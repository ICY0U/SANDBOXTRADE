// Item categories for S&box — manually mapped since Steam only provides "Workshop Item" / "Clothing"
// We categorise by looking at the item names

export interface ItemCategory {
  name: string;
  keywords: string[]; // if item name contains any of these, it belongs here
  color?: string;     // accent colour for the category
}

export const CATEGORIES: ItemCategory[] = [
  {
    name: "HEAD",
    keywords: [
      "helmet", "head", "hat", "cap", "hood", "beanie", "beret", "crown",
      "mask", "doctor", "bunny ears", "antlers", "horns", "ushanka",
    ],
    color: "#e84057",
  },
  {
    name: "FACE",
    keywords: [
      "glasses", "sunglasses", "goggles", "bandage", "face mask", "surgical",
      "loving look", "nose", "eyes", "monocle", "eyepatch",
    ],
    color: "#f5a623",
  },
  {
    name: "BODY",
    keywords: [
      "jacket", "shirt", "coat", "vest", "hoodie", "sweater", "top",
      "raincoat", "lifejacket", "bag shirt", "tee", "jersey",
    ],
    color: "#4db8d9",
  },
  {
    name: "LEGS",
    keywords: [
      "pants", "trousers", "shorts", "jeans", "skirt", "legs",
    ],
    color: "#44d991",
  },
  {
    name: "HANDS",
    keywords: [
      "hands", "gloves", "mittens", "gauntlets",
    ],
    color: "#d32ce6",
  },
  {
    name: "FEET",
    keywords: [
      "shoes", "boots", "slippers", "sneakers", "sandals", "feet",
    ],
    color: "#5e98d9",
  },
  {
    name: "ACCESSORIES",
    keywords: [
      "beard", "moustache", "scarf", "necklace", "backpack", "wings",
      "tail", "cape",
    ],
    color: "#eb4b4b",
  },
];

/**
 * Categorise an item by its name. Returns category name or "OTHER".
 */
export function categoriseItem(itemName: string): string {
  const lower = itemName.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw))) {
      return cat.name;
    }
  }
  return "OTHER";
}

/**
 * Get category object by name
 */
export function getCategoryByName(name: string): ItemCategory | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
