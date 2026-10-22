"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product, Order, OrderStatus } from "@/lib/types";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";

interface AdminStats {
  ordersToday: number;
  revenueTodayPaise: number;
  totalOrders: number;
  lowStockCount: number;
  prepaidCount: number;
  codCount: number;
  lowStockItems: { slug: string; name: string; size: string; stock: number }[];
}

interface CsvReport {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errors: { row: number; column?: string; message: string }[];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "csv" | "marketing">("products");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<string>("all");

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addTimeSeconds, setAddTimeSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // CSV Tab State
  const [csvInput, setCsvInput] = useState<string>("");
  const [csvReport, setCsvReport] = useState<CsvReport | null>(null);
  const [csvLoading, setCsvLoading] = useState<boolean>(false);

  // Tracking edit state for orders
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { carrier: string; trackingNumber: string }>>({});

  // Notification message
  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  }

  // Load Initial Data
  async function loadData() {
    try {
      const [statsRes, prodsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (prodsRes.ok) {
        const data = await prodsRes.json();
        setProducts(data.products || []);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }
    } catch {
      showNotice("Error connecting to admin APIs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [statsRes, prodsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
        ]);
        if (ignore) return;
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }
        if (prodsRes.ok) {
          const data = await prodsRes.json();
          setProducts(data.products || []);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders || []);
        }
      } catch {
        if (!ignore) showNotice("Error connecting to admin APIs");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Timer effect for Product Addition benchmark
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setAddTimeSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Handle Quick Stock Update
  async function handleStockChange(slug: string, size: string, newStock: number) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, size, stock: Math.max(0, newStock) }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.slug === slug ? data.product : p))
        );
        showNotice(`Updated ${slug} size ${size} stock to ${newStock}`);
      } else {
        const err = await res.json();
        showNotice(`Stock update failed: ${err.error}`);
      }
    } catch {
      showNotice("Network error during stock update");
    }
  }

  // Handle Order Status Update
  async function handleOrderStatusChange(orderId: string, newStatus: OrderStatus) {
    const input = trackingInputs[orderId] || {};
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          carrier: input.carrier,
          trackingNumber: input.trackingNumber,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        showNotice(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        const err = await res.json();
        showNotice(`Order update failed: ${err.error}`);
      }
    } catch {
      showNotice("Network error during order update");
    }
  }

  // Handle Order Refund
  async function handleRefund(orderId: string) {
    if (!confirm(`Are you sure you want to cancel and refund Order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        showNotice(`Order ${orderId} cancelled & refunded`);
      }
    } catch {
      showNotice("Network error processing refund");
    }
  }

  // Handle CSV Import
  async function handleCsvImport(e: React.FormEvent) {
    e.preventDefault();
    if (!csvInput.trim()) {
      showNotice("Please paste CSV data to import");
      return;
    }
    setCsvLoading(true);
    setCsvReport(null);
    try {
      const res = await fetch("/api/admin/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvInput }),
      });
      const data = await res.json();
      setCsvReport(data);
      if (data.success) {
        showNotice(`Successfully imported ${data.importedCount} products!`);
        loadData();
      } else {
        showNotice(`CSV import completed with ${data.errors.length} validation errors`);
      }
    } catch {
      showNotice("Network error during CSV ingestion");
    } finally {
      setCsvLoading(false);
    }
  }

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.status === orderFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--ink-primary)] pb-24 selection:bg-[var(--surface-subtle)]">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--ink-primary)] text-white px-5 py-3 rounded-[10px] text-sm shadow-xl flex items-center gap-3 animate-fade-in border border-[var(--ink-muted)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-brass)]"></span>
          <span>{notice}</span>
        </div>
      )}

      {/* Atelier Admin Top Navigation */}
      <header className="border-b border-[var(--ink-muted)]/15 bg-[var(--surface-subtle)]/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SelvedgeDots />
            <div>
              <span className="font-serif text-lg tracking-tight font-medium text-[var(--ink-primary)]">
                Eskort Creations
              </span>
              <span className="ml-2 text-xs uppercase tracking-wider text-[var(--ink-muted)] font-mono">
                Atelier Back Office
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)] px-3 py-1.5 rounded-[10px] border border-[var(--ink-muted)]/20 hover:border-[var(--ink-muted)]/40 transition-colors"
            >
              View Storefront
            </Link>
            <button
              onClick={loadData}
              disabled={loading}
              className="text-xs bg-[var(--surface-canvas)] text-[var(--ink-primary)] px-3 py-1.5 rounded-[10px] border border-[var(--ink-muted)]/20 hover:border-[var(--ink-muted)]/40 transition-colors active:scale-[0.985]"
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* KPI Metric Summary Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-[12px] bg-[var(--surface-subtle)]/70 border border-[var(--ink-muted)]/15">
            <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-medium">
              Orders Today
            </span>
            <div className="text-2xl font-serif mt-1 font-semibold text-[var(--ink-primary)]">
              {stats?.ordersToday ?? 0}
            </div>
            <div className="text-[11px] text-[var(--ink-muted)] mt-1 font-mono">
              Total Recorded: {stats?.totalOrders ?? orders.length}
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--surface-subtle)]/70 border border-[var(--ink-muted)]/15">
            <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-medium">
              Gross Revenue Today
            </span>
            <div className="text-2xl font-serif mt-1 font-semibold text-[var(--ink-primary)] tabular-nums">
              ₹{stats ? ((stats.revenueTodayPaise || 0) / 100).toLocaleString("en-IN") : "0"}
            </div>
            <div className="text-[11px] text-[var(--ink-muted)] mt-1">
              Inclusive of 5% GST
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--surface-subtle)]/70 border border-[var(--ink-muted)]/15">
            <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-medium">
              Low Stock Alerts
            </span>
            <div className="text-2xl font-serif mt-1 font-semibold text-[var(--accent-madder)]">
              {stats?.lowStockCount ?? 0}
            </div>
            <div className="text-[11px] text-[var(--ink-muted)] mt-1">
              Variants with ≤ 2 units remaining
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--surface-subtle)]/70 border border-[var(--ink-muted)]/15">
            <span className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-medium">
              Payment Split
            </span>
            <div className="text-lg font-serif mt-1 font-semibold text-[var(--ink-primary)]">
              {stats?.prepaidCount ?? 0} Prepaid · {stats?.codCount ?? 0} COD
            </div>
            <div className="text-[11px] text-[var(--ink-muted)] mt-1">
              ₹50 transparent COD fee active
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--ink-muted)]/15 gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "products"
                ? "border-[var(--accent-madder)] text-[var(--ink-primary)] font-semibold"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-[var(--accent-madder)] text-[var(--ink-primary)] font-semibold"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Orders & Dispatches ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "csv"
                ? "border-[var(--accent-madder)] text-[var(--ink-primary)] font-semibold"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
            }`}
          >
            CSV Import & Export
          </button>
        </div>

        {/* TAB 1: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface-subtle)]/40 p-3 rounded-[12px] border border-[var(--ink-muted)]/15">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filter products by name, slug, or fabric..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[10px] px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--ink-primary)]"
                />
              </div>
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setAddTimeSeconds(0);
                  setTimerActive(true);
                }}
                className="bg-[var(--accent-madder)] hover:bg-[#802f39] text-white px-4 py-2 rounded-[10px] text-sm font-medium transition-colors active:scale-[0.985] flex items-center justify-center gap-2"
              >
                <span>+ Add Product</span>
                <span className="text-[11px] opacity-80">(Timed &lt; 3 min)</span>
              </button>
            </div>

            {/* Catalog Table */}
            <div className="border border-[var(--ink-muted)]/15 rounded-[12px] overflow-hidden bg-[var(--surface-canvas)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--surface-subtle)]/80 text-xs uppercase tracking-wider text-[var(--ink-muted)] border-b border-[var(--ink-muted)]/15">
                    <tr>
                      <th className="py-3 px-4">Garment / Piece</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price (₹)</th>
                      <th className="py-3 px-3">HSN / Tax</th>
                      <th className="py-3 px-4">Inventory & Quick Adjust</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ink-muted)]/10 font-sans">
                    {filteredProducts.map((p) => (
                      <tr key={p.slug} className="hover:bg-[var(--surface-subtle)]/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-[2px] bg-[var(--surface-subtle)] overflow-hidden shrink-0 border border-[var(--ink-muted)]/15">
                              {p.images[0] && (
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-[var(--ink-primary)] leading-snug">
                                {p.name}
                              </div>
                              <div className="text-xs text-[var(--ink-muted)] font-mono mt-0.5">
                                {p.slug} · {p.fabric}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 capitalize text-xs text-[var(--ink-muted)]">
                          {p.kind}
                        </td>

                        <td className="py-3 px-3 tabular-nums">
                          <div className="font-medium">₹{p.price_inr.toLocaleString("en-IN")}</div>
                          {p.mrp_inr > p.price_inr && (
                            <div className="text-xs text-[var(--ink-muted)] line-through">
                              ₹{p.mrp_inr.toLocaleString("en-IN")}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 text-xs text-[var(--ink-muted)] font-mono">
                          {p.hsn} · {p.gst_percent}%
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {Object.entries(p.stock_by_size || {}).map(([size, qty]) => (
                              <div
                                key={size}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-xs font-mono border ${
                                  qty <= 2
                                    ? "bg-[var(--accent-madder)]/10 border-[var(--accent-madder)]/40 text-[var(--accent-madder)]"
                                    : "bg-[var(--surface-subtle)] border-[var(--ink-muted)]/20 text-[var(--ink-primary)]"
                                }`}
                              >
                                <span>{size}:</span>
                                <span className="font-semibold">{qty}</span>
                                <div className="flex flex-col ml-0.5">
                                  <button
                                    onClick={() => handleStockChange(p.slug, size, qty + 1)}
                                    className="hover:text-[var(--accent-brass)] leading-none text-[9px]"
                                    title="Increase stock"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    onClick={() => handleStockChange(p.slug, size, qty - 1)}
                                    className="hover:text-[var(--accent-brass)] leading-none text-[9px]"
                                    title="Decrease stock"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/product/${p.slug}`}
                            className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)] underline decoration-[var(--ink-muted)]/40 mr-2"
                            target="_blank"
                          >
                            Preview
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: ORDERS & FULFILLMENT */}
        {activeTab === "orders" && (
          <section className="space-y-4">
            {/* Order Status Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {["all", "confirmed", "packed", "dispatched", "delivered", "cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-[10px] capitalize transition-colors border ${
                    orderFilter === st
                      ? "bg-[var(--ink-primary)] text-white border-transparent"
                      : "bg-[var(--surface-subtle)] text-[var(--ink-muted)] border-[var(--ink-muted)]/15 hover:border-[var(--ink-muted)]/40"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-sm text-[var(--ink-muted)] border border-dashed border-[var(--ink-muted)]/20 rounded-[12px]">
                  No orders found matching the filter &quot;{orderFilter}&quot;.
                </div>
              ) : (
                filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 sm:p-5 rounded-[12px] bg-[var(--surface-subtle)]/40 border border-[var(--ink-muted)]/15 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--ink-muted)]/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[var(--ink-primary)]">
                          {o.id}
                        </span>
                        <span
                          className={`text-[11px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                            o.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : o.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {o.status}
                        </span>
                        <span className="text-xs text-[var(--ink-muted)]">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-[var(--ink-primary)]">
                        Total: <span className="text-base font-serif font-semibold">₹{(o.totalAmountPaise / 100).toLocaleString("en-IN")}</span> ({o.paymentMethod.toUpperCase()})
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-[var(--ink-muted)] uppercase tracking-wider text-[10px]">Customer</div>
                        <div className="font-medium mt-0.5">{o.customer.fullName}</div>
                        <div className="font-mono text-[var(--ink-muted)]">{o.customer.phone} · {o.customer.email}</div>
                      </div>

                      <div>
                        <div className="text-[var(--ink-muted)] uppercase tracking-wider text-[10px]">Shipping Destination</div>
                        <div className="mt-0.5">{o.customer.addressLine}, {o.customer.locality}</div>
                        <div className="text-[var(--ink-muted)]">{o.customer.city}, {o.customer.state} — {o.customer.pincode}</div>
                      </div>

                      <div>
                        <div className="text-[var(--ink-muted)] uppercase tracking-wider text-[10px]">Items Ordered</div>
                        <div className="mt-0.5 space-y-0.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-[var(--ink-primary)]">
                              • {it.name} ({it.size}) × {it.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fulfillment Control Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--ink-muted)]/10 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusChange(o.id, e.target.value as OrderStatus)}
                          className="bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[8px] px-2.5 py-1.5 text-xs text-[var(--ink-primary)] focus:outline-none"
                        >
                          <option value="placed">Mark: Placed</option>
                          <option value="confirmed">Mark: Confirmed</option>
                          <option value="packed">Mark: Packed</option>
                          <option value="dispatched">Mark: Dispatched</option>
                          <option value="delivered">Mark: Delivered</option>
                          <option value="cancelled">Mark: Cancelled</option>
                        </select>

                        <input
                          type="text"
                          placeholder="AWB / Tracking #"
                          value={trackingInputs[o.id]?.trackingNumber ?? (o.trackingNumber || "")}
                          onChange={(e) =>
                            setTrackingInputs((prev) => ({
                              ...prev,
                              [o.id]: {
                                carrier: prev[o.id]?.carrier || o.carrier || "Delhivery Surface Express",
                                trackingNumber: e.target.value,
                              },
                            }))
                          }
                          className="bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[8px] px-2.5 py-1.5 text-xs font-mono w-36"
                        />

                        <button
                          onClick={() => handleOrderStatusChange(o.id, o.status)}
                          className="bg-[var(--ink-primary)] text-white px-2.5 py-1.5 rounded-[8px] hover:bg-black transition-colors"
                        >
                          Save AWB
                        </button>
                      </div>

                      {/* 1-Tap WhatsApp Customer Update Buttons */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${o.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Namaste ${o.customer.fullName}, your Eskort Creations Order ${o.id} is confirmed! Total: ₹${o.totalAmountPaise / 100}. We are preparing your order at our Jaipur atelier.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-[var(--ink-muted)]/20 hover:border-emerald-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-[8px] transition-colors"
                          title="Send WhatsApp Confirmation"
                        >
                          WA Confirm
                        </a>

                        <a
                          href={`https://wa.me/91${o.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Namaste ${o.customer.fullName}, your order ${o.id} is dispatched via ${o.carrier || "Delhivery"}. Tracking AWB: ${o.trackingNumber || "N/A"}. Track here: https://eskortcreations.com/track?orderId=${o.id}&phone=${o.customer.phone}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-[var(--ink-muted)]/20 hover:border-emerald-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-[8px] transition-colors"
                          title="Send WhatsApp Dispatch Notice"
                        >
                          WA Dispatch
                        </a>

                        {o.status !== "cancelled" && (
                          <button
                            onClick={() => handleRefund(o.id)}
                            className="text-rose-700 hover:text-rose-900 border border-rose-200 hover:bg-rose-50 px-2.5 py-1.5 rounded-[8px] transition-colors"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 3: CSV IMPORT & EXPORT */}
        {activeTab === "csv" && (
          <section className="space-y-6">
            {/* Export Section */}
            <div className="p-5 rounded-[12px] bg-[var(--surface-subtle)]/40 border border-[var(--ink-muted)]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-medium text-base text-[var(--ink-primary)]">
                  Export Canonical Catalog CSV
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-xl">
                  Download the complete live catalog from <code>brand/products.csv</code> formatted with exact specification columns.
                </p>
              </div>
              <a
                href="/api/admin/csv"
                download="products.csv"
                className="bg-[var(--ink-primary)] text-white px-4 py-2.5 rounded-[10px] text-xs font-medium text-center shrink-0 hover:bg-black transition-colors"
              >
                Download products.csv
              </a>
            </div>

            {/* Import Section */}
            <form onSubmit={handleCsvImport} className="p-5 rounded-[12px] bg-[var(--surface-subtle)]/40 border border-[var(--ink-muted)]/15 space-y-4">
              <div>
                <h3 className="font-serif font-medium text-base text-[var(--ink-primary)]">
                  Import Products with Row-by-Row Validation
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1">
                  Paste updated CSV content below. The parser rigorously enforces schema types, positive integer paise pricing, and valid JSON measurement arrays.
                </p>
              </div>

              <textarea
                rows={8}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="slug,name,kind,moment,description,price_inr,mrp_inr,hsn,gst_percent,sizes,garment_measurements_in,fabric,composition,care,print_colours,stock_by_size,images,feeding_access,country_of_origin,packer_name_address..."
                className="w-full bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[10px] p-3 text-xs font-mono leading-relaxed focus:outline-none focus:border-[var(--ink-primary)]"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-muted)]">
                  Enforces 20 statutory columns per Section 8.11 & 10
                </span>
                <button
                  type="submit"
                  disabled={csvLoading}
                  className="bg-[var(--accent-madder)] text-white px-5 py-2.5 rounded-[10px] text-xs font-medium hover:bg-[#802f39] transition-colors disabled:opacity-50"
                >
                  {csvLoading ? "Validating & Ingesting..." : "Validate & Import CSV"}
                </button>
              </div>
            </form>

            {/* Validation Report Card */}
            {csvReport && (
              <div
                className={`p-5 rounded-[12px] border ${
                  csvReport.success
                    ? "bg-emerald-50/40 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/40 border-rose-200 text-rose-900"
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-serif font-medium text-base">
                    {csvReport.success ? "✓ CSV Validation Succeeded" : "⚠ CSV Validation Warnings & Errors"}
                  </div>
                  <div className="text-xs font-mono">
                    {csvReport.importedCount} of {csvReport.totalRows} Rows Ingested
                  </div>
                </div>

                {csvReport.errors.length > 0 && (
                  <div className="border-t border-rose-200 pt-3 space-y-1.5 text-xs">
                    <div className="font-semibold text-rose-800">
                      Reported Errors ({csvReport.errors.length}):
                    </div>
                    <ul className="space-y-1 list-disc list-inside font-mono text-[11px]">
                      {csvReport.errors.map((err, idx) => (
                        <li key={idx}>
                          <strong>Row {err.row}</strong>
                          {err.column ? ` (${err.column})` : ""}: {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* MODAL: ADD PRODUCT RAPID FORM (Timed < 3 Min) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[16px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--ink-muted)]/15 pb-3">
              <div>
                <h3 className="font-serif font-medium text-lg text-[var(--ink-primary)]">
                  Add New Product to Atelier
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--ink-muted)]">
                  <span>Owner Benchmark: Under 3 Minutes</span>
                  <span>·</span>
                  <span className="font-mono text-[var(--accent-madder)] font-medium">
                    Timer: {Math.floor(addTimeSeconds / 60)}m {addTimeSeconds % 60}s
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTimerActive(false);
                }}
                className="text-lg text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);

                const priceInr = Number(fd.get("price_inr"));
                const mrpInr = Number(fd.get("mrp_inr"));
                const sizesStr = String(fd.get("sizes") || "XS,S,M,L,XL,XXL");
                const sizes = sizesStr.split(",").map((s) => s.trim());

                // Default measurements template
                const defaultMeasurements: Record<string, { bust: number; waist: number; hip: number; length: number }> = {
                  XS: { bust: 34, waist: 30, hip: 36, length: 44 },
                  S: { bust: 36, waist: 32, hip: 38, length: 44 },
                  M: { bust: 38, waist: 34, hip: 40, length: 44 },
                  L: { bust: 40, waist: 36, hip: 42, length: 44 },
                  XL: { bust: 42, waist: 38, hip: 44, length: 44 },
                  XXL: { bust: 44, waist: 40, hip: 46, length: 44 },
                };

                const stockBySize: Record<string, number> = {};
                sizes.forEach((s) => {
                  stockBySize[s] = Number(fd.get(`stock_${s}`) || 5);
                });

                const payload = {
                  name: fd.get("name"),
                  slug: fd.get("slug"),
                  kind: fd.get("kind"),
                  moment: fd.get("moment"),
                  description: fd.get("description"),
                  price_inr: priceInr,
                  mrp_inr: mrpInr,
                  price_paise: priceInr * 100,
                  mrp_paise: mrpInr * 100,
                  hsn: fd.get("hsn") || "6204",
                  gst_percent: Number(fd.get("gst_percent") || 5),
                  sizes,
                  garment_measurements_in: defaultMeasurements,
                  fabric: fd.get("fabric"),
                  composition: fd.get("composition"),
                  care: fd.get("care"),
                  print_colours: ["#943843", "#A67C38", "#3D5A80"],
                  stock_by_size: stockBySize,
                  images: [String(fd.get("image") || "/brand/products/EKC-1501-3 piece/1.jpeg")],
                  feeding_access: fd.get("feeding_access") || "none",
                  country_of_origin: "India",
                  packer_name_address: "⟦NEEDED: packer_name_address⟧",
                };

                try {
                  const res = await fetch("/api/admin/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) {
                    showNotice(`Product "${payload.name}" saved in ${addTimeSeconds} seconds!`);
                    setShowAddModal(false);
                    setTimerActive(false);
                    loadData();
                  } else {
                    const err = await res.json();
                    showNotice(`Error: ${err.error}`);
                  }
                } catch {
                  showNotice("Network error adding product");
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Product Title</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Handcrafted Indigo Cambric Kurta"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                    onChange={(e) => {
                      const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                      if (slugInput && !slugInput.value) {
                        slugInput.value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Slug (URL)</label>
                  <input
                    name="slug"
                    required
                    placeholder="e.g. indigo-cambric-kurta"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Category (Kind)</label>
                  <select
                    name="kind"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                  >
                    <option value="garment">Garment</option>
                    <option value="fabric">Fabric</option>
                    <option value="baby">Baby Garment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Moment</label>
                  <input
                    name="moment"
                    defaultValue="slow mornings"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Selling Price (₹)</label>
                  <input
                    name="price_inr"
                    type="number"
                    required
                    defaultValue={1499}
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">MRP (₹)</label>
                  <input
                    name="mrp_inr"
                    type="number"
                    required
                    defaultValue={2499}
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--ink-muted)] mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue="Tailored in Jaipur with breathable natural cambric cotton. Features a 1.5 inch tailoring seam margin for a customized fit."
                  className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Fabric & Weave</label>
                  <input
                    name="fabric"
                    defaultValue="Pure Cotton Cambric 60s"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Composition</label>
                  <input
                    name="composition"
                    defaultValue="100% Breathable Cotton"
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--ink-muted)] mb-1">Care Advice</label>
                  <input
                    name="care"
                    defaultValue="Gentle machine wash with like colours. Shade dry."
                    className="w-full bg-[var(--surface-subtle)] border border-[var(--ink-muted)]/20 rounded-[8px] p-2 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sizes & Stock */}
              <div>
                <label className="block text-[var(--ink-muted)] mb-1">Initial Stock by Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <div key={sz} className="p-2 bg-[var(--surface-subtle)] rounded-[8px] border border-[var(--ink-muted)]/15">
                      <div className="text-[10px] text-[var(--ink-muted)] font-mono">{sz}</div>
                      <input
                        name={`stock_${sz}`}
                        type="number"
                        defaultValue={4}
                        className="w-full bg-[var(--surface-canvas)] border border-[var(--ink-muted)]/20 rounded-[4px] p-1 font-mono text-xs mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--ink-muted)]/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-[8px] text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--accent-madder)] text-white px-5 py-2 rounded-[8px] font-medium hover:bg-[#802f39]"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
