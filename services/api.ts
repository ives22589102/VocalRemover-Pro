import { SeparationModel, SeparationResult } from '../types';

// TOGGLE THIS TO FALSE WHEN CONNECTING TO YOUR REAL PYTHON BACKEND
const DEMO_MODE = true;
const API_BASE_URL = 'http://localhost:8000';

/**
 * Simulates a delay for demo purposes
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const separateAudio = async (
  file: File, 
  model: SeparationModel,
  onProgress: (progress: number, message: string) => void
): Promise<SeparationResult> => {
  
  if (DEMO_MODE) {
    // --- DEMO MOCK LOGIC ---
    onProgress(10, 'Uploading file...');
    await delay(1500);
    
    onProgress(30, 'Preprocessing waveform (FFmpeg)...');
    await delay(1500);

    onProgress(50, `Loading ${model === SeparationModel.HIGH_QUALITY ? 'Demucs v4 High Quality' : 'Fast'} model...`);
    await delay(2000);

    for (let i = 50; i <= 90; i += 5) {
      onProgress(i, 'Separating Stems (Inference)...');
      await delay(400);
    }

    onProgress(100, 'Finalizing output...');
    await delay(500);

    // Return dummy URLs for the demo UI
    return {
      originalName: file.name,
      // Using placeholder audio for demonstration
      vocalsUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
      instrumentalUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      processingTime: 12.5
    };
  } else {
    // --- REAL BACKEND LOGIC ---
    // 1. Upload
    onProgress(10, 'Uploading...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    try {
      const response = await fetch(`${API_BASE_URL}/separate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      
      // In a real polling scenario, you would poll /job/{id} here.
      // Assuming the simple synchronous endpoint requested in Step 1:
      onProgress(100, 'Done');
      
      return {
        originalName: file.name,
        vocalsUrl: `${API_BASE_URL}${data.vocals_path}`,
        instrumentalUrl: `${API_BASE_URL}${data.no_vocals_path}`,
        processingTime: data.time_taken || 0
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to connect to Python backend. Ensure main.py is running.");
    }
  }
};