# Task 11 — Haptic Feedback

## Overview

Add haptic feedback on key interactions using the Capacitor Haptics plugin. Silent no-op on web.

## Acceptance criteria

- [ ] `src/services/haptics.ts` exports `hapticTap()`, `hapticCorrect()`, `hapticError()`, `hapticComplete()`
- [ ] Each function wraps the Capacitor call in try/catch — silent no-op on web
- [ ] `hapticTap()` — `ImpactStyle.Light` on cell selection
- [ ] `hapticCorrect()` — `ImpactStyle.Light` on valid number placement
- [ ] `hapticError()` — `ImpactStyle.Medium` on mistake
- [ ] `hapticComplete()` — `ImpactStyle.Heavy` on puzzle completion
- [ ] All four called alongside their matching `play()` calls in `SudokuGame.tsx` using `void hapticX()`
- [ ] `@capacitor/haptics` is already in `package.json` — do not add a new dependency
- [ ] No unit tests required (Capacitor not available in jsdom)

## Files

```
src/services/haptics.ts    ← create
src/sudoku/SudokuGame.tsx  ← update (add void hapticX() calls)
```
