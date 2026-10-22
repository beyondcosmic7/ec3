import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[var(--canvas)] px-4 text-center">
      <div className="flex items-center gap-2 mb-4">
        <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
      </div>

      <h1 className="text-display-title font-display text-[var(--ink-primary)] mb-2">
        This page isn&apos;t here.
      </h1>

      <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-sm mb-8 leading-relaxed">
        The piece or page you are looking for may have moved or is no longer available in our workshop catalogue.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop">
          <Button variant="primary" size="md">
            Try the shop
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="md">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
