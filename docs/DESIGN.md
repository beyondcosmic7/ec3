# Eskort Creations: Design System Architecture & Token Plan (`docs/DESIGN.md`)

## 1. Brand DNA Statement
> **"We are the only Indian women's wear atelier that pairs genuine fabric truth and measurement precision with calm, unhurried digital craftsmanship for women who value honesty over hype."**
> *(Hypothesis for owner confirmation)*

---

## 2. Reference Scan: 8 Live Brands
*Conducted per Section 4 of BUILD_PROMPT.md to study structural craftsmanship and avoid common industry defaults.*

| Brand | Category | What It Does Well | Default Trap It Falls Into |
| :--- | :--- | :--- | :--- |
| **Nicobar** | Indian Contemporary Lifestyle | Tactile, unhurried lifestyle photography with generous whitespace. | Excessive lifestyle fluff over concrete garment dimensions; price discovery feels buried. |
| **Fabindia** | Indian Traditional Heritage | Comprehensive craft categorization (chanderi, ikat, block prints). | Cluttered card kit; overwhelming mega-menus; visual noise with multiple competing badges. |
| **Anokhi** | Jaipur Block-Print Craft | Deep respect for dye integrity, block printing, and fabric heritage. | Fragmented digital presence with outdated web ergonomics and poor mobile-first checkout. |
| **Meera Bharadwaj** | Bespoke Ethnic Atelier | Crisp focus on festive tailoring, silhouettes, and fabric drapes. | Heavy dependence on Instagram DM shopping rather than self-service instant commerce. |
| **Lunya** | Global Washable Silk/Sleep | Crystal clear fabric honesty and wash/care transparency. | Monotonous high-fashion serif minimalism with stark, low-contrast grey-on-white text. |
| **Eberjey** | Global Modal/Comfort Gowns | Ergonomic mobile navigation and soft, calming color tone. | Generic card grids that feel template-driven and lack tactile garment texture. |
| **Kindred Bravely** | Maternity & Nursing Wear | Purpose-built functional diagrams for nursing clips and fit. | Cluttered with aggressive urgency banners, review popups, and coupon traps. |
| **Toast** | UK Quiet-Craft Apparel | Poetic yet concrete textile descriptions, honest selvedge details. | Extremely high desktop bias; slow mobile responsive image delivery. |

---

## 3. Color Token Plan (Day & Night)
*Sampled directly from authentic fabric photography: deep indigo, madder rose, natural unbleached cotton, antique brass, and midnight dye vats. Tested for strict WCAG AAA/AA compliance.*

### Day Theme Tokens
| Token Name | Role | Hex | OKLCH | On Surface Contrast | WCAG Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--surface-canvas` | Base page background | `#FAF8F5` | `oklch(0.975 0.008 75)` | Canvas Base | - |
| `--surface-subtle` | Secondary cards, panels | `#F0ECE4` | `oklch(0.935 0.014 78)` | 1.15:1 vs Canvas | UI Neutral |
| `--ink-primary` | Main headings, body text | `#1C1E24` | `oklch(0.220 0.012 265)`| 14.8:1 vs Canvas | **AAA** (Pass) |
| `--ink-muted` | Secondary facts, borders | `#5A606E` | `oklch(0.485 0.022 260)`| 4.9:1 vs Canvas | **AA** (Pass) |
| `--accent-madder` | Brand emphasis, accents | `#943843` | `oklch(0.450 0.125 18)` | 6.2:1 vs Canvas | **AA** (Pass) |
| `--accent-brass` | Tailor measure, selvedge | `#A67C38` | `oklch(0.585 0.115 72)` | 3.5:1 vs Canvas | UI Controls |

