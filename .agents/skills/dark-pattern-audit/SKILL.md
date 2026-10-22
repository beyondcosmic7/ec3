---
name: dark-pattern-audit
description: Audits the storefront, cart, checkout flows, and notifications against the 13 dark patterns prohibited under India CCPA regulations.
---

# CCPA Dark Pattern Audit Skill

This skill conducts a systematic legal and UX audit across all customer touchpoints against the 13 dark patterns specified by India's Central Consumer Protection Authority (CCPA).

## The 13 Prohibited Dark Patterns & Verification Criteria

| No. | Dark Pattern | Description | Compliance Check in Eskort Creations | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **False Urgency** | Artificial timers, false limited stock claims | No fake countdowns; stock status reflects real inventory quantities only. | Pass |
| 2 | **Basket Sneaking** | Adding unrequested items, donations, or insurance | No automatic add-ons; cart items strictly reflect customer selections. | Pass |
| 3 | **Confirm Shaming** | Guilt-inducing copy to deter opting out or cancelling | Clean, neutral action copy (e.g. "Keep in cart" or "Remove"); no emotional manipulation. | Pass |
| 4 | **Forced Action** | Compelling registration or newsletter signups to buy | Guest checkout is standard; no mandatory account creation. | Pass |
| 5 | **Subscription Trap** | Hidden recurring charges or impossible cancellation | One-time purchases only; no hidden subscription terms. | Pass |
| 6 | **Interface Interference** | Obscuring critical info or visual manipulation | Key costs, delivery terms, and product facts presented with clear contrast and equal prominence. | Pass |
| 7 | **Bait and Switch** | Advertising one price/product and delivering another | Server-authoritative pricing guarantees the advertised price matches final billing. | Pass |
| 8 | **Drip Pricing** | Progressively revealing hidden fees late in checkout | Delivery fees, taxes, and COD charges are shown up front prior to final pay step. | Pass |
| 9 | **Disguised Ads** | Presenting paid promotions as editorial or organic | No affiliate links, sponsor placements, or disguised advertisements. | Pass |
| 10 | **Nagging** | Persistent popups interrupting the user flow | Zero marketing popups, spin-the-wheels, or exit-intent modals. | Pass |
| 11 | **Trick Wording** | Confusing double-negatives to mislead choices | Direct, plain Indian English phrasing for all checkboxes and options. | Pass |
| 12 | **SaaS Billing / Trap** | Unauthorized recurring debit or ambiguous renewals | Not applicable (no SaaS or recurring recurring debits). | N/A |
| 13 | **Rogue Malware** | Malicious redirection, adware, or unauthorized cookies | Clean client bundles; strict CSP; no unverified third-party scripts. | Pass |

## Output Requirement
At the conclusion of each phase involving commerce or user flows, generate an evidence-backed CCPA Dark Pattern Audit table in the phase walkthrough artifact.
