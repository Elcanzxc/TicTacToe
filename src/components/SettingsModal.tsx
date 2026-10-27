import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Users, Volume2, Check, Sun, Moon, Sparkles, Grid, Eye, Globe } from 'lucide-react';
import { GameSettings, GameMode, Difficulty, Player, RuleVariant, ThemeMode, Language } from '../types';
import { sound } from '../audio/soundEngine';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [language, setLanguage] = useState<Language>(settings.language ?? 'ru');
  const [mode, setMode] = useState<GameMode>(settings.mode);
  const [ruleVariant, setRuleVariant] = useState<RuleVariant>(settings.ruleVariant);
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.difficulty);
  const [humanPlayer, setHumanPlayer] = useState<Player>(settings.humanPlayer);
  const [playerXName, setPlayerXName] = useState<string>(settings.playerXName);
  const [playerOName, setPlayerOName] = useState<string>(settings.playerOName);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);
  const [soundVolume, setSoundVolume] = useState<number>(settings.soundVolume);
  const [showVanishingWarning, setShowVanishingWarning] = useState<boolean>(
    settings.showVanishingWarning ?? true
  );

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const t = translations[language];

  const handleSave = () => {
    sound.playClick(750);
    const updated: GameSettings = {
      language,
      mode,
      ruleVariant,
      theme,
      difficulty,
      humanPlayer,
      playerXName: playerXName.trim() || t.playerXDefault,
      playerOName:
        playerOName.trim() || (mode === 'ai' ? t.playerODefaultAi : t.playerODefaultPvp),
      soundEnabled,
      soundVolume,
      showVanishingWarning,
    };
    onSaveSettings(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden border transition-colors ${
            isDark
              ? 'bg-[#0e121c]/95 border-cyber-borderGlow/60 text-slate-100'
              : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-cyber-border/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
              <h3 className="text-sm font-bold font-mono tracking-wide uppercase">
                {t.settingsTitle}
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playClick(400);
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
            {/* 0. Language Selector */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                {t.langLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setLanguage('ru');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    language === 'ru'
                      ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-sm'
                      : 'border-slate-300/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Русский (RU)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setLanguage('en');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-sm'
                      : 'border-slate-300/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>English (EN)</span>
                </button>
              </div>
            </div>

            {/* 1. Theme Selector */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                {t.themeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setTheme('dark');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-neon-cyan text-neon-cyan shadow-sm'
                      : 'border-slate-300/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.themeDark}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setTheme('light');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                      : 'border-slate-300/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.themeLight}</span>
                </button>
              </div>
            </div>

            {/* 2. Rule Variant */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                {t.rulesLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(550);
                    setRuleVariant('classic');
                  }}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    ruleVariant === 'classic'
                      ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-sm'
                      : 'border-slate-300/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Grid className="w-3.5 h-3.5" />
                    <span>{t.rulesClassicFull}</span>
                  </div>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {t.rulesClassicDesc}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(550);
                    setRuleVariant('infinite');
                  }}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    ruleVariant === 'infinite'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-sm'
                      : 'border-slate-300/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.rulesInfiniteFull}</span>
                  </div>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {t.rulesInfiniteDesc}
                  </span>
                </button>
              </div>
            </div>

            {/* Vanishing piece highlight toggle (only for infinite mode) */}
            {ruleVariant === 'infinite' && (
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-cyber-card/50 border-cyber-border' : 'bg-slate-100/70 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-mono uppercase font-bold block">
                      {t.vanishingWarningLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {showVanishingWarning
                        ? t.vanishingWarningOn
                        : t.vanishingWarningOff}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showVanishingWarning}
                  onChange={(e) => setShowVanishingWarning(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                />
              </div>
            )}

            {/* 3. Game Mode */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                {t.opponentLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(550);
                    setMode('ai');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    mode === 'ai'
                      ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-sm'
                      : 'border-slate-300/60 text-slate-400'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{t.vsAi}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(550);
                    setMode('pvp');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    mode === 'pvp'
                      ? 'bg-neon-rose/15 border-neon-rose text-neon-rose shadow-sm'
                      : 'border-slate-300/60 text-slate-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.pvp}</span>
                </button>
              </div>
            </div>

            {/* AI Sub-settings */}
            {mode === 'ai' && (
              <div
                className={`space-y-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-cyber-card/50 border-cyber-border' : 'bg-slate-100/70 border-slate-200'
                }`}
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    {t.playerSymbolLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setHumanPlayer('X');
                      }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold font-mono transition-all ${
                        humanPlayer === 'X'
                          ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                          : 'border-slate-300/50 text-slate-400'
                      }`}
                    >
                      {t.playerXFirst}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setHumanPlayer('O');
                      }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold font-mono transition-all ${
                        humanPlayer === 'O'
                          ? 'bg-neon-rose/20 border-neon-rose text-neon-rose'
                          : 'border-slate-300/50 text-slate-400'
                      }`}
                    >
                      {t.playerOSecond}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    {t.difficultyLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(500);
                        setDifficulty('easy');
                      }}
                      className={`py-1.5 px-1 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                        difficulty === 'easy'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-500'
                          : 'border-slate-300/50 text-slate-400'
                      }`}
                    >
                      {t.easy}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setDifficulty('medium');
                      }}
                      className={`py-1.5 px-1 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                        difficulty === 'medium'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-500'
                          : 'border-slate-300/50 text-slate-400'
                      }`}
                    >
                      {t.medium}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(700);
                        setDifficulty('impossible');
                      }}
                      className={`py-1.5 px-1 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                        difficulty === 'impossible'
                          ? 'bg-neon-rose/20 border-neon-rose text-neon-rose'
                          : 'border-slate-300/50 text-slate-400'
                      }`}
                    >
                      {t.impossible}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Player Names */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-slate-400">
                {t.playerNamesLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-neon-cyan">X:</span>
                  <input
                    type="text"
                    maxLength={14}
                    value={playerXName}
                    onChange={(e) => setPlayerXName(e.target.value)}
                    className={`w-full mt-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
                      isDark
                        ? 'bg-cyber-card border-cyber-border text-slate-100 focus:border-neon-cyan'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neon-rose">O:</span>
                  <input
                    type="text"
                    maxLength={14}
                    value={playerOName}
                    onChange={(e) => setPlayerOName(e.target.value)}
                    className={`w-full mt-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono focus:outline-none ${
                      isDark
                        ? 'bg-cyber-card border-cyber-border text-slate-100 focus:border-neon-rose'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div
              className={`p-3 rounded-2xl border space-y-2.5 ${
                isDark ? 'bg-cyber-card/50 border-cyber-border' : 'bg-slate-100/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-xs font-mono uppercase">
                    {t.soundLabel}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => {
                    setSoundEnabled(e.target.checked);
                    sound.setEnabled(e.target.checked);
                    if (e.target.checked) sound.playClick();
                  }}
                  className="w-4 h-4 accent-neon-cyan cursor-pointer rounded"
                />
              </div>

              {soundEnabled && (
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{t.soundVolumeLabel}</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSoundVolume(v);
                      sound.setVolume(v);
                    }}
                    onMouseUp={() => sound.playClick(650)}
                    className="w-full accent-neon-cyan cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-cyber-border/70 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick(400);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-400/40 text-xs transition-colors hover:bg-slate-500/10"
            >
              {t.btnCancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-neon-cyan hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.btnApply}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
