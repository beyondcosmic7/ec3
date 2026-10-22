"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { cartStore } from "@/lib/cart-store";
import { CustomerDetails, GiftOptions, PaymentMethod } from "@/lib/types";
import { lookupPincode, PincodeInfo } from "@/lib/pincodes";
import { brandConfig } from "@/../brand.config";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Money,
  Gift,
  CaretDown,
  CaretUp,
  Lock,
} from "@phosphor-icons/react";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (resp: unknown) => void) => void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields (7 required maximum per Section 8.7)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");

  // Pincode auto-lookup state
  const [pinInfo, setPinInfo] = useState<PincodeInfo | null>(null);

  // Collapsed Gift Options
  const [showGift, setShowGift] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  // DPDP Act Consent Checkbox (explicit, unticked by default)
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  // Field error messages
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Auto-fill City & State from 6-digit Pincode (Section 8.7: "pincode first, city and state auto-filled")
  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    setPincode(clean);

    if (fieldErrors.pincode) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.pincode;
        return next;
      });
    }

    if (clean.length === 6) {
      const info = lookupPincode(clean);
      setPinInfo(info);
      if (!info.valid) {
        setFieldErrors((prev) => ({ ...prev, pincode: "That pincode needs 6 digits." }));
      }
    } else {
      setPinInfo(null);
    }
  };

  const subtotalPaise = cartStore.getSubtotalPaise();
  const subtotalInr = Math.round(subtotalPaise / 100);
  const itemCount = cartStore.getItemCount();

  // Transparent COD Surcharge (Section 9.4)
  const codFeePaise =
    paymentMethod === "cod" && brandConfig.commerce.cod.enabled
      ? brandConfig.commerce.cod.feePaise
      : 0;
  const codFeeInr = Math.round(codFeePaise / 100);
  const totalAmountInr = subtotalInr + codFeeInr;

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address for your GST receipt.";
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      errors.pincode = "That pincode needs 6 digits.";
    }
    if (!addressLine.trim() || addressLine.trim().length < 5) {
      errors.addressLine = "Please enter house number, building and street name.";
    }
    if (!locality.trim() || locality.trim().length < 2) {
      errors.locality = "Please enter area or landmark.";
    }

    if (paymentMethod === "cod") {
      if (subtotalPaise < brandConfig.commerce.cod.minOrderPaise) {
        errors.payment = `COD minimum order is ₹${brandConfig.commerce.cod.minOrderPaise / 100}.`;
      }
      if (subtotalPaise > brandConfig.commerce.cod.maxOrderPaise) {
        errors.payment = `COD maximum order is ₹${brandConfig.commerce.cod.maxOrderPaise / 100}. Please choose online payment.`;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Dynamically load Razorpay SDK only at payment execution (Section 7.6: "Razorpay script loads only at the payment step")
  const loadRazorpaySdk = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Submit Handler
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const customer: CustomerDetails = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        pincode: pincode.trim(),
        addressLine: addressLine.trim(),
        locality: locality.trim(),
        city: pinInfo?.city || "Jaipur",
        state: pinInfo?.state || "Rajasthan",
        whatsappConsent,
      };

      const gift: GiftOptions = {
        isGift,
        recipientName: isGift ? recipientName.trim() : undefined,
        giftMessage: isGift ? giftMessage.trim() : undefined,
        hidePriceOnSlip: true,
        wrap: isGift,
      };

      // Step 1: 10-Minute Inventory Reservation (Section 9.3)
      const reserveRes = await fetch("/api/checkout/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, size: i.size, quantity: i.quantity })),
        }),
      });

      const reserveData = await reserveRes.json();
      if (!reserveRes.ok || !reserveData.success) {
        throw new Error(reserveData.error || "Some items are no longer available in the requested size.");
      }

      const reservationId = reserveData.reservationId;

      // Handle Cash on Delivery
      if (paymentMethod === "cod") {
        const codRes = await fetch("/api/checkout/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customer,
            gift,
            reservationId,
          }),
        });

        const codData = await codRes.json();
        if (!codRes.ok || !codData.success) {
          throw new Error(codData.error || "Failed to place COD order.");
        }

        cartStore.clearCart();
        router.push(`/order/${codData.orderId}?cod=true`);
        return;
      }

      // Handle Online Prepaid Payment via Razorpay (Section 9.2)
      const orderRes = await fetch("/api/checkout/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          pincode: customer.pincode,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment gateway.");
      }

      const sdkLoaded = await loadRazorpaySdk();

      // If Razorpay SDK is blocked or in mock testing environment, simulate successful verification
      if (!sdkLoaded || typeof window.Razorpay === "undefined" || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        const verifyRes = await fetch("/api/checkout/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderData.razorpayOrder.id,
            razorpayPaymentId: `pay_${Date.now()}`,
            razorpaySignature: "mock_valid_signature_for_test",
            items,
            customer,
            gift,
            reservationId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || "Payment verification failed.");
        }

        cartStore.clearCart();
        router.push(`/order/${verifyData.orderId}`);
        return;
      }

      // Standard Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: "INR",
        name: brandConfig.name,
        description: `Bespoke Ethnic Wear (${itemCount} items)`,
        image: brandConfig.assets.emblem,
        order_id: orderData.razorpayOrder.id,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: "#943843", // Madder Rose
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items,
                customer,
                gift,
                reservationId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature mismatch.");
            }

            cartStore.clearCart();
            router.push(`/order/${verifyData.orderId}`);
          } catch (err: unknown) {
            setErrorMessage((err as Error).message || "Verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Release inventory reservation if dismissed
            fetch(`/api/checkout/reserve?reservationId=${reservationId}`, { method: "DELETE" });
            setLoading(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--canvas)]" />;
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[70vh] bg-[var(--canvas)] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-xl font-display text-[var(--ink-primary)] mb-2">
            Nothing in your cart to checkout.
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mb-6">
            Please select your tailored garments before proceeding.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--canvas)] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 mb-2 text-xs text-[var(--ink-muted)]">
          <Link href="/shop" className="hover:underline">Shop</Link>
          <span>/</span>
          <Link href="/cart" className="hover:underline">Cart</Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">Checkout</span>
          <span>·</span>
          <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
        </div>

        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-display-title font-display text-[var(--ink-primary)]">
            Guest Checkout
          </h1>
          <span className="text-xs text-[var(--ink-muted)] flex items-center gap-1">
            <Lock size={13} className="text-[var(--accent-madder)]" />
            256-bit Encrypted · Zero Hidden Drip Fees
          </span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--accent-madder)] text-xs text-[var(--accent-madder)] font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Main Checkout Form (7 Fields) */}
          <form onSubmit={handleProceedToPayment} className="lg:col-span-7 flex flex-col gap-8">
            {/* Step 1: Contact Details */}
            <div className="p-6 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span className="text-xs uppercase font-semibold tracking-wider text-[var(--accent-brass)]">
                  1. Contact Information
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">Guest Order</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-medium text-[var(--ink-primary)]">
                    Mobile Number <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    maxLength={10}
                    placeholder="10-digit phone (e.g. 9829277894)"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
                    }}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.phone && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-[var(--ink-primary)]">
                    Email Address <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    placeholder="For GST invoice PDF"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
                    }}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.email && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* DPDP Act Compliant Separate Unticked Consent (Section 9.7) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-[var(--ink-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappConsent}
                    onChange={(e) => setWhatsappConsent(e.target.checked)}
                    className="mt-0.5 rounded-[3px] border-[var(--border-strong)] text-[var(--accent-madder)] focus:ring-0"
                  />
                  <span>
                    Send courier tracking link &amp; delivery updates via WhatsApp (Optional, you may opt out anytime).
                  </span>
                </label>
              </div>
            </div>

            {/* Step 2: Shipping Address (Pincode-First) */}
            <div className="p-6 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span className="text-xs uppercase font-semibold tracking-wider text-[var(--accent-brass)]">
                  2. Delivery Address (India Only)
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">Jaipur Workshop Dispatch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="fullName" className="text-xs font-medium text-[var(--ink-primary)]">
                    Full Name <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    placeholder="Recipient's legal name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: "" }));
                    }}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.fullName && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.fullName}
                    </span>
                  )}
                </div>

                {/* PIN Code Field */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pincode" className="text-xs font-medium text-[var(--ink-primary)]">
                    PIN Code <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    enterKeyHint="next"
                    maxLength={6}
                    placeholder="6-digit PIN code"
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.pincode && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.pincode}
                    </span>
                  )}
                  {pinInfo?.valid && (
                    <span className="text-[11px] text-[var(--accent-brass)] font-medium">
                      ✓ {pinInfo.city}, {pinInfo.state} ({pinInfo.etaDays})
                    </span>
                  )}
                </div>

                {/* Locality Field */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="locality" className="text-xs font-medium text-[var(--ink-primary)]">
                    Locality / Sector / Area <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="locality"
                    name="locality"
                    type="text"
                    autoComplete="address-level3"
                    enterKeyHint="next"
                    placeholder="e.g. C-Scheme, Indiranagar"
                    value={locality}
                    onChange={(e) => {
                      setLocality(e.target.value);
                      if (fieldErrors.locality) setFieldErrors((p) => ({ ...p, locality: "" }));
                    }}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.locality && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.locality}
                    </span>
                  )}
                </div>

                {/* Street Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="addressLine" className="text-xs font-medium text-[var(--ink-primary)]">
                    Flat / House No. &amp; Street <span className="text-[var(--accent-madder)]">*</span>
                  </label>
                  <input
                    id="addressLine"
                    name="addressLine"
                    type="text"
                    autoComplete="street-address"
                    enterKeyHint="next"
                    placeholder="House/flat number, road, nearest landmark"
                    value={addressLine}
                    onChange={(e) => {
                      setAddressLine(e.target.value);
                      if (fieldErrors.addressLine) setFieldErrors((p) => ({ ...p, addressLine: "" }));
                    }}
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  {fieldErrors.addressLine && (
                    <span className="text-[11px] text-[var(--accent-madder)] font-medium">
                      {fieldErrors.addressLine}
                    </span>
                  )}
                </div>

                {/* City & State (Auto-filled read-only) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[var(--ink-secondary)]">City</label>
                  <input
                    type="text"
                    readOnly
                    value={pinInfo?.city || ""}
                    placeholder="Auto-filled from PIN"
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--ink-primary)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[var(--ink-secondary)]">State</label>
                  <input
                    type="text"
                    readOnly
                    value={pinInfo?.state || ""}
                    placeholder="Auto-filled from PIN"
                    className="px-3.5 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--ink-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Collapsible Gift Presentation (Section 8.7) */}
            <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowGift(!showGift)}
                className="flex items-center justify-between text-xs font-semibold text-[var(--ink-primary)] hover:text-[var(--accent-madder)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-[var(--accent-brass)]" />
                  <span>Send as a Gift (Complimentary Card &amp; Textile Wrap)</span>
                </div>
                {showGift ? <CaretUp size={14} /> : <CaretDown size={14} />}
              </button>

              {showGift && (
                <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-3.5 animate-fadeIn">
                  <label className="flex items-center gap-2 text-xs text-[var(--ink-primary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="rounded-[3px] border-[var(--border-strong)] text-[var(--accent-madder)]"
                    />
                    <span>Yes, this order is a gift for someone special</span>
                  </label>

                  {isGift && (
                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-[var(--ink-secondary)]">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Priyanshi Sharma"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-medium text-[var(--ink-secondary)]">
                            Personal Note (Handwritten on cotton card)
                          </label>
                          <span className="text-[10px] text-[var(--ink-muted)]">
                            {giftMessage.length}/200
                          </span>
                        </div>
                        <textarea
                          maxLength={200}
                          rows={3}
                          placeholder="Wishing you calm comfort and joy..."
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] resize-none"
                        />
                      </div>

                      <span className="text-[11px] text-[var(--accent-brass)] font-medium">
                        ✓ Price tag &amp; invoice will be discreetly omitted from parcel interior.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 4: Payment Method Selection */}
            <div className="p-6 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <span className="text-xs uppercase font-semibold tracking-wider text-[var(--accent-brass)]">
                  3. Select Payment Method
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">No Drip Pricing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Online Payment (Prepaid via Razorpay) */}
                <label
                  className={`p-4 rounded-[var(--radius-control)] border cursor-pointer flex flex-col justify-between gap-3 transition-colors ${
                    paymentMethod === "online"
                      ? "border-[var(--accent-madder)] bg-[var(--surface-subtle)] shadow-xs"
                      : "border-[var(--border-subtle)] bg-[var(--canvas)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="text-[var(--accent-madder)] focus:ring-0"
                      />
                      <span className="text-xs font-semibold text-[var(--ink-primary)]">
                        Prepaid Online
                      </span>
                    </div>
                    <CreditCard size={18} className="text-[var(--accent-madder)]" />
                  </div>
                  <span className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                    Instant dispatch. Pay via Google Pay, PhonePe, UPI QR, Cards &amp; Netbanking.
                  </span>
                </label>

                {/* Cash on Delivery (COD) */}
                <label
                  className={`p-4 rounded-[var(--radius-control)] border cursor-pointer flex flex-col justify-between gap-3 transition-colors ${
                    paymentMethod === "cod"
                      ? "border-[var(--accent-madder)] bg-[var(--surface-subtle)] shadow-xs"
                      : "border-[var(--border-subtle)] bg-[var(--canvas)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-[var(--accent-madder)] focus:ring-0"
                      />
                      <span className="text-xs font-semibold text-[var(--ink-primary)]">
                        Cash on Delivery
                      </span>
                    </div>
                    <Money size={18} className="text-[var(--accent-brass)]" />
                  </div>
                  <span className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                    Pay cash upon delivery. Transparent <strong className="text-[var(--ink-primary)]">₹50 handling fee</strong> applies.
                  </span>
                </label>
              </div>

              {fieldErrors.payment && (
                <span className="text-xs text-[var(--accent-madder)] font-medium">
                  {fieldErrors.payment}
                </span>
              )}
            </div>

            {/* Mobile Submit Button (Visible only on small screens) */}
            <div className="lg:hidden">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Reserving pieces &amp; connecting...</span>
                ) : (
                  <span>
                    {paymentMethod === "cod" ? "Place COD Order" : "Proceed to Pay"} — ₹{totalAmountInr}
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Sticky Desktop Order Summary (Section 8.7: "Sticky summary on desktop") */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-sm font-semibold text-[var(--ink-primary)]">
                  Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h2>
                <Link href="/cart" className="text-xs text-[var(--accent-madder)] hover:underline">
                  Edit
                </Link>
              </div>

              {/* Line Items List */}
              <div className="flex flex-col gap-3 divide-y divide-[var(--border-subtle)] max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="w-12 h-16 relative shrink-0 rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
                      <Media
                        src={item.image}
                        alt={item.name}
                        fill
                        aspectRatio="auto"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-[var(--ink-primary)] truncate block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[var(--ink-muted)] block">
                        Size: {item.size} · Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="text-xs font-semibold tabular-numbers text-[var(--ink-primary)]">
                      ₹{(item.price_paise * item.quantity) / 100}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation (Taxes & Fees) */}
              <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)] text-xs">
                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>Items Subtotal</span>
                  <span className="tabular-numbers font-medium text-[var(--ink-primary)]">
                    ₹{subtotalInr}
                  </span>
                </div>

                <div className="flex justify-between text-[var(--ink-secondary)]">
                  <span>Tracked Surface Courier</span>
                  <span className="text-[var(--accent-brass)] font-semibold">FREE</span>
                </div>

                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-[var(--ink-primary)] animate-fadeIn">
                    <span>Cash on Delivery Handling</span>
                    <span className="tabular-numbers font-medium">₹{codFeeInr}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--ink-muted)] text-[11px]">
                  <span>Statutory GST (CGST/SGST/IGST)</span>
                  <span>Included in prices</span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[var(--ink-primary)] pt-3 border-t border-[var(--border-subtle)]">
                  <span>Grand Total</span>
                  <span className="tabular-numbers">₹{totalAmountInr}</span>
                </div>
              </div>

              {/* Desktop Pay Button */}
              <div className="hidden lg:block pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  disabled={loading}
                  onClick={handleProceedToPayment}
                  className="w-full py-4 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Reserving pieces &amp; connecting...</span>
                  ) : (
                    <span>
                      {paymentMethod === "cod" ? "Place COD Order" : "Proceed to Pay"} — ₹{totalAmountInr}
                    </span>
                  )}
                </Button>
              </div>

              <span className="text-[10px] text-center text-[var(--ink-faint)] leading-normal">
                By placing your order, you agree to Eskort Creations&apos; Terms of Service, Privacy Policy, and 7-day garment exchange guarantee.
              </span>
            </div>

            {/* Statutory Guarantees Block */}
            <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-3 text-xs text-[var(--ink-secondary)]">
              <div className="flex items-center gap-2.5">
                <Truck size={17} className="text-[var(--accent-madder)] shrink-0" />
                <span>
                  {pinInfo?.valid
                    ? `Estimated arrival in ${pinInfo.etaDays} to ${pinInfo.city}.`
                    : "Fast tracked courier dispatch from Jaipur workshop."}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={17} className="text-[var(--accent-brass)] shrink-0" />
                <span>Legal Metrology compliant. Complete GST tax invoice issued.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
