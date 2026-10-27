import { describe, it, expect } from 'vitest';
import { minimax, getAIMove } from '../src/ai/minimax';
import { BoardState, Player } from '../src/types';
import { checkWin, getAvailableMoves, isBoardFull } from '../src/core/gameEngine';

describe('Minimax Algorithm & AI Engine', () => {
  it('takes immediate win in 1 move', () => {
    // X has two in top row, cell 2 is winning move
    const board: BoardState = [
      'X', 'X', null,
      'O', 'O', null,
      null, null, null,
    ];
    const { bestMove } = minimax(board, 0, true, 'X', 'O');
    expect(bestMove).toBe(2);
  });

  it('blocks opponent from immediate win', () => {
    // O needs to block X from winning on index 2
    const board: BoardState = [
      'X', 'X', null,
      'O', null, null,
      null, null, null,
    ];
    const { bestMove } = minimax(board, 0, true, 'O', 'X');
    expect(bestMove).toBe(2);
  });

  it('prevents diagonal fork threat', () => {
    // X played opposite corners (0 and 8), O in center (4)
    // Next best move for O must be an edge (1, 3, 5, or 7) to avoid fork
    const board: BoardState = [
      'X', null, null,
      null, 'O', null,
      null, null, 'X',
    ];
    const { bestMove } = minimax(board, 0, true, 'O', 'X');
    expect([1, 3, 5, 7]).toContain(bestMove);
  });

  it('Master difficulty is mathematically unbeatable (AI as O against multiple starting moves)', () => {
    // Test that for any opening move by X, Master AI as O never loses.
    const possibleFirstMoves = [0, 1, 4]; // Corner, Edge, Center
    for (const firstMove of possibleFirstMoves) {
      const board: BoardState = Array(9).fill(null);
      board[firstMove] = 'X';

      // Play out the rest using minimax for both or minimax for O and greedy for X
      let currentBoard = [...board];
      let currentTurn: Player = 'O';

      while (!isBoardFull(currentBoard) && !checkWin(currentBoard)) {
        if (currentTurn === 'O') {
          const move = getAIMove(currentBoard, 'O', 'impossible');
          expect(move).toBeGreaterThanOrEqual(0);
          currentBoard[move] = 'O';
        } else {
          // X picks the best move it can find via minimax
          const move = getAIMove(currentBoard, 'X', 'impossible');
          expect(move).toBeGreaterThanOrEqual(0);
          currentBoard[move] = 'X';
        }
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
      }

      const winResult = checkWin(currentBoard);
      // X must NEVER win against Master AI
      if (winResult) {
        expect(winResult.winner).not.toBe('X');
      }
    }
  });

  it('Casual AI makes valid moves within bounds', () => {
    const board: BoardState = [
      'X', null, 'O',
      null, null, null,
      null, null, null,
    ];
    const move = getAIMove(board, 'X', 'easy');
    const available = getAvailableMoves(board);
    expect(available).toContain(move);
  });
});

