import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";


export const metadata = {
  title: "Sizing & Measurement Guide — Eskort Creations",
  description: "Detailed inch measurement reference tables and tailoring ease specifications.",
};

export default function SizingGuidePage() {
  return (
    <PolicyPageLayout
      title="Garment Sizing & Fit in Inches"
      subtitle="How to measure your body and understand our Jaipur workshop garment dimensions"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. How We Measure</h2>
        <p>
          Unlike fast-fashion mass brands that use vanity sizing labels, Eskort Creations specifies the
          exact finished garment bust, waist, hip, and length in inches for every design.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. Comprehensive Sizing Chart (Inches)</h2>
        <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-[var(--radius-control)]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[var(--surface-subtle)] text-[var(--ink-primary)] border-b border-[var(--border-subtle)]">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Body Bust</th>
                <th className="py-2.5 px-3">Garment Chest</th>
                <th className="py-2.5 px-3">Kurti Waist</th>
                <th className="py-2.5 px-3">Hip (Kurti/Pant)</th>
                <th className="py-2.5 px-3">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">XS</td>
                <td className="py-2 px-3">32&quot;</td>
                <td className="py-2 px-3">34&quot;</td>
                <td className="py-2 px-3">30&quot;</td>
                <td className="py-2 px-3">36&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">S</td>
                <td className="py-2 px-3">34&quot;</td>
                <td className="py-2 px-3">36&quot;</td>
                <td className="py-2 px-3">32&quot;</td>
                <td className="py-2 px-3">38&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">M</td>
                <td className="py-2 px-3">36&quot;</td>
                <td className="py-2 px-3">38&quot;</td>
                <td className="py-2 px-3">34&quot;</td>
                <td className="py-2 px-3">40&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">L</td>
                <td className="py-2 px-3">38&quot;</td>
                <td className="py-2 px-3">40&quot;</td>
                <td className="py-2 px-3">36&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">XL</td>
                <td className="py-2 px-3">40&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
                <td className="py-2 px-3">38&quot;</td>
                <td className="py-2 px-3">44&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">XXL</td>
                <td className="py-2 px-3">42&quot;</td>
                <td className="py-2 px-3">44&quot;</td>
                <td className="py-2 px-3">40&quot;</td>
                <td className="py-2 px-3">46&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[var(--accent-madder)]">3XL</td>
                <td className="py-2 px-3">44&quot;</td>
                <td className="py-2 px-3">46&quot;</td>
                <td className="py-2 px-3">42&quot;</td>
                <td className="py-2 px-3">48&quot;</td>
                <td className="py-2 px-3">45&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. Internal Seam Allowance (1.5 Inches)</h2>
        <p>
          Every garment features 1.5 inches of internal margin on both side seams. If your measurements change or you desire a more relaxed fit, simply undo the outer safety stitch.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
