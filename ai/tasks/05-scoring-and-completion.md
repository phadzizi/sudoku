# Task 05 — Scoring, Storage + Game Complete Screen

## Overview

Wire up score calculation, persist best scores to localStorage, and show the game complete screen.

## Acceptance criteria

- [ ] `src/services/storage.ts` exports `getBestScore(difficulty)`, `setBestScore(difficulty, score)`, `clearBestScore(difficulty)`
- [ ] Storage keys: `sudoku:best:easy`, `sudoku:best:medium`, `sudoku:best:hard`
- [ ] On board completion (`isBoardComplete` returns true): calculate score, update best if higher, stop timer
- [ ] Game complete screen (`data-testid="game-complete-screen"`) shows: time taken, score, mistakes, hints used, best score for that difficulty
- [ ] "Play again" starts a new puzzle at the same difficulty
- [ ] "Change difficulty" navigates to `/`
- [ ] Best score badge on difficulty cards (updated after returning to home)

## Files

```
src/services/storage.ts            ← create
src/sudoku/SudokuGame.tsx          ← update (completion + storage)
src/sudoku/SudokuGame.module.css   ← update
```
