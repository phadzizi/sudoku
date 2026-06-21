# Definition of Done

A feature is done only when every item below is checked. If any item is unchecked, the feature is not done — do not open the PR.

---

## Functionality

- [ ] Satisfies every acceptance criterion listed in the feature request
- [ ] Does not break any existing screens, routes, or shared components
- [ ] Works on web (desktop and mobile viewport)
- [ ] Works on Android (manual or emulator check)
- [ ] Works on iOS (manual or simulator check, where available)

## Code quality

- [ ] Follows `/ai/GOOD_CODE_STANDARD.md`
- [ ] Follows `/ai/FEATURE_STANDARD.md`
- [ ] Logic is separated from UI
- [ ] No `any` in TypeScript
- [ ] No unused imports or variables
- [ ] No dead code
- [ ] Timers, intervals, and subscriptions are cleaned up on unmount

## UI design

- [ ] Follows `ai/UI_DESIGN_STANDARD.md` — no hard-coded colors, spacing, or font sizes
- [ ] Uses design tokens from `src/styles/tokens.css`
- [ ] Uses shared components where they exist
- [ ] All interactive elements are minimum 44×44px tap target
- [ ] No hover-only interactions
- [ ] Focus ring visible on all focusable elements
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Color is not the sole indicator of state (border, icon, or text also used)
- [ ] Completed `ai/UI_DESIGN_STANDARD.md` section 9 checklist

## Mobile & web

- [ ] No horizontal scroll at 320px viewport width
- [ ] Content centered and not stretched at 1280px viewport width
- [ ] `data-testid` attributes on all key interactive and state elements
- [ ] Playwright E2E happy-path passes at `mobile-sm` (360px)
- [ ] Playwright E2E happy-path passes at `mobile-lg` (390px)
- [ ] Playwright E2E happy-path passes at `tablet` (768px)
- [ ] Playwright E2E happy-path passes at `desktop` (1280px)
- [ ] Completed `ai/MOBILE_WEB_TESTING.md` section 9 manual checklist

## Code checks

- [ ] `npm run format:check` passes
- [ ] `npm run lint` passes (zero warnings)
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run build` succeeds

## Unit & component tests

- [ ] Unit tests cover pure logic
- [ ] Edge cases are tested
- [ ] E2E happy-path test exists for new screens

## PR

- [ ] Branch name follows convention (`feature/`, `fix/`, `chore/`)
- [ ] Commit message follows convention (`feat:`, `fix:`, `chore:`)
- [ ] PR title is clear and under 70 characters
- [ ] PR description is complete (summary, criteria, tests, commands run, limitations)
- [ ] Self-review was completed using `/ai/SELF_REVIEW_PROMPT.md`
- [ ] At least one improvement was made after self-review
