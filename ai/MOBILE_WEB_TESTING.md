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

Configure this in `playwright.config.ts`.

---

## 2. What Playwright must cover for every new screen or feature

### Happy path (required)

1. Navigate to the screen
2. Complete the primary user action
3. Verify the expected outcome
4. Verify score / state updates where applicable
5. Verify any error or edge-case path
6. Verify reset / replay / back navigation

This test must pass at **all four viewports**.

### Viewport-specific assertions

At `mobile-sm` (360px), additionally assert:

- No horizontal scrollbar (`document.body.scrollWidth <= 360`)
- All primary controls visible without scrolling
- Score / status display visible

At `desktop` (1280px), additionally assert:

- Content is centered and not stretched beyond `max-width`
- No layout elements are misaligned

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
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
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

## 4. Shared test selectors rule

Use `data-testid` attributes on key elements — never CSS selectors or text content that can change. Define `data-testid` values in the task spec for each feature.

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

Call it in every test after significant interactions.

---

## 6. Manual testing checklist

```
Chrome devtools — Device toolbar

[ ] Set to "iPhone SE" (375×667) — check layout
[ ] Set to "Galaxy S20" (360×800) — check layout
[ ] Set to "iPad Air" (820×1180) — check layout
[ ] Responsive mode at 320px — nothing overflows
[ ] Responsive mode at 1440px — content centered, not stretched

Touch simulation

[ ] All buttons respond to tap (not just hover)
[ ] No accidental double-tap zoom
[ ] No 300ms tap delay

Keyboard navigation (desktop)

[ ] Tab through all interactive elements in logical order
[ ] Focus ring visible on all focused elements
[ ] Enter/Space activates buttons

Safari (if available)

[ ] Run on Safari — check for CSS gaps
[ ] Check that `dvh` units work
```

---

## 7. Capacitor verification (before PR if native files changed)

If any of these changed, run the Capacitor sync check before PR:

- `capacitor.config.ts`
- `src/services/` files that use Capacitor plugins
- Any `@capacitor/*` imports

```bash
npm run build
npx cap sync android
npx cap open android
```
