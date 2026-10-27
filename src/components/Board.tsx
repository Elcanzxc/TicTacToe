import React from 'react';
import { BoardState, Player, WinningInfo, ThemeMode, Language } from '../types';
import { Cell } from './Cell';
import { WinLaserLine } from './WinLaserLine';

interface BoardProps {
  board: BoardState;
  winningInfo: WinningInfo | null;
  vanishingIndex: number | null;
  hintCell: number | null;
  currentTurn: Player;
  isHumanTurn: boolean;
  isGameActive: boolean;
  theme: ThemeMode;
  language: Language;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningInfo,
  vanishingIndex,
  hintCell,
  currentTurn,
  isHumanTurn,
  isGameActive,
  theme,
  language,
  onCellClick,
}) => {
  const winningIndices = new Set(winningInfo?.combination ?? []);

  return (
    <div className="relative w-full max-w-[440px] aspect-square mx-auto p-4 rounded-3xl glass-panel shadow-2xl transition-all duration-300">
      {/* Decorative cyber grid corners */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-neon-rose/50 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-neon-cyan/50 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-neon-rose/50 rounded-br-sm pointer-events-none" />

      {/* Grid of 9 cells */}
      <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
        {board.map((cellValue, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={cellValue}
            isWinningCell={winningIndices.has(idx)}
            isAboutToVanish={idx === vanishingIndex}
            isHintCell={idx === hintCell}
            disabled={!isGameActive || !isHumanTurn || cellValue !== null}
            currentTurn={currentTurn}
            isHumanTurn={isHumanTurn}
            theme={theme}
            language={language}
            onClick={onCellClick}
          />
        ))}

        {/* Laser line on victory */}
        {winningInfo && <WinLaserLine winningInfo={winningInfo} />}
      </div>
    </div>
  );
};
