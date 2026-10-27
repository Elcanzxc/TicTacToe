import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  makeMove,
  makeInfiniteMove,
  checkWin,
  isBoardFull,
  getAvailableMoves,
  getGameStatus,
  switchPlayer,
} from '../src/core/gameEngine';
import { BoardState } from '../src/types';

describe('GameEngine Core Rules', () => {
  it('creates an empty 9-cell board', () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });

  it('correctly applies a move immutably', () => {
    const board = createInitialBoard();
    const nextBoard = makeMove(board, 4, 'X');
    expect(board[4]).toBeNull();
    expect(nextBoard[4]).toBe('X');
  });

  it('throws error when moving to an occupied cell', () => {
    const board = createInitialBoard();
    const nextBoard = makeMove(board, 0, 'X');
    expect(() => makeMove(nextBoard, 0, 'O')).toThrowError();
  });

  it('detects a row win for X', () => {
    const board: BoardState = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    const win = checkWin(board);
    expect(win).not.toBeNull();
    expect(win?.winner).toBe('X');
    expect(win?.type).toBe('row');
    expect(win?.combination).toEqual([0, 1, 2]);
  });

  it('detects a column win for O', () => {
    const board: BoardState = [
      'O', 'X', 'X',
      'O', null, 'X',
      'O', null, null,
    ];
    const win = checkWin(board);
    expect(win).not.toBeNull();
    expect(win?.winner).toBe('O');
    expect(win?.type).toBe('col');
    expect(win?.combination).toEqual([0, 3, 6]);
  });

  it('detects diagonal wins', () => {
    const diagMain: BoardState = [
      'X', 'O', null,
      'O', 'X', null,
      null, null, 'X',
    ];
    expect(checkWin(diagMain)?.combination).toEqual([0, 4, 8]);

    const diagAnti: BoardState = [
      null, 'X', 'O',
      'X', 'O', null,
      'O', null, 'X',
    ];
    expect(checkWin(diagAnti)?.combination).toEqual([2, 4, 6]);
  });

  it('detects a draw state in classic mode', () => {
    const board: BoardState = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(isBoardFull(board)).toBe(true);
    expect(checkWin(board)).toBeNull();
    const status = getGameStatus(board, 'classic');
    expect(status.status).toBe('draw');
  });

  it('never draws in infinite mode even if board has cells', () => {
    const board: BoardState = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    const status = getGameStatus(board, 'infinite');
    expect(status.status).toBe('in_progress');
  });

  it('switches player correctly', () => {
    expect(switchPlayer('X')).toBe('O');
    expect(switchPlayer('O')).toBe('X');
  });

  it('returns valid available moves', () => {
    const board: BoardState = [
      'X', null, 'O',
      null, 'X', null,
      null, null, 'O',
    ];
    expect(getAvailableMoves(board)).toEqual([1, 3, 5, 6, 7]);
  });

  describe('Infinite (3-pieces) Mode Mechanics', () => {
    it('allows placing up to 3 pieces without removal', () => {
      let board = createInitialBoard();
      let moves: number[] = [];

      const r1 = makeInfiniteMove(board, 0, 'X', moves);
      board = r1.nextBoard;
      moves = r1.nextMoves;
      expect(r1.removedIndex).toBeNull();
      expect(board[0]).toBe('X');

      const r2 = makeInfiniteMove(board, 1, 'X', moves);
      board = r2.nextBoard;
      moves = r2.nextMoves;
      expect(r2.removedIndex).toBeNull();
      expect(board[1]).toBe('X');

      const r3 = makeInfiniteMove(board, 2, 'X', moves);
      board = r3.nextBoard;
      moves = r3.nextMoves;
      expect(r3.removedIndex).toBeNull();
      expect(board[2]).toBe('X');
      expect(moves).toEqual([0, 1, 2]);
    });

    it('evicts the oldest piece on the 4th move', () => {
      let board = createInitialBoard();
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      const moves = [0, 1, 2];

      // Placing 4th piece at cell 8 must remove cell 0
      const r4 = makeInfiniteMove(board, 8, 'X', moves);
      expect(r4.removedIndex).toBe(0);
      expect(r4.nextBoard[0]).toBeNull();
      expect(r4.nextBoard[8]).toBe('X');
      expect(r4.nextMoves).toEqual([1, 2, 8]);
    });
  });
});
