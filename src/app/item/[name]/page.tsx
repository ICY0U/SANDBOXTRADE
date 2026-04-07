"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/lib/currency";

interface ItemData {
  name: string;
  hash_name: string;
  sell_listings: number;
  sell_price: number;
  sell_price_text: string;
  asset_description?: {
    icon_url: string;
    type: string;
    descriptions?: Array<{ value: string; color?: string }>;
    tags?: Array<{ category: string; internal_name: string; localized_tag_name: string; color?: string }>;
  };
}

interface PriceOverview {
  success: boolean;
  lowest_price?: string;
  median_price?: string;
  volume?: string;
}

function steamImg(hash: string) {
  return `https://community.akamai.steamstatic.com/economy/image/${hash}/360fx360f`;
}

export default function ItemPage({ params }: { params: Promise<{ name: string }> }) {
  const [marketHashName, setMarketHashName] = useState("");
  const [item, setItem] = useState<ItemData | null>(null);
  const [priceOverview, setPriceOverview] = useState<PriceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    params.then((p) => setMarketHashName(decodeURIComponent(p.name)));
  }, [params]);

  useEffect(() => {
    if (!marketHashName) return;
    setLoading(true);

    // Fetch item data
    fetch(`/api/items?q=${encodeURIComponent(marketHashName)}&count=100`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.results?.find((r: ItemData) => r.hash_name === marketHashName);
        setItem(found || null);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));

    // Fetch price overview
    fetch(`/api/price?name=${encodeURIComponent(marketHashName)}`)
      .then((r) => r.json())
      .then((data) => setPriceOverview(data))
      .catch(() => setPriceOverview(null));
  }, [marketHashName]);

  const tags = item?.asset_description?.tags || [];
  const descriptions = item?.asset_description?.descriptions || [];
  const type = tags.find((t) => t.category === "Type");
  const iconUrl = item?.asset_description?.icon_url ? steamImg(item.asset_description.icon_url) : null;
  const steamUrl = `https://steamcommunity.com/market/listings/590830/${encodeURIComponent(marketHashName)}`;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header style={{ background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex h-[56px] max-w-[1400px] items-center px-5">
          <Link href="/" className="mr-6 flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "var(--cyan)" }}>
              <span className="text-[14px] font-black text-black">S</span>
            </div>
            <span className="text-[16px] font-extrabold tracking-tight">S&Box Market</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/market" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Market</Link>
            <Link href="#" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Sign In</Link>
            <button className="rounded-md px-5 py-2 text-[12px] font-bold uppercase tracking-wide" style={{ background: "var(--cyan)", color: "#000" }}>Sign Up</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[13px]">
          <Link href="/market" className="transition hover:text-white" style={{ color: "var(--text-muted)" }}>Market</Link>
          <span style={{ color: "var(--text-muted)" }}>›</span>
          {type && (
            <>
              <span style={{ color: "var(--text-sec)" }}>{type.localized_tag_name}</span>
              <span style={{ color: "var(--text-muted)" }}>›</span>
            </>
          )}
          <span>{marketHashName}</span>
        </nav>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="skeleton rounded-xl" style={{ height: "380px" }} />
            <div className="flex flex-col gap-4">
              <div className="skeleton rounded-lg" style={{ height: "30px", width: "60%" }} />
              <div className="skeleton rounded-lg" style={{ height: "24px", width: "40%" }} />
              <div className="skeleton rounded-xl" style={{ height: "280px" }} />
            </div>
          </div>
        ) : !item ? (
          <div className="rounded-xl p-16 text-center" style={{ background: "var(--bg-card)" }}>
            <p className="text-lg font-bold">Item not found</p>
            <Link href="/market" className="mt-4 inline-block text-[13px] font-semibold" style={{ color: "var(--cyan)" }}>← Back to Market</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Image */}
            <div
              className="relative flex items-center justify-center rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", minHeight: "380px" }}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at center, var(--cyan) 0%, transparent 70%)" }} />
              {iconUrl ? (
                <img src={iconUrl} alt={item.name} className="relative z-10 max-h-[280px] w-auto object-contain drop-shadow-2xl" />
              ) : (
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>No image</span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              {type && (
                <span className="text-[12px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {type.localized_tag_name}
                </span>
              )}

              <h1 className="text-[28px] font-bold leading-tight">{item.name}</h1>

              {/* Price card */}
              <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[32px] font-black" style={{ color: "var(--cyan)" }}>
                    {formatPrice(item.sell_price)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Lowest</p>
                    <p className="text-[15px] font-bold" style={{ color: "var(--cyan)" }}>
                      {formatPrice(item.sell_price)}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Median</p>
                    <p className="text-[15px] font-bold">
                      {priceOverview?.median_price ? formatPrice(item.sell_price) : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Listings</p>
                    <p className="text-[15px] font-bold">{item.sell_listings}</p>
                  </div>
                </div>

                {priceOverview?.volume && (
                  <p className="text-[12px] mb-4" style={{ color: "var(--text-sec)" }}>
                    📊 {priceOverview.volume} sold in the last 24 hours
                  </p>
                )}

                <a
                  href={steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg py-3.5 text-center text-[13px] font-bold uppercase tracking-wide transition-all hover:shadow-lg"
                  style={{ background: "var(--cyan)", color: "#000", boxShadow: "0 0 20px rgba(0,200,255,0.15)" }}
                >
                  View on Steam Market →
                </a>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={`${tag.category}-${tag.internal_name}`}
                      className="rounded-md px-2.5 py-1 text-[11px] font-medium"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: tag.color ? `#${tag.color}` : "var(--text-sec)" }}
                    >
                      {tag.localized_tag_name}
                    </span>
                  ))}
                </div>
              )}

              {/* Descriptions */}
              {descriptions.length > 0 && (
                <div className="rounded-lg p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="space-y-1 text-[13px]" style={{ color: "var(--text-sec)" }}>
                    {descriptions.map((desc, i) => (
                      <p key={i} style={{ color: desc.color ? `#${desc.color}` : undefined }} dangerouslySetInnerHTML={{ __html: desc.value }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
