# Alfa Marseille — Продам гараж

Минимальный SPA на Vite + React 18 + TypeScript в стилистике Альфа-Банка. Большая карточка по центру с загрузкой CSV, статусами и выводом результатов от ML-модели.

## Быстрый старт

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Переменные окружения

- `VITE_API_URL` — базовый URL бэкенда. По умолчанию `http://localhost:8000`.

## Архитектура

- `src/main.tsx` — подключение React, ThemeProvider, глобальные стили.
- `src/App.tsx` — состояние загрузки, вызов API.
- `src/theme.ts` и `src/globalStyles.ts` — тема и базовые стили.
- `src/components/Layout` — Header, PageContainer.
- `src/components/UploadCard` — карточка, UploadZone (drag&drop + input), StatusPanel.
- `src/components/ui` — Button, Tag.
- `src/types/api.ts` — контракты с API и тип статуса.

## Контракт API

POST `${VITE_API_URL}/api/v1/income/predict-file` c `FormData(file)`.
Успешный ответ:

```json
{
  "request_id": "uuid",
  "file_name": "hackathon_income_test.csv",
  "n_rows": 1000,
  "target": [105000.5, 99000.0, 120340.7],
  "summary": {
    "target_mean": 103400.2,
    "target_median": 101200.0,
    "target_min": 45000.0,
    "target_max": 250000.0
  }
}
```

При ошибке ожидается JSON с полями `error`, `message`. Сообщение отображается в панели статуса.
