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
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Typography

```css
:root {
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
}
```

### Border radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

### Shadows and animation

See `src/styles/tokens.css` for full values.

---

## 2. Responsive breakpoints

```
mobile:  0 – 639px    → default styles (design mobile first)
tablet:  640px+       → @media (min-width: 640px)
desktop: 1024px+      → @media (min-width: 1024px)
```

Minimum supported width: **320px**.

---

## 3. Touch targets

Every interactive element must have a minimum tap target of **44×44px**.

If the visual element is smaller, use padding to grow the tappable area:

```css
.icon-button {
  padding: var(--space-3);
}
```

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
Hover:       background → var(--color-primary-dark), translateY(-1px)
Active:      translateY(0), opacity 0.9
Disabled:    background → var(--color-text-disabled), cursor not-allowed
Transition:  var(--duration-fast) var(--ease-out)
```

### Surface panel

```
Background:  var(--color-surface)
Padding:     var(--space-6)
Radius:      var(--radius-lg)
Shadow:      var(--shadow-md)
```

### GameLayout (wraps every screen)

```
Max width: 480px, centered horizontally
Padding:   var(--space-4) on mobile, var(--space-8) on desktop
Background: var(--color-bg)
Min height: 100dvh
Display:   flex, column
```

### FeedbackBadge

```
Correct:  background var(--color-success), white text
Wrong:    background var(--color-error), white text
Padding:  var(--space-2) var(--space-4)
Radius:   var(--radius-full)
Font:     var(--font-semibold)
```

---

## 5. Animation rules

**What to animate:**

- Button press feedback (scale down 0.96, fast)
- Correct answer feedback (scale up 1.06, spring ease)
- Wrong answer feedback (horizontal shake, 3 iterations)
- Screen transitions (fade, 250ms)

**What NOT to animate:**

- Layout reflows
- Text content changes
- Anything that loops indefinitely unless it pauses when off-screen

**Motion safety:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Accessibility rules (WCAG 2.1 AA)

| Rule             | Requirement                                                          |
| ---------------- | -------------------------------------------------------------------- |
| Color contrast   | Text on bg: minimum 4.5:1 ratio                                      |
| Focus visible    | All interactive elements must show a visible focus ring              |
| Focus ring style | `outline: 2px solid var(--color-primary-light); outline-offset: 2px` |
| Button semantics | Use `<button>` not `<div onClick>`                                   |
| Icon buttons     | Must have `aria-label`                                               |
| State changes    | Screen reader must be told when state changes (`aria-live="polite"`) |
| Color only       | Never use color as the only indicator (add icon, shape, or text)     |
| Disabled inputs  | Use `disabled` attribute, not just `pointer-events: none`            |

---

## 7. Dark theme

The app uses a dark theme by default (`--color-bg: #0F172A`). Do not add a light theme toggle. All components must look correct on the dark background.

---

## 8. Agent UI review checklist

After implementing UI, the agent must check each item before PR:

```
Layout
[ ] All content visible at 320px width without horizontal scroll
[ ] All content visible at 1280px width (no awkward stretching)
[ ] No content clipped by device notch or status bar
[ ] GameLayout max-width respected; screen doesn't sprawl on desktop

Tokens
[ ] No hard-coded hex colors in component CSS
[ ] No hard-coded px values outside of tokens
[ ] All new interactive elements use token-based transitions

Touch & interaction
[ ] Every tappable element is min 44×44px
[ ] No hover-only interactions
[ ] Active/pressed state visible on all buttons
[ ] Disabled state visually distinct

Typography
[ ] No text smaller than var(--text-sm) = 14px

Animation
[ ] prefers-reduced-motion respected
[ ] No animation loops indefinitely
[ ] All timers and animation callbacks cleaned up on unmount

Accessibility
[ ] All buttons are <button> elements
[ ] Icon buttons have aria-label
[ ] State changes announced via aria-live
[ ] Focus ring visible on keyboard navigation
[ ] Color not used as sole indicator

Consistency
[ ] Uses GameLayout wrapper
[ ] Uses PrimaryButton from components/
[ ] No one-off CSS that duplicates an existing component
```
