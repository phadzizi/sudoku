import { describe, expect, it } from 'vitest';
import {
  applyHint,
  calculateScore,
  countSolutions,
  generatePuzzle,
  generateSolvedBoard,
  getHint,
  isBoardComplete,
  loadPuzzle,
  puzzleToString,
  setCellValue,
  stringToBoard,
  toggleNote,
  validateBoard,
} from './sudoku.logic';
import type { Board, CellState } from './sudoku.types';

// --- Test helpers ---

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

function emptyGrid(): CellState[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: 0, given: false, notes: [], error: false }))
  );
}

function boardToGrid(board: Board): CellState[][] {
  return board.map((row) => row.map((value) => ({ value, given: false, notes: [], error: false })));
}

function firstEmptyCell(grid: CellState[][]): [number, number] {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!grid[r][c].given) return [r, c];
  throw new Error('no empty cell');
}

function firstGivenCell(grid: CellState[][]): [number, number] {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (grid[r][c].given) return [r, c];
  throw new Error('no given cell');
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

  it('spot-check hard: algorithm kept critical givens that break uniqueness when removed', () => {
    const { clues } = generatePuzzle('hard', mulberry32(11));
    const board = stringToBoard(clues);
    const critical = criticalGivens(board);
    expect(critical.length).toBeGreaterThan(0);
    for (const [r, c] of critical.slice(0, 3)) {
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

// ── Task 02 tests ──────────────────────────────────────────────────────────

describe('loadPuzzle', () => {
  it('returns a 9×9 CellState grid', () => {
    const { board } = loadPuzzle('easy', mulberry32(1));
    expect(board).toHaveLength(9);
    board.forEach((row) => expect(row).toHaveLength(9));
  });

  it('marks clue cells as given and empty cells as non-given', () => {
    const { board } = loadPuzzle('medium', mulberry32(1));
    board.forEach((row) =>
      row.forEach((cell) => {
        expect(cell.given).toBe(cell.value !== 0);
        expect(cell.notes).toEqual([]);
        expect(cell.error).toBe(false);
      })
    );
  });

  it('solution is a valid solved board', () => {
    const { solution } = loadPuzzle('hard', mulberry32(1));
    expect(isValidBoard(solution)).toBe(true);
  });

  it('is deterministic with a fixed rng', () => {
    const { board: b1 } = loadPuzzle('easy', mulberry32(7));
    const { board: b2 } = loadPuzzle('easy', mulberry32(7));
    expect(b1).toEqual(b2);
  });
});

describe('setCellValue', () => {
  it('sets a value on a non-given cell and returns a new grid', () => {
    const grid = emptyGrid();
    const next = setCellValue(grid, 3, 5, 7);
    expect(next[3][5].value).toBe(7);
    expect(next).not.toBe(grid);
  });

  it('returns the same grid reference for a given cell', () => {
    const { board } = loadPuzzle('easy', mulberry32(1));
    const [r, c] = firstGivenCell(board);
    const next = setCellValue(board, r, c, 9);
    expect(next).toBe(board);
  });

  it('clears notes when placing a value', () => {
    const withNote = toggleNote(emptyGrid(), 0, 0, 4);
    const withValue = setCellValue(withNote, 0, 0, 5);
    expect(withValue[0][0].notes).toEqual([]);
    expect(withValue[0][0].value).toBe(5);
  });

  it('preserves notes when clearing a cell (value = 0)', () => {
    const withNote = toggleNote(emptyGrid(), 0, 0, 4);
    const cleared = setCellValue(withNote, 0, 0, 0);
    expect(cleared[0][0].notes).toEqual([4]);
    expect(cleared[0][0].value).toBe(0);
  });
});

describe('toggleNote', () => {
  it('adds a note to an empty cell', () => {
    const next = toggleNote(emptyGrid(), 4, 4, 9);
    expect(next[4][4].notes).toContain(9);
  });

  it('removes a note that is already present', () => {
    const with5 = toggleNote(emptyGrid(), 0, 0, 5);
    const without5 = toggleNote(with5, 0, 0, 5);
    expect(without5[0][0].notes).toEqual([]);
  });

  it('keeps notes sorted ascending', () => {
    const a = toggleNote(emptyGrid(), 0, 0, 9);
    const b = toggleNote(a, 0, 0, 1);
    const c = toggleNote(b, 0, 0, 5);
    expect(c[0][0].notes).toEqual([1, 5, 9]);
  });

  it('returns the same grid reference for a given cell', () => {
    const { board } = loadPuzzle('easy', mulberry32(1));
    const [r, c] = firstGivenCell(board);
    expect(toggleNote(board, r, c, 3)).toBe(board);
  });

  it('returns the same grid reference when cell already has a value', () => {
    const withVal = setCellValue(emptyGrid(), 2, 2, 6);
    expect(toggleNote(withVal, 2, 2, 3)).toBe(withVal);
  });
});

describe('validateBoard', () => {
  it('sets no errors on a fully valid (solved) board', () => {
    const grid = boardToGrid(generateSolvedBoard(mulberry32(1)));
    const validated = validateBoard(grid);
    validated.forEach((row) => row.forEach((cell) => expect(cell.error).toBe(false)));
  });

  it('marks both cells in a row conflict', () => {
    const grid = emptyGrid();
    grid[2][0] = { value: 5, given: false, notes: [], error: false };
    grid[2][7] = { value: 5, given: false, notes: [], error: false };
    const v = validateBoard(grid);
    expect(v[2][0].error).toBe(true);
    expect(v[2][7].error).toBe(true);
    expect(v[1][0].error).toBe(false);
  });

  it('marks both cells in a column conflict', () => {
    const grid = emptyGrid();
    grid[0][4] = { value: 3, given: false, notes: [], error: false };
    grid[8][4] = { value: 3, given: false, notes: [], error: false };
    const v = validateBoard(grid);
    expect(v[0][4].error).toBe(true);
    expect(v[8][4].error).toBe(true);
  });

  it('marks both cells in a box conflict', () => {
    const grid = emptyGrid();
    grid[6][6] = { value: 7, given: false, notes: [], error: false };
    grid[8][8] = { value: 7, given: false, notes: [], error: false };
    const v = validateBoard(grid);
    expect(v[6][6].error).toBe(true);
    expect(v[8][8].error).toBe(true);
  });

  it('clears stale error flags on re-validation', () => {
    const grid = emptyGrid();
    grid[0][0] = { value: 9, given: false, notes: [], error: true }; // stale error
    const v = validateBoard(grid);
    expect(v[0][0].error).toBe(false); // no conflict → cleared
  });
});

describe('isBoardComplete', () => {
  it('returns false for a grid with empty cells', () => {
    expect(isBoardComplete(emptyGrid())).toBe(false);
  });

  it('returns false when any cell has an error', () => {
    const grid = emptyGrid();
    grid[0][0] = { value: 1, given: false, notes: [], error: false };
    grid[0][1] = { value: 1, given: false, notes: [], error: false };
    const partial = validateBoard(grid);
    expect(isBoardComplete(partial)).toBe(false);
  });

  it('returns true for a fully filled valid board', () => {
    const solved = generateSolvedBoard(mulberry32(1));
    const validated = validateBoard(boardToGrid(solved));
    expect(isBoardComplete(validated)).toBe(true);
  });
});

describe('calculateScore', () => {
  it('easy, fast finish, no mistakes, no hints → base + time bonus', () => {
    expect(calculateScore('easy', 0, 0, 0)).toBe(1500); // 1000 + 500
  });

  it('time bonus is zero when elapsed ≥ 500 seconds', () => {
    expect(calculateScore('medium', 600, 0, 0)).toBe(2000); // 2000 + 0
  });

  it('deducts 50 per mistake and 100 per hint', () => {
    // 3000 + max(0,500-100) - 3*50 - 2*100 = 3000+400-150-200 = 3050
    expect(calculateScore('hard', 100, 3, 2)).toBe(3050);
  });

  it('score is never negative', () => {
    expect(calculateScore('easy', 9999, 999, 999)).toBe(0);
  });
});

describe('getHint', () => {
  it('returns the correct solution value for an empty cell', () => {
    const { board, solution } = loadPuzzle('easy', mulberry32(1));
    const [r, c] = firstEmptyCell(board);
    expect(getHint(board, solution, r, c)).toBe(solution[r][c]);
  });
});

describe('applyHint', () => {
  it('fills the cell with the solution value and marks it given', () => {
    const { board, solution } = loadPuzzle('easy', mulberry32(1));
    const [r, c] = firstEmptyCell(board);
    const next = applyHint(board, solution, r, c);
    expect(next[r][c].value).toBe(solution[r][c]);
    expect(next[r][c].given).toBe(true);
    expect(next[r][c].notes).toEqual([]);
    expect(next[r][c].error).toBe(false);
  });

  it('returns a new grid without mutating the original', () => {
    const { board, solution } = loadPuzzle('easy', mulberry32(1));
    const [r, c] = firstEmptyCell(board);
    const next = applyHint(board, solution, r, c);
    expect(next).not.toBe(board);
    expect(board[r][c].value).toBe(0);
  });
});
