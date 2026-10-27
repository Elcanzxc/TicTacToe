import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CellState, Player, ThemeMode, Language } from '../types';
import { Flame, Lightbulb } from 'lucide-react';
import { translations } from '../i18n/translations';

interface CellProps {
  index: number;
  value: CellState;
  isWinningCell: boolean;
  isAboutToVanish: boolean;
  isHintCell: boolean;
  disabled: boolean;
  currentTurn: Player;
  isHumanTurn: boolean;
  theme: ThemeMode;
  language: Language;
  onClick: (index: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinningCell,
  isAboutToVanish,
  isHintCell,
  disabled,
  currentTurn,
  isHumanTurn,
  theme,
  language,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = translations[language];

  const handleClick = () => {
    if (!disabled && value === null) {
      onClick(index);
    }
  };

  const showGhost = !disabled && isHumanTurn && value === null && isHovered;
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || value !== null}
      whileHover={!disabled && value === null ? { scale: 1.025 } : {}}
      whileTap={!disabled && value === null ? { scale: 0.96 } : {}}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      aria-label={t.cellAria(index + 1, value)}
      className={`
        relative aspect-square w-full rounded-2xl flex items-center justify-center
        transition-all duration-300 focus:outline-none overflow-hidden
        ${
          isWinningCell
            ? value === 'X'
              ? 'bg-neon-cyan/20 border-2 border-neon-cyan shadow-neon-cyan'
              : 'bg-neon-rose/20 border-2 border-neon-rose shadow-neon-rose'
            : isHintCell
            ? 'bg-amber-400/20 border-2 border-amber-400 ring-4 ring-amber-400/40 shadow-lg'
            : isDark
            ? 'bg-[#111520]/80 hover:bg-[#161c2b] border border-cyber-border/70 hover:border-cyber-borderGlow'
            : 'bg-white/80 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm'
        }
        ${isAboutToVanish ? 'ring-2 ring-amber-500/80' : ''}
        ${!disabled && value === null ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

      {/* Warning badge if this piece is about to vanish */}
      {isAboutToVanish && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/70 text-[9px] font-mono text-amber-500 font-bold"
        >
          <Flame className="w-2.5 h-2.5 animate-bounce" />
          <span className="hidden sm:inline">{t.badgeVanishes}</span>
        </motion.div>
      )}

      {/* Recommended Move Hint Badge */}
      {isHintCell && value === null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none z-10"
        >
          <div className="p-2 rounded-full bg-amber-400/25 border border-amber-400 text-amber-400 shadow-lg">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-black/50 px-1.5 py-0.5 rounded">
            {t.badgeHint}
          </span>
        </motion.div>
      )}

      {/* Render placed symbol with exit animation support */}
      <AnimatePresence mode="wait">
        {value === 'X' && (
          <motion.div
            key="symbol-x"
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(8px)', transition: { duration: 0.25 } }}
            className={`w-3/5 h-3/5 flex items-center justify-center ${
              isAboutToVanish ? 'anim-vanishing' : ''
            }`}
          >
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full stroke-neon-cyan ${isDark ? 'neon-glow-cyan' : ''}`}
              style={{ strokeWidth: 11, strokeLinecap: 'round' }}
            >
              <line x1="22" y1="22" x2="78" y2="78" />
              <line x1="78" y1="22" x2="22" y2="78" />
            </svg>
          </motion.div>
        )}

        {value === 'O' && (
          <motion.div
            key="symbol-o"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(8px)', transition: { duration: 0.25 } }}
            className={`w-3/5 h-3/5 flex items-center justify-center ${
              isAboutToVanish ? 'anim-vanishing' : ''
            }`}
          >
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full stroke-neon-rose fill-none ${isDark ? 'neon-glow-rose' : ''}`}
              style={{ strokeWidth: 10, strokeLinecap: 'round' }}
            >
              <circle cx="50" cy="50" r="30" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ghost preview for human turn */}
      {showGhost && (
        <div className="w-3/5 h-3/5 opacity-25 transition-opacity duration-150 pointer-events-none">
          {currentTurn === 'X' ? (
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full stroke-neon-cyan"
              style={{ strokeWidth: 10, strokeLinecap: 'round' }}
            >
              <line x1="24" y1="24" x2="76" y2="76" />
              <line x1="76" y1="24" x2="24" y2="76" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full stroke-neon-rose fill-none"
              style={{ strokeWidth: 9, strokeLinecap: 'round' }}
            >
              <circle cx="50" cy="50" r="28" />
            </svg>
          )}
        </div>
      )}
    </motion.button>
  );
};
