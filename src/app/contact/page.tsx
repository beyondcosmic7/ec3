"use client";

import React, { useState } from "react";
import { brandConfig } from "@/../brand.config";
import { Button } from "@/components/ui/button";
import { WhatsappLogo, Phone, EnvelopeSimple, MapPin } from "@phosphor-icons/react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col bg-[var(--canvas)] min-h-screen">
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20">
        <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
          Customer Concierge &amp; Workshop Desk
        </span>
        <h1 className="text-display-title font-display text-[var(--ink-primary)] mt-1 mb-4">
          Speak with our Jaipur atelier
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-xl mb-12">
          We answer calls and WhatsApp queries directly from our workroom.
          Whether you need help with sizing in inches or tracking a parcel, we are here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Direct Channels */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* WhatsApp Block */}
            <div className="p-5 rounded-[var(--radius-control)] bg-[#25D366]/10 border border-[#25D366]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <WhatsappLogo size={20} weight="regular" className="text-[#25D366]" />
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  WhatsApp Concierge (Fastest Response)
                </span>
              </div>
              <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                Send us photos, ask about specific fabric weaves, or get sizing advice.
              </p>
              <a
                href={brandConfig.contact.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs font-semibold text-[#128C7E] underline"
              >
                Chat on WhatsApp (+91 99291 91655)
              </a>
            </div>

            {/* Direct Phone Lines */}
            <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[var(--ink-primary)]">
                <Phone size={18} weight="regular" className="text-[var(--accent-madder)]" />
                <span>Direct Voice Support</span>
              </div>
              <div className="flex flex-col gap-1.5 pl-6">
                <a
                  href={`tel:${brandConfig.contact.voicePhones[0].replace(/\s+/g, "")}`}
                  className="text-[var(--ink-primary)] hover:underline"
                >
                  Line 1: {brandConfig.contact.voicePhones[0]}
                </a>
                <a
                  href={`tel:${brandConfig.contact.voicePhones[1].replace(/\s+/g, "")}`}
                  className="text-[var(--ink-primary)] hover:underline"
                >
                  Line 2: {brandConfig.contact.voicePhones[1]}
                </a>
                <span className="text-[10px] text-[var(--ink-muted)] mt-1">
                  Operating Hours: {brandConfig.contact.supportHours}
                </span>
              </div>
            </div>

            {/* Email & Grievance */}
            <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[var(--ink-primary)]">
                <EnvelopeSimple size={18} weight="regular" className="text-[var(--accent-madder)]" />
                <span>Email &amp; Grievances</span>
              </div>
              <div className="pl-6 flex flex-col gap-1">
                <a
                  href={`mailto:${brandConfig.contact.email}`}
                  className="text-[var(--ink-primary)] hover:underline"
                >
                  {brandConfig.contact.email}
                </a>
                <span className="text-[10px] text-[var(--ink-muted)] mt-1">
                  Grievance Officer: {brandConfig.legal.grievanceOfficer.name} · {brandConfig.legal.grievanceOfficer.email}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[var(--ink-primary)]">
                <MapPin size={18} weight="regular" className="text-[var(--accent-madder)]" />
                <span>Workshop Location</span>
              </div>
              <p className="pl-6 text-[var(--ink-secondary)]">
                {brandConfig.legal.registeredOfficeAddress}
              </p>
            </div>
          </div>


          {/* Contact Enquiry Form */}
          <div className="md:col-span-7 bg-[var(--surface-card)] p-6 sm:p-8 rounded-[var(--radius-control)] border border-[var(--border-strong)] shadow-xs">
            <h2 className="text-base font-display font-semibold text-[var(--ink-primary)] mb-2">
              Send us a direct message
            </h2>
            <p className="text-xs text-[var(--ink-muted)] mb-6">
              Our workshop team reviews all inquiries during active business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-[var(--surface-subtle)] rounded-[var(--radius-control)] text-xs text-[var(--ink-primary)] flex flex-col gap-3">
                <span className="font-semibold text-sm">Message received.</span>
                <p>
                  Thank you for writing to Eskort Creations. Our customer team will review your note and respond via email or WhatsApp within one business day.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="self-start mt-2"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                <div>
                  <label htmlFor="contact-name" className="font-semibold block mb-1 text-[var(--ink-primary)]">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="font-semibold block mb-1 text-[var(--ink-primary)]">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="font-semibold block mb-1 text-[var(--ink-primary)]">
                    Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  >
                    <option value="Sizing Query">Sizing &amp; Measurement Advice</option>
                    <option value="Order Tracking">Order Tracking &amp; Delivery</option>
                    <option value="Fabric Customization">Fabric by the Metre / Wholesale</option>
                    <option value="Exchange or Return">Exchange or Return Request</option>
                    <option value="General Inquiry">General Atelier Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="font-semibold block mb-1 text-[var(--ink-primary)]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="mt-2">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
