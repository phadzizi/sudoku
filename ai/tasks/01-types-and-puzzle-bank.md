# Task 01 — Types + Puzzle Bank

## Overview

Define all TypeScript types and create the bundled puzzle bank. No logic, no UI. This is the data foundation every other task builds on.

## Acceptance criteria

- [ ] `src/sudoku/sudoku.types.ts` defines: `Difficulty`, `GameStatus`, `Board`, `CellState`, `GameState`, `SavedGame`, `BestScore`
- [ ] `CellState` has: `value: number`, `given: boolean`, `notes: number[]`, `error: boolean`
- [ ] `SavedGame` has: `board: CellState[][]`, `solution: Board`, `elapsedSeconds: number`, `mistakes: number`, `hintsUsed: number`, `undoStack: CellState[][][]`
- [ ] `src/sudoku/puzzles.ts` exports `PUZZLES: Record<Difficulty, Puzzle[]>` where `Puzzle = { clues: string; solution: string }` (81-char strings, `'0'` = empty)
- [ ] 100 puzzles per difficulty (300 total)
- [ ] All solutions are valid — each row, column, and 3×3 box contains 1–9 exactly once
- [ ] Easy puzzles have 36–50 givens, medium 27–35, hard 22–26

## Files

```
src/sudoku/sudoku.types.ts   ← create
src/sudoku/puzzles.ts        ← create
```
