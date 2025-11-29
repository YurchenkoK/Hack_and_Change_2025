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
python main.py
```

2) Запуск фронтенда вручную (Vite):
```pwsh
cd frontend
npm install
npm run dev
```

3) Быстрый запуск через Docker Compose (dev):
```pwsh
docker compose up --build
```

Проблемы и отладка:
- Проверьте `backend/main.py` на настройки хоста/порта.
- Проверьте в `frontend` адрес API (env или proxy в `vite.config.ts`).

Если нужно, я могу обновить `docker-compose.yml` под production-сборку фронтенда или настроить CI.
