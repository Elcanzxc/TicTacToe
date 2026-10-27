import React from 'react';
import { motion } from 'framer-motion';
import { Player, ScoreState, GameMode, RuleVariant, ThemeMode, Language } from '../types';
import { User, Cpu, Sparkles } from 'lucide-react';
import { translations } from '../i18n/translations';

interface ScoreboardProps {
  score: ScoreState;
  currentTurn: Player;
  isGameActive: boolean;
  gameMode: GameMode;
  ruleVariant: RuleVariant;
  theme: ThemeMode;
  language: Language;
  humanPlayer: Player;
  playerXName: string;
  playerOName: string;
  xPiecesCount: number;
  oPiecesCount: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  currentTurn,
  isGameActive,
  gameMode,
  ruleVariant,
  theme,
  language,
  humanPlayer,
  playerXName,
  playerOName,
  xPiecesCount,
  oPiecesCount,
}) => {
  const isXTurn = isGameActive && currentTurn === 'X';
  const isOTurn = isGameActive && currentTurn === 'O';
  const isDark = theme === 'dark';
  const t = translations[language];

  const isXAI = gameMode === 'ai' && humanPlayer !== 'X';
  const isOAI = gameMode === 'ai' && humanPlayer !== 'O';

  return (
    <div className="w-full max-w-[500px] mx-auto flex items-center justify-between gap-3 px-2">
      {/* Player X Card */}
      <motion.div
        animate={{
          scale: isXTurn ? 1.03 : 1,
          borderColor: isXTurn ? '#00f0ff' : isDark ? 'rgba(35, 43, 62, 0.6)' : 'rgba(226, 232, 240, 0.9)',
        }}
        className={`flex-1 relative p-3 rounded-2xl glass-panel transition-all duration-300 ${
          isXTurn
            ? isDark
              ? 'shadow-neon-cyan bg-[#111928]'
              : 'shadow-md border-neon-cyan/80 bg-cyan-50/70'
            : isDark
            ? 'bg-[#11141e]/70'
            : 'bg-white/80'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            {isXAI ? (
              <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
            ) : (
              <User className="w-3.5 h-3.5 text-neon-cyan" />
            )}
            <span className={`text-xs font-semibold truncate max-w-[90px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {playerXName}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan font-bold">
            X
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl font-black font-mono text-neon-cyan">
            {score.xWins}
          </span>
          {ruleVariant === 'infinite' ? (
            <span className="text-[10px] font-mono text-slate-400">
              {xPiecesCount}/3 {t.pieces}
            </span>
          ) : isXTurn ? (
            <span className="text-[10px] font-mono text-neon-cyan tracking-wider uppercase animate-pulse">
              {t.turn}
            </span>
          ) : null}
        </div>
      </motion.div>

      {/* Center Card: Draws or Infinite Badge */}
      <div
        className={`px-3 py-2 rounded-xl border text-center flex flex-col items-center justify-center min-w-[76px] ${
          isDark
            ? 'bg-[#0e111a]/90 border-cyber-border'
            : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        {ruleVariant === 'classic' ? (
          <>
            <span className={`text-[10px] uppercase font-mono tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.draws}
            </span>
            <span className={`text-lg font-bold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {score.draws}
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-amber-500 font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{t.rulesInfinite}</span>
            </span>
            <span className={`text-[11px] font-bold font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.noDraws}
            </span>
          </>
        )}
      </div>

      {/* Player O Card */}
      <motion.div
        animate={{
          scale: isOTurn ? 1.03 : 1,
          borderColor: isOTurn ? '#ff0055' : isDark ? 'rgba(35, 43, 62, 0.6)' : 'rgba(226, 232, 240, 0.9)',
        }}
        className={`flex-1 relative p-3 rounded-2xl glass-panel transition-all duration-300 ${
          isOTurn
            ? isDark
              ? 'shadow-neon-rose bg-[#26111b]'
              : 'shadow-md border-neon-rose/80 bg-rose-50/70'
            : isDark
            ? 'bg-[#11141e]/70'
            : 'bg-white/80'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            {isOAI ? (
              <Cpu className="w-3.5 h-3.5 text-neon-rose" />
            ) : (
              <User className="w-3.5 h-3.5 text-neon-rose" />
            )}
            <span className={`text-xs font-semibold truncate max-w-[90px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {playerOName}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neon-rose/15 text-neon-rose font-bold">
            O
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl font-black font-mono text-neon-rose">
            {score.oWins}
          </span>
          {ruleVariant === 'infinite' ? (
            <span className="text-[10px] font-mono text-slate-400">
              {oPiecesCount}/3 {t.pieces}
            </span>
          ) : isOTurn ? (
            <span className="text-[10px] font-mono text-neon-rose tracking-wider uppercase animate-pulse">
              {t.turn}
            </span>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
