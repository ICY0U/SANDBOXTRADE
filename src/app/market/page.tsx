"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { MarketItem } from "@/lib/steam";
import { CATEGORIES, categoriseItem } from "@/lib/categories";
import { useCurrency, CURRENCIES } from "@/lib/currency";

type SortOption = { label: string; column: string; dir: string };
const SORT_OPTIONS: SortOption[] = [
  { label: "MOST POPULAR", column: "popular", dir: "desc" },
  { label: "PRICE ↑", column: "price", dir: "asc" },
  { label: "PRICE ↓", column: "price", dir: "desc" },
  { label: "NAME", column: "name", dir: "asc" },
  { label: "QUANTITY", column: "quantity", dir: "desc" },
];

function steamImg(hash: string) { return `https://community.akamai.steamstatic.com/economy/image/${hash}/256fx256f`; }

/* ── CURRENCY SWITCHER ───────────────────────────────────── */
function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropOpen(!dropOpen)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition-colors"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {currency.symbol} {currency.code}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {dropOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-md py-1 shadow-xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {CURRENCIES.map((c) => (
            <button key={c.code} onClick={() => { setCurrency(c); setDropOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-white/5"
              style={{ color: currency.code === c.code ? "var(--cyan)" : "var(--text-sec)" }}>
              <span className="w-4 text-center">{c.symbol}</span>{c.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── HEADER ──────────────────────────────────────────────── */
function Header({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  return (
    <header style={{ background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
      <div className="mx-auto flex h-[56px] max-w-[1400px] items-center px-5">
        <Link href="/" className="mr-6 flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "var(--cyan)" }}>
            <span className="text-[14px] font-black text-black">S</span>
          </div>
          <span className="text-[16px] font-extrabold tracking-tight">S&Box Market</span>
        </Link>

        {/* Search */}
        <div className="relative mx-4 flex-1 max-w-[420px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md py-2 pl-10 pr-3 text-[13px] outline-none"
            style={{ background: "var(--bg-input)", color: "var(--text)", border: "1px solid var(--border)" }}
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <CurrencySwitcher />
          <Link href="#" className="hidden text-[13px] font-semibold md:block" style={{ color: "var(--text-sec)" }}>Sell</Link>
          <Link href="#" className="text-[13px] font-semibold" style={{ color: "var(--text-sec)" }}>Sign In</Link>
          <button className="rounded-md px-5 py-2 text-[12px] font-bold uppercase tracking-wide" style={{ background: "var(--cyan)", color: "#000" }}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── CATEGORY BAR ────────────────────────────────────────── */
function CategoryBar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <div style={{ background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
      <div className="mx-auto flex max-w-[1400px] items-center gap-0 px-5 overflow-x-auto">
        <button
          onClick={() => setActive("ALL")}
          className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors"
          style={{
            color: active === "ALL" ? "var(--cyan)" : "var(--text-sec)",
            borderBottom: active === "ALL" ? "2px solid var(--cyan)" : "2px solid transparent",
          }}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActive(cat.name)}
            className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors"
            style={{
              color: active === cat.name ? (cat.color || "var(--cyan)") : "var(--text-sec)",
              borderBottom: active === cat.name ? `2px solid ${cat.color || "var(--cyan)"}` : "2px solid transparent",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── SIDEBAR ─────────────────────────────────────────────── */
function Sidebar({ sort, setSort }: { sort: SortOption; setSort: (s: SortOption) => void }) {
  return (
    <aside className="hidden w-[220px] shrink-0 pr-5 lg:block">
      {/* Price filter */}
      <div className="mb-6">
        <h3 className="mb-3 text-[13px] font-bold">Price</h3>
        <div className="flex gap-2">
          <input type="text" placeholder="Min" className="w-1/2 rounded-md px-2.5 py-2 text-[12px] outline-none"
            style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border)" }} />
          <input type="text" placeholder="Max" className="w-1/2 rounded-md px-2.5 py-2 text-[12px] outline-none"
            style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border)" }} />
        </div>
      </div>

      <div className="mb-6 border-t" style={{ borderColor: "var(--border)" }} />

      {/* Sort */}
      <div className="mb-6">
        <h3 className="mb-3 text-[13px] font-bold">Sort By</h3>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSort(opt)}
              className="rounded-md px-3 py-2 text-left text-[12px] font-medium transition-all"
              style={{
                background: sort.label === opt.label ? "var(--cyan-glow)" : "transparent",
                color: sort.label === opt.label ? "var(--cyan)" : "var(--text-sec)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ── ITEM CARD ───────────────────────────────────────────── */
function ItemCard({ item }: { item: MarketItem }) {
  const icon = item.asset_description?.icon_url;
  const tags = item.asset_description?.tags || [];
  const type = tags.find((t) => t.category === "Type");
  const { formatPrice } = useCurrency();

  return (
    <Link
      href={`/item/${encodeURIComponent(item.hash_name)}`}
      className="group flex flex-col rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-center p-5" style={{ minHeight: "160px" }}>
        {icon ? (
          <img
            src={steamImg(icon)}
            alt={item.name}
            className="max-h-[120px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-[120px] w-[120px] items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>No image</div>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }} />

      <div className="flex flex-col gap-0.5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold">{formatPrice(item.sell_price)}</span>
        </div>
        {type && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{type.localized_tag_name}</span>
        )}
        <span className="text-[14px] font-semibold leading-snug line-clamp-2">{item.name}</span>
        <span className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
          {item.sell_listings} listing{item.sell_listings !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}

/* ── MARKET PAGE ─────────────────────────────────────────── */
export default function MarketPage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [activeCat, setActiveCat] = useState("ALL");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: search, sort: sort.column, dir: sort.dir, count: "100" });
      const res = await fetch(`/api/items?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.results || []);
      setTotalCount(data.total_count || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    const t = setTimeout(fetchItems, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchItems, search]);

  // Client-side category filter
  const filtered = activeCat === "ALL" ? items : items.filter((i) => categoriseItem(i.name) === activeCat);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Header search={search} setSearch={setSearch} />
      <CategoryBar active={activeCat} setActive={setActiveCat} />

      {/* Info bar */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-2.5">
          <span className="text-[13px]" style={{ color: "var(--text-sec)" }}>
            {activeCat === "ALL" ? totalCount : filtered.length} items
          </span>
          <select
            value={sort.label}
            onChange={(e) => { const o = SORT_OPTIONS.find((x) => x.label === e.target.value); if (o) setSort(o); }}
            className="rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide outline-none cursor-pointer"
            style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            {SORT_OPTIONS.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] px-5 py-5">
        <Sidebar sort={sort} setSort={setSort} />

        <div className="flex-1">
          {error ? (
            <div className="rounded-lg p-10 text-center" style={{ background: "var(--bg-card)" }}>
              <p className="mb-1 text-sm font-semibold" style={{ color: "var(--red)" }}>Failed to load items</p>
              <p className="mb-4 text-xs" style={{ color: "var(--text-muted)" }}>Steam may be rate-limiting.</p>
              <button onClick={fetchItems} className="rounded-md px-4 py-2 text-[13px] font-bold" style={{ background: "var(--cyan)", color: "#000" }}>Retry</button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton rounded-lg" style={{ height: "300px" }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg p-16 text-center" style={{ background: "var(--bg-card)" }}>
              <p className="text-sm" style={{ color: "var(--text-sec)" }}>No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => <ItemCard key={item.hash_name} item={item} />)}
            </div>
          )}
        </div>
      </div>

      <footer className="py-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          © 2026 S&Box Market. Not affiliated with Valve, Steam, or Facepunch.
        </p>
      </footer>
    </div>
  );
}
