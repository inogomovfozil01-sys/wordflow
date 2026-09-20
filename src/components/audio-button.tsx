'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, hasSpeechSupport } from '@/lib/speech';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AudioButton({ text, className = '', size = 'md' }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasSpeechSupport()) {
      return;
    }

    setIsPlaying(true);
    speakText(text);

    // Reset visual feedback after a brief delay
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const sizeClasses = {
    sm: 'p-1.5 h-7 w-7',
    md: 'p-2 h-9 w-9',
    lg: 'p-2.5 h-11 w-11',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={`Listen to "${text}" pronunciation`}
      aria-label={`Pronounce ${text}`}
      className={`inline-flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all active:scale-95 cursor-pointer ${
        isPlaying ? 'ring-2 ring-emerald-500 scale-105' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <Volume2 size={iconSizes[size]} className="animate-pulse" />
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
    </button>
  );
}
