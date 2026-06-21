import type { Board, Difficulty, Puzzle } from './sudoku.types';

export type Rng = () => number;

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  if (board[row].includes(num)) return false;
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function fillBox(board: Board, startRow: number, startCol: number, rng: Rng): void {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  let idx = 0;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      board[r][c] = nums[idx++];
    }
  }
}

function solveWithRng(board: Board, rng?: Rng): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = rng ? shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng) : [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveWithRng(board, rng)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSolvedBoard(rng: Rng = Math.random): Board {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBox(board, 0, 0, rng);
  fillBox(board, 3, 3, rng);
  fillBox(board, 6, 6, rng);
  solveWithRng(board, rng);
  return board;
}

export function countSolutions(board: Board, limit: number): number {
  let count = 0;

  function bt(): void {
    if (count >= limit) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              bt();
              board[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  bt();
  return count;
}

const GIVEN_TARGETS: Record<Difficulty, number> = {
  easy: 36,
  medium: 27,
  hard: 22,
};

export function generatePuzzle(difficulty: Difficulty, rng: Rng = Math.random): Puzzle {
  const solution = generateSolvedBoard(rng);
  const puzzle = solution.map((row) => [...row]);

  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }

  const shuffled = shuffle(cells, rng);
  const target = GIVEN_TARGETS[difficulty];
  let givens = 81;

  for (const [r, c] of shuffled) {
    if (givens <= target) break;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    const copy = puzzle.map((row) => [...row]);
    if (countSolutions(copy, 2) === 1) {
      givens--;
    } else {
      puzzle[r][c] = backup;
    }
  }

  return {
    clues: puzzleToString(puzzle),
    solution: puzzleToString(solution),
  };
}

export function puzzleToString(board: Board): string {
  return board.flat().join('');
}

export function stringToBoard(s: string): Board {
  const board: Board = [];
  for (let r = 0; r < 9; r++) {
    board.push(Array.from({ length: 9 }, (_, c) => parseInt(s[r * 9 + c], 10)));
  }
  return board;
}