### Night Theme Tokens (Low Light, Calm Warm Lamp)
| Token Name | Role | Hex | OKLCH | On Surface Contrast | WCAG Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--surface-canvas` | Low-glare night background | `#121316` | `oklch(0.185 0.008 265)`| Canvas Base | - |
| `--surface-subtle` | Elevated panels | `#1B1D22` | `oklch(0.230 0.011 265)`| 1.3:1 vs Canvas | UI Neutral |
| `--ink-primary` | Main text & numerals | `#EBE8E1` | `oklch(0.925 0.010 75)` | 13.5:1 vs Canvas | **AAA** (Pass) |
| `--ink-muted` | Measurements, details | `#9BA1B0` | `oklch(0.680 0.020 255)`| 5.8:1 vs Canvas | **AA** (Pass) |
| `--accent-madder` | Soft warm rose accent | `#D9727F` | `oklch(0.640 0.130 18)` | 6.1:1 vs Canvas | **AA** (Pass) |
| `--accent-brass` | Soft gold selvedge dot | `#D4A85B` | `oklch(0.740 0.120 75)` | 8.2:1 vs Canvas | **AAA** (Pass) |

---

## 4. Typography Scale & Hierarchy
*Self-hosted font roles: Display with organic soft warmth, Body with crystal-clear legibility on mid-range Android screens.*

- **Display**: Fraunces / Newsreader (Soft serif, organic stroke modulation for hero, section openers, and collection headers).
- **Body & Tabular**: Figtree / Hanken Grotesk (Humanist sans-serif with tall x-height, open apertures, and dedicated tabular numerals for measurements and prices).

```css
/* Fluid Type Tokens */
--text-display-hero: clamp(2.25rem, 5vw + 1rem, 4.5rem);      /* 36px -> 72px */
--text-display-title: clamp(1.75rem, 3vw + 0.75rem, 2.75rem); /* 28px -> 44px */
--text-heading: clamp(1.25rem, 1.5vw + 0.75rem, 1.75rem);     /* 20px -> 28px */
--text-body: clamp(0.9375rem, 0.4vw + 0.85rem, 1.0625rem);    /* 15px -> 17px */
--text-caption: 0.8125rem;                                    /* 13px */
--text-mono-measure: 0.875rem;                                /* 14px */
```

---

## 5. Shape, Radius & Elevation Tokens
```css
/* Radius by role */
--radius-media: 2px;       /* Sharp, tailored fabric edge */
--radius-control: 10px;    /* Tactile button and input curve */
--radius-sheet: 20px;      /* Dialogs and bottom drawer sheets */
--radius-pill: 9999px;     /* Swatch dots, measurement pills */

/* Elevation */
--shadow-sheet: 0 16px 40px -12px rgba(28, 30, 36, 0.16);
```

---

