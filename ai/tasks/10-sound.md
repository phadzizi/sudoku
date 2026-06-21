# Task 10 — Sound Effects

## Overview

Add optional sound effects using the Web Audio API. Sound is off by default and controlled by the settings toggle.

## Acceptance criteria

- [ ] `src/services/sound.ts` exports `play(type: SoundType): void` where `SoundType = 'tap' | 'correct' | 'error' | 'complete' | 'hint'`
- [ ] Sounds are generated via Web Audio API — no audio files, no external dependencies
- [ ] `play()` is a no-op when `soundEnabled` is false in `useSettingsStore`
- [ ] `play()` is a no-op when the Web Audio API is unavailable (try/catch)
- [ ] Sound specs:
  - `tap` — soft click on cell select (short sine wave, ~30ms)
  - `correct` — brief upward tone on valid number placement
  - `error` — low buzz on mistake
  - `complete` — short ascending arpeggio on puzzle completion
  - `hint` — neutral chime on hint use
- [ ] `play('tap')` called on cell selection in `SudokuGame.tsx`
- [ ] `play('correct')` called on valid number entry
- [ ] `play('error')` called on mistake
- [ ] `play('complete')` called on puzzle completion
- [ ] `play('hint')` called on hint use
- [ ] No unit tests required (Web Audio API not available in jsdom)

## Files

```
src/services/sound.ts     ← create
src/sudoku/SudokuGame.tsx ← update (add play() calls)
```
