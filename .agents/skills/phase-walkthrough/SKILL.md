---
name: phase-walkthrough
description: Guides the generation of empirical exit evidence, multi-viewport visual verification, and structured walkthrough artifacts required at the conclusion of each development phase.
---

# Phase Walkthrough & Exit Evidence Skill

This skill enforces Section 2 (Rule 6) and Section 10 of `BUILD_PROMPT.md`: "Evidence over assertion. Every phase ends with a Walkthrough artifact: screenshots at 390×844, 768×1024 and 1440×900, Lighthouse mobile numbers, test output. A phase without evidence is not complete."

## Walkthrough Checklist

For every phase:

### 1. Visual Verification at Three Standard Viewports
Capture and embed screenshots at:
- **Mobile**: 390 × 844 px (primary viewport representing modern mid-range Android / iOS mobile browsing)
- **Tablet**: 768 × 1024 px (iPad / tablet portrait)
- **Desktop**: 1440 × 900 px (standard laptop / desktop widescreen)

Verify that:
- Touch targets on mobile are at least 44×44 px with comfortable thumb reach.
- Header, cart drawer, and sticky bars adapt cleanly without overflow or layout shifts.
- Responsive typography uses fluid `clamp()` without awkward line wrapping.

### 2. Empirical Test Output
Include actual execution logs for:
- Unit & integration tests (`pnpm test` or `vitest run`)
- Type checking (`pnpm run typecheck` or `tsc --noEmit`)
- Linting (`pnpm run lint`)
- Build verification (`pnpm run build`)

### 3. Audit Tables
Include completed audit records:
- Slop & Banned Elements Audit (zero violations)
- CCPA Dark Pattern Audit table (all 13 categories accounted for)
- Core Web Vitals & Lighthouse lab scores

### 4. Walkthrough Artifact Format
All walkthroughs must be saved to the active artifact directory as `walkthrough.md`, linking directly to changed files and embedding visual evidence.
