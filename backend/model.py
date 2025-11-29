import io
import json
import os

import pandas as pd
import joblib


class Model:
    def __init__(
        self,
        model_path: str = "final_model.joblib",
        te_path: str = "target_encoding_stats.joblib",
        cols_drop_path: str = "columns_to_drop.joblib",
        metadata_path: str = "model_metadata.json",
    ):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        self.best_model = joblib.load(model_path)

        self.metadata = {}
        if os.path.exists(metadata_path):
            with open(metadata_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

        self.metadata_path = metadata_path
        self.best_features = self.metadata.get("features", None)
        if self.best_features is None:
            self.best_features = ["first_salary_income", "incomeValue"]

        self.median_fill = self.metadata.get("median_fill", {})

        self.te_stats = {}
        if os.path.exists(te_path):
            try:
                self.te_stats = joblib.load(te_path)
            except Exception:
                with open(te_path, "r", encoding="utf-8") as f:
                    self.te_stats = json.load(f)

        self.columns_to_drop = []
        if os.path.exists(cols_drop_path):
            try:
                self.columns_to_drop = joblib.load(cols_drop_path)
            except Exception:
                with open(cols_drop_path, "r", encoding="utf-8") as f:
                    self.columns_to_drop = json.load(f)

    def _safe_read_csv(self, file_path: str) -> pd.DataFrame:
        """Read CSV robustly to avoid DtypeWarning and preserve values."""
        df = pd.read_csv(file_path, decimal=",", sep=";", low_memory=False)

        for col in df.columns:
            if df[col].dtype == "object":
                nonnull = df[col].dropna()
                if nonnull.empty:
                    continue
                conv = pd.to_numeric(nonnull, errors="coerce")
                n_total = len(conv)
                n_num = conv.notna().sum()
                if 0 < n_num < n_total:
                    df[col] = df[col].astype("string")
        return df

    def _try_numeric_conversion(self, df: pd.DataFrame):
        """Convert object columns to numeric when all non-null are numeric."""
        for col in df.columns:
            if df[col].dtype == "object":
                conv = pd.to_numeric(df[col], errors="coerce")
                n_nonnull_orig = df[col].notna().sum()
                if n_nonnull_orig > 0 and conv.notna().sum() == n_nonnull_orig:
                    df[col] = conv

    def _apply_target_encoding(self, df: pd.DataFrame, te_columns):
        """Apply saved te_stats. Accepts both formats ('stats' or 'mapping')."""
        for col in te_columns:
            if col not in df.columns:
                continue
            if col not in self.te_stats:
                continue
            te_info = self.te_stats[col]
            mapping = te_info.get("stats") or te_info.get("mapping") or te_info.get("map")
            global_mean = te_info.get("global_mean", None)
            if mapping is None:
                if isinstance(te_info, dict) and all(isinstance(v, (int, float)) for v in te_info.values()):
                    mapping = te_info
                    global_mean = global_mean or 0.0
                else:
                    continue
            df[f"{col}_te"] = df[col].map(mapping).fillna(global_mean)

    def exec(self, file: str):
        df_test = self._safe_read_csv(file)
        submission_df = self.predict_from_dataframe(df_test)
        csv_bytes = submission_df.to_csv(index=False).encode("utf-8")
        try:
            with open("submission.csv", "wb") as f:
                f.write(csv_bytes)
        except Exception:
            pass
        return csv_bytes

    def predict_from_dataframe(self, df_input: pd.DataFrame) -> pd.DataFrame:
        """Apply preprocessing to a DataFrame and return a submission DataFrame with columns ['id','target']."""
        df_test = df_input.copy()

        try:
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, "r", encoding="utf-8") as f:
                    new_meta = json.load(f)
                if new_meta.get("features"):
                    self.metadata = new_meta
                    self.best_features = self.metadata.get("features", self.best_features)
                    self.median_fill = self.metadata.get("median_fill", self.median_fill)
        except Exception:
            pass

        self._try_numeric_conversion(df_test)

        obj_cols = df_test.select_dtypes(include=["object", "string"]).columns.tolist()

        te_columns = self.metadata.get("te_columns", [
            "adminarea",
            "dp_ewb_last_employment_position",
            "city_smart_name",
            "addrref",
            "dp_address_unique_regions",
        ])

        for col in te_columns:
            if col in df_test.columns:
                df_test[col] = df_test[col].fillna("Unknown")

        if "dp_address_unique_regions" in df_test.columns:
            df_test["num_unique_regions"] = df_test["dp_address_unique_regions"].apply(
                lambda x: 0 if pd.isna(x) or x == "Unknown" else len(str(x).split(","))
            )

        self._apply_target_encoding(df_test, te_columns)

        if "period_last_act_ad" in df_test.columns:
            df_test["period_year"] = pd.to_datetime(
                df_test["period_last_act_ad"], format="%Y-%m-%d", errors="coerce"
            ).dt.year.fillna(0).astype(int)

        if "gender" in df_test.columns:
            df_test["is_male"] = (df_test["gender"] == "Мужской").astype(int)

        drop_cols = te_columns + ["period_last_act_ad", "gender", "dt"]
        for c in [c for c in drop_cols if c in df_test.columns]:
            df_test.drop(columns=c, inplace=True)

        for c in [c for c in self.columns_to_drop if c in df_test.columns]:
            df_test.drop(columns=c, inplace=True)

        missing_feats = [f for f in self.best_features if f not in df_test.columns]
        if missing_feats:
            for f in missing_feats:
                if f in self.median_fill:
                    df_test[f] = self.median_fill[f]
                else:
                    df_test[f] = 0

        X_test_final = df_test.reindex(columns=self.best_features)

        for col in X_test_final.columns:
            if X_test_final[col].dtype == "object" or str(X_test_final[col].dtype).startswith("string"):
                conv = pd.to_numeric(X_test_final[col], errors="coerce")
                n_nonnull = X_test_final[col].notna().sum()
                if n_nonnull > 0 and conv.notna().sum() / n_nonnull > 0.95:
                    X_test_final[col] = conv

            if col in self.median_fill:
                X_test_final[col] = X_test_final[col].fillna(self.median_fill[col])
            else:
                if pd.api.types.is_numeric_dtype(X_test_final[col]):
                    X_test_final[col] = X_test_final[col].fillna(0)

        for col in X_test_final.columns:
            if pd.api.types.is_numeric_dtype(X_test_final[col]) is False:
                X_test_final[col] = pd.to_numeric(X_test_final[col], errors="ignore")

        try:
            pred = self.best_model.predict(X_test_final)
        except Exception as e:
            try:
                model = self.best_model
                if hasattr(model, "booster_") and model.booster_ is not None:
                    try:
                        arr = X_test_final.values
                    except Exception:
                        arr = X_test_final.to_numpy()
                    pred = model.booster_.predict(arr)
                else:
                    raise
            except Exception:
                model = self.best_model
                try:
                    model_type = type(model).__name__
                    model_mro = [c.__name__ for c in type(model).__mro__]
                except Exception:
                    model_type = str(type(model))
                    model_mro = []

                has_get_params = hasattr(model, "get_params")
                try:
                    if has_get_params:
                        gp = model.get_params()
                        try:
                            gp_keys = list(gp.keys())[:10]
                            get_params_info = f"get_params() keys (first 10): {gp_keys}"
                        except Exception as e_gp_keys:
                            get_params_info = f"get_params() returned but listing keys failed: {e_gp_keys}"
                    else:
                        get_params_info = "no get_params attribute"
                except Exception as e_gp:
                    get_params_info = f"get_params() raised: {e_gp}"

                raise RuntimeError(
                    f"Prediction failed: {e}. Model type: {model_type}. MRO: {model_mro}. "
                    f"has_get_params: {has_get_params}. get_params_info: {get_params_info}. "
                    f"X_test_final shape: {X_test_final.shape}. Columns: {X_test_final.columns.tolist()}"
                )

        id_col = "id" if "id" in df_test.columns else None
        if id_col is None:
            id_series = pd.Series(range(1, len(pred) + 1), name="id")
        else:
            id_series = df_test["id"]

        submission = pd.DataFrame({"id": id_series, "target": pred})

        return submission