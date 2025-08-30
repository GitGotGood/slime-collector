export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic";

export type Skin = {
  id: string;
  name: string;
  tier: Rarity;
  kind: "solid" | "gradient" | "animated";
  colors: string[]; // 1+ colors (2–3 for gradient/animated)
};

export const SKINS: Record<string, Skin> = {
  // commons (solids)
  green: { id: "green", name: "Green", tier: "common", kind: "solid", colors: ["#22c55e"] },
  mint: { id: "mint", name: "Mint", tier: "common", kind: "solid", colors: ["#4ade80"] },
  blueberry: { id: "blueberry", name: "Blueberry", tier: "common", kind: "solid", colors: ["#60a5fa"] },

  // rare (simple gradient)
  tangerine: { id: "tangerine", name: "Tangerine", tier: "rare", kind: "gradient", colors: ["#fb923c", "#f59e0b"] },
  bubblegum: { id: "bubblegum", name: "Bubblegum", tier: "rare", kind: "gradient", colors: ["#f472b6", "#fbcfe8"] },

  // epic (animated gradients)
  lava: { id: "lava", name: "Lava", tier: "epic", kind: "animated", colors: ["#ef4444", "#f97316", "#fbbf24"] },
  aurora: { id: "aurora", name: "Aurora", tier: "epic", kind: "animated", colors: ["#22d3ee", "#22c55e", "#a78bfa"] },

  // mythic (animated, deeper colors)
  nebula: { id: "nebula", name: "Nebula", tier: "mythic", kind: "animated", colors: ["#6d28d9", "#7c3aed", "#0ea5e9"] },
};

// simple shop listing
export const ALL_SHOP_ITEMS = Object.values(SKINS).map((s) => ({
  id: `skin_${s.id}`,
  type: "skin" as const,
  skin: s.id,
  tier: s.tier,
}));
