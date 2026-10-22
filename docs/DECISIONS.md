# Eskort Creations: Architectural Decisions Log (`docs/DECISIONS.md`)

*Per Section 2 (Rule 1) and Section 7 of BUILD_PROMPT.md, every package selection, exact version pinning, and architectural choice is documented here with rationale and date.*

---

## Architecture & Dependency Decisions

### 1. Next.js Core & React Framework
- **Date**: 22 October 2026
- **Package**: `next@16.4.2` (Latest stable 16.x release; Next.js 15 reached EOL on 21 Oct 2026)
- **Peer Dependencies**: `react@19.3.0`, `react-dom@19.3.0`
- **Documentation Source**: `node_modules/next/dist/docs/`
- **Rationale**: Next.js 16.4.2 provides native App Router Turbopack support, built-in bundling of version-exact documentation, React 19.3 `<ViewTransition>` declarative primitives for seamless product morphing, and strict partial prefetching.

### 2. Styling Engine: Tailwind CSS v4
- **Date**: 22 October 2026
- **Packages**: `tailwindcss@4.3.3`, `@tailwindcss/turbopack@4.3.3`
- **Rationale**: Tailwind v4 uses a CSS-first configuration via `@import "tailwindcss";` and `@theme`. All default theme scales (`--color-*`, `--font-*`, `--radius-*`) are explicitly reset to `initial` so only Eskort Creations bespoke design tokens exist. Zero generic template utilities.

### 3. TypeScript & Linting
- **Date**: 22 October 2026
- **Packages**: `typescript@5.9.3`, `eslint@9.39.5`, `eslint-config-next@16.4.2`
- **Rationale**: Strict type checking with `strict: true` and zero `any` usage.

### 4. Package Manager
- **Date**: 22 October 2026
- **Tool**: `pnpm@12.14.0` (managed via Node corepack)
- **Rationale**: Hard links in content-addressable store, reproducible lockfiles, fast deterministic builds.

### 5. Validation & Schemas
- **Date**: 22 October 2026
- **Package**: `zod@3.24.2`
- **Rationale**: Schema validation for CSV product ingestion, cart checkout payloads, and pincode lookups.

### 6. End-to-End Testing & Visual Verification
- **Date**: 22 October 2026
- **Package**: `playwright@1.58.2`
- **Rationale**: Specified in Section 7.1 and 10 of BUILD_PROMPT.md for automated headless multi-viewport screenshot captures and end-to-end commerce and admin verification.

