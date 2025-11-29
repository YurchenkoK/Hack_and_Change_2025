import io

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import pandas as pd
import tempfile
import os

from starlette.responses import StreamingResponse

from model import Model
# Инициализация FastAPI приложения
app = FastAPI(
    title="Income Prediction API",
    description="API для предсказания дохода на основе финансовых данных",
    version="1.0.0"
)

# Глобальная переменная для модели
model = Model()


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {
        "message": "Income Prediction API",
        "version": "1.0.0",
        "status": "active"
    }


@app.get("/health")
async def health_check():
    """Проверка статуса API"""
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/metrics")
async def metrics():
    return {"metrics": 1}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Эндпоинт для предсказания по CSV файлу

    Args:
        file: CSV файл с данными для предсказания

    Returns:
        JSON с предсказаниями или файл с результатами
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")

    # Проверяем формат файла
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Формат файла должен быть CSV")

    try:
        contents = await file.read()
        # Используем существующий метод exec
        csv_bytes=model.exec(io.BytesIO(contents))

        print(f"Сгенерирован результат размером {len(csv_bytes)} байт")

        # Возвращаем StreamingResponse
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=predictions.csv"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")

@app.post("/predict_json")
async def predict_json(file: UploadFile = File(...)):
    """
    Эндпоинт для предсказания с возвратом JSON

    Args:
        file: CSV файл с данными для предсказания

    Returns:
        JSON с предсказаниями
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Формат файла должен быть CSV")

    try:
        # Читаем CSV файл в DataFrame
        contents = await file.read()
        df_test = pd.read_csv(pd.io.common.BytesIO(contents), decimal=',', sep=';')

        # Используем метод predict_from_dataframe
        result_df = model.predict_from_dataframe(df_test)

        # Конвертируем в JSON
        predictions = result_df.to_dict('records')

        return {
            "predictions": predictions,
            "count": len(predictions),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")


@app.post("/predict_batch")
async def predict_batch(data: dict):
    """
    Эндпоинт для предсказания по JSON данным (пакетная обработка)

    Args:
        data: JSON с массивом объектов для предсказания

    Returns:
        JSON с предсказаниями
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")

    try:
        # Конвертируем JSON в DataFrame
        df_test = pd.DataFrame(data['records'])

        # Используем метод predict_from_dataframe
        result_df = model.predict_from_dataframe(df_test)

        predictions = result_df.to_dict('records')

        return {
            "predictions": predictions,
            "count": len(predictions),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")
