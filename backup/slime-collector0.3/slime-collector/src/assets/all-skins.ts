// Unified skin system combining skins.ts and skinspiration.ts
// This file contains ALL skin variations for preview purposes

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic" | "secret";

export type UnifiedSkin = {
  id: string;
  name: string;
  tier: Rarity;
  source: "production" | "inspiration"; // track where it came from
  
  // For production skins (from skins.ts)
  kind?: "solid" | "gradient" | "animated";
  colors?: string[];
  
  // For inspiration skins (from skinspiration.ts)
  palette?: { fill: string; stroke: string; shine: string };
  gradient?: { stops: [string, number][]; dir: string };
  pattern?: string;
  anim?: string;
  base?: { fill: string; stroke: string; shine: string };
};

// ===== PRODUCTION SKINS (from current skins.ts) =====
export const PRODUCTION_SKINS: UnifiedSkin[] = [
  // Commons
  { id: "green_prod", name: "Green (Production)", tier: "common", source: "production", kind: "solid", colors: ["#22c55e"] },
  { id: "mint_prod", name: "Mint (Production)", tier: "common", source: "production", kind: "solid", colors: ["#4ade80"] },
  { id: "blueberry_prod", name: "Blueberry (Production)", tier: "common", source: "production", kind: "solid", colors: ["#60a5fa"] },
  
  // Rares
  { id: "tangerine_prod", name: "Tangerine (Production)", tier: "rare", source: "production", kind: "gradient", colors: ["#fb923c", "#f59e0b"] },
  { id: "bubblegum_prod", name: "Bubblegum (Production)", tier: "rare", source: "production", kind: "gradient", colors: ["#f472b6", "#fbcfe8"] },
  
  // Epics
  { id: "lava_prod", name: "Lava (Production)", tier: "epic", source: "production", kind: "animated", colors: ["#ef4444", "#f97316", "#fbbf24"] },
  { id: "aurora_prod", name: "Aurora (Production)", tier: "epic", source: "production", kind: "animated", colors: ["#22d3ee", "#22c55e", "#a78bfa"] },
  
  // Mythics
  { id: "nebula_prod", name: "Nebula (Production)", tier: "mythic", source: "production", kind: "animated", colors: ["#6d28d9", "#7c3aed", "#0ea5e9"] },
];

// ===== INSPIRATION SKINS (from skinspiration.ts) =====

