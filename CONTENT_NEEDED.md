# Eskort Creations: Missing Content Inventory (`CONTENT_NEEDED.md`)

*Per Section 2 (Rule 4) and Section 9 of BUILD_PROMPT.md, this repository enforces a strict zero-invented-content policy. All missing legal, operational, and brand facts are logged here with corresponding `⟦NEEDED: what⟧` markers in code. Production builds (`LAUNCH=1` or `VERCEL_ENV=production`) will fail until every marker is resolved with verified owner data.*

---

## 1. Statutory & Legal Metrology Identifiers (Mandatory)

| Item Code | Field | Description | Current Marker | Status |
| :--- | :--- | :--- | :--- | :--- |
| `LEGAL-01` | **Registered Business Name** | Official legal entity name registered under MCA / GST | `⟦NEEDED: registered_business_name⟧` | Open |
| `LEGAL-02` | **Registered Office Address** | Physical registered address for corporate filings | `⟦NEEDED: registered_office_address⟧` | Open |
| `LEGAL-03` | **GSTIN** | 15-digit Goods & Services Tax Identification Number | `⟦NEEDED: gstin⟧` | Open |
| `LEGAL-04` | **Grievance Officer Name** | Mandatory under Consumer Protection (E-Commerce) Rules | `⟦NEEDED: grievance_officer_name⟧` | Open |
| `LEGAL-05` | **Grievance Officer Email & Phone** | Redressal contact channels | `⟦NEEDED: grievance_officer_contact⟧` | Open |
| `LEGAL-06` | **Packer & Manufacturer Details** | Mandatory address on every product detail page | `⟦NEEDED: packer_name_address⟧` | Open |

---

## 2. Commercial & Operational Policies

| Item Code | Field | Description | Current Marker | Status |
| :--- | :--- | :--- | :--- | :--- |
| `OPS-01` | **Return & Exchange Window** | Timeframe (e.g. 7 days from delivery) and conditions | `⟦NEEDED: return_window_days⟧` | Open |
| `OPS-02` | **Return Shipping Policy** | Reverse pickup coverage or customer self-ship terms | `⟦NEEDED: return_shipping_terms⟧` | Open |
| `OPS-03` | **Courier Partner Integrations** | Shiprocket, Delhivery, Bluedart, or India Post | `⟦NEEDED: primary_courier_partner⟧` | Open |
| `OPS-04` | **Customer Care Hours** | Operating hours for phone and WhatsApp support | `⟦NEEDED: customer_care_hours⟧` | Open |
| `OPS-05` | **COD Pincode Servicability** | Whitelist/blacklist pincodes or standard courier API | `⟦NEEDED: cod_servicable_pincodes⟧` | Open |

---

## 3. Brand Story & Social Footprint

| Item Code | Field | Description | Current Marker | Status |
| :--- | :--- | :--- | :--- | :--- |
| `BRAND-01` | **Founder Story** | Authentic origin, craft philosophy, atelier background | `⟦NEEDED: founder_story⟧` | Open |
| `BRAND-02` | **Social Media Handles** | Official Instagram / Facebook URLs | `⟦NEEDED: social_handles⟧` | Open |
| `BRAND-03` | **Customer Reviews** | Minimum 3 verified-buyer photo reviews for home section | `⟦NEEDED: verified_customer_reviews⟧` | Blocked until orders |

---

## Current Active Owner Contact Details (Verified)

- **Voice Calls**: `+91 75809 01212` and `+91 98292 77894`
- **WhatsApp Concierge**: `+91 99291 91655` (`https://wa.me/919929191655`)
- **Customer Support Email**: `eskortcreations@gmail.com`
