---
name: slop-audit
description: Scans code, templates, and UI components to detect and reject banned design cliches, copy slop, and second-wave AI styling patterns.
---

# Slop Audit Skill

This skill enforces Section 6.5 of the Eskort Creations design standards, ensuring that neither AI-generated code patterns nor second-wave AI styling defaults leak into the storefront.

## Audit Workflow

### 1. Codebase Static Scan
Execute the automated slop-scanner script:
```bash
node scripts/slop-scan.mjs
```
The script validates against:
- **Visual Banned List**: Gradients (text or background), `backdrop-filter: blur`, neon colors, glow effects, floating blobs, decorative noise textures, 3D card tilt, custom cursors, marquees, confetti animations, and Lottie animations.
- **Template Chrome**: Tracked all-caps micro-eyebrows above headings, `A · B · C` metadata strings, monospace micro-labels, arrows (`→`) appended to standard links, artificial 01/02 numbering on non-sequential items, and unbacked pill badges ("Bestseller", "New" without catalog data).
- **Copy Banned List**: Buzzwords such as "elevate", "curated", "seamless", "unlock", "journey", "timeless", "effortless", "indulge", "crafted with passion", "game-changer", "discover the magic", "your go-to", "luxurious comfort", "Learn more", and "Click here".

### 2. Specificity Test
For every headline, product description, and call to action:
- Ask: "Could a competitor copy and paste this exact sentence onto their website unchanged?"
- If YES: Reject and rewrite with concrete, truthful product details (e.g., weave type, exact garment measurements, dye technique, or pricing facts).

### 3. Visual Cluster Rejection
Inspect captured screenshots against the 5 second-wave AI styling archetypes:
1. Warm cream (`#F4F1EA`) + high-contrast serif + terracotta/clay accent (`#D97757`).
2. Near-black (`#0A0A0A`) + harsh neon/acid accent.
3. Hairline broadsheet styling with excessive fine dividing lines.
4. Homogeneous rounded card kit with identical corner radii and shadows.
5. Template chrome with artificial metadata labels.

Any screen matching these tropes by default must be re-engineered with textile-derived design tokens.
