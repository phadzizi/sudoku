# Task 08 — Settings Screen

## Overview

Add a settings screen reachable from the home screen header. Covers sound toggle and score/progress reset.

## Acceptance criteria

- [ ] `/settings` route renders `SettingsPage`
- [ ] Sound toggle: `aria-pressed`, persisted via `useSettingsStore` (Zustand), `data-testid="settings-sound-toggle"`
- [ ] "Clear all scores" button with inline confirmation flow (button → confirm/cancel → cleared message with 2s auto-reset)
- [ ] Clearing scores removes all 6 localStorage keys (`sudoku:best:*` and `sudoku:progress:*`)
- [ ] `data-testid` on: `clear-scores-button`, `clear-scores-confirm`, `clear-scores-cancel`, `scores-cleared-msg`
- [ ] Back button/link returns to `/`
- [ ] `src/store/useSettingsStore.ts` — Zustand store: `soundEnabled` (default false), `toggleSound`; persisted to `sudoku:settings`

## Files

```
src/pages/SettingsPage.tsx         ← create
src/pages/SettingsPage.module.css  ← create
src/store/useSettingsStore.ts      ← create
```
