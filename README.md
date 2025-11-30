# Alfa Marseille — Прогноз дохода

## Описание проекта

Веб-приложение для прогнозирования дохода клиентов Альфа-Банка на основе машинного обучения. Решение состоит из FastAPI-бэкенда с моделью LightGBM и React-фронтенда с интуитивным интерфейсом для загрузки датасетов и просмотра предсказаний.

**Основные возможности:**
- Загрузка CSV-файлов с данными клиентов через drag-and-drop интерфейс
- Автоматическая обработка и предсказание дохода с помощью ML-модели
- Отображение статистики: среднее, медиана, минимум, максимум
- Экспорт результатов в формате CSV (`submission.csv`)
- REST API с Swagger-документацией

**Ссылки:**
- Репозиторий: [github.com/YurchenkoK/Hack_and_Change_2025](https://github.com/YurchenkoK/Hack_and_Change_2025)
- Демо: _(ссылка на задеплоенное решение, если есть)_

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
│   ├── requirements.txt       # Python зависимости
│   └── Dockerfile             # Docker-образ для бэкенда
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
├── docker-compose.yml          # Оркестрация контейнеров
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

## Инструкция по запуску

### Требования

- Python 3.10 или выше
- Node.js 18 или выше
- npm или yarn
- PowerShell (Windows) или bash (Linux/macOS)

### 1. Клонирование репозитория

```powershell
git clone https://github.com/YurchenkoK/Hack_and_Change_2025.git
cd Hack_and_Change_2025
```

### 2. Настройка и запуск Backend

```powershell
# Переход в папку backend
cd backend

# Создание виртуального окружения
python -m venv .venv

# Активация виртуального окружения
.\.venv\Scripts\Activate.ps1

# Установка зависимостей
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Запуск сервера
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend будет доступен на `http://localhost:8000`  
Swagger документация: `http://localhost:8000/docs`

### 3. Настройка и запуск Frontend

Откройте новый терминал:

```powershell
# Переход в папку frontend (из корня репозитория)
cd frontend

# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

### 4. Использование приложения

1. Откройте браузер и перейдите на `http://localhost:5173`
2. Нажмите "Начать работу" на главной странице
3. Загрузите CSV-файл с данными клиентов (drag-and-drop или через кнопку)
4. Нажмите "Загрузить данные"
5. Просмотрите результаты предсказаний и статистику
6. Файл `submission.csv` с результатами будет сохранён в корне проекта

## API Endpoints

Backend предоставляет следующие endpoints:

- `GET /` - Информация о сервисе
- `GET /health` - Проверка состояния API
- `GET /docs` - Swagger UI документация
- `POST /predict` - Загрузка CSV и получение CSV с предсказаниями
- `POST /predict_json` - Загрузка CSV и получение JSON с предсказаниями
- `POST /api/v1/income/predict-file` - Основной endpoint для фронтенда

### Пример запроса к API

```powershell
# Загрузка файла через curl
curl -X POST "http://localhost:8000/api/v1/income/predict-file" `
  -F "file=@hackathon_income_test.csv;type=text/csv"
```

### Формат ответа

```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "file_name": "hackathon_income_test.csv",
  "n_rows": 1000,
  "target": [105000.5, 99000.0, 120340.7, ...],
  "summary": {
    "target_mean": 103400.2,
    "target_median": 101200.0,
    "target_min": 45000.0,
    "target_max": 250000.0
  }
}
```

## Запуск через Docker

```powershell
# Из корня репозитория
docker-compose up --build
```

Backend будет доступен на `http://localhost:8000`  
Frontend будет доступен на `http://localhost:5173`

## Версии библиотек

**Backend (requirements.txt):**
```
pandas==2.3.3
fastapi==0.122.0
uvicorn==0.38.0
joblib==1.5.2
lightgbm==4.6.0
python-multipart==0.0.20
```

**Frontend (package.json):**
```json
{
  "dependencies": {
    "framer-motion": "^11.3.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "styled-components": "^6.1.11"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.4.5",
    "vite": "^5.4.0"
  }
}
```

## Лицензия

Проект разработан в рамках хакатона Альфа-Банк Hack&Change 2025