## 6. Motion Tokens (CSS-First Scroll & State)
```css
/* Durations */
--duration-press: 120ms;
--duration-hover: 220ms;
--duration-ui: 420ms;
--duration-reveal: 720ms;
--duration-hero: 1100ms;

/* Easings */
--ease-settle: cubic-bezier(0.22, 1, 0.36, 1);
--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### The Three Reveal Effects
1. **Drape**: Image container slides subtly `translateY(12px -> 0)` with opacity `0 -> 1` while inner image scales from `1.04 -> 1` inside `overflow: hidden`.
2. **Rise**: Headings emerge line-by-line from masked vertical containers over 720ms.
3. **Press**: Scale to `0.985` with 120ms snap on touch/click.

---

## 7. Single Signature Element: Textile Selvedge & Registration Dots
- Derived from the raw selvedge edge of block-printed cotton fabric bolts where dyers stamp registration test dots to verify color alignment.
- **Application**:
  1. Product swatch chips show authentic hex dots sampled from each garment's real prints.
  2. Sub-pixel woven horizontal dashed border separating sections, evocative of a tailored seam.
  3. Route progression and carousel index displayed as colored selvedge dots.

---

## 8. Section Variety Table (Home Page)
*Section 8.2: Seven moments, seven distinct layout primitives, zero card chrome.*

| Moment | Section Name | Layout Primitive | Visual Signature | Motion Effect |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Hero** | Asymmetric Full-Bleed Split | Full-width real photo with off-axis text at lower left. | Drape on image, Rise on heading. |
| 2 | **New In** | Horizontal Scroll-Snap Rail | Mixed aspect ratio tiles (4:5, 3:4) with caption only (no boxes). | Natural momentum scroll with arrow controls. |
| 3 | **By the Hour** | Oversized Typographic Index | Full-width stacked rows; hover/touch reveals garment silhouette. | Crossfade preview thumbnail on touch. |
| 4 | **The Cloth** | Macro Weave Interactive Stage | Full-bleed macro photograph of weave alongside woven care facts. | CSS scroll-driven zoom-out (1.1 -> 1.0). |
| 5 | **Fit in Inches** | Interactive Split Ruler & Calculator | Pure measurement inputs (bust, hip) with garment tape overlay. | Live slider tick feedback without layout shift. |
| 6 | **Ensemble Craft** | Curated 2-Column Asymmetric Diptych | Editorial pairings (e.g. Kurta + Pant + Dupatta details). | Subtle parallax drift (max 16px). |
| 7 | **Customer Voice** | Minimal Typographic Quotation Panel | Full-width textile background; quotes strictly from verified orders. | Static display (hidden until 3 reviews exist). |

---

## 9. ASCII Wireframes

### Home Page Wireframe
```text
+-------------------------------------------------------------+
|  [Logo: ESKORT CREATIONS]      Shop  By-Hour  Story   (0)Cart|
+-------------------------------------------------------------+
|                                                             |
|   [ HERO: Full-Bleed Authentic Photography ]                |
|                                                             |
|   Unrushed Cotton.                                          |
|   Tailored in Jaipur.                                       |
|   [ Explore Collection ]                                    |
|                                     -- . . . (Selvedge Dots)|
+-------------------------------------------------------------+
|  NEW IN                                                     |
|  [Image 4:5]       [Image 3:4]       [Image 4:5]            |
|  Pink Floral Kurta  Banarasi 3-Piece  Longline Shrug Set    |
|  Rs 279             Rs 1,799          Rs 1,499              |
+-------------------------------------------------------------+
|  BY THE HOUR                                                |
|  ---------------------------------------------------------  |
|  01  MORNING RITUAL           Rayon & Soft Cotton      [+]  |
|  02  AFTERNOON AT WORK        Breathable Kurta Sets    [+]  |
|  03  EVENING FESTIVITIES      Banarasi Silk Pair       [+]  |
+-------------------------------------------------------------+
|  THE CLOTH: 100% Breathable Cotton                          |
|  [ Macro Weave Photograph ] | Thread Count: 60x60 Cambric   |
|                             | Natural vegetable dyes        |
+-------------------------------------------------------------+
|  FIT IN INCHES                                              |
|  Your Bust [ 38" ]  Your Hip [ 40" ] --> Recommended: M     |
|  Exact Garment Chest: 38" | Length: 42"                     |
+-------------------------------------------------------------+
|  FOOTER: Direct WhatsApp Concierge | Legal Metrology | (c)  |
+-------------------------------------------------------------+
```

### Product Detail Page (PDP) Wireframe
```text
+-------------------------------------------------------------+
|  <- Back to Collection                   [Eskort]   (1) Cart|
+-------------------------------------------------------------+
|  [ GALLERY ]                 |  Banarasi Soft Silk 3-Piece  |
|                              |  Rs 1,799  (MRP Rs 2,999)    |
|  [ Main Photo (4:5) ]        |  Incl. all taxes             |
|                              |                              |
|  [T1] [T2] [T3]              |  Colour: Rust & Gold         |
|                              |  [.] [.] [.] (Print Dots)    |
|                              |                              |
|                              |  Select Size (Inches):       |
|                              |  ( M ) [ L ] [ XL ] [ XXL ]  |
|                              |                              |
|                              |  [  ADD TO CART - Rs 1,799 ] |
|                              |  [ Order via WhatsApp     ] |
|                              |                              |
|                              |  -- GARMENT MEASUREMENTS --  |
|                              |  Bust: 38" | Waist: 34"      |
|                              |  Hip: 40"  | Length: 44"     |
|                              |                              |
|                              |  -- STATUTORY DECLARATIONS - |
|                              |  Packer: ⟦NEEDED⟧            |
|                              |  Net Qty: 1 Set (3 Pieces)   |
|                              |  Origin: India               |
+-------------------------------------------------------------+
```
