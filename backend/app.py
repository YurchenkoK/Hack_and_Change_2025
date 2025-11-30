import io
import uuid
import statistics

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
import pandas as pd

from model import Model

app = FastAPI(
    title="Income Prediction API",
    description="API для предсказания дохода на основе финансовых данных",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = Model()


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "Income Prediction API", "version": "1.0.0", "status": "active"}


@app.get("/health")
async def health_check():
    """Проверка статуса API"""
    return {"status": "healthy", "model_loaded": model is not None}


@app.get("/metrics")
async def metrics():
    return {"metrics": 1}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Эндпоинт для предсказания по CSV файлу. Возвращает CSV файл с предсказаниями."""
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Формат файла должен быть CSV")
    try:
        contents = await file.read()
        csv_bytes = model.exec(io.BytesIO(contents))
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=predictions.csv"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")


@app.post("/predict_json")
async def predict_json(file: UploadFile = File(...)):
    """Эндпоинт для предсказания с возвратом JSON"""
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Формат файла должен быть CSV")
    try:
        contents = await file.read()
        df_test = pd.read_csv(pd.io.common.BytesIO(contents), decimal=',', sep=';')
        result_df = model.predict_from_dataframe(df_test)
        predictions = result_df.to_dict('records')
        return {"predictions": predictions, "count": len(predictions), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")


@app.post("/predict_batch")
async def predict_batch(data: dict):
    """Эндпоинт для предсказания по JSON данным (пакетная обработка)"""
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")
    try:
        df_test = pd.DataFrame(data['records'])
        result_df = model.predict_from_dataframe(df_test)
        predictions = result_df.to_dict('records')
        return {"predictions": predictions, "count": len(predictions), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")


@app.post("/api/v1/income/predict-file")
async def predict_file_api(file: UploadFile = File(...)):
    """Compatibility endpoint used by frontend: POST /api/v1/income/predict-file"""
    if model is None:
        raise HTTPException(status_code=500, detail="Модель не загружена")
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Формат файла должен быть CSV")
    try:
        contents = await file.read()
        df_test = pd.read_csv(pd.io.common.BytesIO(contents), decimal=',', sep=';')
        result_df = model.predict_from_dataframe(df_test)
        target_list = result_df['target'].tolist() if 'target' in result_df.columns else []
        
        # Save submission.csv to project root (next to frontend and backend)
        try:
            import os
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            submission_path = os.path.join(repo_root, 'submission.csv')
            result_df.to_csv(submission_path, index=False)
        except Exception:
            # Fallback to current directory if write fails
            try:
                result_df.to_csv('submission.csv', index=False)
            except Exception:
                pass
        
        summary = {
            'target_mean': float(statistics.mean(target_list)) if target_list else 0.0,
            'target_median': float(statistics.median(target_list)) if target_list else 0.0,
            'target_min': float(min(target_list)) if target_list else 0.0,
            'target_max': float(max(target_list)) if target_list else 0.0,
        }
        response = {
            'request_id': str(uuid.uuid4()),
            'file_name': file.filename,
            'n_rows': int(len(target_list)),
            'target': [float(x) for x in target_list],
            'summary': summary,
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки: {str(e)}")