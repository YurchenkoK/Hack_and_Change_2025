import pandas as pd
import joblib


class Model:
    def __init__(self):
        self.best_model = joblib.load("best_model.joblib")
        self.best_features = ['first_salary_income', 'incomeValue', ...]  # ваш список фичей

        # Загружаем предварительно вычисленные статистики для преобразований
        self.te_stats = joblib.load("target_encoding_stats.joblib")
        self.columns_to_drop = joblib.load("columns_to_drop.joblib")

    def exec(self, file):
        # Загружаем только тестовые данные из переданного файла
        df_test = pd.read_csv(file, decimal=',', sep=';')

        # 1) Попытка конвертации object → float
        for col in df_test.columns:
            if df_test[col].dtype == 'object':
                converted = pd.to_numeric(df_test[col], errors='coerce')
                n_non_convertible = converted.isna().sum() - df_test[col].isna().sum()
                if n_non_convertible == 0:
                    df_test[col] = converted

        ### Обработка категориальных переменных
        object_columns_test = df_test.select_dtypes(include=['object']).columns
        print("Столбцы типа object в df_test:")
        for col in object_columns_test:
            print(f"  - {col}")

        # Заполнение пропусков
        df_test['adminarea'] = df_test['adminarea'].fillna('Unknown')
        df_test['city_smart_name'] = df_test['city_smart_name'].fillna('Unknown')
        df_test['dp_ewb_last_employment_position'] = df_test['dp_ewb_last_employment_position'].fillna('Unknown')
        df_test['addrref'] = df_test['addrref'].fillna('Unknown')
        df_test['dp_address_unique_regions'] = df_test['dp_address_unique_regions'].fillna('Unknown')
        df_test['period_last_act_ad'] = df_test['period_last_act_ad'].fillna('Unknown')

        # Создание новых признаков
        df_test['num_unique_regions'] = df_test['dp_address_unique_regions'].apply(
            lambda x: 0 if pd.isna(x) or x == 'Unknown' else len(str(x).split(','))
        )

        ### Применяем сохраненные target encoding статистики
        te_columns = [
            'adminarea', 'dp_ewb_last_employment_position', 'city_smart_name',
            'addrref', 'dp_address_unique_regions'
        ]

        for col in te_columns:
            if col in self.te_stats:
                global_mean = self.te_stats[col]['global_mean']
                mapping = self.te_stats[col]['mapping']
                df_test[f'{col}_te'] = df_test[col].map(mapping).fillna(global_mean)

        ### Другие преобразования
        df_test['period_year'] = pd.to_datetime(
            df_test['period_last_act_ad'], format='%Y-%m-%d', errors='coerce'
        ).dt.year.fillna(0).astype(int)

        df_test['is_male'] = (df_test['gender'] == 'Мужской').astype(int)

        # Удаляем ненужные столбцы
        drop_cols = te_columns + ['period_last_act_ad', 'gender', 'dt']
        df_test.drop(columns=[col for col in drop_cols if col in df_test.columns], inplace=True)

        ### Удаляем столбцы с доминирующими значениями (на основе сохраненного списка)
        df_test = df_test.drop(columns=[col for col in self.columns_to_drop if col in df_test.columns])

        ### Подготовка финальных данных для предсказания
        X_test_final = df_test.reindex(columns=self.best_features)

        # =======================================
        #   ПРЕДСКАЗАНИЕ
        # =======================================
        pred = self.best_model.predict(X_test_final)

        # =======================================
        #   СОЗДАЁМ submission
        # =======================================
        submission = pd.DataFrame({
            "id": df_test["id"],
            "target": pred
        })

        submission.to_csv("submission.csv", index=False)

        print("=======================================")
        print("Готово! Файл submission.csv создан.")
        print(submission.head())
        print("=======================================")