# Feature Standard

Every feature must follow this structure without exception.

---

## Directory layout

```
src/sudoku/
  sudoku.types.ts       ← types only, no logic
  sudoku.logic.ts       ← pure functions only, no React
  sudoku.test.ts        ← unit tests for logic
  SudokuGame.tsx        ← React UI component
  index.ts              ← re-exports for clean imports
```

---

## Types file

Define all shapes used by the game. Required types:

```ts
export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'complete';

// 0 = empty cell
export type Board = number[][];

export type CellState = {
  value: number;       // 0 = empty
  given: boolean;      // true = part of the original puzzle, not editable
  notes: number[];     // pencil-mark candidates (0–9)
  error: boolean;      // true = conflicts with another cell
};

export type GameState = {
  status: GameStatus;
  difficulty: Difficulty;
  board: CellState[][];
  solution: Board;
  selectedCell: [number, number] | null;
  elapsedSeconds: number;
  mistakes: number;
  bestTime: number | null;  // per difficulty, in seconds
};
```

---

## Logic file

Contains only pure functions. Rules:

- No React imports
- No browser APIs (`document`, `window`, `localStorage`)
- Puzzle generation must accept an injectable `rng` parameter for deterministic tests
- Every function takes data in, returns data out — no side effects

Required functions:

```ts
generatePuzzle(difficulty: Difficulty, rng?: () => number): { board: Board; solution: Board }
createCellGrid(board: Board, solution: Board): CellState[][]
setCellValue(grid: CellState[][], row: number, col: number, value: number): CellState[][]
toggleNote(grid: CellState[][], row: number, col: number, note: number): CellState[][]
validateBoard(grid: CellState[][]): CellState[][]   // marks error cells
isBoardComplete(grid: CellState[][]): boolean
calculateScore(difficulty: Difficulty, elapsedSeconds: number, mistakes: number): number
```

---

## Logic constraints

- Every generated puzzle must have exactly one solution
- Given cells must not be editable (`given: true` cells are read-only)
- `validateBoard` checks rows, columns, and 3×3 boxes — marks conflicts as `error: true`
- Validation runs after every cell change, not on a timer

---

## UI component

Responsibilities:

- Render the 9×9 board
- Render the number picker (1–9 + erase)
- Handle cell selection and number entry
- Show timer, mistake count, difficulty label
- Manage the game timer (and clean it up on unmount/pause)
- Handle game completion

Must NOT contain:

- Puzzle generation algorithms
- Validation logic
- Score calculation
- Solution checking

These belong in the logic file.

---

## Tests file

Test the logic file, not the UI. Minimum coverage:

```ts
describe('generatePuzzle', () => {
  it('returns a 9x9 board', ...);
  it('easy has more given cells than hard', ...);
  it('solution satisfies all Sudoku rules', ...);
});

describe('validateBoard', () => {
  it('marks a duplicate in a row as error', ...);
  it('marks a duplicate in a column as error', ...);
  it('marks a duplicate in a box as error', ...);
  it('does not mark valid cells as errors', ...);
});

describe('isBoardComplete', () => {
  it('returns false when cells are empty', ...);
  it('returns false when errors exist', ...);
  it('returns true when board matches solution', ...);
});

describe('calculateScore', () => {
  it('awards more points for harder difficulty', ...);
  it('penalises mistakes', ...);
  it('rewards faster completion times', ...);
});
```

For deterministic tests, inject a fixed `rng`:

```ts
const fixedRng = () => 0.5;
const { board, solution } = generatePuzzle('easy', fixedRng);
```

---

## Index file

```ts
export { default } from './SudokuGame';
export * from './sudoku.types';
export * from './sudoku.logic';
```

---

## Scoring formula

```
base(easy) = 1000 | base(medium) = 2000 | base(hard) = 3000
timeBonus  = max(0, 500 − elapsedSeconds)
score      = max(0, base + timeBonus − mistakes × 50 − hintsUsed × 100)
```

Implemented in `calculateScore(difficulty, elapsedSeconds, mistakes, hintsUsed): number`.

---

## Storage

Use the shared storage service at `src/services/storage.ts`. Never call `localStorage` directly from a component or logic file.

Best score shape (one record per difficulty):

```ts
export type BestScore = {
  score: number;
  achievedAt: string; // ISO date string
};
```

Storage keys: `sudoku:best:easy`, `sudoku:best:medium`, `sudoku:best:hard`
In-progress keys: `sudoku:progress:easy`, `sudoku:progress:medium`, `sudoku:progress:hard`
