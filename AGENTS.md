# AGENTS.md

You are an AI coding agent working on a cross-platform app built with React, TypeScript, Capacitor, Vite, Zustand, Vitest, React Testing Library, and Playwright.

## Core rule

Do not jump straight into coding.

For every feature request, follow this exact workflow:

1. Understand the feature
2. Inspect the existing code
3. Write an implementation plan
4. Break the work into small tasks
5. Implement one task at a time
6. Run checks
7. Review your own code
8. Fix issues
9. Prepare a PR

## Feature workflow

For every new feature, create or update as needed:

- Logic (pure functions)
- UI components
- Tests
- Routing
- Storage
- Documentation

## Standards

- Good code: `ai/GOOD_CODE_STANDARD.md`
- Task breakdown: `ai/TASK_BREAKDOWN_PROTOCOL.md`
- Feature architecture: `ai/FEATURE_STANDARD.md`
- Definition of done: `ai/DEFINITION_OF_DONE.md`
- UI design: `ai/UI_DESIGN_STANDARD.md` ← read this before writing any CSS or JSX
- Mobile & web testing: `ai/MOBILE_WEB_TESTING.md` ← read this before writing any Playwright test

## Project architecture

```
src/
  sudoku/           ← feature module
  components/       ← shared UI
  pages/            ← route-level screens
  store/            ← Zustand stores
  services/         ← storage, sound, haptics
  styles/           ← tokens.css, global.css
```

## Quality gates — run before every PR

```bash
npm run check          # format + lint + typecheck + unit tests + build
npm run test:e2e       # Playwright at all 4 viewports
```

If `test:e2e` fails with a missing shared library error, run `sudo npx playwright install-deps chromium` once, then retry.

If any gate fails, fix it. Do not claim it passed unless you ran it.

## Self-review checklist

Before creating a PR, answer each item honestly:

**Code**

- Does the feature match every acceptance criterion?
- Is the solution simpler than the first version I thought of?
- Did I avoid unnecessary dependencies?
- Is logic separated from UI?
- Are important edge cases tested?
- Are timers, intervals, and subscriptions cleaned up?
- Did I avoid `any`?

**UI — run the checklist in `ai/UI_DESIGN_STANDARD.md` section 9**

- No hard-coded colors or spacing values (use tokens)?
- All interactive elements at least 44×44px?
- No hover-only interactions?
- Focus ring visible?
- `prefers-reduced-motion` respected?

**Mobile & web — run the checklist in `ai/MOBILE_WEB_TESTING.md` section 9**

- No horizontal scroll at 320px?
- Content centered and not stretched at 1280px?
- Playwright E2E passes at all 4 viewports?
- `data-testid` attributes on all key elements?

If any answer is no, fix it first.

## PR requirements

Every PR must include:

- Summary (bullet points)
- Which acceptance criteria are satisfied
- Tests added
- Commands run
- Known limitations
- Follow-up ideas (optional)

## Branch naming

```
feature/[short-description]
fix/[short-description]
chore/[short-description]
```

## Commit style

```
feat: add puzzle generator with uniqueness validation
fix: clear timer on component unmount
chore: add vitest config
```
