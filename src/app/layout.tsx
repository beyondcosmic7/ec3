import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { ThumbDock } from "@/components/sections/thumb-dock";
import { SearchDialog } from "@/components/sections/search-dialog";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { brandConfig } from "../../brand.config";

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  colorScheme: "light",
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brandConfig.name} — Handcrafted Women's Kurtas & Ethnic Wear Sets`,
  description: `${brandConfig.name} bespoke Indian women's ethnic and fusion wear atelier (Kurtas, 2-Piece/3-Piece sets, Longline Shrugs). Calm, tactile, and unhurried design that loads and responds instantly.`,
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand/assets/emblem.png",
    shortcut: "/brand/assets/emblem.png",
    apple: "/brand/assets/emblem.png",
  },
  openGraph: {
    title: `${brandConfig.name} — Women's Ethnic Kurta Sets & Tailored Wear`,
    description: brandConfig.dnaStatement,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      data-theme="day"
      style={{ colorScheme: "light" }}
      className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--ink-primary)] pb-14 md:pb-0">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ThumbDock />
        <SearchDialog />
        <CartDrawer />
      </body>
    </html>
  );
}

