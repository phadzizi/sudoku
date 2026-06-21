# Self-Review Prompt

Run this review before opening any PR. Go through each step in order. Do not skip steps.

---

## Step 1 — Summarize the diff

Write out:

- What files changed and why
- What behavior changed (from the user's perspective)
- What was explicitly not changed (scope boundary)

---

## Step 2 — Check correctness against acceptance criteria

For each acceptance criterion in the feature request, mark:

- **PASS** — fully implemented and verified
- **PARTIAL** — partially implemented; explain what is missing
- **FAIL** — not implemented; explain why

If any criterion is PARTIAL or FAIL, fix it before continuing.

---

## Step 3 — Check code quality

Review the diff against `/ai/GOOD_CODE_STANDARD.md`:

| Area          | What to look for                                                |
| ------------- | --------------------------------------------------------------- |
| Complexity    | Can any function be simplified?                                 |
| Naming        | Do names explain intent without needing a comment?              |
| Duplication   | Is any logic copy-pasted instead of extracted?                  |
| Types         | Is `any` used anywhere? Are all props typed?                    |
| Separation    | Is business logic inside JSX? Move it to logic file.            |
| Tests         | Are edge cases covered? Would a new failure go undetected?      |
| Cleanup       | Are all timers and subscriptions cleaned up?                    |
| Accessibility | Are cells keyboard-navigable? Arrow keys, number keys, delete?  |
| Mobile        | Does the grid fit at 320px? Is the number picker fully visible? |

---

## Step 4 — Verify tests

- Run `npm run test` and confirm all pass
- Check that new tests actually fail when the logic is broken
- Confirm E2E test passes at all four viewports

---

## Step 5 — Make at least one improvement

After the review, make at least one concrete improvement before the PR:

- Rename an unclear variable
- Extract a pure function from component code
- Delete dead code
- Add a missing edge case test
- Simplify a state shape
- Improve an accessibility label

Document what improvement you made in the PR notes.

---

## Step 6 — Final check run

```bash
npm run check
```

Paste the output into the PR body under "Commands Run."

---

## Step 7 — Write PR notes

Produce:

- 3–5 bullet summary of what changed
- Which acceptance criteria are satisfied (checkboxes)
- Tests added (list)
- Commands run (paste output)
- Known limitations (honest list)
- One improvement made during self-review
