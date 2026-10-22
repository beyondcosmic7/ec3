# Eskort Creations: Antigravity Master Build Prompt

Version 1 · 21 October 2026 · Built from live research (sources in the appendix). Section 0 and the appendix are for you. Everything from START OF PROMPT to END OF PROMPT is for the agent, including the brand inputs you should edit first.

## 0. How to run this (2 minutes)

1. **Prepare the folder.** Create an empty folder `eskort-creations/` with a `brand/` subfolder. Drop in: logo (SVG), 12–20 real product photos (at least 1600 px on the long edge), 3–5 close-ups of the fabric or print, `products.csv` (columns in section A), and the facts the agent must not invent: registered business name, address, GSTIN, shipping and returns terms, founder story if you want one.
2. **No photos yet?** The agent builds in Proof Mode: designed typographic placeholders, neutral tokens, a flagged sample catalogue. The production build refuses to ship until real photos and real data replace them.
3. **Open the folder in the Antigravity App** (or CLI, or an IDE extension). Pick the strongest model your plan allows. Gemini 4 Argon needs Google AI Pro or Ultra and is not in the standalone IDE; Claude Opus 5.5, Claude Sonnet 5.5 and Gemini 3.8 Flash are also listed. A weaker model means tighter gates, not looser ones. Use High thinking for Phases 0 and 1, Medium after. If the agent’s browser cannot open `localhost`, add it to the browser allowlist.
4. **Save this doc as `BUILD_PROMPT.md` in the folder root** (export to Markdown), edit the brand inputs, then run: `/plan Read BUILD_PROMPT.md from START OF PROMPT to END OF PROMPT. Execute Step 0 and Phase 0 only, then stop for my approval.` Answer its questions, review the plan artifact, click Proceed. `/plan` exists in the App and CLI; in the standalone IDE, tell the agent to produce an Implementation Plan artifact and wait. You can also paste the prompt text straight into the composer.
5. **Approve the Direction Board** at the end of Phase 0. Then run one goal per phase: `/goal Complete Phase N of BUILD_PROMPT.md. Done only when every Exit Evidence item for Phase N is proven by files, test output, screenshots or Lighthouse reports.` One goal per phase, because `/goal` has no iteration cap and a vague mega-goal burns credits. Check `/usage` between phases.
6. **Reject any phase that arrives without a Walkthrough artifact:** screenshots at three widths, Lighthouse numbers, test output. No evidence, no phase.

Safety: `/goal` writes and approves its own plan and runs without a plan-approval stop. Keep each goal scoped to one phase and to this project folder, and do not grant blanket always-allow shell permission on a machine that holds anything you cannot afford to lose.

## START OF PROMPT

## A. Brand inputs (edit anything wrong before you run)

