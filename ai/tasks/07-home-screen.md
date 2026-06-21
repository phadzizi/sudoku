# Task 07 — Home Screen + Routing

## Overview

Replace the temporary home screen with the real difficulty picker. Wire up full app routing.

## Acceptance criteria

- [ ] Home screen shows three difficulty cards: Easy, Medium, Hard
- [ ] Each card shows the difficulty name, a brief description, and the best score (or "—" if none)
- [ ] Each card shows a "Resume" badge if a saved game exists for that difficulty
- [ ] `data-testid="difficulty-easy"`, `data-testid="difficulty-medium"`, `data-testid="difficulty-hard"`
- [ ] Tapping a card with no saved game starts a new game immediately
- [ ] Tapping a card with a saved game shows inline "Resume" / "New game" choice
- [ ] Settings icon in header navigates to `/settings`
- [ ] `src/App.tsx` routes: `/` (home), `/game/:difficulty` (game), `/settings` (settings stub), `*` → `/`
- [ ] Android hardware back button: exits app from `/`, navigates to `/` from game screen (use `@capacitor/app` `backButton` listener)

## Files

```
src/pages/HomePage.tsx             ← rewrite
src/pages/HomePage.module.css      ← create
src/App.tsx                        ← update (full routing + back button)
```
