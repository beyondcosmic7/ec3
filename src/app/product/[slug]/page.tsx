import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getAllProducts, getRelatedProducts } from "@/server/catalog";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { FitPanel } from "@/components/product/fit-panel";
import { DeclarationsBlock } from "@/components/product/declarations-block";
import { PincodeEstimator } from "@/components/product/pincode-estimator";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { Media } from "@/components/ui/media";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — Eskort Creations",
      description: "The requested tailored garment could not be found.",
    };
  }

  // Section 9.9: Name Hazard Safeguard — always pair Eskort with product nouns
  return {
    title: `${product.name} — Women's Ethnic Wear | Eskort Creations`,
    description: `${product.description} Fabric: ${product.fabric}. Measured across exact inches. Tailored in Jaipur.`,
    openGraph: {
      title: `${product.name} — Eskort Creations Women's Ethnic Wear`,
      description: product.description,
      images: product.images[0] ? [`/brand/products/${product.images[0]}`] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.slug, 4);

  // Schema.org Product Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => `/brand/products/${img}`),
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Eskort Creations",
    },
    offers: {
      "@type": "Offer",
      url: `/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price_inr,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Eskort Creations",
      },
    },
  };

  return (
    <div className="w-full flex flex-col bg-[var(--canvas)] min-h-screen">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 text-xs text-[var(--ink-muted)]">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--ink-primary)]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-[var(--ink-primary)]">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--ink-primary)] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Primary Stage */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Garment Information & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
                  {product.moment}
                </span>
                <span className="text-[var(--ink-faint)]">·</span>
                <SelvedgeDots colors={product.print_colours} size="sm" />
              </div>

              <h1 className="text-heading font-display text-[var(--ink-primary)] text-xl sm:text-2xl">
                {product.name}
              </h1>

              {/* Price and GST breakdown */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold tabular-numbers text-[var(--ink-primary)]">
                  ₹{product.price_inr}
                </span>
                {product.mrp_inr > product.price_inr && (
                  <span className="text-sm text-[var(--ink-muted)] line-through tabular-numbers">
                    ₹{product.mrp_inr}
                  </span>
                )}
                <span className="text-xs text-[var(--ink-muted)] ml-auto">
                  Inclusive of all taxes (GST {product.gst_percent}%)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
              {product.description}
            </p>

            {/* Feeding Access Callout (Section 8.4) */}
            {product.feeding_access !== "none" && (
              <div className="p-3.5 bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[var(--ink-primary)] block">
                    Feeding Friendly Design
                  </span>
                  <span className="text-[11px] text-[var(--ink-muted)]">
                    {product.feeding_access === "concealed"
                      ? "Features discreet concealed side access for nursing mothers."
                      : "Zipless overlap construction designed for easy, comfortable access."}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[var(--accent-madder)] bg-[var(--canvas)] px-2 py-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                  {product.feeding_access}
                </span>
              </div>
            )}

            {/* Product Actions (Size selector, Add to cart, WhatsApp link) */}
            <ProductActions product={product} />

            {/* Pincode Estimator */}
            <PincodeEstimator />

            {/* Fit in Inches Panel */}
            <FitPanel measurements={product.garment_measurements_in} />

            {/* Care and Composition */}
            <div className="p-4 rounded-[var(--radius-control)] bg-[var(--canvas)] border border-[var(--border-subtle)] flex flex-col gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[var(--ink-secondary)] text-[10px]">
                Textile &amp; Care Details
              </span>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--ink-muted)]">Fabric:</span>
                <span className="font-medium text-[var(--ink-primary)]">{product.fabric}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--ink-muted)]">Composition:</span>
                <span className="font-medium text-[var(--ink-primary)]">{product.composition}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--ink-muted)]">Care:</span>
                <span className="font-medium text-[var(--ink-primary)] text-right">{product.care}</span>
              </div>
            </div>

            {/* Statutory Legal Metrology Declarations */}
            <DeclarationsBlock product={product} />

            {/* Returns & Exchange Summary */}
            <div className="text-xs text-[var(--ink-muted)] bg-[var(--surface-subtle)] p-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
              <span className="font-semibold text-[var(--ink-primary)]">
                7-Day Easy Exchange &amp; Return Window
              </span>
              <p className="text-[11px] leading-relaxed">
                If the fit or drape is not right for you, exchange for another size or initiate a return within 7 days of delivery. Tags must remain attached and garment unworn.
              </p>
              <Link href="/policies/returns" className="text-[11px] underline text-[var(--accent-madder)]">
                Read our complete returns policy
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[var(--border-subtle)]">
            <h2 className="text-heading font-display text-[var(--ink-primary)] mb-6">
              Complementary Atelier Designs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => {
                const img = p.images[0] ? `/brand/products/${p.images[0]}` : "";
                return (
                  <article
                    key={p.slug}
                    className="group flex flex-col bg-[var(--surface-card)] rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <Link
                      href={`/product/${p.slug}`}
                      className="relative block aspect-[3/4] bg-[var(--surface-subtle)] overflow-hidden"
                    >
                      {img && (
                        <Media
                          src={img}
                          alt={p.name}
                          fill
                          aspectRatio="auto"
                          className="group-hover:scale-[1.02] transition-transform duration-500 object-cover"
                        />
                      )}
                    </Link>
                    <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                      <h3 className="text-xs font-medium line-clamp-1 text-[var(--ink-primary)]">
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      </h3>
                      <div className="flex items-baseline justify-between pt-1 border-t border-[var(--border-subtle)]">
                        <span className="text-xs font-semibold tabular-numbers text-[var(--ink-primary)]">
                          ₹{p.price_inr}
                        </span>
                        <span className="text-[10px] text-[var(--ink-muted)]">
                          {p.fabric.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
