# Mobile & Web Testing Protocol

Every feature must be mechanically verified at multiple viewports before PR.

---

## 1. Viewport matrix

| Name        | Width  | Height | Represents                |
| ----------- | ------ | ------ | ------------------------- |
| `mobile-sm` | 360px  | 640px  | Small Android / iPhone SE |
| `mobile-lg` | 390px  | 844px  | iPhone 14                 |
| `tablet`    | 768px  | 1024px | iPad portrait             |
| `desktop`   | 1280px | 800px  | Laptop                    |

Configure this in `playwright.config.ts` — see section 3.

---

## 2. What Playwright must cover

### Happy path (required)

1. Navigate to the game screen
2. Select a difficulty and start
3. Select an empty cell
4. Enter a correct number
5. Verify the number appears in the cell
6. Enter an incorrect number — verify error state is shown
7. Complete (or simulate completion of) the puzzle
8. Verify the completion screen shows time and score
9. Tap Play Again — verify a new puzzle starts

This test must pass at **all four viewports**.

### Viewport-specific assertions

At `mobile-sm` (360px), additionally assert:
- No horizontal scrollbar (`document.body.scrollWidth <= 360`)
- Sudoku grid fully visible without scrolling
- Number picker buttons visible without scrolling

At `desktop` (1280px), additionally assert:
- Game content is centered and not stretched beyond `max-width: 480px`

---

## 3. Playwright configuration

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'mobile-sm', use: { viewport: { width: 360, height: 640 } } },
    {
      name: 'mobile-lg',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      },
    },
    { name: 'tablet', use: { ...devices['iPad'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 4. Shared test selectors

Use `data-testid` on key elements:

| Element               | `data-testid`              |
| --------------------- | -------------------------- |
| Board grid            | `sudoku-board`             |
| Individual cell       | `cell-{row}-{col}`         |
| Number picker         | `number-picker`            |
| Number button         | `pick-{n}` (1–9)           |
| Erase button          | `pick-erase`               |
| Timer display         | `timer-display`            |
| Mistake counter       | `mistake-counter`          |
| Start / Play Again    | `start-button`             |
| Game complete screen  | `game-complete-screen`     |
| Difficulty selector   | `difficulty-{easy|medium|hard}` |

---

## 5. No-horizontal-scroll assertion

`e2e/helpers/viewport.ts`:

```ts
import { Page, expect } from '@playwright/test';

export async function assertNoHorizontalScroll(page: Page) {
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = page.viewportSize()!.width;
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
}
```

---

## 6. Manual testing checklist

```
Chrome devtools — Device toolbar

[ ] Set to "iPhone SE" (375×667) — grid fits, picker visible
[ ] Set to "Galaxy S20" (360×800) — grid fits, picker visible
[ ] Set to "iPad Air" (820×1180) — layout centered
[ ] Responsive mode at 320px — nothing overflows
[ ] Responsive mode at 1440px — content centered, not stretched

Touch simulation

[ ] Cells respond to tap
[ ] Number picker responds to tap
[ ] No accidental double-tap zoom

Keyboard navigation (desktop)

[ ] Tab into the board
[ ] Arrow keys navigate between cells
[ ] Number keys 1–9 fill selected cell
[ ] Delete/Backspace clears selected cell
[ ] Focus ring visible

Sudoku UX

[ ] Given cells cannot be edited
[ ] Error cells are visually distinct
[ ] Completing the board triggers the win screen
```
