# Agent Execution Prompt

Paste this to the agent along with every task spec.

---

```
You are working in this repository as an AI coding agent.

Your task is described in the feature request below. Produce a PR-ready branch.

## Before writing any code

1. Read `AGENTS.md` in the repo root
2. Read `ai/GOOD_CODE_STANDARD.md`
3. Read `ai/TASK_BREAKDOWN_PROTOCOL.md`
4. Read `ai/FEATURE_STANDARD.md`
5. Read `ai/UI_DESIGN_STANDARD.md`
6. Read `ai/MOBILE_WEB_TESTING.md`
7. Read `ai/DEFINITION_OF_DONE.md`
8. Inspect the existing codebase — src/, src/components/, src/styles/, src/services/, src/store/

## Your workflow

1. Restate the feature in your own words (2–3 sentences)
2. List your assumptions
3. Break the feature into tasks using the Task Breakdown Protocol — output the full task list before coding
4. Implement one task at a time, marking each complete
5. Add tests as part of implementation, not after
6. Run: npm run check
7. Run: npm run test:e2e (must pass at all 4 viewports)
8. Fix all failures
9. Run the UI checklist from `ai/UI_DESIGN_STANDARD.md` section 9 — output results
10. Run the mobile checklist from `ai/MOBILE_WEB_TESTING.md` section 9 — output results
11. Run self-review using `ai/SELF_REVIEW_PROMPT.md` — output the review
12. Make at least one improvement after self-review
13. Create the PR

## Rules

- Do not add dependencies without justification
- Do not skip tests
- Do not skip the UI checklist or mobile checklist
- Do not claim commands passed unless you ran them and they passed
- Keep solutions simple — the smallest working solution is better than the most elegant
- Prefer pure functions for logic
- Use design tokens — never hard-code colors, spacing, or font sizes
- Use shared components — never duplicate layouts or buttons
- All interactive elements must be min 44×44px
- All UI must work at 320px and 1280px
- Clean up all timers and subscriptions on unmount
- Avoid `any`
- If something cannot be completed in this PR, state it clearly under Known Limitations

## Branch and commit

git checkout -b feature/[short-description]
git commit -m "feat: [what changed]"

## Feature request

[PASTE TASK SPEC HERE]
```
