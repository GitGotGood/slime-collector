export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic";

export type Skin = {
  id: string;
  name: string;
  tier: Rarity;
  kind: "solid" | "gradient" | "animated";
  colors: string[]; // 1+ colors (2–3 for gradient/animated)
};

export const SKINS: Record<string, Skin> = {
  // V1 Launch Commons
  moss: { id: "moss", name: "Moss", tier: "common", kind: "solid", colors: ["#5BA86D"] },
  sky: { id: "sky", name: "Sky", tier: "common", kind: "solid", colors: ["#A9D8FF"] },
  coral: { id: "coral", name: "Coral", tier: "common", kind: "solid", colors: ["#FF8B7A"] },
  charcoal: { id: "charcoal", name: "Charcoal", tier: "common", kind: "solid", colors: ["#2A2F35"] },

  // V1 Launch Uncommons
  spring_fade: { id: "spring_fade", name: "Spring Fade", tier: "uncommon", kind: "gradient", colors: ["#B7F8C6", "#FFF4A8"] },
  blue_lagoon: { id: "blue_lagoon", name: "Blue Lagoon", tier: "uncommon", kind: "gradient", colors: ["#68E0FF", "#3D78C1"] },

  // V1 Launch Rares (patterns - simplified as gradient for now)
  polka_mint: { id: "polka_mint", name: "Polka Mint", tier: "rare", kind: "gradient", colors: ["#B6E3B6", "#FFFFFF"] },
  ripple: { id: "ripple", name: "Ripple", tier: "rare", kind: "gradient", colors: ["#7FECD8", "#134E4A"] },

  // V1 Launch Epics (animated)
  lava_flow: { id: "lava_flow", name: "Lava Flow", tier: "epic", kind: "animated", colors: ["#3A1D0E", "#FFF0DD", "#dc2626"] },
  aurora_veil: { id: "aurora_veil", name: "Aurora Veil", tier: "epic", kind: "animated", colors: ["#101424", "#F3FAFF", "#0ea5e9"] },

  // V1 Launch Mythics (animated)
  nebula_prime: { id: "nebula_prime", name: "Nebula Prime", tier: "mythic", kind: "animated", colors: ["#1e1b4b", "#c7d2fe", "#0f172a"] },
  phoenix_heart: { id: "phoenix_heart", name: "Phoenix Heart", tier: "mythic", kind: "animated", colors: ["#dc2626", "#fed7d7", "#7f1d1d"] },

  // Biome Unlock Rewards
  clover: { id: "clover", name: "Clover", tier: "common", kind: "solid", colors: ["#65a30d"] },
  sea_breeze: { id: "sea_breeze", name: "Sea Breeze", tier: "uncommon", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },
  raindrop: { id: "raindrop", name: "Raindrop", tier: "uncommon", kind: "gradient", colors: ["#e0e7ff", "#6366f1"] },
  ocean_drift: { id: "ocean_drift", name: "Ocean Drift", tier: "rare", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },
  magma_vein: { id: "magma_vein", name: "Magma Vein", tier: "epic", kind: "gradient", colors: ["#7f1d1d", "#f97316"] },
  ember_bed: { id: "ember_bed", name: "Ember Bed", tier: "epic", kind: "animated", colors: ["#dc2626", "#fecaca", "#7f1d1d"] },
  glacier: { id: "glacier", name: "Glacier", tier: "epic", kind: "gradient", colors: ["#f0f9ff", "#0ea5e9"] },
  frost_breath: { id: "frost_breath", name: "Frost Breath", tier: "epic", kind: "animated", colors: ["#e0f2fe", "#f0f9ff", "#0c4a6e"] },
  moonlit_pool: { id: "moonlit_pool", name: "Moonlit Pool", tier: "rare", kind: "gradient", colors: ["#1e293b", "#e2e8f0"] },
  star_parade: { id: "star_parade", name: "Star Parade", tier: "mythic", kind: "animated", colors: ["#0f172a", "#f8fafc", "#020617"] },
  galaxy_swirl: { id: "galaxy_swirl", name: "Galaxy Swirl", tier: "mythic", kind: "animated", colors: ["#1e1b4b", "#c7d2fe", "#0f172a"] },

  // Legacy skins (for backward compatibility)
  green: { id: "green", name: "Green", tier: "common", kind: "solid", colors: ["#22c55e"] },
  mint: { id: "mint", name: "Mint", tier: "common", kind: "solid", colors: ["#4ade80"] },
  blueberry: { id: "blueberry", name: "Blueberry", tier: "common", kind: "solid", colors: ["#60a5fa"] },
  tangerine: { id: "tangerine", name: "Tangerine", tier: "rare", kind: "gradient", colors: ["#fb923c", "#f59e0b"] },
  bubblegum: { id: "bubblegum", name: "Bubblegum", tier: "rare", kind: "gradient", colors: ["#f472b6", "#fbcfe8"] },
  lava: { id: "lava", name: "Lava", tier: "epic", kind: "animated", colors: ["#ef4444", "#f97316", "#fbbf24"] },
  aurora: { id: "aurora", name: "Aurora", tier: "epic", kind: "animated", colors: ["#22d3ee", "#22c55e", "#a78bfa"] },
  nebula: { id: "nebula", name: "Nebula", tier: "mythic", kind: "animated", colors: ["#6d28d9", "#7c3aed", "#0ea5e9"] },
};

// simple shop listing
export const ALL_SHOP_ITEMS = Object.values(SKINS).map((s) => ({
  id: `skin_${s.id}`,
  type: "skin" as const,
  skin: s.id,
  tier: s.tier,
}));
