"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MarketItem } from "@/lib/steam";
import { CATEGORIES } from "@/lib/categories";
import { useCurrency, CURRENCIES } from "@/lib/currency";

function steamImg(hash: string, size = "256fx256f") {
  return `https://community.akamai.steamstatic.com/economy/image/${hash}/${size}`;
}

/* ── CURRENCY SWITCHER ───────────────────────────────────── */
function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition-colors"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {currency.symbol} {currency.code}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-md py-1 shadow-xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-white/5"
              style={{ color: currency.code === c.code ? "var(--cyan)" : "var(--text-sec)" }}
            >
              <span className="w-4 text-center">{c.symbol}</span>
              {c.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── HEADER (two rows: top bar + category bar) ───────────── */
function Header() {
  return (
    <>
      {/* Top bar */}
      <header style={{ background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex h-[52px] max-w-[1400px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "var(--cyan)" }}>
              <span className="text-[14px] font-black text-black">S</span>
            </div>
            <span className="text-[16px] font-extrabold tracking-tight">S&Box Market</span>
          </Link>

          <div className="flex items-center gap-4">
            <CurrencySwitcher />
            <Link href="/market" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Market</Link>
            <Link href="#" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Sell</Link>
            <Link href="#" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Sign In</Link>
            <button className="rounded-md px-5 py-2 text-[12px] font-bold uppercase tracking-wide" style={{ background: "var(--cyan)", color: "#000" }}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Category bar (separate row) */}
      <nav style={{ background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/market?cat=${cat.name}`}
              className="whitespace-nowrap px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] transition-colors hover:text-white"
              style={{ color: "var(--text-sec)" }}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/market"
            className="whitespace-nowrap px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em]"
            style={{ color: "var(--cyan)" }}
          >
            ALL ITEMS
          </Link>
        </div>
      </nav>
    </>
  );
}

/* ── HERO CAROUSEL — cycles top trending items ───────────── */
function HeroCarousel({ items }: { items: MarketItem[] }) {
  const [current, setCurrent] = useState(0);
  const { formatPrice } = useCurrency();
  const featured = items.slice(0, 5);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (!featured.length) {
    return (
      <section className="relative h-[420px] overflow-hidden" style={{ background: "var(--bg-hero)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[42px] font-black leading-[1.1] md:text-[52px]">
              The <span style={{ color: "var(--cyan)" }}>S&Box</span> Skin Marketplace
            </h1>
            <p className="mt-4 text-[16px]" style={{ color: "var(--text-sec)" }}>Loading trending items...</p>
          </div>
        </div>
      </section>
    );
  }

  const item = featured[current];
  const icon = item.asset_description?.icon_url;

  return (
    <section className="relative h-[420px] overflow-hidden" style={{ background: "var(--bg-hero)" }}>
      {/* Background glow based on current item */}
      <div className="absolute inset-0 transition-opacity duration-700">
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 h-[400px] w-[400px] rounded-full blur-[120px] opacity-15" style={{ background: "var(--cyan)" }} />
        <div className="absolute bottom-0 left-[10%] h-[300px] w-[300px] rounded-full blur-[100px] opacity-10" style={{ background: "var(--purple)" }} />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-5">
        {/* Left text */}
        <div className="flex-1 max-w-lg z-10">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: "var(--cyan-glow)", color: "var(--cyan)", border: "1px solid rgba(0,200,255,0.2)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--cyan)" }} />
            Trending Now
          </div>

          <h2 className="mb-2 text-[36px] font-black leading-[1.1] md:text-[44px]" key={`title-${current}`}>
            {item.name}
          </h2>

          <p className="mb-2 text-[22px] font-bold" style={{ color: "var(--cyan)" }}>
            {formatPrice(item.sell_price)}
          </p>

          <p className="mb-6 text-[14px]" style={{ color: "var(--text-sec)" }}>
            {item.sell_listings} listings on the market
          </p>

          <div className="flex gap-3">
            <Link
              href={`/item/${encodeURIComponent(item.hash_name)}`}
              className="rounded-md px-6 py-3 text-[13px] font-bold uppercase tracking-wide"
              style={{ background: "var(--cyan)", color: "#000" }}
            >
              View Item
            </Link>
            <Link
              href="/market"
              className="rounded-md px-6 py-3 text-[13px] font-bold uppercase tracking-wide"
              style={{ border: "1px solid var(--border-light)", color: "var(--text)" }}
            >
              Browse All
            </Link>
          </div>
        </div>

        {/* Right — item image */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          {icon && (
            <img
              key={`img-${current}`}
              src={steamImg(icon, "360fx360f")}
              alt={item.name}
              className="max-h-[280px] w-auto object-contain drop-shadow-2xl"
              style={{ animation: "fadeSlide 0.5s ease-out" }}
            />
          )}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              background: i === current ? "var(--cyan)" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      {featured.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + featured.length) % featured.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % featured.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
          >
            ›
          </button>
        </>
      )}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 h-16 w-full" style={{ background: "linear-gradient(transparent, var(--bg))" }} />
    </section>
  );
}

/* ── FEATURED ITEMS ROW ──────────────────────────────────── */
function FeaturedItems({ items }: { items: MarketItem[] }) {
  const { formatPrice } = useCurrency();
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-[22px] font-bold">Popular Right Now</h2>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Most traded S&Box items</p>
        </div>
        <Link href="/market" className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--cyan)" }}>
          View All →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {items.slice(0, 10).map((item) => {
          const icon = item.asset_description?.icon_url;
          return (
            <Link
              key={item.hash_name}
              href={`/item/${encodeURIComponent(item.hash_name)}`}
              className="group flex w-[190px] shrink-0 flex-col rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-center p-4" style={{ minHeight: "120px" }}>
                {icon && (
                  <img src={steamImg(icon)} alt={item.name}
                    className="max-h-[90px] w-auto object-contain transition-transform group-hover:scale-105" loading="lazy" />
                )}
              </div>
              <div className="px-3 pb-3">
                <p className="text-[12px] font-semibold leading-snug line-clamp-1">{item.name}</p>
                <p className="text-[15px] font-bold mt-0.5" style={{ color: "var(--cyan)" }}>
                  {formatPrice(item.sell_price)}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{item.sell_listings} listings</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ── VALUE PROPS ─────────────────────────────────────────── */
function ValueProps() {
  const props = [
    { icon: "🔒", title: "Secure Escrow", desc: "Funds held safely until items are delivered." },
    { icon: "⚡", title: "Instant Delivery", desc: "Automated bot delivery in minutes." },
    { icon: "💰", title: "Low Fees", desc: "3% seller fee. 0% buyer fee." },
    { icon: "📊", title: "Live Prices", desc: "Real-time data updated every 5 min." },
  ];
  return (
    <section className="py-20" style={{ background: "var(--bg-header)" }}>
      <div className="mx-auto max-w-[1400px] px-5">
        <h2 className="mb-10 text-center text-[24px] font-bold">Why S&Box Market?</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {props.map((p) => (
            <div key={p.title} className="rounded-lg p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="mb-2 block text-[26px]">{p.icon}</span>
              <h3 className="mb-1 text-[14px] font-bold">{p.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-sec)" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────── */
function Cta() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16">
      <div className="relative overflow-hidden rounded-xl px-10 py-16 text-center" style={{ border: "1px solid var(--border)" }}>
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--bg-hero)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] rounded-full blur-[100px] opacity-15" style={{ background: "var(--cyan)" }} />
        <div className="relative z-10">
          <h2 className="mb-4 text-[28px] font-black">Start Trading Today</h2>
          <p className="mb-8 text-[14px]" style={{ color: "var(--text-sec)" }}>Low fees, secure trades, real-time prices.</p>
          <div className="flex justify-center gap-3">
            <Link href="/market" className="rounded-md px-7 py-3 text-[13px] font-bold uppercase tracking-wide" style={{ background: "var(--cyan)", color: "#000" }}>Browse Market</Link>
            <button className="rounded-md px-7 py-3 text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--cyan)", border: "1px solid var(--cyan)" }}>Sign Up Free</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { title: "Marketplace", links: [{ l: "Browse", h: "/market" }, { l: "Sell", h: "#" }, { l: "Prices", h: "#" }] },
            { title: "Support", links: [{ l: "FAQ", h: "#" }, { l: "Contact", h: "#" }, { l: "Terms", h: "#" }] },
            { title: "Company", links: [{ l: "About", h: "#" }, { l: "Blog", h: "#" }, { l: "Privacy", h: "#" }] },
            { title: "Social", links: [{ l: "Discord", h: "#" }, { l: "Twitter", h: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{col.title}</h4>
              {col.links.map((link) => (
                <Link key={link.l} href={link.h} className="block text-[13px] py-1 transition hover:text-white" style={{ color: "var(--text-sec)" }}>{link.l}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-8 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>© 2026 S&Box Market. Not affiliated with Valve, Steam, or Facepunch.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── PAGE ─────────────────────────────────────────────────── */
export default function LandingPage() {
  const [items, setItems] = useState<MarketItem[]>([]);

  useEffect(() => {
    fetch("/api/items?sort=popular&dir=desc&count=10")
      .then((r) => r.json())
      .then((d) => setItems(d.results || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Header />
      <HeroCarousel items={items} />
      <FeaturedItems items={items} />
      <ValueProps />
      <Cta />
      <Footer />
    </div>
  );
}
