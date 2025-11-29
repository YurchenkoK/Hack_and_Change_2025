## Команда "Марсель"

Выполнили:

- **Малышко Артём** - Data Scientist
- **Юрченко Кирилл** - Data Analyst
- **Гилятзединов Кирилл** - Backend
- **Матвеев Илья** - Frontend
- **Микулин Михаил** - Frontend

Структура репозитория:
- `backend/` - Python-бэкенд (Flask/FastAPI/прочее)
- `frontend/` - Vite/React фронтенд

**Локальный запуск**

1) Запуск backend

```powershell
# Находясь в папке backend и с активированным .venv
& .\.venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

- Откройте `http://127.0.0.1:8000/docs` для Swagger UI и ручного тестирования.

2) Frontend - установка и запуск

```powershell
cd ..\frontend
npm install
npm run dev
```

- Фронтенд будет доступен по умолчанию на `http://localhost:5173`.

**Основные API endpoints**

- `GET /` - корень
- `GET /health` - статус сервиса
- `GET /metrics` - тестовый endpoint
- `POST /predict` - возвращает CSV с предсказаниями
- `POST /predict_json` - возвращает JSON с предсказаниями
- `POST /api/v1/income/predict-file` - endpoint, используемый фронтендом

**Модель и формат ответа**

- Модель загружается и используется в `backend/model.py`.
- Ожидаемый формат ответа, который использует фронтенд (пример):

```json
{
	"request_id": "...",
	"file_name": "sample.csv",
	"n_rows": 123,
	"target": [10000.0, 12000.0],
	"summary": {
		"target_mean": 11000.0,
		"target_median": 10500.0,
		"target_min": 9000.0,
		"target_max": 13000.0
	}
}
```
