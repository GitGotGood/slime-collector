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

  // New Biome Coverage Slimes
  // Forest
  canopy_lantern: { id: "canopy_lantern", name: "Canopy Lantern", tier: "epic", kind: "animated", colors: ["#207a4f", "#2ea271"] },
  moss_quilt: { id: "moss_quilt", name: "Moss Quilt", tier: "rare", kind: "solid", colors: ["#2e7d5a"] },
  acorn_buddy: { id: "acorn_buddy", name: "Acorn Buddy", tier: "uncommon", kind: "solid", colors: ["#6c8a3a"] },
  
  // Cove
  pearl_whisper: { id: "pearl_whisper", name: "Pearl Whisper", tier: "epic", kind: "animated", colors: ["#70c6c0", "#f2f7ff"] },
  kelp_curl: { id: "kelp_curl", name: "Kelp Curl", tier: "rare", kind: "solid", colors: ["#267a6f"] },
  tide_glass: { id: "tide_glass", name: "Tide Glass", tier: "uncommon", kind: "gradient", colors: ["#78d3d0", "#e9fbfb"] },
  
  // Tundra
  snow_lantern: { id: "snow_lantern", name: "Snow Lantern", tier: "epic", kind: "animated", colors: ["#9fd3e6", "#eaf7ff"] },
  frost_fern: { id: "frost_fern", name: "Frost Fern", tier: "rare", kind: "solid", colors: ["#cfeff8"] },
  drift_puff: { id: "drift_puff", name: "Drift Puff", tier: "uncommon", kind: "animated", colors: ["#bfe7f4", "#ffffff"] },
  
  // Canyon
  redwall_glow: { id: "redwall_glow", name: "Redwall Glow", tier: "epic", kind: "animated", colors: ["#b3562e", "#d67b4d"] },
  desert_varnish: { id: "desert_varnish", name: "Desert Varnish", tier: "rare", kind: "solid", colors: ["#a14a2a"] },
  swallow_sweep: { id: "swallow_sweep", name: "Swallow Sweep", tier: "uncommon", kind: "animated", colors: ["#cf7e50", "#f4c4a2"] },
  
  // Aurora
  aurora_veil_plus: { id: "aurora_veil_plus", name: "Aurora Veil+", tier: "epic", kind: "animated", colors: ["#43e0c6", "#b189ff"] },
  polar_crown: { id: "polar_crown", name: "Polar Crown", tier: "rare", kind: "solid", colors: ["#86c5ff"] },
  ionosong: { id: "ionosong", name: "Ionosong", tier: "mythic", kind: "animated", colors: ["#0f1b3d", "#c7d2fe"] },
  
  // Savanna
  acacia_shade: { id: "acacia_shade", name: "Acacia Shade", tier: "epic", kind: "animated", colors: ["#e0b45a", "#f7ddb0"] },
  grass_run: { id: "grass_run", name: "Grass Run", tier: "rare", kind: "gradient", colors: ["#c9d66c", "#f2f6c6"] },
  sun_drum: { id: "sun_drum", name: "Sun Drum", tier: "uncommon", kind: "animated", colors: ["#ffcc66", "#fff3cc"] },
  
  // Reef
  coral_chorus: { id: "coral_chorus", name: "Coral Chorus", tier: "epic", kind: "animated", colors: ["#ff7e6b", "#2fd3c9"] },
  anemone_wiggle: { id: "anemone_wiggle", name: "Anemone Wiggle", tier: "rare", kind: "solid", colors: ["#ff9ea0"] },
  shell_gleam: { id: "shell_gleam", name: "Shell Gleam", tier: "uncommon", kind: "gradient", colors: ["#8de3de", "#f6ffff"] },
  
  // Temple
  glyph_bloom: { id: "glyph_bloom", name: "Glyph Bloom", tier: "epic", kind: "animated", colors: ["#6a5d4a", "#d9c7a6"] },
  vine_inlay: { id: "vine_inlay", name: "Vine Inlay", tier: "rare", kind: "solid", colors: ["#907a5d"] },
  incense_drift: { id: "incense_drift", name: "Incense Drift", tier: "uncommon", kind: "animated", colors: ["#b79f80", "#f0e7d8"] },
  
  // Harbor
  lighthouse_wink: { id: "lighthouse_wink", name: "Lighthouse Wink", tier: "epic", kind: "animated", colors: ["#5a82b8", "#dbe8ff"] },
  rope_coil: { id: "rope_coil", name: "Rope Coil", tier: "rare", kind: "solid", colors: ["#c8a06d"] },
  foam_crest: { id: "foam_crest", name: "Foam Crest", tier: "uncommon", kind: "gradient", colors: ["#74b7e4", "#e9f7ff"] },
  
  // Foundry
  anvil_ember: { id: "anvil_ember", name: "Anvil Ember", tier: "epic", kind: "animated", colors: ["#151515", "#ff6a00"] },
  forge_rune: { id: "forge_rune", name: "Forge Rune", tier: "rare", kind: "solid", colors: ["#332b28"] },
  quench_mist: { id: "quench_mist", name: "Quench Mist", tier: "uncommon", kind: "animated", colors: ["#2a2a2a", "#5f6a71"] },

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
