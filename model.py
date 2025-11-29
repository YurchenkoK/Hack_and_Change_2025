import pandas as pd
import joblib


class Model:
    def __init__(self):
        self.best_model = joblib.load("best_model.joblib")
        self.best_features = [
              'first_salary_income',
              'incomeValue',
              'hdb_bki_total_max_limit',
              'dp_ils_paymentssum_avg_12m',
              'dp_ewb_last_employment_position_te',
              'is_male',
              'turn_cur_db_max_v2',
              'hdb_bki_total_cc_max_limit',
              'avg_by_category__amount__sum__cashflowcategory_name__vydacha_nalichnyh_v_bankomate',
              'dp_ils_avg_salary_1y',
              'by_category__amount__sum__eoperation_type_name__ishodjaschij_bystryj_platezh_sbp',
              'by_category__amount__sum__eoperation_type_name__perevod_po_nomeru_telefona',
              'turn_cur_cr_max_v2',
              'dp_ils_paymentssum_avg_6m',
              'avg_cur_cr_turn',
              'curr_rur_amt_3m_avg',
              'turn_cur_db_sum_v2',
              'turn_cur_cr_avg_v2',
              'hdb_bki_total_pil_max_limit',
              'turn_cur_db_avg_act_v2',
              'avg_6m_money_transactions',
              'hdb_bki_total_ip_max_limit',
              'age',
              'dda_rur_amt_curr_v2',
              'turn_cur_db_min_v2',
              'avg_amount_daily_transactions_90d',
              'dp_ils_avg_salary_2y',
              'curr_rur_amt_cm_avg',
              'dp_ils_avg_salary_3y',
              'bki_total_max_limit',
              'per_capita_income_rur_amt',
              'avg_by_category__amount__sum__cashflowcategory_name__gipermarkety',
              'mob_cnt_days',
              'turn_cur_cr_7avg_avg_v2',
              'loanacc_rur_amt_cm_avg',
              'avg_by_category__amount__sum__cashflowcategory_name__elektronnye_dengi',
              'turn_cur_cr_min_v2',
              'pil',
              'avg_6m_restaurants',
              'dp_payoutincomedata_payout_avg_6_month',
              'label_Above_1M_share_r1',
              'mob_total_sessions',
              'avg_cur_db_turn',
              'turn_save_db_min_v2',
              'city_smart_name_te',
              'by_category__amount__sum__eoperation_type_name__vhodjaschij_bystryj_platezh_sbp',
              'avg_6m_all',
              'avg_debet_turn_rur',
              'transaction_category_supermarket_sum_amt_d15',
              'bki_total_products',
              'hdb_bki_total_products',
              'bki_total_oth_cnt',
              'avg_by_category__amount__sum__cashflowcategory_name__kafe',
              'total_sum',
              'hdb_relend_active_max_psk',
              'curbal_usd_amt_cm_avg',
              'avg_by_category__amount__sum__cashflowcategory_name__odezhda',
              'label_500k_to_1M_share_r1',
              'turn_cur_db_7avg_avg_v2',
              'bki_total_ip_max_outstand'
            ]

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