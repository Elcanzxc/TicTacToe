import React from 'react';
import {
  RotateCcw,
  RotateCcw as ResetIcon,
  Settings,
  Volume2,
  VolumeX,
  Lightbulb,
  History,
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../audio/soundEngine';
import { translations } from '../i18n/translations';

interface GameControlsProps {
  onRestartGame: () => void;
  onResetScore: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onRequestHint: () => void;
  canHint: boolean;
  soundEnabled: boolean;
  language: Language;
  onToggleSound: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onRestartGame,
  onResetScore,
  onOpenSettings,
  onOpenHistory,
  onRequestHint,
  canHint,
  soundEnabled,
  language,
  onToggleSound,
}) => {
  const t = translations[language];

  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-[480px] mx-auto py-2">
      {/* Restart Board Button */}
      <button
        type="button"
        onClick={() => {
          sound.playClick(700);
          onRestartGame();
        }}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan/15 to-neon-rose/15 hover:from-neon-cyan/25 hover:to-neon-rose/25 border border-cyber-border hover:border-slate-400 text-xs font-semibold transition-all duration-200 shadow-md active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5 text-neon-cyan" />
        <span>{t.btnNewGame}</span>
      </button>

      {/* Hint Button */}
      <button
        type="button"
        title={t.btnHint}
        disabled={!canHint}
        onClick={onRequestHint}
        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
          canHint
            ? 'bg-amber-400/15 border-amber-400/60 hover:bg-amber-400/25 text-amber-400 hover:border-amber-400 cursor-pointer shadow-sm'
            : 'bg-cyber-card/30 border-cyber-border/40 text-slate-500 cursor-not-allowed opacity-50'
        }`}
      >
        <Lightbulb className="w-3.5 h-3.5 animate-pulse" />
        <span className="hidden sm:inline">{t.btnHint}</span>
      </button>

      {/* Move History Button */}
      <button
        type="button"
        title={t.btnHistory}
        onClick={() => {
          sound.playClick(500);
          onOpenHistory();
        }}
        className="flex items-center justify-center p-2.5 rounded-xl bg-cyber-card/80 hover:bg-cyber-card border border-cyber-border hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
      >
        <History className="w-4 h-4" />
      </button>

      {/* Reset Score Button */}
      <button
        type="button"
        title={t.btnResetScore}
        onClick={() => {
          sound.playClick(450);
          onResetScore();
        }}
        className="flex items-center justify-center p-2.5 rounded-xl bg-cyber-card/80 hover:bg-cyber-card border border-cyber-border hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
      >
        <ResetIcon className="w-4 h-4" />
      </button>

      {/* Sound Toggle */}
      <button
        type="button"
        title={soundEnabled ? t.btnSoundOn : t.btnSoundOff}
        onClick={() => {
          sound.playClick(600);
          onToggleSound();
        }}
        className={`flex items-center justify-center p-2.5 rounded-xl border transition-all active:scale-95 ${
          soundEnabled
            ? 'bg-cyber-card/80 hover:bg-cyber-card border-cyber-border text-neon-cyan'
            : 'bg-cyber-card/40 border-cyber-border/40 text-slate-600'
        }`}
      >
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Settings Modal Open */}
      <button
        type="button"
        title={t.btnSettings}
        onClick={() => {
          sound.playClick(650);
          onOpenSettings();
        }}
        className="flex items-center justify-center p-2.5 rounded-xl bg-cyber-card/80 hover:bg-cyber-card border border-cyber-border hover:border-neon-cyan/50 text-slate-400 hover:text-neon-cyan transition-all active:scale-95"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};
