import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrCreateOrder, generateGstInvoice } from "@/server/commerce";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { brandConfig } from "@/../brand.config";
import {
  CheckCircle,
  WhatsappLogo,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cod?: string }>;
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { cod } = await searchParams;

  const order = getOrCreateOrder(id);
  if (!order) {
    notFound();
  }

  const invoice = generateGstInvoice(order);

  // Post-order WhatsApp confirmation URL (Section 8.8 & 9.4)
  const whatsappConfirmText = [
    `Namaste Eskort Creations, I am confirming Order ${order.id}.`,
    `• Total: ₹${order.totalAmountPaise / 100} (${order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid Online"})`,
    `• Delivery to: ${order.customer.fullName}, ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})`,
    `Please share tracking updates when dispatched.`,
  ].join("\n");

  const whatsappConfirmUrl = `https://wa.me/919929191655?text=${encodeURIComponent(
    whatsappConfirmText
  )}`;

  return (
    <div className="w-full min-h-screen bg-[var(--canvas)] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Status Header */}
        <div className="p-6 sm:p-8 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-card)] border border-[var(--border-strong)] flex items-center justify-center shrink-0 text-[var(--accent-madder)]">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-[var(--accent-brass)]">
                  Order Received &amp; Confirmed
                </span>
                <span className="text-[var(--ink-faint)]">·</span>
                <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-[var(--ink-primary)]">
                Thank you, {order.customer.fullName.split(" ")[0]}
              </h1>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                Order reference: <strong className="font-mono text-[var(--ink-primary)]">{order.id}</strong>
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-[var(--ink-muted)] block">Estimated Delivery</span>
            <span className="text-base font-semibold text-[var(--ink-primary)] block">
              {order.estimatedDeliveryDate}
            </span>
            <span className="text-[11px] text-[var(--accent-brass)] font-medium block">
              via {order.carrier}
            </span>
          </div>
        </div>

        {/* WhatsApp Immediate Action Banner */}
        <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <WhatsappLogo size={22} weight="regular" className="text-[#25D366]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[var(--ink-primary)] block">
                Stay updated on WhatsApp
              </span>
              <span className="text-[11px] text-[var(--ink-muted)] block">
                {cod === "true"
                  ? "Confirm your COD dispatch with the Jaipur workshop in one tap."
                  : "Receive live courier dispatch and out-for-delivery alerts."}
              </span>
            </div>
          </div>

          <a
            href={whatsappConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0"
          >
            <Button variant="primary" size="md" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <WhatsappLogo size={16} />
              <span>Confirm on WhatsApp</span>
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
          {/* Purchased Items List */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6">
              <h2 className="text-sm font-semibold text-[var(--ink-primary)] pb-3 border-b border-[var(--border-subtle)] mb-4">
                Items Tailored &amp; Packed
              </h2>

              <div className="flex flex-col gap-4 divide-y divide-[var(--border-subtle)]">
                {order.items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <div className="w-14 h-18 relative shrink-0 rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
                      <Media
                        src={item.image}
                        alt={item.name}
                        fill
                        aspectRatio="auto"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-xs font-semibold text-[var(--ink-primary)] hover:underline block truncate"
                      >
                        {item.name}
                      </Link>
                      <div className="text-[11px] text-[var(--ink-muted)] mt-0.5">
                        Size: <span className="font-mono text-[var(--ink-primary)]">{item.size}</span> · Qty: {item.quantity} · HSN: {item.hsn}
                      </div>
                    </div>
                    <span className="text-xs font-semibold tabular-numbers text-[var(--ink-primary)]">
                      ₹{item.totalPaise / 100}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Tracking Info */}
            <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-[var(--ink-primary)] pb-2 border-b border-[var(--border-subtle)]">
                Delivery Details
              </h3>
              <div className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                <p className="font-semibold text-[var(--ink-primary)]">{order.customer.fullName}</p>
                <p>{order.customer.addressLine}, {order.customer.locality}</p>
                <p>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
                <p className="mt-1 font-mono">Mobile: +91 {order.customer.phone}</p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--ink-muted)]">Courier Air Waybill:</span>
                <span className="font-mono font-medium text-[var(--ink-primary)]">{order.trackingNumber}</span>
              </div>
            </div>
          </div>

          {/* Pricing & GST Tax Breakdown */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 shadow-xs flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-[var(--ink-primary)] pb-3 border-b border-[var(--border-subtle)]">
                Payment &amp; Tax Summary
              </h3>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>Subtotal</span>
                  <span className="tabular-numbers font-medium text-[var(--ink-primary)]">
                    ₹{order.subtotalPaise / 100}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>Tracked Courier Shipping</span>
                  <span className="text-[var(--accent-brass)] font-semibold">FREE</span>
                </div>
                {order.codFeePaise > 0 && (
                  <div className="flex justify-between text-[var(--ink-primary)]">
                    <span>COD Handling Fee</span>
                    <span className="tabular-numbers font-medium">₹{order.codFeePaise / 100}</span>
                  </div>
                )}

                {/* Statutory Tax Split (Section 9.1) */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1.5 text-[11px] text-[var(--ink-muted)]">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span className="font-mono">₹{order.taxableAmountPaise / 100}</span>
                  </div>
                  {order.isInterstate ? (
                    <div className="flex justify-between">
                      <span>IGST (5% Inter-state):</span>
                      <span className="font-mono">₹{order.igstPaise / 100}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>CGST (2.5% Rajasthan):</span>
                        <span className="font-mono">₹{order.cgstPaise / 100}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST (2.5% Rajasthan):</span>
                        <span className="font-mono">₹{order.sgstPaise / 100}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-medium text-[var(--ink-secondary)]">
                    <span>Total GST included:</span>
                    <span className="font-mono">₹{order.totalTaxPaise / 100}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-semibold text-[var(--ink-primary)] pt-3 border-t border-[var(--border-subtle)]">
                  <span>Total {order.paymentMethod === "cod" ? "Due on Delivery" : "Paid"}</span>
                  <span className="tabular-numbers">₹{order.totalAmountPaise / 100}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-[var(--ink-muted)] block">
                  Method: <strong className="text-[var(--ink-primary)]">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid Online (Razorpay)"}</strong>
                </span>
                <span className="text-[11px] text-[var(--ink-muted)] block">
                  Status: <span className="text-[var(--accent-brass)] font-semibold uppercase">{order.status}</span>
                </span>
              </div>
            </div>

            {/* Quick Track Link */}
            <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--ink-primary)]">Track Your Package</span>
              <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                You can track this shipment anytime using your Order ID and registered phone number.
              </p>
              <Link
                href={`/track?orderId=${order.id}&phone=${order.customer.phone}`}
                className="text-xs font-semibold text-[var(--accent-madder)] hover:underline flex items-center gap-1 mt-1"
              >
                <span>Go to Live Tracking</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Statutory GST Tax Invoice (Section 9.1 & Legal Metrology) */}
        <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 sm:p-8 overflow-hidden shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <Image
                src={brandConfig.assets.emblem}
                alt=""
                width={44}
                height={44}
                unoptimized
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Image
                    src={brandConfig.assets.textLogo}
                    alt={brandConfig.name}
                    width={200}
                    height={80}
                    unoptimized
                    className="h-8 sm:h-10 w-auto object-contain brand-text-logo shrink-0"
                  />
                  <span className="text-[var(--ink-faint)]">·</span>
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-[var(--ink-secondary)]">
                    Rule 6 Tax Invoice
                  </span>
                </div>
                <h2 className="text-base font-display text-[var(--ink-primary)]">
                  Invoice #{invoice.invoiceNumber}
                </h2>
              </div>
            </div>
            <div className="sm:text-right text-xs text-[var(--ink-muted)]">
              <span>Date: {invoice.invoiceDate}</span>
              <span className="block">Place of Supply: {order.customer.state}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[var(--border-subtle)] text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                Supplier (Seller)
              </span>
              <strong className="text-[var(--ink-primary)] block">{invoice.supplier.name}</strong>
              <span className="text-[var(--ink-secondary)] block">{invoice.supplier.address}</span>
              <span className="text-[var(--ink-secondary)] block font-mono">GSTIN: {invoice.supplier.gstin}</span>
              <span className="text-[var(--ink-secondary)] block">{invoice.supplier.state}</span>
              <span className="text-[var(--ink-secondary)] block">Contact: {invoice.supplier.phone}</span>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                Recipient (Billed &amp; Shipped To)
              </span>
              <strong className="text-[var(--ink-primary)] block">{invoice.buyer.name}</strong>
              <span className="text-[var(--ink-secondary)] block">{invoice.buyer.address}</span>
              <span className="text-[var(--ink-secondary)] block">{invoice.buyer.city}, {invoice.buyer.state} — {invoice.buyer.pincode}</span>
              <span className="text-[var(--ink-secondary)] block font-mono">Phone: +91 {invoice.buyer.phone}</span>
              <span className="text-[var(--ink-secondary)] block">Email: {invoice.buyer.email}</span>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto py-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--ink-muted)]">
                  <th className="py-2 pr-2 font-medium">#</th>
                  <th className="py-2 pr-4 font-medium">Item Description</th>
                  <th className="py-2 pr-4 font-medium">Size</th>
                  <th className="py-2 pr-4 font-medium">HSN</th>
                  <th className="py-2 pr-4 font-medium text-right">Rate</th>
                  <th className="py-2 pr-4 font-medium text-center">Qty</th>
                  <th className="py-2 font-medium text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--ink-secondary)]">
                {invoice.items.map((item) => (
                  <tr key={item.sn}>
                    <td className="py-2.5 pr-2 font-mono">{item.sn}</td>
                    <td className="py-2.5 pr-4 font-medium text-[var(--ink-primary)]">{item.description}</td>
                    <td className="py-2.5 pr-4 font-mono">{item.size}</td>
                    <td className="py-2.5 pr-4 font-mono">{item.hsn}</td>
                    <td className="py-2.5 pr-4 text-right tabular-numbers">₹{item.unitPriceInr}</td>
                    <td className="py-2.5 pr-4 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-medium text-[var(--ink-primary)] tabular-numbers">₹{item.totalInr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-[var(--border-subtle)] text-xs">
            <div className="text-[10px] text-[var(--ink-muted)] max-w-sm leading-relaxed">
              This is a computer-generated tax invoice issued under the Goods and Services Tax Rules, 2017. All values are in Indian Rupees (INR).
            </div>
            <div className="flex flex-col gap-1 sm:text-right w-full sm:w-auto">
              <span className="text-[var(--ink-secondary)]">Taxable Amount: ₹{invoice.summary.taxableAmountInr}</span>
              <span className="text-[var(--ink-secondary)]">Total GST (5%): ₹{invoice.summary.totalTaxInr}</span>
              <span className="text-sm font-semibold text-[var(--ink-primary)] pt-1 border-t border-[var(--border-subtle)]">
                Invoice Total: ₹{invoice.summary.grandTotalInr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
