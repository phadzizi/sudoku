# Task 02 — Core Logic + Unit Tests

## Overview

Implement all pure game logic functions and their unit tests. No React, no browser APIs.

## Acceptance criteria

- [ ] `src/sudoku/sudoku.logic.ts` exports:
  - `loadPuzzle(difficulty, rng?)` → `{ board: CellState[][], solution: Board }` — picks randomly from puzzle bank
  - `setCellValue(grid, row, col, value)` → new grid; given cells are unmodifiable (returns grid unchanged)
  - `toggleNote(grid, row, col, note)` → new grid with note added or removed
  - `validateBoard(grid)` → new grid with `error` flags set on all conflicting cells (row, col, box)
  - `isBoardComplete(grid)` → true when all cells filled and no errors
  - `calculateScore(difficulty, elapsedSeconds, mistakes, hintsUsed)` → integer ≥ 0
  - `getHint(grid, solution, row, col)` → correct value for that cell
  - `applyHint(grid, solution, row, col)` → new grid with hint applied and cell marked given
- [ ] Scoring: base (Easy=1000, Medium=2000, Hard=3000) + `max(0, 500 − elapsedSeconds)` − `mistakes×50` − `hintsUsed×100`, minimum 0
- [ ] All functions are pure — no side effects, injectable `rng` where randomness needed
- [ ] `src/sudoku/sudoku.test.ts` covers: loadPuzzle, setCellValue (given cell blocked), toggleNote, validateBoard (row/col/box conflicts), isBoardComplete (empty, errors, correct), calculateScore, getHint

## Files

```
src/sudoku/sudoku.logic.ts   ← create
src/sudoku/sudoku.test.ts    ← create
```
