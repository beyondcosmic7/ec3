---
name: perf-gate
description: Validates web application performance, Core Web Vitals, and JavaScript bundle sizes against Section 7.6 performance budgets under throttled mobile network and CPU conditions.
---

# Performance Gate Skill

This skill validates that Eskort Creations meets all strict performance budgets defined in Section 7.6 of `BUILD_PROMPT.md`.

## Performance Budgets

Target Profile: Throttled mid-range mobile device (Slow 4G network, 4× CPU slowdown).

| Metric | Budget Target | Critical Ceiling |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | ≤ 2.0s (Lab) | 2.5s (p75 Field) |
| **INP (Interaction to Next Paint)** | ≤ 150ms | 200ms |
| **CLS (Cumulative Layout Shift)** | ≤ 0.02 | 0.05 |
| **TBT (Total Blocking Time)** | ≤ 150ms | 200ms |
| **First-load JS (Home, Shop, PDP)** | ≤ 160 KB gzipped | 180 KB |
| **First-load JS (Checkout)** | ≤ 200 KB gzipped | 220 KB |
| **Mobile Hero Image** | ≤ 150 KB (AVIF/WebP) | 180 KB |
| **Total Transfer on Initial Load** | ≤ 700 KB | 850 KB |
| **Lighthouse Mobile Score** | Perf: 95+ (Checkout: 90+), A11y: 98+, Best Practices: 100, SEO: 98+ |

## Verification Procedures

### 1. Bundle Size Check
Run the bundle analyzer or bundle budget script:
```bash
pnpm run check:bundle
```
Ensure no route exceeds the 160 KB gzipped first-load JS budget. Verify that third-party scripts (e.g. Razorpay checkout modal) are strictly dynamic and lazy-loaded only when reaching the payment step.

### 2. Lighthouse CI Audit
Run Lighthouse under mobile throttling:
```bash
pnpm run lighthouse:ci
```
Extract and record exact scores for `/`, `/shop`, `/product/[slug]`, and `/checkout`.

### 3. Media Inspection
- Verify all image assets are served via the unified `<Media>` component with explicit `width`, `height`, `sizes`, and modern format delivery (AVIF/WebP).
- Verify the LCP hero image receives `priority` and `fetchpriority="high"`.
- Verify below-the-fold assets are strictly lazy-loaded.
