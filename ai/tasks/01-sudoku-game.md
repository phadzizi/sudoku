# Task 01 — Sudoku Game

## Overview

Implement the full Sudoku game: puzzle bank, core logic, game UI, scoring, notes, undo, hints, and auto-save. This is the only game in the app.

---

## Decisions already made — do not re-litigate

| Topic             | Decision                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| Puzzles           | Bundled bank — 100 puzzles per difficulty (300 total)                    |
| Difficulty        | Easy, Medium, Hard                                                       |
| Scoring           | `baseDifficulty − (mistakes × 50) − (hintsUsed × 100) + timeBonus`      |
| Best score        | One record per difficulty, stored in localStorage                        |
| Input UX          | Fill mode + Notes mode toggle; Erase button; Undo (multi-step)           |
| Keyboard          | Arrow keys navigate, 1–9 fills, Delete/Backspace clears                  |
| Conflict display  | Real-time — highlight all cells violating row/col/box rules              |
| Mistake counting  | Increment when filled value differs from solution                        |
| Hints             | Reveal solution value for selected cell; each use increments hint count  |
| Save/resume       | Auto-save after every cell change; resume prompt on re-entry if in-progress game exists |

---

## Acceptance criteria

### Puzzle bank
- [ ] `src/sudoku/puzzles.ts` exports `PUZZLES: Record<Difficulty, Puzzle[]>` with 100 puzzles per difficulty
- [ ] Each `Puzzle` is `{ clues: string; solution: string }` — 81-char strings, `'0'` = empty cell
- [ ] All solutions are valid (each row, column, and 3×3 box contains 1–9 exactly once)
- [ ] Puzzle is selected randomly on game start; same puzzle is never repeated until the bank is exhausted (shuffle then cycle)

### Core logic (`sudoku.logic.ts`)
- [ ] `loadPuzzle(difficulty, rng?)` — picks a puzzle from the bank, returns `{ board: CellState[][], solution: Board }`
- [ ] `setCellValue(grid, row, col, value)` — returns new grid with value set; given cells are unmodifiable
- [ ] `toggleNote(grid, row, col, note)` — adds/removes a pencil-mark candidate
- [ ] `validateBoard(grid)` — marks `error: true` on all cells conflicting within their row, col, or box
- [ ] `isBoardComplete(grid)` — true when all cells filled and no errors
- [ ] `calculateScore(difficulty, elapsedSeconds, mistakes, hintsUsed)` — returns integer ≥ 0
- [ ] `getHint(grid, solution, row, col)` — returns the correct value for that cell

### Game UI (`SudokuGame.tsx`)
- [ ] 9×9 grid rendered with correct 3×3 box borders (thicker than cell borders)
- [ ] Given cells visually distinct from user-filled cells (bold vs normal weight)
- [ ] Selected cell highlighted; its row, column, and 3×3 box subtly highlighted
- [ ] All cells sharing the same number as the selected cell highlighted
- [ ] Error cells highlighted (color + border — not color alone)
- [ ] Number picker: buttons 1–9 + Erase, minimum 44×44px each
- [ ] Mode toggle: Fill / Notes
- [ ] In Notes mode, entering a number adds/removes a pencil mark; marks render as a 3×3 mini-grid inside the cell
- [ ] Undo button reverts the last cell change (supports multiple undos)
- [ ] Hint button reveals correct value for selected cell; disabled when no cell selected
- [ ] Timer counts up from 0:00; pauses when app goes to background
- [ ] Mistake counter visible
- [ ] Hint counter visible
- [ ] Game complete screen: shows time, score, mistakes, hints used, best score for that difficulty
- [ ] "Play again" starts a new puzzle at the same difficulty; "Change difficulty" returns to difficulty picker

### Difficulty selection
- [ ] Home screen shows three difficulty cards: Easy, Medium, Hard
- [ ] Each card shows the best time for that difficulty (or "—" if none)
- [ ] Tapping a card starts a new game or offers to resume an in-progress game at that difficulty

### Scoring
- [ ] Base scores: Easy = 1000, Medium = 2000, Hard = 3000
- [ ] Time bonus: `max(0, 500 − elapsedSeconds)` — zero bonus after 500 seconds
- [ ] Final: `max(0, base + timeBonus − mistakes × 50 − hintsUsed × 100)`
- [ ] Best score per difficulty stored and displayed

### Save / resume
- [ ] Game state auto-saved to localStorage after every cell change
- [ ] Storage key: `sudoku:progress:<difficulty>`
- [ ] On difficulty card tap, if a saved game exists: show "Resume" / "New game" choice
- [ ] On completing a game, saved progress is cleared for that difficulty
- [ ] Saved state includes: board, solution, elapsedSeconds, mistakes, hintsUsed, undoStack

### Storage keys
```
sudoku:best:easy        → BestScore { score, achievedAt }
sudoku:best:medium      → BestScore { score, achievedAt }
sudoku:best:hard        → BestScore { score, achievedAt }
sudoku:progress:easy    → SavedGame (see above)
sudoku:progress:medium  → SavedGame
sudoku:progress:hard    → SavedGame
```

### Routing
- [ ] `/` — difficulty selection home screen
- [ ] `/game/:difficulty` — active game screen
- [ ] `/settings` — sound toggle, clear all scores/progress

### Keyboard (desktop)
- [ ] Arrow keys navigate between cells
- [ ] 1–9 fills the selected cell (or adds a note in notes mode)
- [ ] Delete / Backspace clears the selected cell
- [ ] `n` toggles notes mode
- [ ] `z` or `Ctrl+Z` triggers undo
- [ ] `h` triggers hint

### Mobile
- [ ] Grid fits within 320px viewport without horizontal scroll
- [ ] Number picker fully visible below the grid without scrolling on mobile-sm
- [ ] All picker buttons meet 44×44px touch target minimum

### Tests
- [ ] Unit tests: `loadPuzzle`, `setCellValue`, `toggleNote`, `validateBoard`, `isBoardComplete`, `calculateScore`, `getHint`
- [ ] Given cells cannot be modified — tested
- [ ] `validateBoard` detects row, column, and box conflicts — tested separately
- [ ] Undo stack operates correctly after multiple moves — tested
- [ ] Playwright E2E happy path at all 4 viewports: select difficulty → play cell → enter number → verify cell updates → trigger error → verify highlight → complete game (inject solution via test helper) → verify complete screen

---

## Out of scope for this task

- iOS / Android native builds (add Capacitor after web is complete)
- App icon / splash screen
- Privacy policy page
- Haptic feedback (add later)
- Puzzle generator (bank is sufficient; add generator if bank ever runs out)

---

## File checklist

```
src/sudoku/sudoku.types.ts
src/sudoku/sudoku.logic.ts
src/sudoku/sudoku.test.ts
src/sudoku/SudokuGame.tsx
src/sudoku/SudokuGame.module.css
src/sudoku/index.ts
src/sudoku/puzzles.ts
src/pages/HomePage.tsx          (difficulty picker)
src/pages/HomePage.module.css
src/services/storage.ts
src/services/haptics.ts         (stub — no-op for now)
src/services/sound.ts           (stub — no-op for now)
src/components/index.ts         (GameLayout, PrimaryButton, shared components)
src/App.tsx                     (routing)
e2e/sudoku.spec.ts
```
