import React, { useState } from 'react';
import { Settings, Zap, RotateCcw, Box, Github } from 'lucide-react';
import Dropzone from './components/Dropzone';
import ProgressBar from './components/ProgressBar';
import AudioPlayer from './components/AudioPlayer';
import { separateAudio } from './services/api';
import { AppStatus, ProcessingState, SeparationModel } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<SeparationModel>(SeparationModel.HIGH_QUALITY);
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
    progress: 0,
    message: ''
  });

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    startProcessing(selectedFile);
  };

  const startProcessing = async (selectedFile: File) => {
    setState({
      status: AppStatus.UPLOADING,
      progress: 0,
      message: 'Initializing session...'
    });

    try {
      const result = await separateAudio(
        selectedFile, 
        model, 
        (progress, message) => {
          setState(prev => ({
            ...prev,
            status: progress < 100 ? AppStatus.PROCESSING : AppStatus.COMPLETE,
            progress,
            message
          }));
        }
      );

      setState({
        status: AppStatus.COMPLETE,
        progress: 100,
        message: 'Separation complete',
        result
      });

    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        status: AppStatus.ERROR,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const resetApp = () => {
    setFile(null);
    setState({
      status: AppStatus.IDLE,
      progress: 0,
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 selection:bg-brand-accent selection:text-white relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-glow/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="w-full max-w-4xl z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-brand-accent to-brand-glow p-2.5 rounded-xl shadow-lg shadow-brand-accent/20">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">VocalRemover <span className="text-brand-glow">Pro</span></h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">AI-POWERED STEM SEPARATION</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Model Selector */}
             <div className="hidden md:flex bg-slate-900/50 border border-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setModel(SeparationModel.FAST)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    model === SeparationModel.FAST 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} />
                    Fast
                  </div>
                </button>
                <button
                  onClick={() => setModel(SeparationModel.HIGH_QUALITY)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    model === SeparationModel.HIGH_QUALITY 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Settings size={12} />
                    High Quality
                  </div>
                </button>
             </div>
             
             <a href="#" className="text-slate-500 hover:text-white transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-8">
          
          {/* Main Stage */}
          <section className={`transition-all duration-500 ${state.status !== AppStatus.IDLE ? 'scale-95 opacity-50 pointer-events-none' : 'opacity-100'}`}>
             <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-1 border border-white/5">
                <Dropzone onFileSelect={handleFileSelect} disabled={state.status !== AppStatus.IDLE} />
             </div>
          </section>

          {/* Processing Stage */}
          {(state.status === AppStatus.PROCESSING || state.status === AppStatus.UPLOADING) && (
             <div className="absolute inset-0 top-32 flex flex-col items-center justify-start pt-20 z-20">
                <ProgressBar progress={state.progress} status={state.status} message={state.message} />
             </div>
          )}

          {/* Results Stage */}
          {state.status === AppStatus.COMPLETE && state.result && (
            <div className="animate-[slideUp_0.5s_ease-out] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl relative z-30">
               
               <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Separation Complete</h2>
                    <p className="text-sm text-slate-400 truncate max-w-xs md:max-w-md">{state.result.originalName}</p>
                  </div>
                  <button 
                    onClick={resetApp}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <RotateCcw size={16} />
                    New Project
                  </button>
               </div>

               <div className="space-y-4">
                 <AudioPlayer 
                    label="Vocals (Isolated)" 
                    type="vocal" 
                    src={state.result.vocalsUrl} 
                    color="pink"
                 />
                 <AudioPlayer 
                    label="Instrumental (Backing)" 
                    type="instrumental" 
                    src={state.result.instrumentalUrl} 
                    color="cyan"
                 />
               </div>

               <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>Model: {model === SeparationModel.HIGH_QUALITY ? 'Demucs v4 (HT)' : 'Fast Transformer'}</span>
                  <span>Time: {state.result.processingTime.toFixed(1)}s</span>
               </div>
            </div>
          )}

           {/* Error State */}
           {state.status === AppStatus.ERROR && (
             <div className="mx-auto max-w-lg bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center animate-pulse">
                <h3 className="text-red-400 font-semibold mb-2">Processing Failed</h3>
                <p className="text-red-300/70 text-sm mb-4">{state.message}</p>
                <button 
                  onClick={resetApp}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
             </div>
           )}

        </div>

      </main>

      <footer className="fixed bottom-6 text-center z-0">
        <p className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">
          Powered by PyTorch & Demucs
        </p>
      </footer>
    </div>
  );
};

export default App;