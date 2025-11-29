export type UploadStatus = 'idle' | 'fileSelected' | 'uploading' | 'success' | 'error';

export interface PredictionSummary {
  target_mean: number;
  target_median: number;
  target_min: number;
  target_max: number;
}

export interface PredictionResponse {
  request_id: string;
  file_name: string;
  n_rows: number;
  target: number[];
  summary: PredictionSummary;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
}
