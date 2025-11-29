import React from 'react';
import { Layers, Cpu, CheckCircle2 } from 'lucide-react';
import { AppStatus } from '../types';

interface ProgressBarProps {
  progress: number;
  status: AppStatus;
  message: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, message }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            {status === AppStatus.COMPLETE ? (
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
            ) : (
                <div className="p-2 bg-brand-accent/20 rounded-lg animate-pulse">
                    <Cpu className="w-5 h-5 text-brand-accent" />
                </div>
            )}
            <div>
                <h4 className="text-sm font-semibold text-slate-200">Processing Pipeline</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{message}</p>
            </div>
        </div>
        <span className="text-2xl font-bold text-slate-200 font-mono">{progress}%</span>
      </div>

      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-accent to-brand-glow transition-all duration-300 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-white/10 w-full -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <div className="flex justify-between mt-4 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        <span className={progress >= 10 ? 'text-brand-glow' : ''}>Upload</span>
        <span className={progress >= 40 ? 'text-brand-glow' : ''}>Pre-process</span>
        <span className={progress >= 60 ? 'text-brand-glow' : ''}>Demucs Inference</span>
        <span className={progress >= 90 ? 'text-brand-glow' : ''}>Encoding</span>
      </div>
    </div>
  );
};

export default ProgressBar;