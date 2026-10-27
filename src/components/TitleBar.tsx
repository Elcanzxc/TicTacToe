import React, { useEffect, useState } from 'react';
import { Minus, Square, Copy, X, Cpu, Gamepad2, Sun, Moon, Sparkles, Globe } from 'lucide-react';
import { GameMode, Difficulty, RuleVariant, ThemeMode, Language } from '../types';
import { sound } from '../audio/soundEngine';
import { translations } from '../i18n/translations';

interface TitleBarProps {
  mode: GameMode;
  difficulty: Difficulty;
  ruleVariant: RuleVariant;
  theme: ThemeMode;
  language: Language;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  mode,
  difficulty,
  ruleVariant,
  theme,
  language,
  onToggleTheme,
  onToggleLanguage,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
  const isDark = theme === 'dark';
  const t = translations[language];

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.isMaximized().then(setIsMaximized);
    const cleanup = window.electronAPI.onMaximizeChange((max) => {
      setIsMaximized(max);
    });

    return () => {
      cleanup?.();
    };
  }, []);

  const handleMinimize = () => {
    sound.playClick(500);
    window.electronAPI?.minimize();
  };

  const handleMaximize = () => {
    sound.playClick(600);
    window.electronAPI?.maximize();
  };

  const handleClose = () => {
    sound.playClick(400);
    window.electronAPI?.close();
  };

  return (
    <header
      className={`h-10 w-full flex items-center justify-between px-3 select-none titlebar-drag-region z-50 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#08090e]/95 border-cyber-border/70 text-slate-200'
          : 'bg-white/80 border-slate-200 text-slate-800 backdrop-blur-md'
      }`}
    >
      {/* Brand & Mode Badges */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-neon-cyan/20 to-neon-rose/20 border border-neon-cyan/50">
            <span className="text-[11px] font-black text-neon-cyan tracking-tighter">✕</span>
          </div>
          <span className="text-xs font-bold tracking-wider uppercase font-mono">
            Cyber<span className="text-neon-cyan">TTT</span>
          </span>
        </div>

        <div className={`h-3 w-px ${isDark ? 'bg-cyber-border' : 'bg-slate-300'}`} />

        {/* Rule Variant Badge */}
        <div
          className={`titlebar-no-drag flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            ruleVariant === 'infinite'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
              : isDark
              ? 'bg-cyber-card/80 border-cyber-border text-slate-400'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}
        >
          {ruleVariant === 'infinite' ? (
            <>
              <Sparkles className="w-2.5 h-2.5" />
              <span>{t.rulesInfinite}</span>
            </>
          ) : (
            <span>{t.rulesClassic}</span>
          )}
        </div>

        {/* Game Mode Badge */}
        <div
          className={`titlebar-no-drag hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            isDark
              ? 'bg-cyber-card/80 border-cyber-border text-cyber-subtext'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}
        >
          {mode === 'ai' ? (
            <>
              <Cpu className="w-2.5 h-2.5 text-neon-cyan" />
              <span>
                AI: {difficulty === 'easy' ? t.easy : difficulty === 'medium' ? t.medium : t.impossible}
              </span>
            </>
          ) : (
            <>
              <Gamepad2 className="w-2.5 h-2.5 text-neon-rose" />
              <span>{t.pvp}</span>
            </>
          )}
        </div>
      </div>

      {/* Right Controls: Language, Theme & Window Buttons */}
      <div className="titlebar-no-drag flex items-center gap-1.5">
        {/* Quick Language Switcher */}
        <button
          type="button"
          onClick={() => {
            sound.playClick(600);
            onToggleLanguage();
          }}
          title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono border transition-all ${
            isDark
              ? 'border-cyber-border hover:border-neon-cyan/60 text-slate-300 hover:text-neon-cyan hover:bg-neon-cyan/10'
              : 'border-slate-300 hover:border-cyan-600 text-slate-700 hover:bg-cyan-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-bold">{language.toUpperCase()}</span>
        </button>

        {/* Quick Theme Switcher */}
        <button
          type="button"
          onClick={() => {
            sound.playClick(650);
            onToggleTheme();
          }}
          title={isDark ? 'Light Theme' : 'Dark Theme'}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono border transition-all ${
            isDark
              ? 'border-cyber-border hover:border-amber-400/60 text-amber-400 hover:bg-amber-400/10'
              : 'border-slate-300 hover:border-indigo-500 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isDark ? t.themeLightShort : t.themeDarkShort}</span>
        </button>

        {isElectron && (
          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={handleMinimize}
              title="Minimize"
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleMaximize}
              title={isMaximized ? 'Restore' : 'Maximize'}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              {isMaximized ? (
                <Copy className="w-3 h-3 rotate-180" />
              ) : (
                <Square className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={handleClose}
              title="Close"
              className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-neon-rose transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
