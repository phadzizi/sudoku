import { describe, expect, it } from 'vitest';
import {
  countSolutions,
  generatePuzzle,
  generateSolvedBoard,
  puzzleToString,
  stringToBoard,
} from './sudoku.logic';
import type { Board } from './sudoku.types';

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isValidBoard(board: Board): boolean {
  const expected = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  function eq(a: Set<number>, b: Set<number>) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  for (let i = 0; i < 9; i++) {
    if (!eq(new Set(board[i]), expected)) return false;
    if (!eq(new Set(board.map((r) => r[i])), expected)) return false;
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box: number[] = [];
      for (let r = br * 3; r < br * 3 + 3; r++)
        for (let c = bc * 3; c < bc * 3 + 3; c++) box.push(board[r][c]);
      if (!eq(new Set(box), expected)) return false;
    }
  }
  return true;
}

function givenPositionsOf(board: Board): [number, number][] {
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) if (board[r][c] !== 0) positions.push([r, c]);
  return positions;
}

function criticalGivens(board: Board): [number, number][] {
  return givenPositionsOf(board).filter(([r, c]) => {
    const copy = board.map((row) => [...row]);
    copy[r][c] = 0;
    return countSolutions(copy, 2) === 2;
  });
}

describe('generateSolvedBoard', () => {
  it('produces a valid 9×9 board', () => {
    const board = generateSolvedBoard(mulberry32(1));
    expect(isValidBoard(board)).toBe(true);
  });

  it('is deterministic with a fixed rng', () => {
    const board1 = generateSolvedBoard(mulberry32(42));
    const board2 = generateSolvedBoard(mulberry32(42));
    expect(board1).toEqual(board2);
  });

  it('produces different boards with different seeds', () => {
    const board1 = generateSolvedBoard(mulberry32(1));
    const board2 = generateSolvedBoard(mulberry32(2));
    expect(board1).not.toEqual(board2);
  });
});

describe('countSolutions', () => {
  it('returns 0 for an unsolvable board', () => {
    // Row 0 needs 9 at [0][8], but 9 is already in col 8 and the top-right box
    const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
    board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    board[1][8] = 9;
    board[2][6] = 9;
    expect(countSolutions(board, 2)).toBe(0);
  });

  it('returns 1 for a board with a unique solution', () => {
    const { clues } = generatePuzzle('hard', mulberry32(99));
    expect(countSolutions(stringToBoard(clues), 2)).toBe(1);
  });

  it('returns 2 (stops early) for an under-constrained board', () => {
    const empty: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
    expect(countSolutions(empty, 2)).toBe(2);
  });
});

describe('generatePuzzle difficulty ranges', () => {
  it('easy — given count is 36–50', () => {
    const { clues } = generatePuzzle('easy', mulberry32(1));
    const givens = clues.split('').filter((c) => c !== '0').length;
    expect(givens).toBeGreaterThanOrEqual(36);
    expect(givens).toBeLessThanOrEqual(50);
  });

  it('medium — given count is 27–35', () => {
    const { clues } = generatePuzzle('medium', mulberry32(1));
    const givens = clues.split('').filter((c) => c !== '0').length;
    expect(givens).toBeGreaterThanOrEqual(27);
    expect(givens).toBeLessThanOrEqual(35);
  });

  it('hard — given count is 22–26', () => {
    const { clues } = generatePuzzle('hard', mulberry32(1));
    const givens = clues.split('').filter((c) => c !== '0').length;
    expect(givens).toBeGreaterThanOrEqual(22);
    expect(givens).toBeLessThanOrEqual(26);
  });
});

describe('generatePuzzle correctness', () => {
  it('solution satisfies all Sudoku rules', () => {
    const { solution } = generatePuzzle('medium', mulberry32(7));
    expect(isValidBoard(stringToBoard(solution))).toBe(true);
  });

  it('returned puzzle has exactly one solution', () => {
    const { clues } = generatePuzzle('medium', mulberry32(7));
    expect(countSolutions(stringToBoard(clues), 2)).toBe(1);
  });

  it('spot-check easy: algorithm kept critical givens that break uniqueness when removed', () => {
    const { clues } = generatePuzzle('easy', mulberry32(3));
    const board = stringToBoard(clues);
    // Filter to only givens the algorithm rejected during traversal (critical cells)
    const critical = criticalGivens(board);
    expect(critical.length).toBeGreaterThan(0);
    for (const [r, c] of critical.slice(0, 3)) {
      const copy = board.map((row) => [...row]);
      copy[r][c] = 0;
      expect(countSolutions(copy, 2)).toBe(2);
    }
  });

  it('spot-check medium: algorithm kept critical givens that break uniqueness when removed', () => {
    const { clues } = generatePuzzle('medium', mulberry32(5));
    const board = stringToBoard(clues);
    const critical = criticalGivens(board);
    expect(critical.length).toBeGreaterThan(0);
    for (const [r, c] of critical.slice(0, 3)) {
      const copy = board.map((row) => [...row]);
      copy[r][c] = 0;
      expect(countSolutions(copy, 2)).toBe(2);
    }
  });

  it('spot-check hard: all 3 sampled givens break uniqueness when removed', () => {
    const { clues } = generatePuzzle('hard', mulberry32(11));
    const board = stringToBoard(clues);
    // For hard puzzles the algorithm traverses nearly all cells, so most remaining givens are critical
    const positions = givenPositionsOf(board);
    const spots = [
      positions[Math.floor(positions.length * 0.25)],
      positions[Math.floor(positions.length * 0.5)],
      positions[Math.floor(positions.length * 0.75)],
    ];
    for (const [r, c] of spots) {
      const copy = board.map((row) => [...row]);
      copy[r][c] = 0;
      expect(countSolutions(copy, 2)).toBe(2);
    }
  });
});

describe('puzzleToString / stringToBoard', () => {
  it('are inverses of each other (solved board)', () => {
    const board = generateSolvedBoard(mulberry32(1));
    const str = puzzleToString(board);
    expect(str).toHaveLength(81);
    expect(stringToBoard(str)).toEqual(board);
  });

  it('round-trips a puzzle with zeros', () => {
    const { clues } = generatePuzzle('hard', mulberry32(1));
    expect(stringToBoard(clues).flat().map(String).join('')).toBe(clues);
  });
});
