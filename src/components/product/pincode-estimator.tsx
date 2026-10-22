"use client";

import React, { useState } from "react";
import { Truck } from "@phosphor-icons/react";

export function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError("That pincode needs 6 digits.");
      setEstimate(null);
      return;
    }

    setError(null);
    // Calculated estimate based on standard Indian courier dispatch from Jaipur workshop
    const isRajasthan = pincode.startsWith("30") || pincode.startsWith("31") || pincode.startsWith("32");
    const isMetro = ["11", "40", "56", "70", "60", "50"].some((p) => pincode.startsWith(p));

    if (isRajasthan) {
      setEstimate("Estimated delivery in 2–3 business days. COD available.");
    } else if (isMetro) {
      setEstimate("Estimated delivery in 3–4 business days. COD available.");
    } else {
      setEstimate("Estimated delivery in 4–6 business days. Express air dispatch.");
    }
  };

  return (
    <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-primary)]">
        <Truck size={16} weight="regular" className="text-[var(--accent-madder)]" />
        <span>Check Delivery &amp; COD Availability</span>
      </div>

      <form onSubmit={checkPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]{6}"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setError(null);
            setEstimate(null);
          }}
          aria-label="Enter 6-digit pincode"
          className="flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)] hover:opacity-90 transition-opacity interactive-press"
        >
          Check
        </button>
      </form>

      {error && <span className="text-[11px] text-[var(--accent-madder)]">{error}</span>}
      {estimate && (
        <span className="text-[11px] text-[var(--accent-brass)] font-medium">
          ✓ {estimate}
        </span>
      )}
    </div>
  );
}
