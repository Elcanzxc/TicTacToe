import React from 'react';
import { motion } from 'framer-motion';
import { WinningInfo } from '../types';

interface WinLaserLineProps {
  winningInfo: WinningInfo;
}

export const WinLaserLine: React.FC<WinLaserLineProps> = ({ winningInfo }) => {
  const { type, lineIndex, winner } = winningInfo;

  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  if (type === 'row') {
    // 3 rows: indices 0, 1, 2 -> centers at ~16.66%, ~50%, ~83.33%
    const yOffsets = [16.66, 50, 83.33];
    const y = yOffsets[lineIndex];
    x1 = 5;
    y1 = y;
    x2 = 95;
    y2 = y;
  } else if (type === 'col') {
    // 3 columns: indices 0, 1, 2
    const xOffsets = [16.66, 50, 83.33];
    const x = xOffsets[lineIndex];
    x1 = x;
    y1 = 5;
    x2 = x;
    y2 = 95;
  } else if (type === 'diag-main') {
    // Top-left to bottom-right
    x1 = 8;
    y1 = 8;
    x2 = 92;
    y2 = 92;
  } else if (type === 'diag-anti') {
    // Top-right to bottom-left
    x1 = 92;
    y1 = 8;
    x2 = 8;
    y2 = 92;
  }

  const isCyan = winner === 'X';
  const strokeColor = isCyan ? '#00f0ff' : '#ff0055';
  const glowClass = isCyan ? 'neon-glow-cyan' : 'neon-glow-rose';

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`w-full h-full ${glowClass}`}
      >
        <defs>
          <filter id={`laser-core-${winner}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer aura line */}
        <motion.line
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.45"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Sharp core laser line */}
        <motion.line
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

