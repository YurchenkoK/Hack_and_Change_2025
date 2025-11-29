# Используем официальный Python образ
FROM python:3.9-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копируем файл с зависимостями
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# Создаем директорию для моделей если ее нет
RUN mkdir -p /app/models

# Копируем модель (предполагается, что best_model.joblib находится в текущей директории)
# Если модель большая, лучше использовать volume или отдельный этап сборки
COPY best_model.joblib /app/

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]