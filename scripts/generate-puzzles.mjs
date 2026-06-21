// Pure Node.js puzzle generation script — no extra dependencies
// Run with: node scripts/generate-puzzles.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Generator logic (mirrors sudoku.logic.ts) ---

function shuffle(arr, rng) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isValid(board, row, col, num) {
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

function fillBox(board, startRow, startCol, rng) {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  let idx = 0;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      board[r][c] = nums[idx++];
    }
  }
}

function solveWithRng(board, rng) {
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

function generateSolvedBoard(rng) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBox(board, 0, 0, rng);
  fillBox(board, 3, 3, rng);
  fillBox(board, 6, 6, rng);
  solveWithRng(board, rng);
  return board;
}

function countSolutions(board, limit) {
  let count = 0;
  function bt() {
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

function puzzleToString(board) {
  return board.flat().join('');
}

const GIVEN_TARGETS = { easy: 36, medium: 27, hard: 22 };

function generatePuzzle(difficulty) {
  const rng = Math.random;
  const solution = generateSolvedBoard(rng);
  const puzzle = solution.map((row) => [...row]);

  const cells = [];
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

// --- Generation ---

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const COUNT_PER_DIFFICULTY = 100;

const result = { easy: [], medium: [], hard: [] };

for (const difficulty of DIFFICULTIES) {
  console.log(`\nGenerating ${COUNT_PER_DIFFICULTY} ${difficulty} puzzles...`);
  const t0 = performance.now();
  let generated = 0;
  let skipped = 0;

  while (generated < COUNT_PER_DIFFICULTY) {
    const puzzle = generatePuzzle(difficulty);
    const clueBoard = puzzle.clues.split('').map(Number);
    const board = Array.from({ length: 9 }, (_, r) => clueBoard.slice(r * 9, r * 9 + 9));
    const solutions = countSolutions(board, 2);
    if (solutions !== 1) {
      skipped++;
      console.warn(
        `  [skip] puzzle #${generated + skipped} has ${solutions} solution(s) — skipping`
      );
      continue;
    }
    result[difficulty].push(puzzle);
    generated++;
    if (generated % 10 === 0) {
      process.stdout.write(`  ${generated}/${COUNT_PER_DIFFICULTY}...\r`);
    }
  }

  const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
  console.log(`  Done: ${generated} valid, ${skipped} skipped. Time: ${elapsed}s`);
}

// --- Write output ---

const lines = [
  `import type { Difficulty, Puzzle } from './sudoku.types';`,
  ``,
  `export const PUZZLES: Record<Difficulty, Puzzle[]> = {`,
];

for (const difficulty of DIFFICULTIES) {
  lines.push(`  ${difficulty}: [`);
  for (const { clues, solution } of result[difficulty]) {
    lines.push(`    { clues: '${clues}', solution: '${solution}' },`);
  }
  lines.push(`  ],`);
}

lines.push(`};`);
lines.push(``);

const outPath = join(__dirname, '..', 'src', 'sudoku', 'puzzles.ts');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`\nWrote ${outPath}`);
