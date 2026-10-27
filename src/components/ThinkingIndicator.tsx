import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ThinkingIndicatorProps {
  isThinking: boolean;
  aiPlayer: string;
  language: Language;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  isThinking,
  aiPlayer,
  language,
}) => {
  if (!isThinking) {
    return <div className="h-7 w-full" />;
  }

  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="h-7 w-full flex items-center justify-center gap-2 text-xs font-mono text-slate-400"
    >
      <div className="relative flex items-center justify-center w-4 h-4">
        <Cpu className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
        <span className="absolute inset-0 rounded-full border border-neon-cyan/40 animate-ping opacity-60" />
      </div>

      <span className="tracking-wide">
        {t.aiThinking(aiPlayer)}
      </span>

      <div className="flex items-center gap-1 ml-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.9,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
