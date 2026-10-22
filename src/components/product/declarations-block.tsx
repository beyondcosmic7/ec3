import React from "react";
import { Product } from "@/lib/types";
import { brandConfig } from "@/../brand.config";

interface DeclarationsBlockProps {
  product: Product;
}

export function DeclarationsBlock({ product }: DeclarationsBlockProps) {
  return (
    <div className="p-5 rounded-[var(--radius-control)] bg-[var(--canvas)] border border-[var(--border-subtle)] flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <h4 className="font-semibold uppercase tracking-wider text-[var(--ink-secondary)] text-[11px]">
          Statutory Declarations (Legal Metrology Packaged Commodities)
        </h4>
        <span className="text-[10px] text-[var(--ink-faint)]">Rule 6 Compliant</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[var(--ink-secondary)]">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Common Generic Name
          </span>
          <span className="text-xs text-[var(--ink-primary)]">
            Women&apos;s Ethnic Garment / Ensemble ({product.fabric})
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Net Quantity
          </span>
          <span className="text-xs text-[var(--ink-primary)]">
            1 N (Garment Unit)
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Maximum Retail Price (MRP)
          </span>
          <span className="text-xs text-[var(--ink-primary)] font-semibold">
            ₹{product.mrp_inr} (Inclusive of all taxes &amp; GST @ {product.gst_percent}%)
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Country of Origin
          </span>
          <span className="text-xs text-[var(--ink-primary)]">
            {product.country_of_origin}
          </span>
        </div>

        <div className="sm:col-span-2">
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Manufacturer &amp; Packer Details
          </span>
          <span className="text-xs text-[var(--ink-primary)]">
            {product.packer_name_address}
          </span>
        </div>

        <div className="sm:col-span-2 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-semibold text-[var(--ink-muted)] block">
            Consumer Care &amp; Grievance Redressal
          </span>
          <span className="text-xs text-[var(--ink-primary)]">
            Eskort Creations · Email: {brandConfig.contact.email} · Tel: {brandConfig.contact.voicePhones[0]} / {brandConfig.contact.voicePhones[1]}
          </span>
        </div>

      </div>
    </div>
  );
}
