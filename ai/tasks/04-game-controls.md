# Task 04 — Game Controls

## Overview

Add the number picker, fill/notes mode toggle, undo, hint button, timer, and counters. The game should be fully playable after this task.

## Acceptance criteria

- [ ] Number picker: buttons 1–9 + Erase, each minimum 44×44px, `data-testid="pick-{n}"` and `data-testid="pick-erase"`
- [ ] Tapping a number in Fill mode sets the selected cell value, runs `validateBoard`, increments mistake counter if value ≠ solution
- [ ] Tapping Erase clears the selected cell (not given cells)
- [ ] Fill / Notes mode toggle button (`data-testid="notes-toggle"`); active state visually distinct
- [ ] In Notes mode, tapping 1–9 adds/removes pencil marks; marks render as a 3×3 mini-grid inside the cell
- [ ] Undo button (`data-testid="undo-button"`) reverts last cell change (supports multiple undos back to puzzle start); disabled when stack is empty
- [ ] Hint button (`data-testid="hint-button"`) reveals correct value for selected cell, increments hint counter; disabled when no editable cell selected
- [ ] Timer (`data-testid="timer-display"`) counts up from 0:00 in `MM:SS` format; starts on first cell interaction
- [ ] Mistake counter (`data-testid="mistake-counter"`) visible
- [ ] Hint counter (`data-testid="hint-counter"`) visible
- [ ] Keyboard: arrow keys navigate cells, 1–9 fills/notes, Delete/Backspace clears, `n` toggles notes, `z`/`Ctrl+Z` undoes, `h` hints

## Files

```
src/sudoku/SudokuGame.tsx          ← update
src/sudoku/SudokuGame.module.css   ← update
```
