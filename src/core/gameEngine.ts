import { BoardState, Player, WinningInfo, GameStatus, RuleVariant } from '../types';

export const WINNING_COMBINATIONS: Array<{
  combination: [number, number, number];
  type: WinningInfo['type'];
  lineIndex: number;
}> = [
  // Rows
  { combination: [0, 1, 2], type: 'row', lineIndex: 0 },
  { combination: [3, 4, 5], type: 'row', lineIndex: 1 },
  { combination: [6, 7, 8], type: 'row', lineIndex: 2 },
  // Columns
  { combination: [0, 3, 6], type: 'col', lineIndex: 0 },
  { combination: [1, 4, 7], type: 'col', lineIndex: 1 },
  { combination: [2, 5, 8], type: 'col', lineIndex: 2 },
  // Diagonals
  { combination: [0, 4, 8], type: 'diag-main', lineIndex: 0 },
  { combination: [2, 4, 6], type: 'diag-anti', lineIndex: 0 },
];

export function createInitialBoard(): BoardState {
  return Array(9).fill(null);
}

export function checkWin(board: BoardState): WinningInfo | null {
  for (const item of WINNING_COMBINATIONS) {
    const [a, b, c] = item.combination;
    const valA = board[a];
    if (valA && valA === board[b] && valA === board[c]) {
      return {
        combination: item.combination,
        type: item.type,
        lineIndex: item.lineIndex,
        winner: valA,
      };
    }
  }
  return null;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

export function getGameStatus(
  board: BoardState,
  ruleVariant: RuleVariant = 'classic'
): {
  status: GameStatus;
  winningInfo: WinningInfo | null;
} {
  const winningInfo = checkWin(board);
  if (winningInfo) {
    return { status: 'won', winningInfo };
  }
  if (ruleVariant === 'classic' && isBoardFull(board)) {
    return { status: 'draw', winningInfo: null };
  }
  // In infinite mode, draw never occurs
  return { status: 'in_progress', winningInfo: null };
}

export function makeMove(board: BoardState, index: number, player: Player): BoardState {
  if (index < 0 || index >= board.length || board[index] !== null) {
    throw new Error(`Invalid move at index ${index}`);
  }
  const next = [...board];
  next[index] = player;
  return next;
}

/**
 * Executes a move in infinite mode (max 3 pieces).
 * If the player already has 3 pieces, the oldest piece is removed.
 */
export function makeInfiniteMove(
  board: BoardState,
  newIndex: number,
  player: Player,
  currentMoves: number[]
): {
  nextBoard: BoardState;
  nextMoves: number[];
  removedIndex: number | null;
} {
  if (newIndex < 0 || newIndex >= board.length || board[newIndex] !== null) {
    throw new Error(`Invalid move at index ${newIndex}`);
  }

  const nextBoard = [...board];
  let removedIndex: number | null = null;
  const nextMoves = [...currentMoves];

  if (nextMoves.length >= 3) {
    // Evict oldest piece
    removedIndex = nextMoves.shift()!;
    nextBoard[removedIndex] = null;
  }

  nextBoard[newIndex] = player;
  nextMoves.push(newIndex);

  return {
    nextBoard,
    nextMoves,
    removedIndex,
  };
}

export function switchPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

/**
 * Converts a 0..8 index into chess/board notation (e.g. 4 -> "B2")
 */
export function indexToNotation(index: number): string {
  if (index < 0 || index > 8) return '?';
  const cols = ['A', 'B', 'C'];
  const col = cols[index % 3];
  const row = Math.floor(index / 3) + 1;
  return `${col}${row}`;
}

