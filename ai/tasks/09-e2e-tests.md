# Task 09 — E2E Tests

## Overview

Write Playwright E2E tests covering the happy path and key edge cases. All tests must pass at all 4 viewports.

## Acceptance criteria

- [ ] `e2e/home.spec.ts` — home screen: difficulty cards visible, best score shows after seeding localStorage, resume badge appears when progress saved
- [ ] `e2e/sudoku.spec.ts` — game happy path:
  - Navigate to `/game/easy`
  - Select an empty cell
  - Enter a correct number — verify it appears, no error state
  - Enter an incorrect number — verify error highlighting and mistake counter increments
  - Toggle notes mode — enter a number — verify pencil mark renders
  - Undo — verify cell reverts
  - Use hint — verify correct value appears, hint counter increments
  - Inject a near-complete saved game via `page.evaluate` to seed localStorage before navigation: key `sudoku:progress:easy`, value `JSON.stringify({ board: CellState[][] with all cells filled except one, solution: Board, elapsedSeconds: 30, mistakes: 1, hintsUsed: 0, undoStack: [] })` — then navigate to `/game/easy` which resumes the saved game — fill the last cell — verify game complete screen appears
  - Tap Play again — verify new game starts
- [ ] `e2e/settings.spec.ts` — settings navigation, sound toggle, clear scores flow
- [ ] `assertNoHorizontalScroll` called in every test after key interactions
- [ ] All tests pass at `mobile-sm`, `mobile-lg`, `tablet`, `desktop`

## Files

```
e2e/home.spec.ts       ← create
e2e/sudoku.spec.ts     ← create
e2e/settings.spec.ts   ← create
```
