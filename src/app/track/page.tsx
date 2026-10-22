"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import {
  CheckCircle,
  MagnifyingGlass,
  WhatsappLogo,
  Clock,
  MapPin,
} from "@phosphor-icons/react";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (searchId: string, searchPhone: string) => {
    if (!searchId.trim()) {
      setError("Please enter your Order ID (e.g. ESK-2026-000101).");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(searchPhone.trim())) {
      setError("Please enter your 10-digit registered mobile number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/track?orderId=${encodeURIComponent(searchId.trim())}&phone=${encodeURIComponent(
          searchPhone.trim()
        )}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "No order found matching those details. Please check and retry.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Unable to connect to tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialPhone) {
      queueMicrotask(() => {
        fetchTracking(initialOrderId, initialPhone);
      });
    }
  }, [initialOrderId, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId, phone);
  };

  // Timeline steps
  const steps = [
    { title: "Order Placed", desc: "Received at Jaipur workshop", completed: true },
    {
      title: "Order Confirmed",
      desc: "Fabric reserved & measurements checked",
      completed: order?.status !== "pending_payment",
    },
    {
      title: "Handcrafted & Packed",
      desc: "Quality inspection & sealed packaging",
      completed: ["packed", "dispatched", "out_for_delivery", "delivered"].includes(
        order?.status || ""
      ),
    },
    {
      title: "Dispatched with Courier",
      desc: order ? `${order.carrier} (AWB: ${order.trackingNumber})` : "Handed over to carrier",
      completed: ["dispatched", "out_for_delivery", "delivered"].includes(order?.status || ""),
    },
    {
      title: "Delivered",
      desc: order?.estimatedDeliveryDate ? `Estimated: ${order.estimatedDeliveryDate}` : "Delivered safely",
      completed: order?.status === "delivered",
    },
  ];

  return (
    <div className="w-full min-h-[75vh] bg-[var(--canvas)] py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--ink-muted)]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">Tracking</span>
          <span>·</span>
          <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
        </div>

        <h1 className="text-display-title font-display text-[var(--ink-primary)] mb-2">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)] mb-8 leading-relaxed">
          Enter your Eskort Creations Order ID and the mobile phone number used during checkout to check live workshop and courier status.
        </p>

        {/* Lookup Form */}
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 sm:p-8 mb-8 shadow-xs">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5 flex flex-col gap-1.5">
              <label htmlFor="orderId" className="text-xs font-medium text-[var(--ink-primary)]">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                placeholder="e.g. ESK-2026-000101"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
              />
            </div>

            <div className="sm:col-span-5 flex flex-col gap-1.5">
              <label htmlFor="trackPhone" className="text-xs font-medium text-[var(--ink-primary)]">
                Mobile Number
              </label>
              <input
                id="trackPhone"
                type="tel"
                maxLength={10}
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
              />
            </div>

            <div className="sm:col-span-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-2.5"
              >
                <MagnifyingGlass size={15} />
                <span>Track</span>
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--accent-madder)] text-xs text-[var(--accent-madder)] font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Tracking Timeline Output */}
        {order && (
          <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 sm:p-8 animate-fadeIn flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs text-[var(--ink-muted)] block">Tracking for Order</span>
                <span className="text-lg font-mono font-bold text-[var(--ink-primary)]">
                  {order.id}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-[var(--ink-muted)] block">Carrier &amp; Air Waybill</span>
                <span className="text-xs font-medium text-[var(--ink-primary)] font-mono">
                  {order.carrier} — {order.trackingNumber}
                </span>
              </div>
            </div>

            {/* Vertical Stepper */}
            <div className="py-2">
              <div className="flex flex-col gap-6">
                {steps.map((s, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                          s.completed ? "bg-[var(--accent-madder)]" : "bg-[var(--border-subtle)]"
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                        s.completed
                          ? "bg-[var(--accent-madder)] text-white border-[var(--accent-madder)]"
                          : "bg-[var(--surface-subtle)] text-[var(--ink-muted)] border-[var(--border-subtle)]"
                      }`}
                    >
                      {s.completed ? <CheckCircle size={16} weight="fill" /> : <Clock size={16} />}
                    </div>

                    <div className="flex-1 pt-1">
                      <span
                        className={`text-xs font-semibold block ${
                          s.completed ? "text-[var(--ink-primary)]" : "text-[var(--ink-muted)]"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="text-[11px] text-[var(--ink-muted)] block">
                        {s.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-[var(--ink-secondary)]">
                <MapPin size={16} className="text-[var(--accent-madder)] shrink-0" />
                <span>
                  Delivery Address: {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                </span>
              </div>

              <a
                href={`https://wa.me/919929191655?text=${encodeURIComponent(
                  `Namaste Eskort Creations, I am checking the status of my Order ${order.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-madder)] hover:underline flex items-center gap-1 font-medium"
              >
                <WhatsappLogo size={15} />
                <span>Chat with Workshop</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
