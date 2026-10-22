<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Eskort Creations: Operational Governance & Agent Guardrails

## 1. Mission and Definition of Done
Eskort Creations is a bespoke Indian women's ethnic and fusion wear web atelier (Kurtas, 2-Piece/3-Piece sets, Longline Shrugs). Calm, tactile, and unhurried design that loads and responds instantly.
Done is proven, never claimed:
- First-time visitor on ₹12,000 Android over throttled 4G sees first image in < 2s, scrolls at 60 fps, finds product in 3 taps, pays in < 90s.
- Designer cannot guess which AI tool built it (ban list scan-enforced).
- Owner adds a product in < 3 minutes without touching code.
- All Indian statutory compliance (Legal Metrology, CCPA, DPDP, GST) is built-in.

## 2. Operating Rules
1. **Never Code from Memory**: Read docs in `node_modules/next/dist/docs/` before Next.js tasks. Pin exact versions; log in `docs/DECISIONS.md`.
2. **Zero Generative Imagery**: Never call AI image generation tools. Use authentic owner photography and code-drawn primitives only.
3. **Zero Invented Content**: No fake reviews, ratings, press logos, counts, or claims. Missing data becomes `⟦NEEDED: what⟧` and an entry in `CONTENT_NEEDED.md`. Build fails if any marker remains in production (`LAUNCH=1` or `VERCEL_ENV=production`).
4. **Evidence Over Assertion**: Every phase ends with a Walkthrough artifact: 390×844, 768×1024, 1440×900 screenshots, Lighthouse numbers, and test output.
5. **Bounded Self-Critique**: Inspect screenshots, list up to 5 weakest flaws, fix, re-shoot (max 3 passes per screen).
6. **Supply Chain & Security**: No client secrets. Read all third-party code before install. Strict Zod input validation and Supabase RLS.
7. **Scope Fence**: No customer accounts, loyalty programs, multi-language, market sync, subscriptions, chatbots, or user-facing AI.

## 3. Design Ban List (Scan-Enforced)
- **Visual**: Gradients (text/bg), glassmorphism (`backdrop-filter`), glows, neon, blobs, decorative noise, 3D tilt, custom cursors, magnetic buttons, marquees, confetti, Lottie, count-up stats.
- **Template Chrome**: Tracked all-caps eyebrows above headings; `A · B · C` strings; monospace micro-labels; `→` on links; numbering non-sequences; italicized/colored single words in headlines; unbacked pill badges; star chips without real reviews; nested cards; identical rounded 3-up cards; centered hero with pill badge + 2 buttons.
- **Motion**: Section fade-up loops, bounce/overshoot, infinite UI loops, autoplay video above fold, parallax on > 2 elements.
- **Interaction**: Newsletter modals, exit-intent popups, chat bubbles, countdown timers, fake viewer counters, auto-opening cart drawer, fake scarcity tickers.
- **Copy**: elevate, curated, seamless, unlock, journey, timeless, effortless, indulge, crafted with love, game-changer, discover the magic, your go-to, luxurious comfort; Learn more / Click here CTAs; chains of em dashes; competitor-swappable claims.
- **Code**: Default fonts, default Tailwind colors, `transition: all`, TypeScript `any`, unpinned dependencies, console errors, layout shift.

## 4. Stack & Architecture
- **Framework**: Next.js 16.x App Router (Turbopack, Server Components by default).
- **Styling**: Tailwind CSS v4 CSS-first reset (`@theme` resets default palette, radius, fonts).
- **Data & Auth**: Supabase (Postgres, Auth, Storage, RLS enabled, Mumbai region preferred).
- **Payments & Tax**: Razorpay Orders API & Standard Checkout (integer paise, server signature verification, idempotent webhooks). Tax-inclusive prices with GST and HSN breakdown.
- **Motion**: CSS-first scroll animations (`animation-timeline: view()`) with IntersectionObserver fallback. React `<ViewTransition>` for product morphing.
- **Tokens**: Press 120ms, Hover/Focus 220ms, UI 420ms, Reveal 720ms, Hero 1100ms. Settle `cubic-bezier(0.22, 1, 0.36, 1)`. Reveal effects: Drape, Rise, Press. Max reveal distance 16px. `prefers-reduced-motion` opacity-only ≤ 150ms.
- **Single Signature Element**: Textile Selvedge & Print-Color Registration Dots.

## 5. Performance Budgets (Throttled 4G, 4× CPU Throttle)
- LCP ≤ 2.0s (lab), INP ≤ 150ms, CLS ≤ 0.02, TBT ≤ 150ms.
- First-load JS: ≤ 160 KB gzipped (Home, Shop, PDP); ≤ 200 KB (Checkout).
- Mobile hero image: ≤ 150 KB (AVIF/WebP). Total transfer at initial load: ≤ 700 KB.
- Lighthouse Mobile: Performance ≥ 95 (Checkout ≥ 90), Accessibility ≥ 98, Best Practices 100, SEO ≥ 98.

## 6. Indian Commerce & Statutory Compliance
- **Currency**: Integer paise only; `en-IN` numbering (`₹1,799`). Client prices never trusted.
- **Invoicing**: Sequential GST invoice PDF with GSTIN, HSN, state tax split (CGST+SGST / IGST).
- **Inventory**: Stock reservation with 10-minute TTL on checkout init; transactional decrements preventing overselling.
- **COD**: Transparent fee (e.g. ₹50) visible before selection; post-order WhatsApp confirmation link.
- **CCPA Compliance**: Zero dark patterns (no drip pricing, false urgency, pre-ticked add-ons, or guilt-tripping).
- **Legal Metrology (Packaged Commodities)**: Mandatory on every product page: Manufacturer/Packer name & address, Common generic name, Net quantity, MRP (incl. taxes), Consumer Care contact (email/phone), Country of Origin.
- **DPDP Act**: Minimal delivery-only data collection, explicit separate WhatsApp consent, transparent privacy policy.
- **Name Hazard Safeguard**: "Eskort" is always paired with product nouns ("Eskort Creations - Women's Ethnic Kurta Sets") in meta titles, descriptions, schema, and social tags.
