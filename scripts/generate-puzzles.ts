import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { countSolutions, generatePuzzle, stringToBoard } from '../src/sudoku/sudoku.logic.ts';
import type { Difficulty } from '../src/sudoku/sudoku.types.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const COUNT_PER_DIFFICULTY = 100;

const result: Record<Difficulty, { clues: string; solution: string }[]> = {
  easy: [],
  medium: [],
  hard: [],
};

for (const difficulty of DIFFICULTIES) {
  console.log(`\nGenerating ${COUNT_PER_DIFFICULTY} ${difficulty} puzzles...`);
  const t0 = performance.now();
  let generated = 0;
  let skipped = 0;

  while (generated < COUNT_PER_DIFFICULTY) {
    const puzzle = generatePuzzle(difficulty);
    const solutions = countSolutions(stringToBoard(puzzle.clues), 2);
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
