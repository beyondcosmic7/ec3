"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Error Caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[var(--canvas)] px-4 text-center">
      <h2 className="text-display-title font-display text-[var(--ink-primary)] mb-2">
        Something unexpected occurred.
      </h2>
      <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-sm mb-6 leading-relaxed">
        We encountered a momentary glitch while rendering this page. You can try refreshing or returning to our collection.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/shop">
          <Button variant="secondary" size="md">
            View Catalogue
          </Button>
        </Link>
      </div>
    </div>
  );
}
