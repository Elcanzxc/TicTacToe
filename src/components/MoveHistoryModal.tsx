import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Sparkles } from 'lucide-react';
import { MoveRecord, ThemeMode, Language } from '../types';
import { sound } from '../audio/soundEngine';
import { translations } from '../i18n/translations';

interface MoveHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: MoveRecord[];
  theme: ThemeMode;
  language: Language;
  playerXName: string;
  playerOName: string;
}

export const MoveHistoryModal: React.FC<MoveHistoryModalProps> = ({
  isOpen,
  onClose,
  moves,
  theme,
  language,
  playerXName,
  playerOName,
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';
  const t = translations[language];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-hidden border ${
            isDark
              ? 'bg-[#0e121c]/95 border-cyber-borderGlow/60 text-slate-100'
              : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-cyber-border/70">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-sm font-bold font-mono tracking-wide uppercase">
                {t.historyTitle}
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

          {/* Moves List */}
          <div className="py-3 max-h-[60vh] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {moves.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                {t.historyEmpty}
              </div>
            ) : (
              moves.map((m) => {
                const isX = m.player === 'X';
                const playerName = isX ? playerXName : playerOName;

                return (
                  <div
                    key={m.moveNumber}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isDark
                        ? 'bg-cyber-card/60 border-cyber-border'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-slate-400 w-6">
                        #{m.moveNumber}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isX
                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40'
                            : 'bg-neon-rose/20 text-neon-rose border border-neon-rose/40'
                        }`}
                      >
                        {m.player}
                      </span>
                      <span className="font-semibold truncate max-w-[110px]">
                        {playerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          isX
                            ? 'bg-neon-cyan/15 text-neon-cyan'
                            : 'bg-neon-rose/15 text-neon-rose'
                        }`}
                      >
                        → {m.notation}
                      </span>

                      {m.evictedNotation && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>- {m.evictedNotation}</span>
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 ml-1">
                        {m.timeString}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-cyber-border/70 flex justify-between items-center text-[11px] text-slate-400">
            <span>{t.historyTotalMoves(moves.length)}</span>
            <button
              type="button"
              onClick={() => {
                sound.playClick(400);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan/15 text-neon-cyan font-bold hover:bg-neon-cyan/25 transition-colors"
            >
              {t.btnClose}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
