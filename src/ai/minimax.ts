import { BoardState, Player, Difficulty, RuleVariant } from '../types';
import {
  checkWin,
  isBoardFull,
  getAvailableMoves,
  switchPlayer,
  makeInfiniteMove,
} from '../core/gameEngine';

interface MinimaxResult {
  score: number;
  bestMove: number;
}

/**
 * Classic Minimax with Alpha-Beta pruning for 9-cells board.
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): MinimaxResult {
  const winInfo = checkWin(board);

  if (winInfo) {
    if (winInfo.winner === aiPlayer) {
      return { score: 10 - depth, bestMove: -1 };
    } else {
      return { score: depth - 10, bestMove: -1 };
    }
  }

  if (isBoardFull(board)) {
    return { score: 0, bestMove: -1 };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const result = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break;
      }
    }
    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const result = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break;
      }
    }
    return { score: minScore, bestMove };
  }
}

/**
 * Checks for immediate winning move in infinite mode taking into account piece eviction.
 */
function findInfiniteWinningMove(
  board: BoardState,
  player: Player,
  playerMoves: number[]
): number | null {
  const availableMoves = getAvailableMoves(board);
  for (const move of availableMoves) {
    const { nextBoard } = makeInfiniteMove(board, move, player, playerMoves);
    const win = checkWin(nextBoard);
    if (win && win.winner === player) {
      return move;
    }
  }
  return null;
}

/**
 * Infinite Mode AI Move calculation.
 */
export function getInfiniteAIMove(
  board: BoardState,
  aiPlayer: Player,
  aiMoves: number[],
  humanMoves: number[],
  difficulty: Difficulty
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer = switchPlayer(aiPlayer);

  // 1. Can AI win immediately?
  const winMove = findInfiniteWinningMove(board, aiPlayer, aiMoves);
  if (winMove !== null) {
    if (difficulty === 'impossible' || Math.random() < 0.85) {
      return winMove;
    }
  }

  // 2. Must AI block opponent from winning on their next turn?
  const blockMove = findInfiniteWinningMove(board, humanPlayer, humanMoves);
  if (blockMove !== null) {
    if (difficulty === 'impossible' || (difficulty === 'medium' && Math.random() < 0.75)) {
      return blockMove;
    }
  }

  // 3. Easy / Casual mode: pick random move
  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 4. Strategic priority: Center (4), Corners (0, 2, 6, 8), Edges (1, 3, 5, 7)
  const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (const p of preferred) {
    if (availableMoves.includes(p)) {
      return p;
    }
  }

  return availableMoves[0];
}

/**
 * Main AI move resolver based on rule variant.
 */
export function getAIMove(
  board: BoardState,
  aiPlayer: Player,
  difficulty: Difficulty,
  ruleVariant: RuleVariant = 'classic',
  aiMoves: number[] = [],
  humanMoves: number[] = []
): number {
  if (ruleVariant === 'infinite') {
    return getInfiniteAIMove(board, aiPlayer, aiMoves, humanMoves, difficulty);
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer = switchPlayer(aiPlayer);

  // Opening move variety
  if (availableMoves.length === 9) {
    const openingMoves = [4, 0, 2, 6, 8];
    return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  if (difficulty === 'impossible') {
    const { bestMove } = minimax(board, 0, true, aiPlayer, humanPlayer);
    return bestMove;
  }

  if (difficulty === 'easy') {
    // 30% chance to block / take win
    const moves = getAvailableMoves(board);
    for (const move of moves) {
      board[move] = aiPlayer;
      const win = checkWin(board);
      board[move] = null;
      if (win && Math.random() < 0.35) return move;
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === 'medium') {
    if (Math.random() < 0.55) {
      const { bestMove } = minimax(board, 0, true, aiPlayer, humanPlayer);
      return bestMove;
    }
    const moves = getAvailableMoves(board);
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (const p of preferred) {
      if (moves.includes(p)) return p;
    }
    return moves[0];
  }

  return availableMoves[0];
}
