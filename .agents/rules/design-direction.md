---
trigger: model_decision
description: Apply when creating or editing any storefront UI, styles, copy, motion or imagery.
---

# Design Direction & Anti-Slop Guardrails

When working on any visual interface, layout, typography, copy, or styling for Eskort Creations:

## 1. Derive the Look from Textile Reality
- Aesthetic origins: pure cotton weave, fabric weight, print registration marks, selvedge edges, woven care labels, tailor tape measures, block-print dyes, and soft unhurried evening light.
- Do NOT build from generic luxury or minimalist templates.
- Always check `docs/DESIGN.md` for active tokens, typography pairs, and layout blueprints before writing CSS.

## 2. Mandatory Rejection of Second-Wave AI Clusters
Any design that lands in the following patterns must be rejected and reworked:
1. **The Artisan Trope**: Warm cream background (#F4F1EA) + high-contrast serif display + terracotta / burnt orange accent (#D97757).
2. **The Dark Neon Trope**: Near-black background (#0A0A0A) + harsh electric/acid neon accents.
3. **The Broadsheet Trope**: Hairline borders everywhere, dense multi-column grids, and excessive editorial rules.
4. **The Card Kit**: Uniform rounded rectangular cards with identical box-shadows arranged in static 3-column rows.
5. **Template Chrome**: Tracked all-caps micro-eyebrows above headings, `A · B · C` category meta, monospace pills, `→` appended to buttons, artificial 01/02 numbering, and italicized single words in headlines.

## 3. Typography & Color Standards
- **Fonts**: Self-hosted via `next/font`. Max two families, max three font files on initial paint.
- **Banned as Primary**: Inter, Roboto, Arial, System font stack, Poppins, Montserrat, Open Sans, Lato, DM Sans, Space Grotesk, Playfair Display, Cormorant, Instrument Serif.
- **Body Text**: Fluid `clamp()`, minimum 15–16px on mobile. Weight 400 (never 200–300). Line length 55–68 characters. Tabular numerals for all prices (`font-variant-numeric: tabular-nums`).
- **Contrast**: WCAG AA/AAA compliant (Body text ≥ 4.5:1; UI controls and large text ≥ 3.0:1 in both Day and Night modes).
- **Gradients**: Zero decorative background or text gradients. Gradients are only permitted for functional image scrims to ensure text legibility.

## 4. Single Signature Element
The interface features exactly ONE signature element: **Textile Selvedge & Print-Color Registration Dots**, derived from actual product dye palettes. Used for:
- Fabric color swatches
- Section divider accents
- Multi-step route progress indicators
The signature element must be fully functional and recognizable without animation.
