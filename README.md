# Alfa Marseille — Прогноз дохода

## Команда "Марсель"

- **Малышко Артём** - Data Scientist
- **Юрченко Кирилл** - Data Analyst
- **Гилятзединов Кирилл** - Backend
- **Матвеев Илья** - Frontend
- **Микулин Михаил** - Frontend

## Инструкция по запуску

### Требования

- Python 3.10+
- Node.js 18+
- PowerShell (Windows)

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
