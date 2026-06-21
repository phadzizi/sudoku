# Good Code Standard

This is the agent's constitution. Every line of code produced must satisfy these criteria.

---

## 1. Correct

The feature works according to the acceptance criteria. The app must not break existing screens, routing, scoring, storage, or shared components.

## 2. Simple

Prefer the smallest clear solution. Do not over-engineer. Do not introduce unnecessary libraries. Do not create abstractions before there are at least two real use cases. Three similar lines is better than a premature abstraction.

## 3. Readable

Names must explain intent.

Good: `generatePuzzle`, `validateBoard`, `isCellEditable`, `calculateScore`
Bad: `handleThing`, `doStuff`, `data1`

Functions should be small and focused. Comments are only added when the WHY is non-obvious — a hidden constraint, a subtle invariant, or a known workaround. Never comment what the code already says.

## 4. Modular

Logic must be separated from UI.

- `FeatureGame.tsx` — renders UI, calls logic, handles events
- `feature.logic.ts` — pure functions: generation, validation, scoring
- `feature.types.ts` — TypeScript types only

No business logic inside JSX. No React imports in logic files.

## 5. Testable

Important logic must have unit tests. UI flows must have basic component or E2E tests. Every bug fix must include a regression test where practical.

Do not write code that is impossible to test without a browser, network, or real device unless there is no alternative.

## 6. Type-safe

Avoid `any`. Use TypeScript types for:

- state shapes
- events
- score results
- difficulty levels
- storage models
- component props

## 7. Accessible

- Buttons must be real `<button>` elements
- Interactive elements must be keyboard usable
- Text must be readable at default font sizes
- Color must not be the only indicator of state
- Sound must be optional and off by default

## 8. Mobile-friendly

Every feature must work on:

- Small mobile screens (320px+)
- Desktop web
- Touch input
- Mouse input

Avoid hover-only interactions. Use large touch targets (minimum 44×44px). Do not rely on right-click.

## 9. Performant enough

- Avoid unnecessary re-renders (use `useMemo`, `useCallback` where it genuinely helps)
- Avoid storing large objects in state
- Clear intervals and timeouts in cleanup functions
- Do not store derived data that can be computed from existing state

## 10. Consistent

- Use existing project structure before creating new folders
- Use existing shared components before creating new ones
- Follow existing naming patterns
- Follow existing styling patterns

## 11. Safe

- Do not expose secrets or API keys in code
- Do not log sensitive data
- Do not use `dangerouslySetInnerHTML` unless absolutely required and reviewed
- Do not write to localStorage without a service layer

## 12. PR-ready

A PR is only ready when:

- Code builds without errors
- Lint passes with no warnings
- Tests pass
- Feature matches all acceptance criteria
- Self-review is completed and improvements made
- PR description is complete and accurate
