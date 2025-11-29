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
        # Загрузка модели (joblib)
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        self.best_model = joblib.load(model_path)

        # Загрузка метаданных (если есть) — удобнее хранить медианы/список признаков здесь
        self.metadata = {}
        if os.path.exists(metadata_path):
            with open(metadata_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

        # best_features: сначала из metadata, иначе падаем обратно на поле из кода
        self.best_features = self.metadata.get("features", None)
        if self.best_features is None:
            # fallback: ваш список фичей (заполните реальным списком)
            self.best_features = ['first_salary_income', 'incomeValue']  # <- заполните полностью

        # median_fill для заполнения NaN (from metadata if available)
        self.median_fill = self.metadata.get("median_fill", {})

        # Загружаем te_stats и columns_to_drop (если есть)
        self.te_stats = {}
        if os.path.exists(te_path):
            try:
                self.te_stats = joblib.load(te_path)
            except Exception:
                # поддержка json
                with open(te_path, 'r', encoding='utf-8') as f:
                    self.te_stats = json.load(f)

        self.columns_to_drop = []
        if os.path.exists(cols_drop_path):
            try:
                self.columns_to_drop = joblib.load(cols_drop_path)
            except Exception:
                with open(cols_drop_path, 'r', encoding='utf-8') as f:
                    self.columns_to_drop = json.load(f)

    def _safe_read_csv(self, file_path: str) -> pd.DataFrame:
        """
        Read CSV robustly to avoid DtypeWarning and preserve values:
        - read with low_memory=False,
        - detect mixed object columns and cast them to pandas StringDtype.
        """
        df = pd.read_csv(file_path, decimal=",", sep=";", low_memory=False)

        # detect object columns with mixed numeric/text content
        for col in df.columns:
            if df[col].dtype == "object":
                nonnull = df[col].dropna()
                if nonnull.empty:
                    continue
                # try converting to numeric
                conv = pd.to_numeric(nonnull, errors="coerce")
                n_total = len(conv)
                n_num = conv.notna().sum()
                # If there is a mix (some numeric, some not), cast to pandas string to preserve all
                if 0 < n_num < n_total:
                    df[col] = df[col].astype("string")  # preserves NA
        return df

    def _try_numeric_conversion(self, df: pd.DataFrame):
        """Convert object columns to numeric when all non-null are numeric."""
        for col in df.columns:
            if df[col].dtype == "object":
                conv = pd.to_numeric(df[col], errors="coerce")
                # if every non-null value was convertible -> replace
                n_nonnull_orig = df[col].notna().sum()
                if n_nonnull_orig > 0 and conv.notna().sum() == n_nonnull_orig:
                    df[col] = conv

    def _apply_target_encoding(self, df: pd.DataFrame, te_columns):
        """Apply saved te_stats. Accepts both formats ('stats' or 'mapping')."""
        for col in te_columns:
            if col not in df.columns:
                continue
            if col not in self.te_stats:
                # no mapping available
                continue
            te_info = self.te_stats[col]
            # support two formats: {'stats': {...}, 'global_mean': x} or {'mapping': {...}, 'global_mean': x}
            mapping = te_info.get("stats") or te_info.get("mapping") or te_info.get("map")
            global_mean = te_info.get("global_mean", None)
            if mapping is None:
                # If te_info itself is the mapping (legacy), try that
                if isinstance(te_info, dict) and all(isinstance(v, (int, float)) for v in te_info.values()):
                    mapping = te_info
                    global_mean = global_mean or 0.0
                else:
                    continue
            df[f"{col}_te"] = df[col].map(mapping).fillna(global_mean)

    def exec(self, file: str):
        # 0) Safe read
        df_test = self._safe_read_csv(file)

        # Delegate actual preprocessing + prediction to the DataFrame-based method
        submission_df = self.predict_from_dataframe(df_test)

        # Save to CSV as before
        submission_df.to_csv("submission.csv", index=False)

        print("=======================================")
        print("Готово! Файл submission.csv создан.")
        print(submission_df.head())
        print("=======================================")

    def predict_from_dataframe(self, df_input: pd.DataFrame) -> pd.DataFrame:
        """Apply preprocessing to a DataFrame and return a submission DataFrame with columns ['id','target'].

        This method keeps the same logic as exec but accepts an in-memory DataFrame (used by FastAPI handlers).
        """
        df_test = df_input.copy()

        # 1) Try numeric conversion where safe
        self._try_numeric_conversion(df_test)

        # 2) List object columns for debugging (keeps original)
        obj_cols = df_test.select_dtypes(include=["object", "string"]).columns.tolist()
        if obj_cols:
            print("Object/string columns in input:", obj_cols)

        # 3) Fill known object columns from metadata if necessary (use same defaults as training)
        te_columns = self.metadata.get("te_columns", [
            'adminarea', 'dp_ewb_last_employment_position', 'city_smart_name',
            'addrref', 'dp_address_unique_regions'
        ])

        # Fill NaNs for those categorical columns with 'Unknown' (safe default)
        for col in te_columns:
            if col in df_test.columns:
                df_test[col] = df_test[col].fillna("Unknown")

        # 4) Create features consistently
        if "dp_address_unique_regions" in df_test.columns:
            df_test["num_unique_regions"] = df_test["dp_address_unique_regions"].apply(
                lambda x: 0 if pd.isna(x) or x == "Unknown" else len(str(x).split(","))
            )

        # Apply target encoding using saved te_stats (if present)
        self._apply_target_encoding(df_test, te_columns)

        # Other transforms
        if "period_last_act_ad" in df_test.columns:
            df_test["period_year"] = pd.to_datetime(
                df_test["period_last_act_ad"], format="%Y-%m-%d", errors="coerce"
            ).dt.year.fillna(0).astype(int)

        if "gender" in df_test.columns:
            df_test["is_male"] = (df_test["gender"] == "Мужской").astype(int)

        # Drop columns used only for processing
        drop_cols = te_columns + ["period_last_act_ad", "gender", "dt"]
        for c in [c for c in drop_cols if c in df_test.columns]:
            df_test.drop(columns=c, inplace=True)

        # Drop high-frequency cols if provided
        for c in [c for c in self.columns_to_drop if c in df_test.columns]:
            df_test.drop(columns=c, inplace=True)

        # Ensure all best_features present: add missing as median or zeros
        missing_feats = [f for f in self.best_features if f not in df_test.columns]
        if missing_feats:
            print("Missing features in input, adding with median/0:", missing_feats)
            for f in missing_feats:
                if f in self.median_fill:
                    df_test[f] = self.median_fill[f]
                else:
                    df_test[f] = 0

        # Reindex to best_features order
        X_test_final = df_test.reindex(columns=self.best_features)

        # Convert numeric-like columns to numeric (coerce), keep NaNs filled by median_fill if present
        for col in X_test_final.columns:
            if X_test_final[col].dtype == "object" or str(X_test_final[col].dtype).startswith("string"):
                # try numeric conversion if reasonable
                conv = pd.to_numeric(X_test_final[col], errors="coerce")
                n_nonnull = X_test_final[col].notna().sum()
                if n_nonnull > 0 and conv.notna().sum() / n_nonnull > 0.95:
                    X_test_final[col] = conv

            # fill NaNs with median if available
            if col in self.median_fill:
                X_test_final[col] = X_test_final[col].fillna(self.median_fill[col])
            else:
                # numeric columns: fill with 0, categorical already handled
                if pd.api.types.is_numeric_dtype(X_test_final[col]):
                    X_test_final[col] = X_test_final[col].fillna(0)

        # final safety: cast numeric columns to float
        for col in X_test_final.columns:
            if pd.api.types.is_numeric_dtype(X_test_final[col]) is False:
                # attempt to convert
                X_test_final[col] = pd.to_numeric(X_test_final[col], errors="ignore")

        # Prediction: ensure shape matches
        try:
            pred = self.best_model.predict(X_test_final)
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {e}. X_test_final shape: {X_test_final.shape}. Columns: {X_test_final.columns.tolist()}")

        # Prepare submission
        id_col = "id" if "id" in df_test.columns else None
        if id_col is None:
            # create an id column to keep submission consistent
            print("Warning: 'id' not found in input file — generating sequential ids.")
            id_series = pd.Series(range(1, len(pred) + 1), name="id")
        else:
            id_series = df_test["id"]

        submission = pd.DataFrame({"id": id_series, "target": pred})

        return submission