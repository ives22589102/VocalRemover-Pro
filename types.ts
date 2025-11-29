export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum SeparationModel {
  FAST = 'htdemucs_ft', // Fast Transformer
  HIGH_QUALITY = 'htdemucs', // Hybrid Transformer Demucs v4
}

export interface SeparationResult {
  originalName: string;
  vocalsUrl: string;
  instrumentalUrl: string;
  processingTime: number;
}

export interface ProcessingState {
  status: AppStatus;
  progress: number; // 0 to 100
  message: string;
  error?: string;
  result?: SeparationResult;
}

export interface UploadResponse {
  jobId: string;
}

export interface JobStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    vocals_path: string;
    no_vocals_path: string;
  };
}