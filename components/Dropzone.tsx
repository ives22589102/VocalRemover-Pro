import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio, Music } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|flac|m4a|ogg)$/i)) {
        onFileSelect(file);
      } else {
        alert("Please upload a valid audio file.");
      }
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
        ${isDragging 
          ? 'border-brand-glow bg-brand-glow/10 scale-[1.02]' 
          : 'border-slate-700 hover:border-brand-accent/50 hover:bg-slate-800/50 bg-slate-900/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.flac,.m4a"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className={`
          mb-6 p-4 rounded-full bg-slate-800 transition-transform duration-500
          ${isDragging ? 'scale-110 shadow-[0_0_30px_rgba(56,189,248,0.3)]' : 'group-hover:scale-105'}
        `}>
          {isDragging ? (
            <UploadCloud className="w-12 h-12 text-brand-glow" />
          ) : (
            <Music className="w-12 h-12 text-slate-400 group-hover:text-brand-accent" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          {isDragging ? 'Drop Audio Here' : 'Drag & Drop Audio File'}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
          Support for MP3, WAV, FLAC, M4A. Best results with high-quality source files.
        </p>
        
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span className="bg-slate-800 px-2 py-1 rounded">Fast</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Secure</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Local Core</span>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-glow/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Dropzone;