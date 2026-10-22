---
trigger: glob
globs: src/**/*.css, src/**/*.tsx
---

# Styling Principles & Motion Tokens

When writing CSS, Tailwind utility classes, or motion animations in the frontend codebase:

## 1. Tailwind v4 CSS-First Configuration
- Reset default tokens in `@theme`: `--color-*: initial`, `--font-*: initial`, `--radius-*: initial`, `--shadow-*: initial`.
- Only use bespoke project tokens defined in `src/styles/tokens.css` or `docs/DESIGN.md`.
- No arbitrary generic utility classes (`bg-blue-500`, `rounded-xl`, `font-sans`).
- Use semantic token names: `--color-surface-base`, `--color-surface-subtle`, `--color-ink-primary`, `--color-ink-muted`, `--color-accent`, etc.

## 2. Radius and Depth Architecture
- **Radius Scale by Role**:
  - Media & imagery: `2px` (sharp, tailored textile edge)
  - Interactive controls (buttons, inputs, selects): `10px` (comfortable touch curve)
  - Sheets, dialogs, drawers: `20px` (gentle nested overlay)
  - Chips, badges, swatch dots: `9999px` (fully rounded pill)
- **Depth**: Surface depth achieved via tonal layering. Exactly one soft ambient shadow allowed, reserved strictly for floating sheets and dialogs. No box-shadows on standard product cards.

## 3. Strict Motion Tokens
- **Durations**:
  - Press / Active: `120ms`
  - Hover & Focus: `220ms`
  - UI Transitions (drawers, accordions): `420ms`
  - Content Reveals: `720ms`
  - Hero Opening Reveal: `1100ms`
- **Easing Curves**:
  - Settle: `cubic-bezier(0.22, 1, 0.36, 1)`
  - Sheet / Drawer: `cubic-bezier(0.32, 0.72, 0, 1)`
  - In-Out Transition: `cubic-bezier(0.65, 0, 0.35, 1)`

## 4. Permitted Animation Properties & The Three Reveal Effects
- **Hardware Optimization**: Animate ONLY `transform` and `opacity`. Never animate `margin`, `padding`, `width`, `height`, `clip-path`, `filter`, or `box-shadow` (one exception: accordion expansion via `grid-template-rows` over `220ms`).
- **Reveal Distance**: 16px maximum displacement.
- **Stagger**: 70ms maximum stagger between items; maximum 6 sequential items.
- **The Three Permitted Reveals**:
  1. **Drape**: Image or surface settles with `translateY(12px)` to `translateY(0)` while fading in, with internal image scaling down from `1.04` to `1` inside an `overflow: hidden` frame.
  2. **Rise**: Display typography lines rise from behind an overflow mask without runtime string-splitting.
  3. **Press**: Scale `0.985` on touch active/press.

## 5. Accessibility: prefers-reduced-motion
When `@media (prefers-reduced-motion: reduce)` is active:
- Disable all `transform`, drift, parallax, and scroll-linked animations.
- Fallback strictly to simple opacity transitions (maximum duration `150ms`).