// Common skins (flat colors)
export const INSPIRATION_COMMON: UnifiedSkin[] = [
  { id: "green_insp", name: "Green (Inspiration)", tier: "common", source: "inspiration", palette: { fill: "#22c55e", stroke: "#065f46", shine: "#bbf7d0" } },
  { id: "mint_insp", name: "Mint (Inspiration)", tier: "common", source: "inspiration", palette: { fill: "#4ade80", stroke: "#065f46", shine: "#bbf7d0" } },
  { id: "blueberry_insp", name: "Blueberry (Inspiration)", tier: "common", source: "inspiration", palette: { fill: "#60a5fa", stroke: "#1e3a8a", shine: "#dbeafe" } },
  { id: "lemon", name: "Lemon", tier: "common", source: "inspiration", palette: { fill: "#fde047", stroke: "#92400e", shine: "#fef9c3" } },
  { id: "cherry", name: "Cherry", tier: "common", source: "inspiration", palette: { fill: "#fb7185", stroke: "#7f1d1d", shine: "#fecdd3" } },
  { id: "grape", name: "Grape", tier: "common", source: "inspiration", palette: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" } },
  { id: "tangerine_insp", name: "Tangerine (Inspiration)", tier: "common", source: "inspiration", palette: { fill: "#fb923c", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "bubblegum_insp", name: "Bubblegum (Inspiration)", tier: "common", source: "inspiration", palette: { fill: "#f472b6", stroke: "#9f1239", shine: "#fbcfe8" } },
  { id: "seafoam", name: "Seafoam", tier: "common", source: "inspiration", palette: { fill: "#2dd4bf", stroke: "#134e4a", shine: "#99f6e4" } },
  { id: "slate", name: "Slate", tier: "common", source: "inspiration", palette: { fill: "#94a3b8", stroke: "#334155", shine: "#e2e8f0" } },
];

// Uncommon skins (simple gradients)
export const INSPIRATION_UNCOMMON: UnifiedSkin[] = [
  { id: "leaf_fade", name: "Leaf Fade", tier: "uncommon", source: "inspiration", gradient: { stops: [["#86efac", 0], ["#10b981", 100]], dir: "diag" } },
  { id: "ocean_mist", name: "Ocean Mist", tier: "uncommon", source: "inspiration", gradient: { stops: [["#99f6e4", 0], ["#06b6d4", 100]], dir: "diag" } },
  { id: "sunrise", name: "Sunrise", tier: "uncommon", source: "inspiration", gradient: { stops: [["#fdba74", 0], ["#fde047", 100]], dir: "diag" } },
  { id: "twilight", name: "Twilight", tier: "uncommon", source: "inspiration", gradient: { stops: [["#a5b4fc", 0], ["#6d28d9", 100]], dir: "diag" } },
  { id: "rose_glow", name: "Rose Glow", tier: "uncommon", source: "inspiration", gradient: { stops: [["#fecdd3", 0], ["#fb7185", 100]], dir: "diag" } },
  { id: "sky_drift", name: "Sky Drift", tier: "uncommon", source: "inspiration", gradient: { stops: [["#bae6fd", 0], ["#3b82f6", 100]], dir: "diag" } },
  { id: "berry_smoothie", name: "Berry Smoothie", tier: "uncommon", source: "inspiration", gradient: { stops: [["#f472b6", 0], ["#a78bfa", 100]], dir: "diag" } },
  { id: "citrus_pop", name: "Citrus Pop", tier: "uncommon", source: "inspiration", gradient: { stops: [["#fef08a", 0], ["#84cc16", 100]], dir: "diag" } },
  { id: "lavender_drift", name: "Lavender Drift", tier: "uncommon", source: "inspiration", gradient: { stops: [["#e9d5ff", 0], ["#a78bfa", 100]], dir: "diag" } },
  { id: "copper_patina", name: "Copper Patina", tier: "uncommon", source: "inspiration", gradient: { stops: [["#2dd4bf", 0], ["#b45309", 100]], dir: "diag" } },
];

// Rare skins (static patterns)
export const INSPIRATION_RARE: UnifiedSkin[] = [
  { id: "bumble", name: "Bumble", tier: "rare", source: "inspiration", base: { fill: "#fde047", stroke: "#92400e", shine: "#fef9c3" }, pattern: "stripes" },
  { id: "sprinkles", name: "Sprinkles", tier: "rare", source: "inspiration", base: { fill: "#fef2f2", stroke: "#7c2d12", shine: "#fde68a" }, pattern: "sprinkles" },
  { id: "starlet", name: "Starlet", tier: "rare", source: "inspiration", base: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" }, pattern: "starlet" },
  { id: "pebble", name: "Pebble", tier: "rare", source: "inspiration", base: { fill: "#d1fae5", stroke: "#065f46", shine: "#bbf7d0" }, pattern: "pebble" },
  { id: "plaid", name: "Picnic", tier: "rare", source: "inspiration", base: { fill: "#fee2e2", stroke: "#7f1d1d", shine: "#fecaca" }, pattern: "plaid" },
  { id: "puddles", name: "Puddles", tier: "rare", source: "inspiration", base: { fill: "#bfdbfe", stroke: "#1d4ed8", shine: "#dbeafe" }, pattern: "puddles" },
  { id: "zigzag", name: "Zigzag", tier: "rare", source: "inspiration", base: { fill: "#fde68a", stroke: "#92400e", shine: "#fef9c3" }, pattern: "zigzag" },
  { id: "confetti", name: "Confetti", tier: "rare", source: "inspiration", base: { fill: "#fefce8", stroke: "#6b7280", shine: "#fef9c3" }, pattern: "confetti" },
  { id: "scales", name: "Scales", tier: "rare", source: "inspiration", base: { fill: "#bbf7d0", stroke: "#065f46", shine: "#dcfce7" }, pattern: "scales" },
  { id: "hearts", name: "Hearts", tier: "rare", source: "inspiration", base: { fill: "#fecdd3", stroke: "#9f1239", shine: "#ffe4e6" }, pattern: "hearts" },
];

// Epic skins (gentle animated motifs)
export const INSPIRATION_EPIC: UnifiedSkin[] = [
  { id: "ocean_anim", name: "Ocean", tier: "epic", source: "inspiration", anim: "ocean", base: { fill: "#0ea5e9", stroke: "#075985", shine: "#bae6fd" } },
  { id: "lava_anim", name: "Lava (Inspiration)", tier: "epic", source: "inspiration", anim: "lava", base: { fill: "#f97316", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "blizzard_anim", name: "Blizzard", tier: "epic", source: "inspiration", anim: "blizzard", base: { fill: "#93c5fd", stroke: "#1e3a8a", shine: "#e0f2fe" } },
  { id: "monsoon_anim", name: "Monsoon", tier: "epic", source: "inspiration", anim: "monsoon", base: { fill: "#38bdf8", stroke: "#0c4a6e", shine: "#bae6fd" } },
  { id: "aurora_anim", name: "Aurora (Inspiration)", tier: "epic", source: "inspiration", anim: "aurora", base: { fill: "#10b981", stroke: "#065f46", shine: "#a7f3d0" } },
  { id: "firefly_anim", name: "Firefly", tier: "epic", source: "inspiration", anim: "firefly", base: { fill: "#166534", stroke: "#052e16", shine: "#bbf7d0" } },
  { id: "tidepool_anim", name: "Tidepool", tier: "epic", source: "inspiration", anim: "tidepool", base: { fill: "#06b6d4", stroke: "#083344", shine: "#a5f3fc" } },
  { id: "sandstorm_anim", name: "Sandstorm", tier: "epic", source: "inspiration", anim: "sandstorm", base: { fill: "#f5d0a5", stroke: "#92400e", shine: "#fde68a" } },
  { id: "thunderhead_anim", name: "Thunderhead", tier: "epic", source: "inspiration", anim: "thunderhead", base: { fill: "#94a3b8", stroke: "#334155", shine: "#e2e8f0" } },
  { id: "breeze_anim", name: "Breeze", tier: "epic", source: "inspiration", anim: "breeze", base: { fill: "#a7f3d0", stroke: "#065f46", shine: "#d1fae5" } },
];

// Mythic skins (premium effects)
export const INSPIRATION_MYTHIC: UnifiedSkin[] = [
  { id: "nebula_anim", name: "Nebula (Inspiration)", tier: "mythic", source: "inspiration", anim: "nebula", base: { fill: "#581c87", stroke: "#3b0764", shine: "#f5d0fe" } },
  { id: "phoenix_anim", name: "Phoenix", tier: "mythic", source: "inspiration", anim: "phoenix", base: { fill: "#fb923c", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "zeus_anim", name: "Zeus", tier: "mythic", source: "inspiration", anim: "zeus", base: { fill: "#64748b", stroke: "#0f172a", shine: "#e2e8f0" } },
  { id: "leviathan_anim", name: "Leviathan", tier: "mythic", source: "inspiration", anim: "leviathan", base: { fill: "#0ea5e9", stroke: "#082f49", shine: "#a5f3fc" } },
  { id: "pegasus_anim", name: "Pegasus", tier: "mythic", source: "inspiration", anim: "pegasus", base: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" } },
  { id: "yeti_anim", name: "Yeti", tier: "mythic", source: "inspiration", anim: "yeti", base: { fill: "#e0f2fe", stroke: "#1e3a8a", shine: "#f0f9ff" } },
  { id: "dragon_anim", name: "Dragon", tier: "mythic", source: "inspiration", anim: "dragon", base: { fill: "#14532d", stroke: "#022c22", shine: "#86efac" } },
  { id: "sylph_anim", name: "Sylph", tier: "mythic", source: "inspiration", anim: "sylph", base: { fill: "#67e8f9", stroke: "#075985", shine: "#e0f2fe" } },
  { id: "djinn_anim", name: "Djinn", tier: "mythic", source: "inspiration", anim: "djinn", base: { fill: "#fde68a", stroke: "#92400e", shine: "#fff7ed" } },
  { id: "gaia_anim", name: "Gaia", tier: "mythic", source: "inspiration", anim: "gaia", base: { fill: "#16a34a", stroke: "#065f46", shine: "#bbf7d0" } },
];

// Secret skins
export const INSPIRATION_SECRET: UnifiedSkin[] = [
  { id: "bigfoot_secret", name: "Bigfoot", tier: "secret", source: "inspiration", base: { fill: "#a16207", stroke: "#713f12", shine: "#fde68a" }, pattern: "fur" },
  { id: "sponge_buddy_secret", name: "Sponge Buddy", tier: "secret", source: "inspiration", base: { fill: "#facc15", stroke: "#92400e", shine: "#fef08a" }, pattern: "pores" },
];

// ===== MY NEW SLIME DESIGNS =====

// Additional Common skins (solid colors with creative themes)
export const MY_COMMON: UnifiedSkin[] = [
  { id: "honey", name: "Honey", tier: "common", source: "inspiration", palette: { fill: "#f59e0b", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "coral", name: "Coral", tier: "common", source: "inspiration", palette: { fill: "#fb7185", stroke: "#be185d", shine: "#fecdd3" } },
  { id: "sage", name: "Sage", tier: "common", source: "inspiration", palette: { fill: "#84cc16", stroke: "#365314", shine: "#d9f99d" } },
  { id: "periwinkle", name: "Periwinkle", tier: "common", source: "inspiration", palette: { fill: "#8b5cf6", stroke: "#581c87", shine: "#e9d5ff" } },
];

// Additional Uncommon skins (gradient themes)
export const MY_UNCOMMON: UnifiedSkin[] = [
  { id: "sunset_beach", name: "Sunset Beach", tier: "uncommon", source: "inspiration", gradient: { stops: [["#f97316", 0], ["#fbbf24", 50], ["#f472b6", 100]], dir: "diag" } },
  { id: "forest_mist", name: "Forest Mist", tier: "uncommon", source: "inspiration", gradient: { stops: [["#059669", 0], ["#34d399", 100]], dir: "diag" } },
  { id: "arctic_dawn", name: "Arctic Dawn", tier: "uncommon", source: "inspiration", gradient: { stops: [["#0ea5e9", 0], ["#e0f2fe", 100]], dir: "diag" } },
  { id: "volcano_glow", name: "Volcano Glow", tier: "uncommon", source: "inspiration", gradient: { stops: [["#dc2626", 0], ["#f97316", 100]], dir: "diag" } },
];

// Additional Rare skins (new pattern types)
export const MY_RARE: UnifiedSkin[] = [
  { id: "honeycomb", name: "Honeycomb", tier: "rare", source: "inspiration", base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" }, pattern: "honeycomb" },
  { id: "circuit", name: "Circuit", tier: "rare", source: "inspiration", base: { fill: "#06b6d4", stroke: "#164e63", shine: "#cffafe" }, pattern: "circuit" },
  { id: "galaxy_dust", name: "Galaxy Dust", tier: "rare", source: "inspiration", base: { fill: "#1e1b4b", stroke: "#312e81", shine: "#c7d2fe" }, pattern: "dust" },
  { id: "prism", name: "Prism", tier: "rare", source: "inspiration", base: { fill: "#f8fafc", stroke: "#64748b", shine: "#ffffff" }, pattern: "prism" },
];

// Additional Epic skins (new animation themes)
export const MY_EPIC: UnifiedSkin[] = [
  { id: "comet_trail", name: "Comet Trail", tier: "epic", source: "inspiration", anim: "comet", base: { fill: "#1e40af", stroke: "#1e3a8a", shine: "#dbeafe" } },
  { id: "solar_flare", name: "Solar Flare", tier: "epic", source: "inspiration", anim: "solar", base: { fill: "#f59e0b", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "quantum_shift", name: "Quantum Shift", tier: "epic", source: "inspiration", anim: "quantum", base: { fill: "#7c3aed", stroke: "#5b21b6", shine: "#e9d5ff" } },
  { id: "tide_pool", name: "Tide Pool", tier: "epic", source: "inspiration", anim: "tidepool", base: { fill: "#0891b2", stroke: "#164e63", shine: "#cffafe" } },
];

// Additional Mythic skins (advanced themes)
export const MY_MYTHIC: UnifiedSkin[] = [
  { id: "void_walker", name: "Void Walker", tier: "mythic", source: "inspiration", anim: "void", base: { fill: "#0f0f23", stroke: "#1e1b4b", shine: "#c7d2fe" } },
  { id: "celestial_harmony", name: "Celestial Harmony", tier: "mythic", source: "inspiration", anim: "celestial", base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "time_weaver", name: "Time Weaver", tier: "mythic", source: "inspiration", anim: "temporal", base: { fill: "#6366f1", stroke: "#3730a3", shine: "#e0e7ff" } },
  { id: "nebula_hybrid", name: "Nebula (Hybrid)", tier: "mythic", source: "inspiration", anim: "nebula_hybrid", base: { fill: "#6d28d9", stroke: "#3b0764", shine: "#f5d0fe" } },
];

// ===== BATCH 2024: MASSIVE EXPANSION =====

// NEW COMMON (solid colors — clean, readable) — 20
export const NEW_COMMON: UnifiedSkin[] = [
  { id: "moss", name: "Moss", tier: "common", source: "inspiration", base: { fill: "#5BA86D", stroke: "#1F5132", shine: "#0B3A29" } },
  { id: "pistachio", name: "Pistachio", tier: "common", source: "inspiration", base: { fill: "#B6E3B6", stroke: "#2E6A3A", shine: "#0E2A16" } },
  { id: "lime_pop", name: "Lime Pop", tier: "common", source: "inspiration", base: { fill: "#A3F700", stroke: "#336B11", shine: "#10300B" } },
  { id: "clover", name: "Clover", tier: "common", source: "inspiration", base: { fill: "#79D083", stroke: "#2B7A41", shine: "#0F2F1D" } },
  { id: "sky", name: "Sky", tier: "common", source: "inspiration", base: { fill: "#A9D8FF", stroke: "#1E3A8A", shine: "#0E2440" } },
  { id: "denim", name: "Denim", tier: "common", source: "inspiration", base: { fill: "#4F7FBF", stroke: "#1E3A8A", shine: "#0A1B35" } },
  { id: "rain", name: "Rain", tier: "common", source: "inspiration", base: { fill: "#7089A7", stroke: "#334155", shine: "#0C1726" } },
  { id: "coral", name: "Coral", tier: "common", source: "inspiration", base: { fill: "#FF8B7A", stroke: "#7F1D1D", shine: "#3A0B0B" } },
  { id: "papaya", name: "Papaya", tier: "common", source: "inspiration", base: { fill: "#FFA658", stroke: "#7C2D12", shine: "#3A1405" } },
  { id: "honey", name: "Honey", tier: "common", source: "inspiration", base: { fill: "#FFD24A", stroke: "#92400E", shine: "#3A1F06" } },
  { id: "banana_milk", name: "Banana Milk", tier: "common", source: "inspiration", base: { fill: "#FFF3A7", stroke: "#8A6A0D", shine: "#2A2106" } },
  { id: "lilac", name: "Lilac", tier: "common", source: "inspiration", base: { fill: "#D9C9FF", stroke: "#5B21B6", shine: "#251048" } },
  { id: "plum", name: "Plum", tier: "common", source: "inspiration", base: { fill: "#7D4AA3", stroke: "#4C1D95", shine: "#EDE7FF" } },
  { id: "berry_jam", name: "Berry Jam", tier: "common", source: "inspiration", base: { fill: "#C13A73", stroke: "#7F1D3A", shine: "#FFF2F7" } },
  { id: "rosewater", name: "Rosewater", tier: "common", source: "inspiration", base: { fill: "#F7BFD0", stroke: "#9F1239", shine: "#401524" } },
  { id: "sand", name: "Sand", tier: "common", source: "inspiration", base: { fill: "#E9D8B5", stroke: "#9D8057", shine: "#2B2216" } },
  { id: "clay", name: "Clay", tier: "common", source: "inspiration", base: { fill: "#C7744D", stroke: "#7C3A1D", shine: "#2A1108" } },
  { id: "pebble", name: "Pebble", tier: "common", source: "inspiration", base: { fill: "#B9C2CC", stroke: "#475569", shine: "#111827" } },
  { id: "charcoal", name: "Charcoal", tier: "common", source: "inspiration", base: { fill: "#2A2F35", stroke: "#0B0E12", shine: "#EAF0FF" } },
  { id: "snowcone", name: "Snowcone", tier: "common", source: "inspiration", base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
];

// NEW UNCOMMON (simple gradients — 2–3 soft stops) — 20
export const NEW_UNCOMMON: UnifiedSkin[] = [
  { id: "spring_fade", name: "Spring Fade", tier: "uncommon", source: "inspiration", gradient: { stops: [["#B7F8C6", 0], ["#FFF4A8", 100]], dir: "180deg" }, base: { fill: "#B7F8C6", stroke: "#2E6A3A", shine: "#0E2A16" } },
  { id: "sea_breeze", name: "Sea Breeze", tier: "uncommon", source: "inspiration", gradient: { stops: [["#9DECF2", 0], ["#A9D8FF", 100]], dir: "180deg" }, base: { fill: "#9DECF2", stroke: "#1E3A8A", shine: "#0E2440" } },
  { id: "mojito", name: "Mojito", tier: "uncommon", source: "inspiration", gradient: { stops: [["#BFFB6F", 0], ["#B6E3B6", 100]], dir: "180deg" }, base: { fill: "#BFFB6F", stroke: "#336B11", shine: "#0F2F1D" } },
  { id: "melon_glow", name: "Melon Glow", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FF9B86", 0], ["#FFD24A", 100]], dir: "180deg" }, base: { fill: "#FF9B86", stroke: "#7C2D12", shine: "#3A1405" } },
  { id: "peach_soda", name: "Peach Soda", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FFC49E", 0], ["#FFF1DA", 100]], dir: "180deg" }, base: { fill: "#FFC49E", stroke: "#9A4F2A", shine: "#2B1308" } },
  { id: "berry_fizz", name: "Berry Fizz", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FF6BA0", 0], ["#7D4AA3", 100]], dir: "180deg" }, base: { fill: "#FF6BA0", stroke: "#5B1A4A", shine: "#FDEBFA" } },
  { id: "lavender_milk", name: "Lavender Milk", tier: "uncommon", source: "inspiration", gradient: { stops: [["#E6D6FF", 0], ["#FFFFFF", 100]], dir: "180deg" }, base: { fill: "#E6D6FF", stroke: "#5B21B6", shine: "#27104A" } },
  { id: "mint_frost", name: "Mint Frost", tier: "uncommon", source: "inspiration", gradient: { stops: [["#7FECD8", 0], ["#F1FFFB", 100]], dir: "180deg" }, base: { fill: "#7FECD8", stroke: "#134E4A", shine: "#0E2A26" } },
  { id: "sunrise_dew", name: "Sunrise Dew", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FFD36E", 0], ["#FFD0E4", 100]], dir: "180deg" }, base: { fill: "#FFD36E", stroke: "#92400E", shine: "#3A1A06" } },
  { id: "raincloud", name: "Raincloud", tier: "uncommon", source: "inspiration", gradient: { stops: [["#7A8BA3", 0], ["#B7D1FF", 100]], dir: "180deg" }, base: { fill: "#7A8BA3", stroke: "#334155", shine: "#0C1726" } },
  { id: "glacier", name: "Glacier", tier: "uncommon", source: "inspiration", gradient: { stops: [["#CBEAFF", 0], ["#FFFFFF", 100]], dir: "180deg" }, base: { fill: "#CBEAFF", stroke: "#1E3A8A", shine: "#0B2140" } },
  { id: "sakura", name: "Sakura", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FFCDDC", 0], ["#FFE9F1", 100]], dir: "180deg" }, base: { fill: "#FFCDDC", stroke: "#9F1239", shine: "#3C1020" } },
  { id: "canyon", name: "Canyon", tier: "uncommon", source: "inspiration", gradient: { stops: [["#CD7A54", 0], ["#E9D8B5", 100]], dir: "180deg" }, base: { fill: "#CD7A54", stroke: "#7C3A1D", shine: "#2A1108" } },
  { id: "grape_soda", name: "Grape Soda", tier: "uncommon", source: "inspiration", gradient: { stops: [["#A77AFF", 0], ["#E2D4FF", 100]], dir: "180deg" }, base: { fill: "#A77AFF", stroke: "#4C1D95", shine: "#211048" } },
  { id: "matcha_latte", name: "Matcha Latte", tier: "uncommon", source: "inspiration", gradient: { stops: [["#A5D79B", 0], ["#FFF9EB", 100]], dir: "180deg" }, base: { fill: "#A5D79B", stroke: "#2E6A3A", shine: "#0E2A16" } },
  { id: "blue_lagoon", name: "Blue Lagoon", tier: "uncommon", source: "inspiration", gradient: { stops: [["#68E0FF", 0], ["#3D78C1", 100]], dir: "180deg" }, base: { fill: "#68E0FF", stroke: "#1E3A8A", shine: "#0B2140" } },
  { id: "tangerine_cream", name: "Tangerine Cream", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FFA658", 0], ["#FFF1DA", 100]], dir: "180deg" }, base: { fill: "#FFA658", stroke: "#7C2D12", shine: "#3A1405" } },
  { id: "forest_mist", name: "Forest Mist", tier: "uncommon", source: "inspiration", gradient: { stops: [["#5BA86D", 0], ["#E4EEE7", 100]], dir: "180deg" }, base: { fill: "#5BA86D", stroke: "#1F5132", shine: "#0B3A29" } },
  { id: "cosmic_cotton", name: "Cosmic Cotton", tier: "uncommon", source: "inspiration", gradient: { stops: [["#DCC7FF", 0], ["#B7D1FF", 100]], dir: "180deg" }, base: { fill: "#DCC7FF", stroke: "#4C1D95", shine: "#211048" } },
  { id: "buttercup", name: "Buttercup", tier: "uncommon", source: "inspiration", gradient: { stops: [["#FFE65A", 0], ["#FFF6B8", 100]], dir: "180deg" }, base: { fill: "#FFE65A", stroke: "#8A6A0D", shine: "#2A2106" } },
];

// NEW RARE (patterns — subtle, number-friendly) — 20
export const NEW_RARE: UnifiedSkin[] = [
  { id: "polka_mint", name: "Polka Mint", tier: "rare", source: "inspiration", pattern: { type: "polka_dots", size: 3, spacing: 12, color: "#FFFFFF", alpha: 0.14 }, base: { fill: "#B6E3B6", stroke: "#2E6A3A", shine: "#0E2A16" } },
  { id: "mini_stripes", name: "Mini Stripes", tier: "rare", source: "inspiration", pattern: { type: "diagonal_stripes", width: 1, spacing: 8, color: "#FFFFFF", alpha: 0.10 }, base: { fill: "#A9D8FF", stroke: "#1E3A8A", shine: "#0E2440" } },
  { id: "waves", name: "Waves", tier: "rare", source: "inspiration", pattern: { type: "sine_waves", width: 1, amplitude: 2, period: 28, color: "#DCEBFF", alpha: 0.12 }, base: { fill: "#7089A7", stroke: "#334155", shine: "#0B2140" } },
  { id: "honeycomb", name: "Honeycomb", tier: "rare", source: "inspiration", pattern: { type: "hexagon_grid", size: 11, color: "#FFEDB3", alpha: 0.16 }, base: { fill: "#FFD24A", stroke: "#92400E", shine: "#3A1F06" } },
  { id: "sprinkles", name: "Sprinkles", tier: "rare", source: "inspiration", pattern: { type: "confetti_dots", count: 18, colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"], alpha: 0.50 }, base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
  { id: "stitch", name: "Stitch", tier: "rare", source: "inspiration", pattern: { type: "dashed_ring", dashLength: 3, color: "#FFFFFF", alpha: 0.40 }, base: { fill: "#B9C2CC", stroke: "#475569", shine: "#111827" } },
  { id: "plaid_picnic", name: "Plaid Picnic", tier: "rare", source: "inspiration", pattern: { type: "plaid", width: 1, colors: ["#FFD8E4", "#BFE3FF"], alpha: 0.12 }, base: { fill: "#F7BFD0", stroke: "#9F1239", shine: "#401524" } },
  { id: "pebble_path", name: "Pebble Path", tier: "rare", source: "inspiration", pattern: { type: "stone_speckles", size: 2, density: "bottom", colors: ["#8B4513", "#A0522D"], alpha: 0.18 }, base: { fill: "#E9D8B5", stroke: "#9D8057", shine: "#2B2216" } },
  { id: "raindrop", name: "Raindrop", tier: "rare", source: "inspiration", pattern: { type: "droplet_spots", width: 3, height: 4, color: "#EAF5FF", alpha: 0.14 }, base: { fill: "#A9D8FF", stroke: "#1E3A8A", shine: "#0B2140" } },
  { id: "starlet", name: "Starlet", tier: "rare", source: "inspiration", pattern: { type: "micro_twinkles", size: 2, count: 8, color: "#F8E38A", alpha: 0.30 }, base: { fill: "#2A2F35", stroke: "#0B0E12", shine: "#EAF0FF" } },
  { id: "canvas", name: "Canvas", tier: "rare", source: "inspiration", pattern: { type: "linen_texture", alpha: 0.09 }, base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
  { id: "zig_mini", name: "Zig Mini", tier: "rare", source: "inspiration", pattern: { type: "zigzag_bands", width: 1, period: 10, alpha: 0.12 }, base: { fill: "#D9C9FF", stroke: "#5B21B6", shine: "#251048" } },
  { id: "cloud_puff", name: "Cloud Puff", tier: "rare", source: "inspiration", pattern: { type: "wispy_clouds", count: 3, blur: true, alpha: 0.10 }, base: { fill: "#A9D8FF", stroke: "#1E3A8A", shine: "#0B2140" } },
  { id: "ripple", name: "Ripple", tier: "rare", source: "inspiration", pattern: { type: "concentric_rings", width: 1, center: "off-center", alpha: 0.10 }, base: { fill: "#7FECD8", stroke: "#134E4A", shine: "#064E3B" } },
  { id: "daisy_chain", name: "Daisy Chain", tier: "rare", source: "inspiration", pattern: { type: "flower_dots", size: 5, petals: 5, count: 10, color: "#FFF8DC" }, base: { fill: "#F7BFD0", stroke: "#9F1239", shine: "#401524" } },
  { id: "pixel_dust", name: "Pixel Dust", tier: "rare", source: "inspiration", pattern: { type: "scattered_pixels", size: 1, density: "sparse", alpha: 0.16 }, base: { fill: "#B9C2CC", stroke: "#475569", shine: "#111827" } },
  { id: "candy_cane", name: "Candy Cane", tier: "rare", source: "inspiration", pattern: { type: "pinstripes", colors: ["#FFB3B3", "#FFFFFF"], width: 1, angle: 45, spacing: 10 }, base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
  { id: "auric_vein", name: "Auric Vein", tier: "rare", source: "inspiration", pattern: { type: "gold_veining", paths: 3, color: "#E9C46A", alpha: 0.12 }, base: { fill: "#2A2F35", stroke: "#0B0E12", shine: "#EAF0FF" } },
  { id: "ink_wash", name: "Ink Wash", tier: "rare", source: "inspiration", pattern: { type: "watercolor_splotches", count: 3, size: "large", alpha: 0.08 }, base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
  { id: "chesslite", name: "Chesslite", tier: "rare", source: "inspiration", pattern: { type: "checkerboard", size: 8, alpha: 0.04 }, base: { fill: "#B9C2CC", stroke: "#475569", shine: "#111827" } },
];

// NEW EPIC (animated but simple — low motion) — 30
export const NEW_EPIC: UnifiedSkin[] = [
  { id: "lava_flow", name: "Lava Flow", tier: "epic", source: "inspiration", anim: "lava_flow", base: { fill: "#3A1D0E", stroke: "#200E08", shine: "#FFF0DD" } },
  { id: "aurora_veil", name: "Aurora Veil", tier: "epic", source: "inspiration", anim: "aurora_veil", base: { fill: "#101424", stroke: "#0A0F1C", shine: "#F3FAFF" } },
  { id: "ocean_drift", name: "Ocean Drift", tier: "epic", source: "inspiration", anim: "ocean_drift", base: { fill: "#0E3A4D", stroke: "#062531", shine: "#E8FCFF" } },
  { id: "breathing_jelly", name: "Breathing Jelly", tier: "epic", source: "inspiration", anim: "breathing_jelly", base: { fill: "#8ED7FF", stroke: "#69B8FF", shine: "#0F244A" } },
  { id: "glow_pulse", name: "Glow Pulse", tier: "epic", source: "inspiration", anim: "glow_pulse", base: { fill: "#1B1F2B", stroke: "#0E1419", shine: "#E9FCFF" } },
  { id: "rainfall", name: "Rainfall", tier: "epic", source: "inspiration", anim: "rainfall", base: { fill: "#2A3247", stroke: "#1A2032", shine: "#EAF2FF" } },
  { id: "spark_run", name: "Spark Run", tier: "epic", source: "inspiration", anim: "spark_run", base: { fill: "#111318", stroke: "#08090C", shine: "#F6F1E9" } },
  { id: "magneto", name: "Magneto", tier: "epic", source: "inspiration", anim: "magneto", base: { fill: "#1C2230", stroke: "#101622", shine: "#EEF6FF" } },
  { id: "bubble_rise", name: "Bubble Rise", tier: "epic", source: "inspiration", anim: "bubble_rise", base: { fill: "#6DDAD3", stroke: "#46C0B7", shine: "#0F3431" } },
  { id: "tidepool", name: "Tidepool", tier: "epic", source: "inspiration", anim: "tidepool", base: { fill: "#1D7573", stroke: "#0F4B4A", shine: "#E6FFFA" } },
  { id: "wind_ripple", name: "Wind Ripple", tier: "epic", source: "inspiration", anim: "wind_ripple", base: { fill: "#9EC7FF", stroke: "#6AA6FF", shine: "#0E2440" } },
  { id: "comet_streak", name: "Comet Streak", tier: "epic", source: "inspiration", anim: "comet_streak", base: { fill: "#0D111C", stroke: "#050810", shine: "#EAF4FF" } },
  { id: "ember_bed", name: "Ember Bed", tier: "epic", source: "inspiration", anim: "ember_bed", base: { fill: "#231816", stroke: "#1A120F", shine: "#FFEBDD" } },
  { id: "crystal_shine", name: "Crystal Shine", tier: "epic", source: "inspiration", anim: "crystal_shine", base: { fill: "#AEE3FF", stroke: "#7AC2E7", shine: "#0E2C4A" } },
  { id: "heartbeat", name: "Heartbeat", tier: "epic", source: "inspiration", anim: "heartbeat", base: { fill: "#7C2F58", stroke: "#561F3C", shine: "#FFE6F2" } },
  { id: "sunshower", name: "Sunshower", tier: "epic", source: "inspiration", anim: "sunshower", base: { fill: "#C6E7FF", stroke: "#88C5E7", shine: "#0E2440" } },
  { id: "snow_drift", name: "Snow Drift", tier: "epic", source: "inspiration", anim: "snow_drift", base: { fill: "#132033", stroke: "#0C1626", shine: "#E8F0FF" } },
  { id: "will_o_glow", name: "Will-o-Glow", tier: "epic", source: "inspiration", anim: "will_o_glow", base: { fill: "#0E1C14", stroke: "#081108", shine: "#F3FFF7" } },
  { id: "vine_crawl", name: "Vine Crawl", tier: "epic", source: "inspiration", anim: "vine_crawl", base: { fill: "#415A31", stroke: "#2C3E23", shine: "#ECFFE8" } },
  { id: "galaxy_swirl", name: "Galaxy Swirl", tier: "epic", source: "inspiration", anim: "galaxy_swirl", base: { fill: "#12152B", stroke: "#090B1A", shine: "#EEF3FF" } },
  { id: "jelly_ripple", name: "Jelly Ripple", tier: "epic", source: "inspiration", anim: "jelly_ripple", base: { fill: "#7FE4FF", stroke: "#5ACAF0", shine: "#0F3441" } },
  { id: "mirror_gleam", name: "Mirror Gleam", tier: "epic", source: "inspiration", anim: "mirror_gleam", base: { fill: "#2A2F3A", stroke: "#1E232B", shine: "#E6EEFF" } },
  { id: "magma_vein", name: "Magma Vein", tier: "epic", source: "inspiration", anim: "magma_vein", base: { fill: "#1A1412", stroke: "#0F0D0A", shine: "#FFECDD" } },
  { id: "frost_breath", name: "Frost Breath", tier: "epic", source: "inspiration", anim: "frost_breath", base: { fill: "#0E2030", stroke: "#18354A", shine: "#E6F6FF" } },
  { id: "sand_sift", name: "Sand Sift", tier: "epic", source: "inspiration", anim: "sand_sift", base: { fill: "#EED9B7", stroke: "#DCC39F", shine: "#5A472F" } },
  { id: "ink_bloom", name: "Ink Bloom", tier: "epic", source: "inspiration", anim: "ink_bloom", base: { fill: "#12131A", stroke: "#0A0B0F", shine: "#EAF0FF" } },
  { id: "lightning_wink", name: "Lightning Wink", tier: "epic", source: "inspiration", anim: "lightning_wink", base: { fill: "#0F172A", stroke: "#0A0F1A", shine: "#E5F1FF" } },
  { id: "tonic_fizz", name: "Tonic Fizz", tier: "epic", source: "inspiration", anim: "tonic_fizz", base: { fill: "#BDEBFF", stroke: "#93DBFF", shine: "#0E2440" } },
  { id: "star_parade", name: "Star Parade", tier: "epic", source: "inspiration", anim: "star_parade", base: { fill: "#0E1424", stroke: "#090D18", shine: "#EEF3FF" } },
  { id: "rainbow_drip", name: "Rainbow Drip", tier: "epic", source: "inspiration", anim: "rainbow_drip", base: { fill: "#101218", stroke: "#080A0F", shine: "#E6EEFF" } },
];

// NEW MYTHIC (animated + special effects) — 25
export const NEW_MYTHIC: UnifiedSkin[] = [
  { id: "nebula_prime", name: "Nebula Prime", tier: "mythic", source: "inspiration", anim: "deep_space_parallax", base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" } },
  { id: "phoenix_heart", name: "Phoenix Heart", tier: "mythic", source: "inspiration", anim: "ember_rise_trail", base: { fill: "#dc2626", stroke: "#7f1d1d", shine: "#fed7d7" } },
  { id: "leviathan_tide", name: "Leviathan Tide", tier: "mythic", source: "inspiration", anim: "dark_sea_surge", base: { fill: "#0c4a6e", stroke: "#0f172a", shine: "#67e8f9" } },
  { id: "pegasus_gale", name: "Pegasus Gale", tier: "mythic", source: "inspiration", anim: "winged_wisps", base: { fill: "#bae6fd", stroke: "#075985", shine: "#f0f9ff" } },
  { id: "zephyr_lord", name: "Zephyr Lord", tier: "mythic", source: "inspiration", anim: "wind_rings_sparkles", base: { fill: "#84cc16", stroke: "#365314", shine: "#ecfccb" } },
  { id: "thunder_rune", name: "Thunder Rune", tier: "mythic", source: "inspiration", anim: "runic_flashes", base: { fill: "#6366f1", stroke: "#3730a3", shine: "#e0e7ff" } },
  { id: "solar_crown", name: "Solar Crown", tier: "mythic", source: "inspiration", anim: "coronas_flares", base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "solar_crown_2", name: "Solar Crown 2", tier: "mythic", source: "inspiration", anim: "intense_solar_aura", base: { fill: "#ff8c00", stroke: "#b45309", shine: "#fef3c7" } },
  { id: "moonlit_pool", name: "Moonlit Pool", tier: "mythic", source: "inspiration", anim: "silver_caustics", base: { fill: "#e2e8f0", stroke: "#64748b", shine: "#f8fafc" } },
  { id: "starlace", name: "Starlace", tier: "mythic", source: "inspiration", anim: "constellation_shimmer", base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" } },
  { id: "eclipse", name: "Eclipse", tier: "mythic", source: "inspiration", anim: "dark_rim_glow", base: { fill: "#0f172a", stroke: "#000000", shine: "#fbbf24" } },
  { id: "dragon_scale", name: "Dragon Scale", tier: "mythic", source: "inspiration", anim: "iridescent_plates", base: { fill: "#065f46", stroke: "#134e4a", shine: "#22d3ee" } },
  { id: "auric_king", name: "Auric King", tier: "mythic", source: "inspiration", anim: "golden_particle_rain", base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "glacial_core", name: "Glacial Core", tier: "mythic", source: "inspiration", anim: "inner_glow_cracks", base: { fill: "#67e8f9", stroke: "#0e7490", shine: "#f0fdfa" } },
  { id: "stormcaller", name: "Stormcaller", tier: "mythic", source: "inspiration", anim: "clouds_distant_bolts", base: { fill: "#64748b", stroke: "#1e293b", shine: "#fbbf24" } },
  { id: "chrono", name: "Chrono", tier: "mythic", source: "inspiration", anim: "ticking_rings_sparks", base: { fill: "#6366f1", stroke: "#3730a3", shine: "#e0e7ff" } },
  { id: "mystwood", name: "Mystwood", tier: "mythic", source: "inspiration", anim: "floating_leaves_motes", base: { fill: "#2d5016", stroke: "#1a2e0a", shine: "#86efac" } },
  { id: "prismlord", name: "Prismlord", tier: "mythic", source: "inspiration", anim: "rainbow_shards", base: { fill: "#f8fafc", stroke: "#64748b", shine: "#22d3ee" } },
  { id: "lotus_spirit", name: "Lotus Spirit", tier: "mythic", source: "inspiration", anim: "petals_unfurl", base: { fill: "#fbb6ce", stroke: "#be185d", shine: "#fdf2f8" } },
  { id: "obsidian_flame", name: "Obsidian Flame", tier: "mythic", source: "inspiration", anim: "blackfire_tongues", base: { fill: "#0f172a", stroke: "#000000", shine: "#7c3aed" } },
  { id: "starforge", name: "Starforge", tier: "mythic", source: "inspiration", anim: "hammering_sparks", base: { fill: "#dc2626", stroke: "#7f1d1d", shine: "#fbbf24" } },
  { id: "aurora_crown", name: "Aurora Crown", tier: "mythic", source: "inspiration", anim: "headband_lights", base: { fill: "#22d3ee", stroke: "#0e7490", shine: "#cffafe" } },
  { id: "runebloom", name: "Runebloom", tier: "mythic", source: "inspiration", anim: "glowing_glyphs", base: { fill: "#7c3aed", stroke: "#4c1d95", shine: "#e9d5ff" } },
  { id: "solaris", name: "Solaris", tier: "mythic", source: "inspiration", anim: "rotating_sunspots", base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" } },
  { id: "nocturne", name: "Nocturne", tier: "mythic", source: "inspiration", anim: "neon_edge_dark_core", base: { fill: "#0f172a", stroke: "#000000", shine: "#22d3ee" } },
  { id: "comet_choir", name: "Comet Choir", tier: "mythic", source: "inspiration", anim: "multiple_streaks_chimes", base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" } },
];

// NEW SECRET (quest/event — tasteful nods) — 5  
export const NEW_SECRET: UnifiedSkin[] = [
  { id: "bigfoot_update", name: "Forest Footprint", tier: "secret", source: "inspiration", anim: "forest_footprint", base: { fill: "#5BA86D", stroke: "#1F5132", shine: "#CDE9D3" } },
  { id: "pineapple_pants", name: "Pineapple Pants", tier: "secret", source: "inspiration", anim: "pineapple_wink", base: { fill: "#F9D34C", stroke: "#7A4F0B", shine: "#FFF4C4" } },
  { id: "pipe_jumper", name: "Pipe Jumper", tier: "secret", source: "inspiration", anim: "pipe_hop", base: { fill: "#2BB673", stroke: "#0E4F32", shine: "#CFFBE0" } },
  { id: "ring_runner", name: "Ring Runner", tier: "secret", source: "inspiration", anim: "ring_twinkles", base: { fill: "#1E90FF", stroke: "#0B2E5B", shine: "#E6F0FF" } },
  { id: "crafted_cube", name: "Crafted Cube", tier: "secret", source: "inspiration", anim: "pixel_grass", base: { fill: "#7A5232", stroke: "#3A2617", shine: "#E8D7C6" } },
];

// BONUS: SEASONAL/EVENT (reuseable) — 5
export const NEW_SEASONAL: UnifiedSkin[] = [
  { id: "pumpkin_patch", name: "Pumpkin Patch", tier: "common", source: "inspiration", anim: "pumpkin_grin", base: { fill: "#F38B2A", stroke: "#6A3908", shine: "#FFD9B1" } },
  { id: "candy_frost", name: "Candy Frost", tier: "uncommon", source: "inspiration", anim: "candy_snowfall", base: { fill: "#9CF0E4", stroke: "#1B6B66", shine: "#FFFFFF" } },
  { id: "firecracker", name: "Firecracker", tier: "rare", source: "inspiration", anim: "sparkle_bursts", base: { fill: "#D7263D", stroke: "#4F0A13", shine: "#FFD1D7" } },
  { id: "egg_dye", name: "Egg Dye", tier: "uncommon", source: "inspiration", anim: "marble_swirls", base: { fill: "#DCC7FF", stroke: "#6D5E8C", shine: "#FFFFFF" } },
  { id: "beach_day", name: "Beach Day", tier: "common", source: "inspiration", anim: "sea_breeze", base: { fill: "#F8E7C7", stroke: "#9D8057", shine: "#FFF6E6" } },
];

// ===== UNIFIED COLLECTIONS =====
export const ALL_SKINS: UnifiedSkin[] = [
  ...PRODUCTION_SKINS,
  ...INSPIRATION_COMMON,
  ...INSPIRATION_UNCOMMON,
  ...INSPIRATION_RARE,
  ...INSPIRATION_EPIC,
  ...INSPIRATION_MYTHIC,
  ...INSPIRATION_SECRET,
  ...MY_COMMON,
  ...MY_UNCOMMON,
  ...MY_RARE,
  ...MY_EPIC,
  ...MY_MYTHIC,
  // NEW BATCH 2024 EXPANSION
  ...NEW_COMMON,
  ...NEW_UNCOMMON,
  ...NEW_RARE,
  ...NEW_EPIC,
  ...NEW_MYTHIC,
  ...NEW_SECRET,
  ...NEW_SEASONAL,
];

export const SKINS_BY_TIER = {
  common: ALL_SKINS.filter(s => s.tier === "common"),
  uncommon: ALL_SKINS.filter(s => s.tier === "uncommon"),
  rare: ALL_SKINS.filter(s => s.tier === "rare"),
  epic: ALL_SKINS.filter(s => s.tier === "epic"),
  mythic: ALL_SKINS.filter(s => s.tier === "mythic"),
  secret: ALL_SKINS.filter(s => s.tier === "secret"),
};

export const SKINS_BY_SOURCE = {
  production: ALL_SKINS.filter(s => s.source === "production"),
  inspiration: ALL_SKINS.filter(s => s.source === "inspiration"),
};

// Rarity colors for UI
export const RARITY_COLORS = {
  common: "text-slate-600",
  uncommon: "text-emerald-700",
  rare: "text-sky-600",
  epic: "text-purple-600",
  mythic: "text-amber-600",
  secret: "text-pink-700"
};
