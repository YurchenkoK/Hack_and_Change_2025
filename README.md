# Income Prediction System

> Hack&Change 2025 — Alfa Bank track

A machine learning system that predicts individual customer income for Alfa Bank. Users upload a CSV file with transaction and behavioral features; the LightGBM model returns income estimates along with a breakdown of the most influential features.

## How it works

The model was trained on ~100 financial and behavioral features derived from transaction history, BKI credit data, salary records, and mobile banking activity. Key signals include average credit turnover, salary income estimates, spending patterns by category (supermarkets, clothing, cafes), and SBP transfer volumes.

Predictions are exposed through a FastAPI backend and consumed by a React frontend that visualizes results and supports prediction history.

## Tech Stack

| Layer | Technologies |
|---|---|
| ML Model | Python 3.10, LightGBM 4.6, pandas, joblib |
| Backend | FastAPI 0.122, uvicorn |
| Frontend | React 18.3, TypeScript 5.4, Vite, styled-components, framer-motion |

## Project Structure

```
├── backend/
│   ├── app.py                  # FastAPI application with prediction endpoints
│   ├── model.py                # Model wrapper class
│   ├── final_model.joblib      # Trained LightGBM model
│   └── model_metadata.json     # Feature list and fill values
├── frontend/
│   └── src/
│       ├── components/         # UploadCard, TopFeatures, PredictionHistory
│       └── pages/              # HomePage, UploadPage
├── model_v17_fixed.ipynb       # Training and EDA notebook
└── submission.csv              # Generated predictions output
```

## Getting Started

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
API and Swagger docs available at `http://localhost:8000/docs`

**Frontend**
```bash
cd frontend
npm install && npm run dev
```
UI available at `http://localhost:5173`

## Team

| Name | Role |
|---|---|
| Artem Malyshko | Data Science |
| Kirill Yurchenko | Data Analysis |
| Kirill Gilyatzdinov | Backend |
| Ilya Matveev | Frontend |
| Mikhail Mikulin | Frontend |
