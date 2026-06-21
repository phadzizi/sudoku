# Task Breakdown Protocol

For every feature, break work into these task groups before writing a single line of code. Output the full task list first, then implement one task at a time.

---

## Phase 1 — Discovery

- Read `AGENTS.md` and all files in `/ai/`
- Identify files likely to change
- Identify existing patterns to reuse (components, hooks, services, store shape)
- Identify risks and edge cases
- List any ambiguities and resolve them before coding

## Phase 2 — Design

- Define state shape (types)
- Define events and transitions
- Define scoring rules
- Define storage needs (what to persist, how)
- Define sound and animation needs

## Phase 3 — Implementation order

Execute in this order to keep the code always in a working state:

1. Types file
2. Logic file with pure functions
3. Unit tests for logic
4. UI component
5. Route/page entry
6. Storage integration
7. Sound/animation (if needed)
8. Shared component updates (if needed)

## Phase 4 — Testing

- Unit tests for all pure logic functions
- Component tests for key UI interactions
- E2E Playwright test for the happy path
- Manual smoke test notes in PR

## Phase 5 — Review

- Compare every acceptance criterion against the implementation
- Compare against `/ai/GOOD_CODE_STANDARD.md`
- Remove dead code
- Rename unclear identifiers
- Simplify component state
- Check mobile layout at 320px
- Check timer/subscription cleanup

## Phase 6 — PR

- Write clear branch name and commit message
- Fill in PR template completely
- Run `npm run check` one final time
- Create PR

---

## Task output format

When breaking down a feature, output tasks like this before coding:

```
Implementation tasks

[ ] 1. Create types file
[ ] 2. Create logic file — core functions
[ ] 3. Add unit tests
[ ] 4. Create UI component
[ ] 5. Add route
[ ] 6. Add storage integration
[ ] 7. Add Playwright happy-path test
[ ] 8. Run npm run check and fix all failures
[ ] 9. Self-review using /ai/SELF_REVIEW_PROMPT.md
[ ] 10. Create PR
```

Mark each task complete as you finish it. Do not batch.
