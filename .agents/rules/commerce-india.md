---
trigger: model_decision
description: Apply when touching cart, checkout, payments, orders, tax, shipping, policies or consent.
---

# India Commerce, Statutory Compliance & Payment Integrity

When touching any shopping cart, checkout, order processing, inventory, policy, or Indian regulatory logic:

## 1. Financial Precision & Integrity
- **Paise Only**: All database models, cart computations, API payloads, and payment order amounts MUST be integer paise (1 INR = 100 paise).
- **Format**: Render Indian digit grouping (`₹1,799` or `₹1,50,000`) using `en-IN` locale formatting.
- **Server Authority**: Never trust client-submitted line prices or order totals. Every line item must be re-queried and re-computed from the database on checkout initiation.
- **Tax Breakdown**: Prices shown to customers are tax-inclusive. Order records and GST invoices must break down HSN code, taxable value, and tax split (CGST + SGST for intra-state, IGST for inter-state) based on customer delivery state.

## 2. Payment Gateway & Inventory Synchronization
- **Razorpay Server Validation**: Generate orders server-side via Razorpay Orders API. Open Razorpay Checkout on the client. Verify HMAC SHA256 payment signature on the server before finalizing the order.
- **Webhook Idempotency**: Process Razorpay webhooks (`payment.captured`, `payment.failed`, `refund.processed`) idempotently using a database-backed event table.
- **Inventory Reservation**: Temporarily reserve inventory upon checkout start with a strict 10-minute TTL. Release reserved inventory on checkout abandonment, failure, or TTL expiration. Decrement stock permanently upon verified payment capture. Prevent overselling with transactional database row-level locking.
- **Cash on Delivery (COD)**:
  - Allowed only for serviced pincodes and order values within configured caps.
  - Transparent COD fee (e.g. ₹50) clearly displayed before the user selects the payment option.
  - Mandatory post-order WhatsApp order confirmation dispatch.

## 3. CCPA Zero Dark Patterns Mandate
India's Central Consumer Protection Authority (CCPA) strictly prohibits 13 deceptive design patterns. The codebase must enforce:
- No false urgency or fake scarcity ("Only 2 left!", artificial countdown timers, fake viewer counters).
- No basket sneaking (pre-ticked shipping insurance, tips, or unselected add-ons).
- No confirm shaming ("No thanks, I dislike saving money" or manipulative modal buttons).
- No drip pricing: Display all applicable fees (taxes, delivery, COD surcharge) before the final payment button.
- Clean cancellation and return access matching the ease of ordering.

## 4. Legal Metrology Declarations
Under the Legal Metrology (Packaged Commodities) Rules, every product detail page must visibly display:
1. Legal name and physical address of the manufacturer and packer.
2. Common/generic name of the commodity (e.g. "Women's 3-Piece Kurti Pant Dupatta Set").
3. Net quantity contained in the package (e.g. "1 Set - 3 Pieces").
4. Maximum Retail Price (MRP) inclusive of all taxes.
5. Consumer care contact details (Name, phone number, email address).
6. Country of origin ("India").

## 5. DPDP Act (Digital Personal Data Protection)
- Collect only minimal personal data strictly necessary for order fulfillment and delivery.
- Provide a clear, plain-language itemized privacy notice at the point of data capture.
- Provide an explicit, un-ticked checkbox for optional marketing and WhatsApp updates.
- Provide an accessible mechanism for customers to withdraw consent or request data erasure.

## 6. Name Disambiguation
Due to potential vocabulary conflict with the brand name "Eskort", all programmatic page titles, metadata tags, structured schema (JSON-LD), and external communications must explicitly pair the brand name with product categories (e.g. "Eskort Creations - Handcrafted Women's Kurtas & Ethnic Wear").
