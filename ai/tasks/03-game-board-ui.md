# Task 03 — Game Board UI

## Overview

Render the 9×9 board with cell selection, conflict highlighting, and visual differentiation. Wire up minimal routing so it can be tested in the browser. No controls yet.

## Acceptance criteria

- [ ] `SudokuGame.tsx` renders a 9×9 grid using CSS Grid
- [ ] 3×3 box borders are visually thicker than cell borders
- [ ] Given cells: bold, `--color-text`
- [ ] User-filled cells: normal weight, `--color-primary-light`
- [ ] Error cells: `--color-error` text + border; `aria-invalid="true"`
- [ ] Selected cell: highlighted background
- [ ] Row, column, and 3×3 box of selected cell: subtly highlighted
- [ ] All cells with the same value as the selected cell: highlighted
- [ ] Clicking a non-given cell selects it; clicking a given cell selects it (for reference) but does not allow editing
- [ ] `data-testid="sudoku-board"` on the grid; `data-testid="cell-{row}-{col}"` on each cell
- [ ] Grid fits within 320px viewport without horizontal scroll — use fluid sizing
- [ ] `src/App.tsx` has a route `/game/:difficulty` that renders `SudokuGame` — **temporary scaffold, replaced in Task 07**
- [ ] `src/pages/HomePage.tsx` has temporary plain links to `/game/easy`, `/game/medium`, `/game/hard` — **temporary scaffold, replaced in Task 07**

## Files

```
src/sudoku/SudokuGame.tsx          ← create
src/sudoku/SudokuGame.module.css   ← create
src/sudoku/index.ts                ← create
src/App.tsx                        ← update (add route)
src/pages/HomePage.tsx             ← update (add temp links)
src/components/index.ts            ← create (GameLayout stub)
```
