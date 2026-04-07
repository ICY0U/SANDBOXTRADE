// Steam Web API / Community Market helpers for S&box (App ID 590830)

const SBOX_APP_ID = 590830;
const STEAM_MARKET_BASE = "https://steamcommunity.com/market";

export interface MarketItem {
  name: string;
  hash_name: string;
  sell_listings: number;
  sell_price: number; // lowest price in cents
  sell_price_text: string;
  app_icon: string;
  app_name: string;
  asset_description?: {
    icon_url: string;
    icon_url_large?: string;
    type: string;
    name: string;
    market_hash_name: string;
    commodity: number;
    tradable: number;
    marketable: number;
    descriptions?: Array<{ value: string; color?: string }>;
    tags?: Array<{ category: string; internal_name: string; localized_tag_name: string; color?: string }>;
  };
}

export interface MarketSearchResult {
  success: boolean;
  start: number;
  pagesize: number;
  total_count: number;
  results: MarketItem[];
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: string;
}

export interface ItemPriceOverview {
  success: boolean;
  lowest_price?: string;
  median_price?: string;
  volume?: string;
}

/**
 * Search the Steam Community Market for S&box items
 */
export async function searchMarketItems(
  start = 0,
  count = 100,
  sortColumn = "popular",
  sortDir = "desc",
  query = ""
): Promise<MarketSearchResult> {
  const params = new URLSearchParams({
    appid: SBOX_APP_ID.toString(),
    norender: "1",
    start: start.toString(),
    count: count.toString(),
    sort_column: sortColumn,
    sort_dir: sortDir,
    search_descriptions: "0",
    currency: "2", // Force GBP — our base currency for conversion
  });

  if (query) {
    params.set("query", query);
  }

  const url = `${STEAM_MARKET_BASE}/search/render/?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Steam Market API returned ${res.status}`);
  }

  return res.json();
}

/**
 * Get price overview for a specific item
 */
export async function getItemPriceOverview(
  marketHashName: string
): Promise<ItemPriceOverview> {
  const params = new URLSearchParams({
    appid: SBOX_APP_ID.toString(),
    currency: "2", // Force GBP — base currency
    market_hash_name: marketHashName,
  });

  const url = `${STEAM_MARKET_BASE}/priceoverview/?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Steam price overview returned ${res.status}`);
  }

  return res.json();
}

/**
 * Get the full Steam Community Market image URL from an icon_url hash
 */
export function getSteamImageUrl(iconUrl: string, large = false): string {
  const size = large ? "360fx360f" : "128fx128f";
  return `https://community.akamai.steamstatic.com/economy/image/${iconUrl}/${size}`;
}

/**
 * Get the Steam Market listing page URL for an item
 */
export function getMarketListingUrl(marketHashName: string): string {
  return `${STEAM_MARKET_BASE}/listings/${SBOX_APP_ID}/${encodeURIComponent(marketHashName)}`;
}

export { SBOX_APP_ID };
