/**
 * Eskort Creations — Atelier Brand Configuration & Feature Flags
 * Section 8.1 of BUILD_PROMPT.md
 */

export interface BrandConfig {
  name: string;
  categoryName: string;
  tagline: string;
  dnaStatement: string;
  assets: {
    logo: string;
    textLogo: string;
    emblem: string;
  };
  contact: {
    voicePhones: string[];
    hours?: string;
    phones?: { display: string; tel: string }[];
    whatsapp: {
      number: string;
      displayNumber: string;
      chatUrl: string;
      createAskUrl: (productName: string, slug: string, size?: string) => string;
    };
    email: string;
    supportHours: string;
  };
  legal: {
    registeredBusinessName: string;
    businessName?: string;
    registeredOfficeAddress: string;
    registeredAddress?: string;
    gstin: string;
    grievanceOfficer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  };
  commerce: {
    currency: string;
    currencySymbol: string;
    locale: string;
    defaultGstPercent: number;
    cod: {
      enabled: boolean;
      feePaise: number;
      maxOrderPaise: number;
      minOrderPaise: number;
    };
  };
  featureFlags: {
    fabricByMetre: boolean;
    wholesale: boolean;
    nightTheme: boolean;
    giftFinder: boolean;
    customerReviews: boolean;
  };
  features?: {
    fabricByMetre: boolean;
    wholesale: boolean;
    nightTheme: boolean;
    giftFinder: boolean;
    customerReviews: boolean;
  };
  social: {
    instagram: string;
    facebook: string;
  };
}


export const brandConfig: BrandConfig = {
  name: "Eskort Creations",
  categoryName: "Women's Ethnic & Fusion Wear",
  tagline: "Unrushed Cotton. Tailored in Jaipur.",
  dnaStatement:
    "We are the only Indian women's wear atelier that pairs genuine fabric truth and measurement precision with calm, unhurried digital craftsmanship for women who value honesty over hype.",

  assets: {
    logo: "/brand/assets/text-logo.png",
    textLogo: "/brand/assets/text-logo.png",
    emblem: "/brand/assets/emblem.png",
  },

  contact: {
    voicePhones: ["+91 75809 01212", "+91 98292 77894"],
    email: "eskortcreations@gmail.com",
    supportHours: "⟦NEEDED: customer_care_hours⟧",

    get hours() {
      return this.supportHours;
    },
    get phones() {
      return this.voicePhones.map((num) => ({
        display: num,
        tel: `tel:${num.replace(/\s+/g, "")}`,
      }));
    },
    whatsapp: {
      number: "+91 99291 91655",
      displayNumber: "+91 99291 91655",
      chatUrl: "https://wa.me/919929191655",
      createAskUrl(productName: string, slug: string, size?: string) {
        const text = `Namaste Eskort Creations, I am inquiring about "${productName}" (Size: ${size || "Standard"}). Product link: https://eskortcreations.com/product/${slug}`;
        return `https://wa.me/919929191655?text=${encodeURIComponent(text)}`;
      },
    },
  },

  legal: {
    registeredBusinessName: "⟦NEEDED: registered_business_name⟧",
    get businessName() {
      return this.registeredBusinessName;
    },
    registeredOfficeAddress: "⟦NEEDED: registered_office_address⟧",
    get registeredAddress() {
      return this.registeredOfficeAddress;
    },
    gstin: "⟦NEEDED: gstin⟧",
    grievanceOfficer: {
      name: "⟦NEEDED: grievance_officer_name⟧",
      email: "eskortcreations@gmail.com",
      phone: "+91 75809 01212",
      address: "⟦NEEDED: registered_office_address⟧",
    },
  },

  commerce: {
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    defaultGstPercent: 5,
    cod: {
      enabled: true,
      feePaise: 5000, // ₹50.00 COD handling fee
      minOrderPaise: 25000, // ₹250.00
      maxOrderPaise: 1000000, // ₹10,000.00
    },
  },

  featureFlags: {
    fabricByMetre: true,
    wholesale: false,
    nightTheme: false,
    giftFinder: false,
    customerReviews: false, // Hidden until ≥3 verified reviews exist per section 8.2
  },

  get features() {
    return this.featureFlags;
  },

  social: {
    instagram: "⟦NEEDED: social_handles⟧",
    facebook: "⟦NEEDED: social_handles⟧",
  },
};

export default brandConfig;

