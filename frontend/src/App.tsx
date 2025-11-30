import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './components/Layout/Header';
import { PageContainer } from './components/Layout/PageContainer';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import type { ErrorResponse, PredictionResponse, UploadStatus } from './types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const App = () => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionResponse[]>([]);

  const navigate = useNavigate();

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    setResult(null);
    setErrorMessage(null);
    setStatus(file ? 'fileSelected' : 'idle');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus('uploading');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/api/v1/income/predict-file`, {
        method: 'POST',
        body: formData
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const payload = isJson ? await response.json() : null;

      if (!response.ok) {
        const apiError = (payload as ErrorResponse | null)?.message;
        throw new Error(apiError || 'Не удалось загрузить файл');
      }

      const predictionResult = payload as PredictionResponse;
      setResult(predictionResult);
      setHistory(prev => [...prev, predictionResult]);
      setStatus('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Непредвиденная ошибка';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const goToUpload = () => navigate('/upload');

  return (
    <AppShell>
      <PageContainer>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage onStart={goToUpload} />} />
          <Route
            path="/upload"
            element={
              <UploadPage
                status={status}
                selectedFile={selectedFile}
                result={result}
                errorMessage={errorMessage}
                history={history}
                onFileSelected={handleFileSelected}
                onUpload={handleUpload}
                onClearHistory={handleClearHistory}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
    </AppShell>
  );
};

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
