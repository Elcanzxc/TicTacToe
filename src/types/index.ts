import { Language } from '../i18n/translations';

export type { Language };

export type Player = 'X' | 'O';

export type CellState = Player | null;

export type BoardState = CellState[]; // Length 9

export type WinningLineType = 'row' | 'col' | 'diag-main' | 'diag-anti';

export interface WinningInfo {
  combination: [number, number, number];
  type: WinningLineType;
  lineIndex: number;
  winner: Player;
}

export type GameMode = 'pvp' | 'ai';

export type Difficulty = 'easy' | 'medium' | 'impossible';

export type GameStatus = 'in_progress' | 'won' | 'draw';

export type RuleVariant = 'classic' | 'infinite';

export type ThemeMode = 'dark' | 'light';

export interface ScoreState {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
}

export interface GameSettings {
  mode: GameMode;
  ruleVariant: RuleVariant;
  theme: ThemeMode;
  language: Language;
  difficulty: Difficulty;
  humanPlayer: Player;
  playerXName: string;
  playerOName: string;
  soundEnabled: boolean;
  soundVolume: number;
  showVanishingWarning: boolean; // Toggle highlighting which piece will disappear
}

export interface MoveRecord {
  moveNumber: number;
  player: Player;
  cellIndex: number;
  notation: string; // e.g. "B2", "A1"
  evictedIndex: number | null;
  evictedNotation?: string;
  timeString: string;
}

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizeChange: (callback: (isMax: boolean) => void) => () => void;
    };
  }
}
