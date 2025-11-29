import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Mic2, Music2 } from 'lucide-react';

interface AudioPlayerProps {
  label: string;
  type: 'vocal' | 'instrumental';
  src: string;
  color: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ label, type, src, color }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center gap-4">
        {/* Icon Box */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${type === 'vocal' ? 'bg-pink-500/10 text-pink-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
          {type === 'vocal' ? <Mic2 size={24} /> : <Music2 size={24} />}
        </div>

        {/* Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-slate-200 truncate">{label}</h4>
            <span className="text-xs text-slate-400 font-mono">
              {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={togglePlay}
              className={`p-2 rounded-full transition-colors ${isPlaying ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-900 hover:bg-white'}`}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Action */}
        <a 
          href={src} 
          download 
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Download Stem"
        >
          <Download size={20} />
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;