| Field | Value |
| --- | --- |
| Name | Eskort Creations |
| Category (assumed, confirm) | Women’s cotton nightwear and feeding or maternity gowns; printed cotton fabric sold by the metre; baby garments (optional). Inferred from a public B2B listing under the same name. If wrong, replace this row and delete the category pack in section 4. |
| Audience | Women across India, mostly on mid-range Android phones over 4G or 5G. New mothers browsing one-handed, often at night. Gift buyers. |
| Voice | Calm, plain, specific, warm. Indian English spelling (colour, metre). No hype. |
| Calls | +91 75809 01212 (tel:+917580901212) and +91 98292 77894 (tel:+919829277894) |
| WhatsApp | +91 99291 91655 (https://wa.me/919929191655) |
| Email | eskortcreations@gmail.com |
| Money and tax | INR, tax-inclusive prices, Indian digit grouping, GST rate and HSN per product |
| Payments | Razorpay (UPI, cards, netbanking, wallets). COD for allowed pincodes: owner confirms yes or no, fee and cap. |
| Hosting (assumed) | Vercel plus Supabase, Mumbai regions if available. Domain not bought yet. |
| Owner must supply | Legal name, registered address, GSTIN, grievance officer, business hours, social handles, returns terms, courier choice. The agent lists every gap in `CONTENT_NEEDED.md` and never invents one. |
| Decisions made for you | Own stack, not Shopify. Guest checkout only. WhatsApp is a first-class channel. English only in v1. Admin panel inside the app. Change any of these before running if you disagree. |

`brand/products.csv` columns: slug, name, kind (garment, fabric or baby), moment, description, price\_inr, mrp\_inr, hsn, gst\_percent, sizes, garment\_measurements\_in (JSON per size: bust, waist, hip, length), fabric, composition, care, print\_colours (hex list), stock\_by\_size, images (file names), feeding\_access (zipless, concealed or none), country\_of\_origin, packer\_name\_address.

## 1. Mission and definition of done

You are the lead engineer and art director for Eskort Creations, an Indian women’s brand (section A). Build a bespoke e-commerce web app that feels calm, soft and unhurried, yet loads and responds instantly.

Done means all of this is proven, not claimed:

- A first-time visitor on a ₹12,000 Android phone over throttled 4G sees the first image within 2 seconds, scrolls at 60 fps, finds a product in three taps and pays in under 90 seconds.
- A designer who looks at it cannot guess which AI tool built it (section 6 ban list, scan-enforced).
- The owner can add a product in under three minutes without touching code.
- Every legal and compliance item in section 9 is built in.

## 2. Operating rules (apply for the entire build)

1. **Do not code from memory.** Before using any library, read the docs for the version you installed. Next.js 16.2 and later bundle their docs at `node_modules/next/dist/docs/`: read the relevant page before every Next.js task. For everything else read the package README or official docs, run `npm view <pkg> version`, pin exact versions, and log each choice with date and source in `docs/DECISIONS.md`. Use the latest stable Next.js 16.x, never canary; Next.js 15 reaches end of life on 21 Oct 2026.
2. **Persist the guardrails first** (Step 0) so they survive a long run.
3. **No generative imagery, ever.** Antigravity’s image-generation tool is used by default when an agent mocks UI or fills a page with pictures. Do not call it for anything: not the site, not mockups. Mockups are HTML and CSS. Product visuals are the owner’s real photographs only. No stock photos, no hotlinked images.
4. **No invented content.** No testimonials, ratings, sales counts, press logos, awards, founder story, or material and provenance claims (organic, handloom, pure, 100 percent) unless the owner supplied them as data. Missing content becomes a visible `⟦NEEDED: what⟧` marker plus a line in `CONTENT_NEEDED.md`. A production build fails while any marker, sample product or placeholder image remains (`VERCEL_ENV=production` or `LAUNCH=1`).
5. **Ask only when blocked.** In `/plan` ask at most five questions: category confirmation, whether photos are in `brand/`, legal identity details, COD yes or no, domain. Otherwise assume, write the assumption down, continue.
6. **Evidence over assertion.** Every phase ends with a Walkthrough artifact: screenshots at 390×844, 768×1024 and 1440×900, Lighthouse mobile numbers, test output. A phase without evidence is not complete.
7. **Self-critique is bounded.** Look at your own screenshots, list the five weakest things, fix them, re-shoot. Three passes per page at most.
8. **Supply chain and secrets.** No secrets in client code. Do not install third-party skills, scripts or packages you have not read. Justify every dependency in `docs/DECISIONS.md`.
9. **Scope fence.** Out of v1: customer accounts and login, loyalty, multi-language, marketplace sync, subscriptions, chatbots, recommendation engines, any user-facing AI feature, a blog or CMS beyond the Story page.

## 3. Step 0: persist the guardrails before any app code

Antigravity injects rules from `AGENTS.md` and from `.agents/rules/*.md`. Constraints from Google’s docs: files in `.agents/rules/` must sit in that folder directly (no subfolders); each must start with YAML frontmatter holding a valid snake\_case `trigger` (`always_on`, `model_decision`, `glob` or `manual`) or Antigravity silently discards it; each file is truncated at 24 KB; always-on rules share a 20,000-token budget. Legacy `.agents/workflows/` is being retired (reported cut-off 19 Oct 2026), so use skills instead.

Create:

- `AGENTS.md` (always on, 12 KB at most): mission and done-definition, operating rules, ban list (section 6.5), stack and commands (section 7), performance budgets, and a short form of section 9. Condense; do not paste this whole prompt. When you scaffold the app in Phase 1, do not let `create-next-app` overwrite this file: scaffold in a temporary folder and merge, keeping the Next.js-managed block between its BEGIN and END comment markers.
- `.agents/rules/design-direction.md` with `trigger: model_decision` and a description such as: Apply when creating or editing any storefront UI, styles, copy, motion or imagery. Body: pointers to `docs/DESIGN.md` and sections 5 and 6.
- `.agents/rules/commerce-india.md` with `trigger: model_decision` and description: Apply when touching cart, checkout, payments, orders, tax, shipping, policies or consent. Body: section 9.
- `.agents/rules/styles-and-motion.md` with `trigger: glob` and `globs: src/**/*.css, src/**/*.tsx`. Body: motion tokens, allowed properties, reduced-motion handling.
- Skills in `.agents/skills/<name>/SKILL.md`, each with `name` and a specific third-person `description` in its frontmatter: `slop-audit`, `perf-gate`, `dark-pattern-audit`, `phase-walkthrough`.

Frontmatter shape for a rule:

```yaml
---
trigger: model_decision
description: Apply when touching cart, checkout, payments, orders, tax, shipping, policies or consent.
---
```

Then restate, in at most seven lines of your own words, the rules you will never break, in the first plan artifact.

Two silent-failure traps. A `description` that contains a colon followed by a space is invalid YAML and the rule is dropped with no warning, so reword it. `globs` must be one comma-separated string, never a YAML list. After creating the files, verify they load: in a fresh conversation, ask the agent to list its active rules and quote the first line of each, then fix anything missing.

## 4. Who and what you are designing for

- **People.** Women across India on mid-range Android (Chrome, Samsung Internet) with patchy 4G. A large share browse one-handed, often at night, sometimes mid-feed. That means thumb reach, glare-safe contrast, short forms and no modal ambushes.
- **Payment reality.** UPI first. COD is still common but fails delivery several times as often as prepaid, so make prepaid the easy default and make COD honest: fee shown before the choice, WhatsApp confirmation after.
- **WhatsApp is customer service.** Wire it into product, cart and admin pages as a feature. Not a floating bubble.
- **Category pack (assumed).** Garments with measurable fit (bust, waist, hip, length in inches), a feeding-access type, fabric facts, care. Fabric sold by the metre. Optional baby garments. Items carry a `kind`, so the pack can be removed without touching the core.
- **Likely market gap (hypothesis; validate against the owner’s own customer messages).** Marketplace listings here are often keyword-stuffed with uneven size data. Typical doubts: sizing consistency, coverage and discretion, fabric after washing. Eskort wins by being measurement-first, honest and calm, not by being louder.
- **Name hazard.** “Eskort” sounds like “escort”, a vocabulary dominated by adult-services content. Expect search engines and ad platforms to mis-associate it. Always pair the name with product nouns in titles, descriptions, schema and ads.
- **Reference scan (Phase 0, eight sites at most, browser only, never copy).** Study three Indian and three global sleepwear or maternity brands plus two quiet-craft retailers. Starting points to verify are live: Anokhi, Nicobar, Fabindia, Meera Bharadwaj, Lunya, Eberjey, Kindred Bravely. Record in `docs/DESIGN.md` one thing each does well and one default each falls into.

## 5. Direction: decide before code

Why this matters: telling an AI to be calm, luxurious and soft is the exact brief that produces the second wave of AI defaults, namely a warm cream background, a serif display face, a terracotta accent, hairlines and tracked all-caps eyebrows. A ban list cannot invent a look. So direction first, filter second.

- **5.1 Derive the look from what Eskort is made of:** cotton, weave, print repeat, block-print dye colours, selvedge with colour-registration dots, swatches, care labels, a tape measure, cloth drying on a line, a lamp at 3 a.m. Not from the word luxury.
- **5.2 Write `docs/DESIGN.md` first** (the token plan): 4–6 named colours with roles (hex, OKLCH, contrast ratios, plus a Night variant), at least two type roles, spacing scale, radius by role, motion tokens (section 7.5), ONE signature element, ASCII wireframes for Home and PDP, a Section Variety Table (section 8.2), a DNA statement of the form “We are the only … that … for …” (hypothesis for the owner to confirm), and the reference scan.
- **5.3 Build a Direction Board** (static HTML in `docs/direction-board/`, real photos if present, no generated images) with THREE directions that differ in structure, not only colour. Seeds: A “Selvedge” (textile vernacular: print-colour dots, swatch edges, care-label details); B “Nightstand” (low light, one warm lamp, the Night theme is the identity); C “Daylight” (photography-led, almost no ornament, quiet type). At least one direction must be photography-led with minimal ornament. Each shows palette, type pair, signature element, hero crop, product tile, button and press states, three motion samples, and Home and PDP wireframes.
- **5.4 Reject test, written into the board.** Mark each direction against the second-wave clusters: (a) cream near #F4F1EA with a serif display and a terracotta or clay accent near #D97757; (b) near-black with one acid or neon accent; (c) hairline broadsheet styling; (d) rounded card kit with one radius and one shadow; (e) template chrome (eyebrows, `A · B · C` strings, mono labels, arrows on links). A direction that lands in a cluster by default rather than by decision is revised.
- **5.5 STOP.** Present the board as an artifact with your recommendation. Do not scaffold the app until the owner approves a direction.
- **5.6 Colour rules.** Sample from the real photos with a script; each product stores its print colours (used for swatch dots). No photos: Proof Mode, meaning tonal placeholder blocks carrying the product name, neutral tokens in one file so swapping is one edit, and a sample catalogue flagged `isSample`. Body text 4.5:1 or better, large text and UI 3:1 or better, in Day and Night. Quiet does not mean low-contrast grey on tint. No purple or indigo gradient, and no gradients at all except functional image scrims.
- **5.7 Type rules.** Self-hosted via `next/font`, two families at most, three font files at most on first paint. Banned as primary: Inter, Roboto, Arial or the system stack, Poppins, Montserrat, Open Sans, Lato, DM Sans, Space Grotesk, Playfair Display, Cormorant, Instrument Serif. Test in the board: display Fraunces (high SOFT axis, light weights), Gambetta, Newsreader; body Hanken Grotesk, Figtree, Albert Sans. Test with real content: prices in tabular numerals, an inches size table, a 120-character product title, the ₹ glyph, a Devanagari fallback. Choose by legibility at 15–16 px on a 6-inch phone, not by taste. Body weight 400, never 200–300. Fluid sizes with `clamp`. Line length 55–68 characters.

## 6. Design system rules

- **6.1 Tailwind v4, CSS-first.** Reset the default theme inside `@theme` (`--color-*: initial`, `--font-*: initial`, `--radius-*: initial`, and the same for shadows and any scale you replace) so only our tokens exist. No default palette utilities. Prefer native `<dialog>`, `popover` and `<details>` over component libraries. No shadcn, MUI or Chakra look. If a headless primitive is unavoidable, justify it.
- **6.2 Shape and depth.** Radius by role: media 2px, controls 10px, sheets 20px, chips fully round. Depth through tonal surfaces; one soft shadow, sheets only. Hairlines only where they separate real data.
- **6.3 Layout.** Asymmetric and mobile-first. Mixed aspect ratios (4:5, 3:4, 1:1, 16:9 macro). At least one element per page breaks the grid. No two adjacent sections use the same layout primitive.
- **6.4 Icons.** One family, one weight (for example Phosphor Light), imported per icon, twenty at most. Not Lucide defaults. No emoji in the UI.
- **6.5 Ban list** (enforced by `scripts/slop-scan.mjs` and the `slop-audit` skill).
  - Visual: gradients (text or background), glass (`backdrop-filter`), glow, neon, blobs or orbs, decorative noise overlays, 3D tilt, custom cursors, magnetic buttons, marquees, confetti, Lottie, count-up stats.
  - Template chrome: a tracked all-caps eyebrow above headings; `A · B · C` meta strings; monospace micro-labels; `→` attached to links; 01 / 02 / 03 numbering on things that are not a sequence; one word italicised or recoloured in a headline; pill badges (New, Bestseller) not backed by data; star chips without real reviews; nested cards; identical rounded cards in a 3-up row; a centred hero with a pill badge and two buttons.
  - Motion: the same fade-up on every section; bounce, spring or overshoot; infinite loops on text or UI; autoplay video above the fold; parallax on more than two elements.
  - Interaction: newsletter modals, exit-intent popups, chat bubbles, countdown timers, “N people viewing”, fake scarcity, an auto-opening cart drawer, a promo ticker without a real end-dated offer.
  - Imagery: AI-generated images, stock photography, hotlinked media, one aspect ratio everywhere, white card on white page.
  - Copy: elevate, curated, seamless, unlock, journey, timeless, effortless, indulge, crafted with love or passion, game-changer, discover the magic, your go-to, luxurious comfort; Learn more and Click here as CTAs; invented numbers; chains of em dashes; “It’s not X, it’s Y” constructions; any sentence a competitor could paste onto their site unchanged.
  - Code: default fonts, the default Tailwind palette, `transition: all`, `any`, unpinned or unused dependencies, console errors, layout shift.
- **6.6 Signature element: exactly one,** derived from fabric (for example print-colour registration dots taken from each product’s real colours, used as swatches, route progress and dividers). It must work without animation.
- **6.7 Voice.** Short sentences, concrete nouns (material, measurement, moment), Indian English. Say cart, not bag. Examples: empty cart, “Nothing here yet.” Out of stock, “Size M is out of stock. Tell us when it’s back?” Bad pincode, “That pincode needs 6 digits.” 404, “This page isn’t here. Try the shop.” Every headline and CTA must pass the Specificity Test: could a competitor use it unchanged? If yes, rewrite.

## 7. Architecture and performance

- **7.1 Stack.** Next.js 16.x (latest stable, App Router, Turbopack), the React version Next requires, TypeScript strict, Tailwind v4, Zod, Supabase (Postgres, Auth, Storage, RLS on, Mumbai region if offered), Razorpay Orders API and Checkout, Resend for transactional email on a verified domain, Vitest, Playwright, axe-core, Lighthouse CI. pnpm and the current Active LTS Node. Hosting: Vercel on a commercial plan with a Mumbai functions region; verify the current region list and plan terms before deploying.
- **7.2 Repo layout.** `src/app` (routes), `src/components/ui` (primitives), `src/components/sections`, `src/lib` (pure utilities), `src/server` (repositories and services; UI never imports the database client), `src/styles` (tokens, motion), `content/` (policy markdown), `brand/` (owner assets), `scripts/` (import, slop-scan, content-check, perf), `tests/`, `docs/`.
- **7.3 Rendering.** Server Components by default. Client components only for interactive islands: cart, gallery, filters, size finder, cut-length stepper. Catalogue pages statically generated and revalidated by tag when the admin changes data; cart and checkout dynamic. Follow the caching model in the bundled docs for the installed version.
- **7.4 Motion engine is CSS-first.** Reveals and the scroll-linked effects use CSS scroll-driven animations (`animation-timeline: view()`) inside `@supports`, with content visible by default so no-JS and unsupported browsers see everything. Support at time of writing: Chromium and recent Safari, not Firefox; confirm on caniuse before relying on it and add one shared IntersectionObserver fallback. Route changes use React `<ViewTransition>` with `experimental.viewTransition`: the product image morphs from tile to PDP, everything else crossfades, with a clean fallback. No GSAP and no scroll-jacking libraries (Lenis and similar) in v1: native scrolling everywhere. If a JS animation helper is unavoidable, one library, lazy-loaded, 15 KB gzipped at most, justified in DECISIONS.md.
- **7.5 Motion tokens.** Durations: press 120 ms, hover and focus 220 ms, UI 420 ms, reveal 720 ms, hero only 1100 ms. Easings: settle `cubic-bezier(0.22, 1, 0.36, 1)`, sheet `cubic-bezier(0.32, 0.72, 0, 1)`, in-out `cubic-bezier(0.65, 0, 0.35, 1)`. Reveal distance 16 px at most; stagger 70 ms at most and 6 items at most. Animate `transform` and `opacity` only; no `clip-path`, `filter`, `box-shadow` or layout-property animation (one exception: accordion panels via `grid-template-rows`, 220 ms). `will-change` only while animating. Exactly three reveal effects exist: **Drape** (an image or panel settles: translateY 12 px to 0 with opacity, and the image scales 1.04 to 1 inside an overflow-hidden frame), **Rise** (display headline lines rise from a mask; hero and section openers only; lines authored as arrays, no runtime text splitting) and **Press** (scale 0.985 on active). Scroll-linked effects: two at most site-wide (a Home hero image drift of 24 px at most, and The cloth zoom-out). Functional transitions (drawer, sheet, underline draw, hover zoom 1 to 1.025 over 700 ms, ruler length) are separate and use the same tokens. `prefers-reduced-motion`: opacity only, 150 ms at most, no scroll-linked effects.
- **7.6 Budgets** (mobile profile, Slow 4G, 4× CPU throttle). LCP 2.0 s or better in the lab (field target 2.5 s at p75), INP 150 ms or better, CLS 0.02 or better, TBT 150 ms or better. First-load JS 160 KB gzipped or less on Home, Shop and PDP; 200 KB or less on Checkout (the Razorpay script loads only at the payment step). Mobile hero image 150 KB or less (AVIF). Transferred at load 700 KB or less. Lighthouse mobile: Performance 95 or more (Checkout 90 or more), Accessibility 98 or more, Best Practices 100, SEO 98 or more. No third-party request before first interaction; analytics loads after interaction; fonts and media are self-hosted.
- **7.7 Images and fonts.** All images go through one `<Media>` component: explicit dimensions, `sizes`, blur placeholder generated at import, AVIF and WebP, lazy below the fold; the LCP image gets `priority` and `fetchpriority=high`. The upload and import pipeline resizes to 480, 800, 1200 and 1600 px and extracts dominant colours. Fonts through `next/font`, subset (Latin, Latin-ext, ₹), metric-matched fallback.
- **7.8 State.** The URL is state for shop filters, sort and page. The cart lives on the client; the server re-prices every line from the database at checkout and never trusts a client price.

## 8. Experience spec

- **8.1 Global shell.** Header: wordmark, five items (Shop, By the hour, Fabric if enabled, Story, Help), search, cart count. Mobile: a slim top bar, a full-screen menu sheet, and a thumb dock fixed at the bottom (Shop, Search, Cart, WhatsApp) that hides on scroll down and is absent on checkout or while the keyboard is open. Footer: a large, simple contact block (both call numbers, WhatsApp, email, hours once supplied), policy links, and a legal line (name, GSTIN, address) read from config. Help contact sits in the same place on every page (WCAG 3.2.6). Contact details are defined once in `brand.config.ts` and rendered as `tel:`, `https://wa.me/919929191655` and `mailto:` links and in Organization JSON-LD. Feature flags live there too: `fabricByMetre`, `wholesale`, `nightTheme`, `giftFinder`.
- **8.2 Home: seven moments, seven different layout primitives, no card chrome.** Each section gets its own background, spacing and motion signature. Maintain a Section Variety Table in `docs/DESIGN.md` and keep it true to the build.
  1. Hero: full-bleed real photograph, type off-axis at lower left, one primary action, headline from real product facts. Rise on the headline, one slow Drape on the image, no carousel.
  2. New in: horizontal scroll-snap rail, mixed aspect ratios, captions only (name, price). Arrow buttons and keyboard control; never drag-only.
  3. By the hour: an oversized typographic index of moments (for example bedtime, feeding hours, slow mornings, hospital bag, gifting; final list from the owner’s catalogue). Hover or focus previews an image; on mobile, stacked rows with thumbnails.
  4. The cloth: a macro photograph of weave or print with a scroll-linked zoom-out to the garment (desktop only, CSS scroll timeline; static on mobile). Real facts in a care-label component.
  5. Cut to length (if `fabricByMetre`): a live metre stepper with a ruler graphic and running price. The only tonal panel on the page.
  6. Fit in inches: an inline size finder (bust and hip in, size out) using the garment measurements; the result shows size-up advice only when the product data contains it.
  7. From customers: real, verified-purchase reviews with photos where granted. The section is hidden entirely until at least three exist.
- **8.3 Shop and collections.** Server-rendered, URL-driven filters (moment, size in stock, print colour dots, price band, feeding access) and sort. An image-led grid with an irregular row rhythm. A Show 12 more button with real URLs. Tile: image, name, price (strike-through MRP only for a real discount), colour dots. No hover carousels. View Transition into the PDP.
- **8.4 Product page.** Gallery (swipe on mobile, thumbnails on desktop, tap-to-zoom or pinch, nothing hover-only). Name, price incl. GST, size selector with out-of-stock states, colour or print dots. Add to cart: the label crossfades to Added, the header count ticks, the drawer does not auto-open; a sticky add bar on mobile. Fit panel: garment measurements in inches plus the size finder. Feeding access explained with a small honest diagram (no nudity, no generated bodies). Care-label component (fabric, composition, wash, shrinkage note if supplied). Pincode delivery estimate. Ask about this piece on WhatsApp, prefilled with product name, URL and chosen size. Product declarations block (section 9.6). Returns summary. Reviews (real only). Tell us when it’s back, with explicit consent. Product JSON-LD. Fabric variant: price per metre, length stepper (minimum 1 m, step 0.5 m; confirm with the owner), ruler graphic, colour-fidelity note, swatch request only if the owner offers it.
- **8.5 Search.** Instant suggestions from a tiny prebuilt index loaded on focus; server-rendered results page.
- **8.6 Cart.** A `<dialog>` drawer (right on desktop, bottom sheet on mobile): lines, quantity, remove with undo (no confirm-shaming), totals incl. GST, shipping estimate by pincode, Order on WhatsApp as the secondary action (prefilled cart summary to wa.me/919929191655), Checkout as primary.
- **8.7 Checkout.** One page, guest only. Contact (phone first, email for the receipt). Address (pincode first, city and state auto-filled from a bundled lookup, correct `autocomplete`, `inputmode` and `enterkeyhint`). Delivery with an ETA by pincode. Payment: UPI intent or QR, cards, netbanking and wallets via Razorpay; COD when eligible with the fee visible before it is chosen; a prepaid benefit shown only if the owner configures one. Gift options, collapsed (wrap, note card, price hidden on the slip, ship to another address). Sticky summary on desktop. Inline errors in plain language without alarm red. Seven required fields at most. Total, tax, shipping and fees are visible before the pay button.
- **8.8 After payment.** Confirmation page (order id such as ESK-2026-000123, items, ETA, tracking link by signed token), email receipt with the GST invoice PDF, a WhatsApp confirm link. `/track` lookup by order id and phone, rate-limited.
- **8.9 Static pages.** Story (owner facts only), Contact (form, both numbers, WhatsApp, email, grievance officer), Shipping and Delivery, Returns and Exchange, Privacy, Terms, Care guide, Size guide, FAQ. Policy text lives in `content/*.md`, marked `⟦OWNER TO CONFIRM⟧`; you are not a lawyer, so flag it for professional review.
- **8.10 States.** Every page and list has a designed loading state (skeleton matching the layout), empty, error, 404 and offline state in the brand voice. No spinner-only screens.
- **8.11 Admin at /admin** (owner only; Supabase magic link; allowlist from `ADMIN_EMAILS`). Products (create, edit, variants, stock, image upload with auto-optimisation, CSV import and export with a validation report). Orders (placed, confirmed, packed, shipped with courier and tracking id, delivered; cancel and refund through the Razorpay API; one-tap Message on WhatsApp from templates). Coupons. Review moderation. Enquiries. Restock requests. Dashboard (orders today, revenue, low stock, COD versus prepaid). Dense, fast, keyboard friendly, same tokens.
- **8.12 Optional, behind flags (Phase 6).** Wholesale enquiry page, Night theme (auto from `prefers-color-scheme`, manual switch, same palette family, never black with neon), gift finder, review photos, PWA manifest with no HTML caching in a service worker.

## 9. India commerce and compliance (built in, not bolted on)

- **9.1 Money.** Integer paise, INR only, `en-IN` digit grouping, tax-inclusive prices, GST rate and HSN per product. GST invoice PDF with GSTIN, HSN, tax split (CGST and SGST, or IGST by state) and a sequential invoice series. Prices are recomputed on the server. Confirm rates with the owner’s accountant; never hardcode them.
- **9.2 Razorpay.** Create the order on the server (amount in paise), open Checkout on the client, verify the payment signature on the server before fulfilling, and handle webhooks (captured, failed, refund) idempotently with an event-id store. Never trust a client-side success. Test mode first; keys only in environment variables.
- **9.3 Inventory.** Reserve stock when checkout starts (10-minute TTL), decrement on capture or COD confirmation, release on failure or expiry. Overselling must be impossible (transactions and constraints, with a test).
- **9.4 COD.** Configurable: enabled, minimum and maximum order value, pincode allow and deny lists, fee. After a COD order the admin gets a one-tap WhatsApp confirmation; WhatsApp Business API automation is a later step.
- **9.5 Dark patterns.** India’s CCPA guidelines name 13: false urgency, basket sneaking, confirm shaming, forced action, subscription trap, interface interference, bait and switch, drip pricing, disguised advertisement, nagging, trick wording, SaaS billing, rogue malware. Each phase ends with an audit table (pass or not applicable, with evidence) via the `dark-pattern-audit` skill. No pre-ticked extras, no countdowns, no guilt copy, and cancelling is as easy as ordering.
- **9.6 Product declarations on every listing.** Name and address of the manufacturer, packer or importer; common name; net quantity (for example 1 piece, or per metre); MRP inclusive of all taxes; consumer-care contact (name, phone, email); country of origin. Site-wide: legal name, address, GSTIN, grievance officer, return, refund and exchange terms, delivery terms, accepted payment methods. The owner confirms the exact list with an advisor.
- **9.7 Data protection (DPDP Act and Rules).** Collect only what delivery needs. A plain-language itemised notice where data is collected. Separate, unticked consent for marketing and WhatsApp lists. A visible way to withdraw consent or ask for erasure. Retention rules. Reasonable security: RLS, TLS, least privilege, a breach runbook. The main obligations phase in by May 2027: build compliant now.
- **9.8 Reviews.** Verified purchase only (order token), moderated, no incentivised or fabricated reviews.
- **9.9 SEO and the name hazard.** A unique title and description per page, always pairing Eskort Creations with product nouns (for example women’s cotton nightwear, feeding gowns). Product, BreadcrumbList and Organization JSON-LD (with contactPoint), sitemap, robots, canonical URLs, OG images, `lang=en-IN`. Plan Google Business Profile, Merchant Center and Meta Business verification early; never run ads on the bare word Eskort.

## 10. Phases and exit evidence

- **Phase 0: Direction.** Exit: `docs/DESIGN.md`, `CONTENT_NEEDED.md`, the Direction Board with three options and the reject-test table, and a recommendation. Then STOP.
- **Phase 1: Foundation.** Scaffold with `create-next-app` in a temporary folder and merge (keep the Next.js AGENTS.md block), token reset, fonts, shell, UI primitives, motion utilities, `brand.config.ts`, flagged sample data (`isSample`), CSV importer, rules and skills from Step 0, scripts (`slop-scan`, `content-check`, bundle budget). Exit: `pnpm build`, `typecheck`, `lint` and `test` green; baseline screenshots; budgets measured.
- **Phase 2: Storefront.** Home, Shop, collections, PDP (garment and fabric), search, static pages, SEO. Exit: Lighthouse budgets met on `/`, `/shop` and one PDP; zero serious axe violations; slop audit passed; Section Variety Table matches the build; screenshots at three widths.
- **Phase 3: Commerce.** Cart, checkout, Razorpay test-mode flow, COD, inventory reservation, emails, invoice PDF, tracking, WhatsApp links. Exit: Playwright end-to-end green for add to cart and pay (test mode), COD, failed-payment recovery, the out-of-stock race, pincode ETA, fabric length maths, gift options, and WhatsApp links resolving to wa.me/919929191655; dark-pattern audit complete.
- **Phase 4: Admin.** Exit: a timed test adds a product with images in under three minutes; the order flow and refund path work; CSV import rejects bad rows with a readable report.
- **Phase 5: Hardening and launch.** Exit: RLS tests, rate limits, secret scan, consent-gated analytics, error monitoring, backups, `.env.example`, a deployment runbook, a compliance checklist, Lighthouse on the production URL, and `content:check` proven to block a production build that still contains placeholders.
- **Phase 6: Optional flags** (section 8.12), only on request.

## 11. Audits (end of every phase; results go in the Walkthrough)

- **Slop audit** (`slop-audit` skill): run `scripts/slop-scan.mjs` against the ban list, review the screenshots against the second-wave clusters, apply the Specificity Test to every headline and CTA, check the Section Variety Table. You may read the source of an open-source detector such as avoid-ai-design before running it; the in-repo scan is mandatory.
- **Performance gate** (`perf-gate`): the section 7.6 numbers on the three core pages plus checkout.
- **Accessibility:** WCAG 2.2 AA, including target size, focus not obscured, dragging alternatives and consistent help; a keyboard-only walkthrough of cart and checkout; a reduced-motion pass.
- **Security:** RLS tests, input validation with Zod, rate limiting on order, contact and lookup endpoints, no secrets in the client bundle.
- **Honesty audit:** every claim on every page traces to a data field or an owner-supplied fact.

## 12. Deliverables

A repository with README (setup, env, commands), `docs/DESIGN.md`, `docs/DECISIONS.md`, `docs/RUNBOOK.md`, `CONTENT_NEEDED.md`, `.env.example`, tests, a CI workflow, flagged sample data, and one Walkthrough artifact per phase.

## 13. Begin

Execute Step 0 now, then Phase 0. Do not scaffold the app until the owner approves a direction.

## END OF PROMPT

## Appendix: research notes (not part of the prompt)

- **Antigravity (Google docs, read 21 Oct 2026).** Rules load from AGENTS.md and `.agents/rules/` with mandatory frontmatter, a 24 KB per-file cap and a 20k-token always-on budget; skills live in `.agents/skills/`; `/plan` produces a reviewable plan; `/goal` runs until evidence-based completion with no iteration cap; Gemini 4 Argon rolled out on 13 Oct 2026 to AI Pro and Ultra in the App and CLI; the image-generation tool is used when agents fill pages or mock UI, hence rule 3.
- **Next.js.** 16.x is the active line; 15 reaches end of life on 21 Oct 2026; 16.2 bundles version-matched docs in `node_modules/next/dist/docs/` and scaffolds an AGENTS.md that points to them; `<ViewTransition>` is enabled with `experimental.viewTransition`.
- **AI design tells (2026).** Research summarised by Capital & Compute (25 Sep 2026) reports that agents drift to a second wave of defaults (cream plus terracotta, near-black plus neon, hairline broadsheet, card kit, template chrome) once the purple gradient is banned, and that Anthropic’s frontend-design skill was updated on 3 Sep 2026 to name them. Conclusion used here: direction first, then filter; deterministic scans beat prose rules.
- **Web performance.** Core Web Vitals thresholds are unchanged: LCP 2.5 s, INP 200 ms, CLS 0.1 at p75. Our budgets are stricter on purpose. CSS scroll-driven animations: Chromium and recent Safari, not Firefox.
- **India.** CCPA dark-pattern guidelines (30 Nov 2023, 13 patterns; self-audit advisory June 2025); Legal Metrology declarations on e-commerce listings (2017 amendment); DPDP Rules notified 13 Nov 2025 with main obligations from 13 May 2027; COD orders fail delivery far more often than prepaid and WhatsApp confirmation is the standard mitigation; Razorpay requires server-side signature verification.
- **Business context.** A public B2B listing under the same name shows ladies’ nightgowns, feeding gowns and printed cotton fabric. That is the basis for the assumed category, nothing more.
- **Sources.** antigravity.google/docs (rules, skills, models, plan, commands/goal) and antigravity.google/blog/gemini-4-argon-in-google-antigravity; nextjs.org/docs/app/guides/view-transitions, nextjs.org/docs/app/guides/ai-agents, nextjs.org/blog/next-16-2-ai; capitalandcompute.net/blog/fix-ai-slop-design; razorpay.com/docs/developer-tools/integrations/standard-checkout; Mondaq, Bar & Bench, IAPP and Taxguru coverage of the dark-pattern guidelines and DPDP Rules.
