# Alfa Marseille — Прогноз дохода клиентов

Система для прогнозирования дохода клиентов Альфа-Банка на основе машинного обучения. Разработано в рамках хакатона Hack&Change 2025.

## Команда "Марсель"

- **Малышко Артём** - Data Scientist
- **Юрченко Кирилл** - Data Analyst
- **Гилятзединов Кирилл** - Backend
- **Матвеев Илья** - Frontend
- **Микулин Михаил** - Frontend

## Структура проекта

```
Hack_and_Change_2025/
├── backend/                    # FastAPI бэкенд
│   ├── app.py                 # Основное приложение FastAPI с endpoints
│   ├── model.py               # Класс Model для работы с ML-моделью
│   ├── final_model.joblib     # Обученная LightGBM модель
│   ├── model_metadata.json    # Метаданные модели (features, median_fill)
│   └── requirements.txt       # Python зависимости
├── frontend/                   # React + TypeScript фронтенд
│   ├── src/
│   │   ├── components/        # React компоненты (Header, UploadCard, etc.)
│   │   ├── pages/             # Страницы (HomePage, UploadPage)
│   │   ├── types/             # TypeScript типы
│   │   ├── App.tsx            # Главный компонент приложения
│   │   └── main.tsx           # Точка входа
│   ├── package.json           # Node.js зависимости
│   ├── vite.config.ts         # Конфигурация Vite
│   └── tsconfig.json          # TypeScript конфигурация
├── submission.csv              # Результаты предсказаний (генерируется)
└── README.md                   # Документация проекта
```

## Технологии

**Backend:**
- Python 3.10+
- FastAPI 0.122.0
- LightGBM 4.6.0
- pandas 2.3.3
- uvicorn 0.38.0

**Frontend:**
- React 18.3.1
- TypeScript 5.4.5
- Vite 5.4.0
- styled-components 6.1.11
- framer-motion 11.3.2
- react-router-dom 6.28.0

## Установка и запуск

### Требования

- Python 3.10+
- Node.js 18.0+
- npm 9.0+

### Запуск Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend доступен на `http://localhost:8000`  
Swagger документация: `http://localhost:8000/docs`

### Запуск Frontend

Откройте новый терминал:

```bash
cd frontend
npm install
npm run dev
```

Frontend доступен на `http://localhost:5173`


