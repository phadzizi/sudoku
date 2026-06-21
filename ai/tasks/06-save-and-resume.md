# Task 06 — Save / Resume

## Overview

Auto-save game progress after every cell change and offer to resume an in-progress game when the player returns to the difficulty picker.

## Acceptance criteria

- [ ] `src/services/storage.ts` adds: `getSavedGame(difficulty)`, `setSavedGame(difficulty, game)`, `clearSavedGame(difficulty)`
- [ ] Storage keys: `sudoku:progress:easy`, `sudoku:progress:medium`, `sudoku:progress:hard`
- [ ] `SavedGame` persists: `board`, `solution`, `elapsedSeconds`, `mistakes`, `hintsUsed`, `undoStack`
- [ ] State is saved after every cell value change (debounced 500ms to avoid thrashing)
- [ ] On completing a game, saved progress for that difficulty is cleared
- [ ] On home screen, if a saved game exists for a difficulty, the card shows a "Resume" indicator
- [ ] Tapping that card shows a choice: "Resume" (restores full state) or "New game" (discards save, starts fresh)
- [ ] On resume, timer continues from saved `elapsedSeconds`

## Files

```
src/services/storage.ts            ← update
src/sudoku/SudokuGame.tsx          ← update (auto-save)
src/pages/HomePage.tsx             ← update (resume prompt)
```
