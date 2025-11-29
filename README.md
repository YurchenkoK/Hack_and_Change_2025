# Ya_viigratb_ho4y — Интегрированное монорепо

Короткая инструкция по локальному запуску проекта после интеграции фронта и бэка в одну репу.

Структура репозитория:
- `backend/` — Python-бэкенд (Flask/FastAPI/прочее)
- `frontend/` — Vite/React фронтенд

Запуск локально (разработка):

1) Запуск бэкенда вручную:
```pwsh
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Ya_viigratb_ho4y

**Краткое описание**

Проект "Ya_viigratb_ho4y" — веб-приложение для пакетного предсказания дохода (колонка `target`) по CSV-файлу. Проект состоит из двух основных частей:

- `backend/` — FastAPI-сервис, который принимает CSV-файл, прогоняет данные через ML-модель и возвращает результаты (JSON/CSV).
- `frontend/` — React + Vite приложение с интерфейсом загрузки файла, отображением статуса и краткой статистики по результатам.

**Ключевые возможности**

- Drag & Drop / выбор CSV-файла во фронтенде
- Отправка файла на backend: `POST /api/v1/income/predict-file`
- Отображение статистики (mean, median, min, max) и первых предсказаний
- Swagger UI для ручного тестирования: `GET /docs` на backend

**Структура репозитория (корень)**

- `backend/` — FastAPI, модель и зависимости (`requirements.txt`)
- `frontend/` — Vite/React приложение (`package.json`)
- `docker-compose.yml` — (опционально) разработка/локальный запуск через Docker

**Локальный запуск (рекомендуемая последовательность)**

1) Backend — виртуальное окружение и зависимости

```powershell
cd Ya_viigratb_ho4y\backend
# создать venv, если ещё нет
python -m venv .venv
# активировать (PowerShell)
& .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Запуск backend

```powershell
# Находясь в папке backend и с активированным .venv
& .\.venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

- Откройте `http://127.0.0.1:8000/docs` для Swagger UI и ручного тестирования.

3) Frontend — установка и запуск

```powershell
cd ..\frontend
npm install
npm run dev
```

- Фронтенд будет доступен по умолчанию на `http://localhost:5173`.
- Проверьте, что `VITE_API_URL` (в `.env` или в `vite` конфигурации) указывает на `http://localhost:8000` если backend работает локально.

4) Запуск через Docker Compose (опционально)

```powershell
# В корне репозитория (папка Ya_viigratb_ho4y)
docker-compose up --build
```

(Проверьте `docker-compose.yml` — в нём могут быть настроены сервисы для backend и frontend.)

**Примеры запросов**

- cURL:

```bash
curl -F "file=@/path/to/your.csv" http://localhost:8000/api/v1/income/predict-file
```

- PowerShell (пример):

```powershell
$fd = New-Object System.Net.Http.MultipartFormDataContent
$fileBytes = [System.IO.File]::ReadAllBytes('C:\path\to\your.csv')
$fileContent = New-Object System.Net.Http.ByteArrayContent($fileBytes)
$fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('text/csv')
$fd.Add($fileContent, 'file', 'your.csv')
$response = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/income/predict-file' -Method Post -Body $fd
$response | ConvertTo-Json
```

**Основные API endpoints**

- `GET /` — корень
- `GET /health` — статус сервиса
- `GET /metrics` — тестовый endpoint
- `POST /predict` — возвращает CSV с предсказаниями
- `POST /predict_json` — возвращает JSON с предсказаниями
- `POST /api/v1/income/predict-file` — endpoint, используемый фронтендом

**Советы по отладке**

- Белый экран фронтенда после клика: откройте DevTools → Console — там будет ошибка (например, `undefined` у `result.target`). Убедитесь, что backend возвращает JSON с полями `target` (массив), `summary` и `n_rows`.
- CORS: backend в `app.py` должен разрешать origin фронтенда (`http://localhost:5173`).
- Ошибки при старте backend: выполните `python -m py_compile app.py` и изучите трассировку.

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

**Дальнейшие шаги (по запросу)**

- Добавить `examples/sample.csv` с тестовыми данными.
- Написать интеграционный тест, который отправляет sample.csv на backend и проверяет формат ответа.
- Настроить CI (GitHub Actions) и проверить сборку frontend/backend.

Если хотите — могу сразу добавить `examples/sample.csv` и тест для локальной проверки ответа от backend.
