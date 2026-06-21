# UI Design Standard

The agent must follow these rules for every screen and component. No ad-hoc styles — use the tokens. No inventing new patterns — use the components. When something is not covered here, match the closest existing pattern rather than introducing a new one.

---

## 1. Design tokens

All visual values live in `src/styles/tokens.css`. Never hard-code a color, spacing value, border radius, shadow, or font size in a component.

### Color — semantic palette

```css
:root {
  /* Brand */
  --color-primary: #6366f1;
  --color-primary-light: #a5b4fc;
  --color-primary-dark: #4338ca;

  /* Feedback */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #eab308;

  /* Neutral */
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-raised: #334155;
  --color-border: #475569;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-text-disabled: #475569;
}
```

### Spacing — 4px grid

```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px;
}
```

### Typography

```css
:root {
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;

  --text-xs: 12px;   --text-sm: 14px;   --text-base: 16px;
  --text-lg: 18px;   --text-xl: 20px;   --text-2xl: 24px;
  --text-3xl: 30px;  --text-4xl: 36px;  --text-5xl: 48px;

  --font-normal: 400; --font-medium: 500;
  --font-semibold: 600; --font-bold: 700;

  --leading-tight: 1.25; --leading-normal: 1.5;
}
```

### Border radius, shadows, animation

See `src/styles/tokens.css` for full values.

---

## 2. Responsive breakpoints

```
mobile:  0 – 639px    → default styles (design mobile first)
tablet:  640px+       → @media (min-width: 640px)
desktop: 1024px+      → @media (min-width: 1024px)
```

Minimum supported width: **320px**. The 9×9 Sudoku grid must fit within 320px — use fluid sizing (`min(100%, Xpx)`) rather than fixed widths.

---

## 3. Touch targets

Every interactive element must have a minimum tap target of **44×44px**.

Sudoku cells are an exception — the grid must fit the screen. Cells should be as large as possible within the available space but are allowed to be smaller than 44×44px. The number picker buttons (1–9) must always meet the 44×44px minimum.

---

## 4. Component patterns

### PrimaryButton

```
Background:  var(--color-primary)
Text:        white, var(--font-semibold), var(--text-base)
Padding:     var(--space-4) var(--space-8)
Radius:      var(--radius-full)
Min height:  52px
Min width:   160px
```

### GameLayout (wraps every screen)

```
Max width: 480px, centered horizontally
Padding:   var(--space-4) on mobile, var(--space-8) on desktop
Background: var(--color-bg)
Min height: 100dvh
```

### SudokuGrid

```
Display:   grid, 9 columns
Border:    3×3 box borders thicker than cell borders (use border or outline)
Cell selected:    background var(--color-primary) at low opacity
Cell given:       font-weight var(--font-bold), color var(--color-text)
Cell user-filled: font-weight var(--font-normal), color var(--color-primary-light)
Cell error:       color var(--color-error), border var(--color-error)
```

### NumberPicker

```
Display:   grid, 9 buttons (1–9) + erase button
Each button: min 44×44px, var(--color-surface-raised) background
Selected number: var(--color-primary) background
```

---

## 5. Animation rules

**What to animate:**
- Cell selection (instant background change, no animation needed)
- Correct completion (brief scale-up or pulse on the board)
- Error shake (horizontal shake on wrong fill — optional)
- Screen transitions (fade, 250ms)

**What NOT to animate:**
- Individual cell value changes
- Timer updates
- Anything that loops indefinitely

**Motion safety:** Wrap all non-essential animations in `@media (prefers-reduced-motion: reduce)`.

---

## 6. Accessibility rules (WCAG 2.1 AA)

| Rule           | Requirement                                                          |
| -------------- | -------------------------------------------------------------------- |
| Color contrast | Text on bg: minimum 4.5:1 ratio                                      |
| Focus visible  | All interactive elements must show a visible focus ring              |
| Focus ring     | `outline: 2px solid var(--color-primary-light); outline-offset: 2px` |
| Button semantics | Use `<button>` not `<div onClick>`                                 |
| Cell selection | Arrow keys must navigate between cells                               |
| Number entry   | Number keys (1–9) must fill selected cell; Delete/Backspace clears  |
| Error state    | `aria-invalid="true"` on error cells                                 |
| Game status    | Screen reader must be told when game completes (`aria-live`)         |

---

## 7. Dark theme

The app uses a dark theme by default (`--color-bg: #0F172A`). All components must look correct on the dark background.

---

## 8. Sudoku-specific grid rules

- **Box borders:** The 3×3 sub-grid borders must be visually distinct from cell borders. Use `2px` for box borders and `1px` for cell borders.
- **Given vs. user cells:** Given (puzzle) numbers are bold; user-entered numbers are lighter or a different color. This makes it immediately clear which cells can be changed.
- **Selected row/column/box highlighting:** The row, column, and 3×3 box of the selected cell should be subtly highlighted — this is standard Sudoku UX and significantly aids gameplay.
- **Same-number highlighting:** All cells containing the same number as the selected cell should be highlighted.

---

## 9. Agent UI review checklist

After implementing UI, the agent must check each item before PR:

```
Layout
[ ] All content visible at 320px width without horizontal scroll
[ ] Sudoku grid fits at 320px — no horizontal overflow
[ ] All content visible at 1280px width (no awkward stretching)
[ ] GameLayout max-width respected on desktop

Tokens
[ ] No hard-coded hex colors in component CSS
[ ] No hard-coded px values outside of tokens
[ ] All new interactive elements use token-based transitions

Touch & interaction
[ ] Number picker buttons are min 44×44px
[ ] Cells are large enough to tap accurately on mobile
[ ] No hover-only interactions
[ ] Active/pressed state visible on all buttons

Accessibility
[ ] All buttons are <button> elements
[ ] Cells are navigable by keyboard (arrow keys)
[ ] Number keys fill the selected cell
[ ] Error cells use aria-invalid
[ ] Game completion announced via aria-live
[ ] Focus ring visible on keyboard navigation

Sudoku grid
[ ] Box borders visually distinct from cell borders
[ ] Given numbers visually distinct from user-entered numbers
[ ] Selected cell highlighted
[ ] Row/column/box of selected cell highlighted
[ ] Error cells highlighted with more than color alone

Consistency
[ ] Uses GameLayout wrapper
[ ] Uses PrimaryButton from components/
[ ] No one-off CSS that duplicates an existing component
```
