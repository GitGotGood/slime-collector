// Unified skin system combining skins.ts and skinspiration.ts
// This file contains ALL skin variations for preview purposes

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic" | "secret";

export type SlimeOrigin = {
  type: 'shop' | 'biome' | 'badge' | 'quest';
  source: string; // 'shop', 'volcano', 'first_mastery', etc.
  displayName: string; // 'Available in Shop', 'Unlocked in Volcano', etc.
};

export type UnifiedSkin = {
  id: string;
  name: string;
  tier: Rarity;
  source: "production" | "inspiration" | "pre-production"; // track where it came from
  origin?: SlimeOrigin; // how this slime is unlocked
  bio?: string; // character description/story
  
  // For production skins (from skins.ts)
  kind?: "solid" | "gradient" | "animated";
  colors?: string[];
  
  // For inspiration skins (from skinspiration.ts)
  palette?: { fill: string; stroke: string; shine: string };
  gradient?: { stops: [string, number][]; dir: string };
  pattern?: string | object; // Allow both string and object patterns
  anim?: string;
  base?: { fill: string; stroke: string; shine: string };
};

// ===== PRODUCTION SKINS (V1 Launch Roster) =====
export const PRODUCTION_SKINS: UnifiedSkin[] = [
  // Commons - Always unlocked on day 1
  { 
    id: "moss", 
    name: "Moss", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    base: { fill: "#5BA86D", stroke: "#1F5132", shine: "#0B3A29" } 
  },
  { 
    id: "sky", 
    name: "Sky", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    base: { fill: "#A9D8FF", stroke: "#1E3A8A", shine: "#0E2440" } 
  },
  { 
    id: "coral", 
    name: "Coral", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    base: { fill: "#FF8B7A", stroke: "#7F1D1D", shine: "#3A0B0B" } 
  },
  { 
    id: "charcoal", 
    name: "Charcoal", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    base: { fill: "#2A2F35", stroke: "#0B0E12", shine: "#EAF0FF" } 
  },

  // Uncommons - Always unlocked on day 1
  { 
    id: "spring_fade", 
    name: "Spring Fade", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    gradient: { stops: [["#B7F8C6", 0], ["#FFF4A8", 100]], dir: "180deg" }, 
    base: { fill: "#B7F8C6", stroke: "#2E6A3A", shine: "#0E2A16" } 
  },
  { 
    id: "autumn_fade", 
    name: "Autumn Fade", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    gradient: { stops: [["#22c55e", 0], ["#dc2626", 100]], dir: "180deg" }, 
    base: { fill: "#22c55e", stroke: "#0f172a", shine: "#0E2A16" },
    bio: "Perfect companion to Spring Fade. Captures the complete autumn transformation - from vibrant summer green through golden yellow and warm orange to deep crimson red. Like watching a single leaf change through the entire season."
  },
  { 
    id: "blue_lagoon", 
    name: "Blue Lagoon", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    gradient: { stops: [["#68E0FF", 0], ["#3D78C1", 100]], dir: "180deg" }, 
    base: { fill: "#68E0FF", stroke: "#1E3A8A", shine: "#0B2140" } 
  },
  { 
    id: "cotton_candy", 
    name: "Cotton Candy", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    gradient: { stops: [["#60a5fa", 0], ["#f472b6", 100]], dir: "180deg" }, 
    base: { fill: "#60a5fa", stroke: "#ec4899", shine: "#dbeafe" },
    bio: "Sweet and dreamy like spun sugar at the carnival. This delightful slime captures the whimsical magic of cotton candy with its soft blue-to-pink gradient that melts hearts."
  },
  { 
    id: "rainbow", 
    name: "Rainbow", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    kind: "gradient",
    colors: ["#ef4444", "#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6"],
    base: { fill: "#ef4444", stroke: "#0f172a", shine: "#fef2f2" },
    bio: "A spectacular display of all colors in perfect harmony. This magical slime embodies the full ROYGBV spectrum, bringing joy and wonder wherever it appears."
  },
  { 
    id: "sunset", 
    name: "Sunset", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    kind: "gradient",
    colors: ["#8b5cf6", "#ec4899", "#f97316", "#fbbf24"],
    base: { fill: "#8b5cf6", stroke: "#7c2d12", shine: "#fef3c7" },
    bio: "Captures the breathtaking beauty of golden hour. This magical slime flows from deep purple through vibrant pink and orange to golden yellow, like watching the most spectacular sunset paint the sky."
  },

  // Rares - Always unlocked on day 1
  { 
    id: "polka_mint", 
    name: "Polka Mint", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    pattern: { type: "polka_dots", size: 3, spacing: 12, color: "#FFFFFF", alpha: 0.14 }, 
    base: { fill: "#B6E3B6", stroke: "#2E6A3A", shine: "#0E2A16" } 
  },
  { 
    id: "ripple", 
    name: "Ripple", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    pattern: { type: "concentric_rings", width: 1, center: "off-center", alpha: 0.10 }, 
    base: { fill: "#7FECD8", stroke: "#134E4A", shine: "#064E3B" } 
  },

  // Epics - Always unlocked on day 1 (daily rotation)
  { 
    id: "lava_flow", 
    name: "Lava Flow", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    anim: "lava_flow", 
    base: { fill: "#3A1D0E", stroke: "#200E08", shine: "#FFF0DD" } 
  },
  { 
    id: "aurora_veil", 
    name: "Aurora Veil", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    anim: "aurora_veil", 
    base: { fill: "#101424", stroke: "#0A0F1C", shine: "#F3FAFF" } 
  },

  // Mythics - Always unlocked on day 1 (daily rotation)
  { 
    id: "nebula", 
    name: "Nebula", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    bio: "Deep space with parallax stars and cosmic swirls.",
    kind: "animated",
    colors: ["#5b2d8f", "#1b1e4b", "#0f1530"]
  },
  { 
    id: "phoenix_heart", 
    name: "Phoenix Heart", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Available in Shop' },
    bio: "Ember rise with glowing trail and heart pulse.",
    kind: "animated",
    colors: ["#ff7a3c", "#d12525", "#571616"]
  },

  // ===== BIOME UNLOCK REWARDS =====
  // These slimes are unlocked automatically when biomes are mastered (not purchasable)
  
  // Meadow unlock rewards
  { 
    id: "clover", 
    name: "Clover", 
    tier: "common", 
    source: "production", 
    origin: { type: 'biome', source: 'meadow', displayName: 'Unlocked in Meadow' },
    base: { fill: "#65a30d", stroke: "#365314", shine: "#d9f99d" } 
  },

  // Shoreline unlock rewards  
  { 
    id: "sea_breeze", 
    name: "Sea Breeze", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'beach', displayName: 'Unlocked at Shoreline' },
    gradient: { stops: [["#67e8f9", 0], ["#0ea5e9", 100]], dir: "180deg" },
    base: { fill: "#67e8f9", stroke: "#0c4a6e", shine: "#e0f2fe" } 
  },
  { 
    id: "raindrop", 
    name: "Raindrop", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'beach', displayName: 'Unlocked at Shoreline' },
    gradient: { stops: [["#e0e7ff", 0], ["#6366f1", 100]], dir: "180deg" },
    base: { fill: "#e0e7ff", stroke: "#3730a3", shine: "#f1f5f9" } 
  },
  { 
    id: "ocean_drift", 
    name: "Ocean Drift", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'beach', displayName: 'Unlocked at Shoreline' },
    pattern: { type: "flowing_waves", amplitude: 3, period: 8, color: "#0ea5e9", alpha: 0.15 },
    base: { fill: "#67e8f9", stroke: "#0c4a6e", shine: "#e0f2fe" } 
  },

  // Volcano unlock rewards
  { 
    id: "magma_vein", 
    name: "Magma Vein", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'volcano', displayName: 'Unlocked in Volcano' },
    pattern: { type: "lava_veins", width: 2, color: "#f97316", alpha: 0.2 },
    base: { fill: "#7f1d1d", stroke: "#450a0a", shine: "#fed7d7" } 
  },
  { 
    id: "ember_bed", 
    name: "Ember Bed", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'volcano', displayName: 'Unlocked in Volcano' },
    anim: "ember_glow",
    base: { fill: "#dc2626", stroke: "#7f1d1d", shine: "#fecaca" } 
  },

  // Glacier unlock rewards
  { 
    id: "glacier", 
    name: "Glacier", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'glacier', displayName: 'Unlocked in Glacier' },
    gradient: { stops: [["#f0f9ff", 0], ["#0ea5e9", 100]], dir: "180deg" },
    base: { fill: "#f0f9ff", stroke: "#0c4a6e", shine: "#e0f2fe" } 
  },
  { 
    id: "frost_breath", 
    name: "Frost Breath", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'glacier', displayName: 'Unlocked in Glacier' },
    anim: "frost_crystals",
    base: { fill: "#e0f2fe", stroke: "#0c4a6e", shine: "#f0f9ff" } 
  },
  { 
    id: "moonlit_pool", 
    name: "Moonlit Pool", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'glacier', displayName: 'Unlocked in Glacier' },
    pattern: { type: "moonlight_ripples", alpha: 0.12 },
    base: { fill: "#1e293b", stroke: "#0f172a", shine: "#e2e8f0" } 
  },

  // Night Sky unlock rewards  
  { 
    id: "star_parade", 
    name: "Star Parade", 
    tier: "mythic", 
    source: "production", 
    bio: "Lace of marching stars in cosmic formation.",
    kind: "animated",
    colors: ["#0f3d4b", "#062a36", "#08202a"], 
    origin: { type: 'biome', source: 'observatory', displayName: 'Unlocked in Night Sky' },
    anim: "twinkling_stars",
    base: { fill: "#0f172a", stroke: "#020617", shine: "#f8fafc" } 
  },
  { 
    id: "galaxy_swirl", 
    name: "Galaxy Swirl", 
    tier: "mythic", 
    source: "production", 
    bio: "Spiral tint with comet trail and stellar rotation.",
    kind: "animated",
    colors: ["#6a6bd6", "#3443a3", "#1a2454"], 
    origin: { type: 'biome', source: 'observatory', displayName: 'Unlocked in Night Sky' },
    anim: "spiral_galaxy",
    base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" } 
  },

  // ===== NEW BIOME COVERAGE SLIMES =====
  // Forest (World 3)
  { 
    id: "canopy_lantern", 
    name: "Canopy Lantern", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'forest', displayName: 'Unlocked in Forest' },
    bio: "Wears sunlight like a secret. Fireflies use it as a lamp.",
    anim: "leaf_shadow_dapple",
    gradient: { stops: [["#207a4f", 0], ["#2ea271", 100]], dir: "180deg" },
    base: { fill: "#207a4f", stroke: "#0b3b28", shine: "#a7f3d0" } 
  },
  { 
    id: "moss_quilt", 
    name: "Moss Quilt", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'forest', displayName: 'Unlocked in Forest' },
    bio: "Collects naps in shady squares.",
    pattern: { type: "moss_patches", size: "large", density: "sparse" },
    base: { fill: "#2e7d5a", stroke: "#0b3b28", shine: "#5aa87f" } 
  },
  { 
    id: "acorn_buddy", 
    name: "Acorn Buddy", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'forest', displayName: 'Unlocked in Forest' },
    bio: "Hides snacks for friends. Forgets where, finds better ones.",
    pattern: { type: "acorn_crowns", placement: "edges", density: "sparse" },
    base: { fill: "#6c8a3a", stroke: "#365314", shine: "#e7f1bf" } 
  },

  // Cove (World 5)
  { 
    id: "pearl_whisper", 
    name: "Pearl Whisper", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'cove', displayName: 'Unlocked in Cove' },
    bio: "Keeps a pocket pearl for wishes.",
    anim: "diagonal_pearl_gleam",
    gradient: { stops: [["#70c6c0", 0], ["#f2f7ff", 100]], dir: "45deg" },
    base: { fill: "#70c6c0", stroke: "#0c4a6e", shine: "#f2f7ff" } 
  },
  { 
    id: "kelp_curl", 
    name: "Kelp Curl", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'cove', displayName: 'Unlocked in Cove' },
    bio: "Braids seaweed when bored.",
    pattern: { type: "kelp_fronds", placement: "sides", period: 10 },
    base: { fill: "#267a6f", stroke: "#134e4a", shine: "#9be1d9" } 
  },
  { 
    id: "tide_glass", 
    name: "Tide Glass", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'cove', displayName: 'Unlocked in Cove' },
    bio: "See-through enough to hide giggles.",
    gradient: { stops: [["#78d3d0", 0], ["#e9fbfb", 100]], dir: "180deg" },
    base: { fill: "#78d3d0", stroke: "#0c4a6e", shine: "#e9fbfb" } 
  },

  // Tundra (World 6)
  { 
    id: "snow_lantern", 
    name: "Snow Lantern", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'tundra', displayName: 'Unlocked in Tundra' },
    bio: "Keeps a secret spark under all that hush.",
    anim: "inner_glow_snowfall",
    gradient: { stops: [["#9fd3e6", 0], ["#eaf7ff", 100]], dir: "180deg" },
    base: { fill: "#9fd3e6", stroke: "#2e5a6d", shine: "#eaf7ff" } 
  },
  { 
    id: "frost_fern", 
    name: "Frost Fern", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'tundra', displayName: 'Unlocked in Tundra' },
    bio: "Draws winter on windows, then says sorry.",
    pattern: { type: "frost_leaves", placement: "perimeter", color: "#7fb7ca" },
    base: { fill: "#cfeff8", stroke: "#0c1c2e", shine: "#f0f9ff" } 
  },
  { 
    id: "drift_puff", 
    name: "Drift Puff", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'tundra', displayName: 'Unlocked in Tundra' },
    bio: "Collects quiet the way clouds collect cold.",
    anim: "snow_drift_rise",
    gradient: { stops: [["#bfe7f4", 0], ["#ffffff", 100]], dir: "180deg" },
    base: { fill: "#bfe7f4", stroke: "#0c1c2e", shine: "#ffffff" } 
  },

  // Canyon (World 7)
  { 
    id: "redwall_glow", 
    name: "Redwall Glow", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'canyon', displayName: 'Unlocked in Canyon' },
    bio: "Knows a thousand echo spots.",
    anim: "sandstone_banding_parallax",
    gradient: { stops: [["#b3562e", 0], ["#d67b4d", 100]], dir: "180deg" },
    base: { fill: "#b3562e", stroke: "#2a1108", shine: "#fed7aa" } 
  },
  { 
    id: "desert_varnish", 
    name: "Desert Varnish", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'canyon', displayName: 'Unlocked in Canyon' },
    bio: "Shines when stories get old enough.",
    pattern: { type: "mineral_flecks", density: "sparse", color: "#322014" },
    base: { fill: "#a14a2a", stroke: "#2a1108", shine: "#fed7aa" } 
  },
  { 
    id: "swallow_sweep", 
    name: "Swallow Sweep", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'canyon', displayName: 'Unlocked in Canyon' },
    bio: "Races the wind and loses politely.",
    anim: "bird_silhouettes_edge",
    gradient: { stops: [["#cf7e50", 0], ["#f4c4a2", 100]], dir: "180deg" },
    base: { fill: "#cf7e50", stroke: "#2a1108", shine: "#f4c4a2" } 
  },

  // Aurora (World 8)
  { 
    id: "aurora_veil_plus", 
    name: "Aurora Veil+", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'aurora', displayName: 'Unlocked in Aurora' },
    bio: "Sews the night with color ribbons.",
    anim: "vertical_hue_curtain",
    gradient: { stops: [["#43e0c6", 0], ["#b189ff", 100]], dir: "180deg" },
    base: { fill: "#43e0c6", stroke: "#EAF4FF", shine: "#b189ff" } 
  },
  { 
    id: "polar_crown", 
    name: "Polar Crown", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'aurora', displayName: 'Unlocked in Aurora' },
    bio: "Wears the sky like a hat.",
    pattern: { type: "crown_halo", placement: "top", pulse: "slow" },
    base: { fill: "#86c5ff", stroke: "#EAF4FF", shine: "#e6f6ff" } 
  },
  { 
    id: "ionosong", 
    name: "Ionōsong", 
    tier: "mythic", 
    source: "production", 
    bio: "Aurora waves that 'sing' with ionospheric harmony.",
    kind: "animated",
    colors: ["#2fd2ff", "#6a79ff", "#121842"], 
    origin: { type: 'biome', source: 'aurora', displayName: 'Unlocked in Aurora' },
    anim: "star_motes_waves",
    base: { fill: "#0f1b3d", stroke: "#EAF4FF", shine: "#c7d2fe" } 
  },

  // Savanna (World 9)
  { 
    id: "acacia_shade", 
    name: "Acacia Shade", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'savanna', displayName: 'Unlocked in Savanna' },
    bio: "Picks favorite clouds and names them.",
    anim: "tree_shadow_sway",
    gradient: { stops: [["#e0b45a", 0], ["#f7ddb0", 100]], dir: "180deg" },
    base: { fill: "#e0b45a", stroke: "#6d4a1a", shine: "#f7ddb0" } 
  },
  { 
    id: "grass_run", 
    name: "Grass Run", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'savanna', displayName: 'Unlocked in Savanna' },
    bio: "Ticklish at the ankles.",
    pattern: { type: "tall_grass", placement: "base", sway: "light" },
    gradient: { stops: [["#c9d66c", 0], ["#f2f6c6", 100]], dir: "180deg" },
    base: { fill: "#c9d66c", stroke: "#3a2b12", shine: "#f2f6c6" } 
  },
  { 
    id: "sun_drum", 
    name: "Sun Drum", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'savanna', displayName: 'Unlocked in Savanna' },
    bio: "Beats time for walking songs.",
    anim: "sun_disk_heartbeat",
    gradient: { stops: [["#ffcc66", 0], ["#fff3cc", 100]], dir: "180deg" },
    base: { fill: "#ffcc66", stroke: "#3a2b12", shine: "#fff3cc" } 
  },

  // Reef (World 12)
  { 
    id: "coral_chorus", 
    name: "Coral Chorus", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'reef', displayName: 'Unlocked in Reef' },
    bio: "Hums bubble-opera at dawn.",
    anim: "coral_color_shift",
    gradient: { stops: [["#ff7e6b", 0], ["#2fd3c9", 100]], dir: "180deg" },
    base: { fill: "#ff7e6b", stroke: "#072435", shine: "#f0fdfa" } 
  },
  { 
    id: "anemone_wiggle", 
    name: "Anemone Wiggle", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'reef', displayName: 'Unlocked in Reef' },
    bio: "Waves hello with too many hands.",
    pattern: { type: "tentacle_frills", placement: "bottom", motion: "subtle" },
    base: { fill: "#ff9ea0", stroke: "#072435", shine: "#ffd2d3" } 
  },
  { 
    id: "shell_gleam", 
    name: "Shell Gleam", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'reef', displayName: 'Unlocked in Reef' },
    bio: "Collects shiny no-one-elses.",
    pattern: { type: "pearl_specks", count: "3-5", effect: "gentle_glint" },
    gradient: { stops: [["#8de3de", 0], ["#f6ffff", 100]], dir: "180deg" },
    base: { fill: "#8de3de", stroke: "#072435", shine: "#f6ffff" } 
  },

  // Temple (World 13)
  { 
    id: "glyph_bloom", 
    name: "Glyph Bloom", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'temple', displayName: 'Unlocked in Temple' },
    bio: "Reads old light like bedtime stories.",
    anim: "glowing_glyphs_fade",
    gradient: { stops: [["#6a5d4a", 0], ["#d9c7a6", 100]], dir: "180deg" },
    base: { fill: "#6a5d4a", stroke: "#4a3728", shine: "#d9c7a6" } 
  },
  { 
    id: "vine_inlay", 
    name: "Vine Inlay", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'temple', displayName: 'Unlocked in Temple' },
    bio: "Carries keys it can't explain.",
    pattern: { type: "green_inlay_lines", placement: "border", motion: "slow_creep" },
    base: { fill: "#907a5d", stroke: "#4a3728", shine: "#5aa26b" } 
  },
  { 
    id: "incense_drift", 
    name: "Incense Drift", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'temple', displayName: 'Unlocked in Temple' },
    bio: "Smells like quiet mornings.",
    anim: "smoke_curls_corners",
    gradient: { stops: [["#b79f80", 0], ["#f0e7d8", 100]], dir: "180deg" },
    base: { fill: "#b79f80", stroke: "#4a3728", shine: "#f0e7d8" } 
  },

  // Harbor (World 14)
  { 
    id: "lighthouse_wink", 
    name: "Lighthouse Wink", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'harbor', displayName: 'Unlocked in Harbor' },
    bio: "Watches storms with a brave little eye.",
    anim: "sweeping_beam_diagonal",
    gradient: { stops: [["#5a82b8", 0], ["#dbe8ff", 100]], dir: "180deg" },
    base: { fill: "#5a82b8", stroke: "#1e3a8a", shine: "#dbe8ff" } 
  },
  { 
    id: "rope_coil", 
    name: "Rope Coil", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'harbor', displayName: 'Unlocked in Harbor' },
    bio: "Ties perfect knots, forgets why.",
    pattern: { type: "thick_rope", placement: "base", static: true },
    base: { fill: "#c8a06d", stroke: "#1e3a8a", shine: "#8a6435" } 
  },
  { 
    id: "foam_crest", 
    name: "Foam Crest", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'harbor', displayName: 'Unlocked in Harbor' },
    bio: "Saves gull jokes for later.",
    pattern: { type: "foam_caps", placement: "bottom_edge", motion: "lapping" },
    gradient: { stops: [["#74b7e4", 0], ["#e9f7ff", 100]], dir: "180deg" },
    base: { fill: "#74b7e4", stroke: "#1e3a8a", shine: "#e9f7ff" } 
  },

  // Foundry (World 16)
  { 
    id: "anvil_ember", 
    name: "Anvil Ember", 
    tier: "epic", 
    source: "production", 
    origin: { type: 'biome', source: 'foundry', displayName: 'Unlocked in Foundry' },
    bio: "Hums old workshop songs.",
    anim: "heat_shimmer_sparks",
    base: { fill: "#151515", stroke: "#0a0a0a", shine: "#ff6a00" } 
  },
  { 
    id: "forge_rune", 
    name: "Forge Rune", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'biome', source: 'foundry', displayName: 'Unlocked in Foundry' },
    bio: "Stamps its name, changes it weekly.",
    pattern: { type: "glowing_runes", trigger: "tap", color: "#ff8a2a" },
    base: { fill: "#332b28", stroke: "#0a0a0a", shine: "#ff8a2a" } 
  },
  { 
    id: "quench_mist", 
    name: "Quench Mist", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'biome', source: 'foundry', displayName: 'Unlocked in Foundry' },
    bio: "Breathes warm, sighs cool.",
    anim: "steam_puffs_corners",
    gradient: { stops: [["#2a2a2a", 0], ["#5f6a71", 100]], dir: "180deg" },
    base: { fill: "#2a2a2a", stroke: "#0a0a0a", shine: "#5f6a71" } 
  },

  // === ENHANCED VARIANTS (ALL TIERS) ===
  // Enhanced Common Slimes
  { 
    id: "moss_enhanced", 
    name: "Moss Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Calm forest green with leaf highlight and micro-identity.",
    kind: "solid",
    colors: ["#3FA05A"]
  },
  { 
    id: "sky_enhanced", 
    name: "Sky Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Breezy powder blue with cloud highlight and micro-identity.",
    kind: "solid",
    colors: ["#9ECBF6"]
  },
  { 
    id: "coral_enhanced", 
    name: "Coral Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Friendly warm pink-orange with smile highlight and micro-identity.",
    kind: "solid",
    colors: ["#FF7D6E"]
  },
  { 
    id: "charcoal_enhanced", 
    name: "Charcoal Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Bold deep gray with teal face and chip highlight.",
    kind: "solid",
    colors: ["#2B2F36"]
  },
  { 
    id: "clover_enhanced", 
    name: "Clover Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Lucky garden green with seed highlight and micro-identity.",
    kind: "solid",
    colors: ["#6FBF2E"]
  },

  // Enhanced Uncommon Slimes
  { 
    id: "spring_fade_enhanced", 
    name: "Spring Fade Enhanced", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Evergreen to golden fade with sheen and rim effects.",
    kind: "gradient",
    colors: ["#C8F39B", "#FFE69A"]
  },
  { 
    id: "blue_lagoon_enhanced", 
    name: "Blue Lagoon Enhanced", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Aqua to deep lagoon with cool rim lighting.",
    kind: "gradient",
    colors: ["#55C3E0", "#2563EB"]
  },
  { 
    id: "sea_breeze_enhanced", 
    name: "Sea Breeze Enhanced", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Shoreline breeze with enhanced gradient effects.",
    kind: "gradient",
    colors: ["#7FD8D3", "#2F9E9A"]
  },
  { 
    id: "raindrop_enhanced", 
    name: "Raindrop Enhanced", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Wet droplet with large sheen and enhanced lighting.",
    kind: "gradient",
    colors: ["#A9D6FF", "#5E86D6"]
  },
  { 
    id: "acorn_buddy_enhanced", 
    name: "Acorn Buddy Enhanced", 
    tier: "uncommon", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Leafy olive to acorn gold with forest charm.",
    kind: "gradient",
    colors: ["#7A9A2D", "#C18A2E"]
  },

  // Enhanced Rare Slimes
  { 
    id: "polka_mint_enhanced", 
    name: "Polka Mint Enhanced", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Mint with polka dot patterns and glossy highlights.",
    kind: "gradient",
    colors: ["#DDF7EC", "#BFEFD8"]
  },
  { 
    id: "ripple_enhanced", 
    name: "Ripple Enhanced", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Concentric ripple patterns with water effects.",
    kind: "gradient",
    colors: ["#BDEDE4", "#6FC6BE"]
  },
  { 
    id: "ocean_drift_enhanced", 
    name: "Ocean Drift Enhanced", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Wave ridge patterns with oceanic depth.",
    kind: "gradient",
    colors: ["#BDEBFF", "#5DC3F2"]
  },
  { 
    id: "moonlit_pool_enhanced", 
    name: "Moonlit Pool Enhanced", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Starry pool with radial moonlight and night patterns.",
    kind: "gradient",
    colors: ["#9AA5B1", "#4D5A67"]
  },
  { 
    id: "moss_quilt_enhanced", 
    name: "Moss Quilt Enhanced", 
    tier: "rare", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Forest moss with diamond quilting patterns.",
    kind: "gradient",
    colors: ["#98C08F", "#51855A"]
  },

  // Enhanced Mythic Slimes (MERGED INTO ORIGINALS - REMOVED)

  // Pre-Production Enhanced Mythics
  { 
    id: "mirage_enhanced", 
    name: "Mirage Enhanced", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Heat shimmer creates desert mirage illusions.",
    kind: "animated",
    colors: ["#ffe7b0", "#ffc178", "#7a4b11"]
  },
  { 
    id: "frog_chorus_enhanced", 
    name: "Frog Chorus Enhanced", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Swampy musical glow with croaking rhythm.",
    kind: "animated",
    colors: ["#1f8a52", "#0e5b3a", "#0a3b27"]
  },
  { 
    id: "biolume_veil_enhanced", 
    name: "Biolume Veil Enhanced", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Cave bioluminescence curtain with flowing light.",
    kind: "animated",
    colors: ["#0d1b2a", "#16e0ae", "#0a1420"]
  },
  { 
    id: "echo_rune_enhanced", 
    name: "Echo Rune Enhanced", 
    tier: "mythic", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Ancient runes that flash with mystical beats.",
    kind: "animated",
    colors: ["#2a2f3b", "#0b7a63", "#141821"]
  },
  // Synthwave Enhanced (MERGED INTO ORIGINAL - REMOVED)

  // Pre-Production Commons (originals for comparison)
  { 
    id: "murk", 
    name: "Murk", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production' },
    bio: "Swampy graphite-blue.",
    kind: "solid",
    colors: ["#3C4953"]
  },
  { 
    id: "bluebird", 
    name: "Bluebird", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production' },
    bio: "Saturated azure.",
    kind: "solid",
    colors: ["#2E77FF"]
  },
  { 
    id: "apple_shine", 
    name: "Apple Shine", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production' },
    bio: "Cheerful red.",
    kind: "solid",
    colors: ["#E9413B"]
  },
  { 
    id: "honey", 
    name: "Honey", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production' },
    bio: "Warm golden honey.",
    kind: "solid",
    colors: ["#F7C437"]
  },
  { 
    id: "lilac", 
    name: "Lilac", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production' },
    bio: "Soft purple lilac.",
    kind: "solid",
    colors: ["#BDA7FF"]
  },

  // Missing Production Enhanced Commons  
  { 
    id: "green_enhanced", 
    name: "Green Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Classic green with micro-identity highlights.",
    kind: "solid",
    colors: ["#22c55e"]
  },
  { 
    id: "mint_enhanced", 
    name: "Mint Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Fresh mint with micro-identity highlights.",
    kind: "solid",
    colors: ["#4ade80"]
  },
  { 
    id: "blueberry_enhanced", 
    name: "Blueberry Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' },
    bio: "Sweet blueberry with micro-identity highlights.",
    kind: "solid",
    colors: ["#60a5fa"]
  },

  // Pre-Production Enhanced Commons
  { 
    id: "murk_enhanced", 
    name: "Murk Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production Enhanced' },
    bio: "Swampy graphite-blue with micro-identity highlights.",
    kind: "solid",
    colors: ["#3C4953"]
  },
  { 
    id: "bluebird_enhanced", 
    name: "Bluebird Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production Enhanced' },
    bio: "Saturated azure with arc-shaped highlights.",
    kind: "solid",
    colors: ["#2E77FF"]
  },
  { 
    id: "apple_shine_enhanced", 
    name: "Apple Shine Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production Enhanced' },
    bio: "Cheerful red with apple seed highlight shape.",
    kind: "solid",
    colors: ["#E9413B"]
  },
  { 
    id: "honey_enhanced", 
    name: "Honey Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production Enhanced' },
    bio: "Warm golden honey with stripe highlights.",
    kind: "solid",
    colors: ["#F7C437"]
  },
  { 
    id: "lilac_enhanced", 
    name: "Lilac Enhanced", 
    tier: "common", 
    source: "production", 
    origin: { type: 'shop', source: 'shop', displayName: 'Pre-Production Enhanced' },
    bio: "Soft purple lilac with cloud-shaped highlights.",
    kind: "solid",
    colors: ["#BDA7FF"]
  },
];

// ===== INSPIRATION SKINS (from skinspiration.ts) =====

// Common skins (flat colors)
export const INSPIRATION_COMMON: UnifiedSkin[] = [
  // Previous production skins (demoted)
  { id: "green_legacy", name: "Green (Legacy)", tier: "common", source: "inspiration", kind: "solid", colors: ["#22c55e"] },
  { id: "mint_legacy", name: "Mint (Legacy)", tier: "common", source: "inspiration", kind: "solid", colors: ["#4ade80"] },
  { id: "blueberry_legacy", name: "Blueberry (Legacy)", tier: "common", source: "inspiration", kind: "solid", colors: ["#60a5fa"] },
  
  // Original inspiration commons
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
  { id: "citrus_pop", name: "Citrus Pop", tier: "uncommon", source: "production", gradient: { stops: [["#fef08a", 0], ["#84cc16", 100]], dir: "diag" } },
  { id: "lavender_drift", name: "Lavender Drift", tier: "uncommon", source: "inspiration", gradient: { stops: [["#e9d5ff", 0], ["#a78bfa", 100]], dir: "diag" } },
  { id: "copper_patina", name: "Copper Patina", tier: "uncommon", source: "inspiration", gradient: { stops: [["#2dd4bf", 0], ["#b45309", 100]], dir: "diag" } },

];

// Rare skins (static patterns)
export const INSPIRATION_RARE: UnifiedSkin[] = [
  // Previous production skins (demoted)
  { id: "tangerine_legacy", name: "Tangerine (Legacy)", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#fb923c", "#f59e0b"] },
  { id: "bubblegum_legacy", name: "Bubblegum (Legacy)", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#f472b6", "#fbcfe8"] },
  
  // Original inspiration rares
  { id: "bumble", name: "Bumble", tier: "rare", source: "inspiration", base: { fill: "#fde047", stroke: "#92400e", shine: "#fef9c3" }, pattern: "stripes" },
  { id: "starlet", name: "Starlet", tier: "rare", source: "inspiration", base: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" }, pattern: "starlet" },
  { id: "pebble", name: "Pebble", tier: "rare", source: "inspiration", base: { fill: "#d1fae5", stroke: "#065f46", shine: "#bbf7d0" }, pattern: "pebble" },
  { id: "plaid", name: "Picnic", tier: "rare", source: "inspiration", base: { fill: "#fee2e2", stroke: "#7f1d1d", shine: "#fecaca" }, pattern: "plaid" },
  { id: "puddles", name: "Puddles", tier: "rare", source: "inspiration", base: { fill: "#bfdbfe", stroke: "#1d4ed8", shine: "#dbeafe" }, pattern: "puddles" },
  { id: "zigzag", name: "Zigzag", tier: "rare", source: "inspiration", base: { fill: "#fde68a", stroke: "#92400e", shine: "#fef9c3" }, pattern: "zigzag" },
  { id: "confetti", name: "Confetti", tier: "rare", source: "inspiration", base: { fill: "#fefce8", stroke: "#6b7280", shine: "#fef9c3" }, pattern: "confetti" },
  { id: "scales", name: "Scales", tier: "rare", source: "inspiration", base: { fill: "#bbf7d0", stroke: "#065f46", shine: "#dcfce7" }, pattern: "scales" },
  { id: "hearts", name: "Hearts", tier: "rare", source: "inspiration", base: { fill: "#fecdd3", stroke: "#9f1239", shine: "#ffe4e6" }, pattern: "hearts" },

  // Cave / Shadow / Earth Theme
  { id: "deep_dark_cave", name: "Deep Dark Cave", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#0ea5e9", "#312e81"], 
    bio: "Teal-to-indigo body with a soft center-out vignette like a mysterious hole. The vignette breathes gently in 6.5-second cycles.", origin: { type: 'biome', source: 'cave', displayName: 'Cave' } },
  { id: "never_ending_cave", name: "Never-Ending Cave", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#475569", "#1f2937"], 
    bio: "Cool gray with concentric ring hints suggesting an endless tunnel. Inner rings drift inward before fading away.", origin: { type: 'biome', source: 'cave', displayName: 'Cave/Canyon' } },
  { id: "spooky_cave", name: "Spooky Cave", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#4338ca", "#1e1b4b"], 
    bio: "Dusk purple with faint mist rolling near the bottom. The ethereal mist drifts sideways in 6-second cycles.", origin: { type: 'biome', source: 'cave', displayName: 'Cave' } },
  { id: "fault_glow", name: "Fault Glow", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#6b7280", "#374151"], 
    bio: "Stone gray body cut by a thin amber seam like a geological fault line. The seam pulses with brief brightness every 7 seconds.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon' } },
  { id: "aftershock", name: "Aftershock", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#111827", "#374151"], 
    bio: "Muted basalt with a subtle oval ripple imprint. Ripples expand and fade in 6.8-second tremors.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon/Foundry' } },

  // Fire / Heat / Ash Theme
  { id: "ember_rim", name: "Ember Rim", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#ea580c", "#b45309"], 
    bio: "Deep orange with darker edges and a thin ember ring. The ring glows and dims in 6-second cycles.", origin: { type: 'biome', source: 'volcano', displayName: 'Volcano' } },
  { id: "ashfall", name: "Ashfall", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#9a3412", "#7c2d12"], 
    bio: "Red-brown body with sparse ash flecks drifting downward. 1-2 flecks fall every 7-9 seconds.", origin: { type: 'biome', source: 'volcano', displayName: 'Volcano' } },
  { id: "volcanic_glass", name: "Volcanic Glass", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#0f172a", "#111827"], 
    bio: "Near-black obsidian with a glassy diagonal highlight. The highlight sweeps across in 7-second intervals.", origin: { type: 'biome', source: 'volcano', displayName: 'Volcano/Foundry' } },

  // Sand / Wind Theme
  { id: "sandstorm_wall", name: "Sandstorm Wall", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#fde68a", "#f59e0b"], 
    bio: "Warm sand with a side gradient wall moving right to left. The wall slides across in 6-second gusts.", origin: { type: 'biome', source: 'desert', displayName: 'Desert' } },
  { id: "dune_surge", name: "Dune Surge", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#f5e6c4", "#eab308"], 
    bio: "Beige base with a single S-curve dune band. The band shifts diagonally in 6.5-second movements.", origin: { type: 'biome', source: 'desert', displayName: 'Desert' } },
  { id: "whirlwind_edge", name: "Whirlwind Edge", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#f3e8d7", "#fde68a"], 
    bio: "Pale tan with a faint spiral near one side. The spiral rotates 8° back-and-forth in 7-second cycles.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon/Desert' } },

  // Water / Tides / Storm Theme
  { id: "riptide_bowl", name: "Riptide Bowl", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#22d3ee", "#2563eb"], 
    bio: "Aqua-to-deep blue with a curved inner rim creating a bowl effect. The rim drifts with soft shimmer in 6-second waves.", origin: { type: 'biome', source: 'cove', displayName: 'Cove/Harbor' } },
  { id: "whirlpool_eye", name: "Whirlpool Eye", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#14b8a6", "#0ea5e9"], 
    bio: "Teal with subtle spiral rings drawing toward the center. Rings tighten and ease in 6.2-second cycles.", origin: { type: 'biome', source: 'reef', displayName: 'Reef/Cove' } },
  { id: "monsoon_sheet", name: "Monsoon Sheet", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#60a5fa", "#1e40af"], 
    bio: "Steel blue with a thin vertical rain sheet. The sheet slides downward in 6.5-second downpours.", origin: { type: 'biome', source: 'harbor', displayName: 'Harbor/Day Sky' } },

  // Ice / Aurora / Cold Theme
  { id: "crevasse_light", name: "Crevasse Light", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#93c5fd", "#64748b"], 
    bio: "Icy gray-blue with a fine white crevasse slash. The slash flares briefly every 7 seconds.", origin: { type: 'biome', source: 'glacier', displayName: 'Glacier' } },
  { id: "black_ice", name: "Black Ice", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#334155", "#111827"], 
    bio: "Dark slate with a glass wedge highlight. The wedge slides across in 6-second intervals.", origin: { type: 'biome', source: 'glacier', displayName: 'Glacier' } },
  { id: "aurora_curtain", name: "Aurora Curtain", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#67e8f9", "#3b82f6"], 
    bio: "Cool cyan base with a soft vertical color curtain in green and rose. The curtain waves slowly in 7.5-second cycles.", origin: { type: 'biome', source: 'aurora', displayName: 'Aurora' } },

  // Sky / Lightning / Space Theme
  { id: "thunder_shelf", name: "Thunder Shelf", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#06b6d4", "#0ea5e9"], 
    bio: "Storm teal with a broad anvil shelf highlight band. The band brightens and dims in 6-second intervals.", origin: { type: 'biome', source: 'aurora', displayName: 'Aurora/Day Sky' } },
  { id: "static_sheet", name: "Static Sheet", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#0f172a", "#1f2937"], 
    bio: "Midnight navy with thin static lines at the top third. 1-2 lines blink for 150ms every ~8 seconds.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory' } },
  { id: "solar_haze", name: "Solar Haze", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#fde047", "#f59e0b"], 
    bio: "Warm gold center with soft radial haze. The haze breathes gently in 6.8-second cycles.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory/Desert' } },
  { id: "gravity_well", name: "Gravity Well", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#0b1026", "#111827"], 
    bio: "Blue-black with a subtle lensing ring off-center. The ring warps in and out in 7-second distortions.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory' } },
  { id: "prism_mist", name: "Prism Mist", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#94a3b8", "#64748b"], 
    bio: "Cool gray base with a faint triangular prism highlight showing RGB hints. The highlight slides and fades in 6-second cycles.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory/Glacier' } },

  // Metal / Forge / Industrial Theme
  { id: "forge_heat", name: "Forge Heat", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#92400e", "#d97706"], 
    bio: "Brown-to-copper with a soft heat bloom at the bottom. The bloom pulses with warmth in 6.2-second cycles.", origin: { type: 'biome', source: 'foundry', displayName: 'Foundry' } },
  { id: "quench_mist_inspiration", name: "Quench Mist", tier: "rare", source: "inspiration", kind: "gradient", colors: ["#1f2937", "#0f172a"], 
    bio: "Charcoal body with a cool steam plume wedge. The plume drifts upward in 7-second intervals.", origin: { type: 'biome', source: 'foundry', displayName: 'Foundry' } },

  // === EPIC TIER SLIMES ===
  
  // Production Epic Enhanced Versions (only existing epics)
  { id: "lava_flow_enhanced", name: "Lava Flow Enhanced", tier: "epic", source: "production", kind: "gradient", colors: ["#f87171", "#fb923c", "#b45309"],
    bio: "Enhanced lava flow with amplified vein noise and more frequent ember sparks.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "aurora_veil_enhanced", name: "Aurora Veil Enhanced", tier: "epic", source: "production", kind: "gradient", colors: ["#60a5fa", "#8b5cf6", "#22d3ee"],
    bio: "Enhanced aurora veil with micro-identity highlights and improved band movement.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "glacier_enhanced", name: "Glacier Enhanced", tier: "epic", source: "production", kind: "gradient", colors: ["#93c5fd", "#60a5fa", "#e0f2fe"],
    bio: "Enhanced glacier with amplified caustic effects and micro-identity highlights.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "aurora_veil_plus_enhanced", name: "Aurora Veil+ Enhanced", tier: "epic", source: "production", kind: "gradient", colors: ["#60a5fa", "#8b5cf6", "#22d3ee"],
    bio: "Enhanced Aurora Veil+ with micro-identity highlights and improved parallax effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },

  // Pre-Production Epic Slimes (new concepts)
  { id: "dune_drift", name: "Dune Drift", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#fbbf24", "#f59e0b"],
    bio: "Wind-blown sand band moves right in 8-second cycles with gentle opacity.", origin: { type: 'biome', source: 'desert', displayName: 'Desert' } },
  { id: "bog_bubble", name: "Bog Bubble", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#16a34a", "#065f46"],
    bio: "Single bubble circle rises in 1-second intervals every 7-9 seconds.", origin: { type: 'biome', source: 'swamp', displayName: 'Swamp' } },
  { id: "willow_glow", name: "Willow Glow", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22c55e", "#16a34a"],
    bio: "Faint leaf silhouettes sway 5° in place over 7-second cycles.", origin: { type: 'biome', source: 'forest', displayName: 'Forest' } },
  { id: "geode_core", name: "Geode Core", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#a78bfa", "#60a5fa"],
    bio: "Inner ring shimmer rotates 8° in 8-second cycles with 2% sparkle when ring passes top.", origin: { type: 'biome', source: 'cave', displayName: 'Cave' } },
  { id: "stalactite_drip", name: "Stalactite Drip", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#64748b", "#94a3b8"],
    bio: "Downward highlight drip line moves 10px over 900ms every 8-12 seconds.", origin: { type: 'biome', source: 'cave', displayName: 'Cave' } },
  { id: "sunshower", name: "Sunshower", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#bae6fd", "#fde68a"],
    bio: "Micro sun-rays expand 20% and fade in 1.2-second intervals every 10 seconds.", origin: { type: 'biome', source: 'forest', displayName: 'Forest' } },
  { id: "rainbow_arc", name: "Rainbow Arc", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fca5a5", "#fcd34d", "#86efac", "#93c5fd", "#c4b5fd"],
    bio: "Soft pale arc drifts 3px upward and back in 5-second cycles.", origin: { type: 'biome', source: 'meadow', displayName: 'Meadow' } },
  { id: "subway_spark", name: "Subway Spark", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#334155", "#1f2937"],
    bio: "Single teal spark darts 12px then fades in 400ms every 9-12 seconds.", origin: { type: 'biome', source: 'city', displayName: 'City' } },
  { id: "billboard_blink", name: "Billboard Blink", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#312e81", "#1e1b4b"],
    bio: "Neon sweep moves left to right in 7-second cycles with slight 5% flicker at end.", origin: { type: 'biome', source: 'city', displayName: 'City' } },
  { id: "haystack", name: "Haystack", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#f59e0b"],
    bio: "Vertical straw striations drift 6px in 8-second cycles.", origin: { type: 'biome', source: 'farm', displayName: 'Farm' } },
  { id: "orchard_breeze", name: "Orchard Breeze", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22c55e", "#16a34a"],
    bio: "Leaf flecks slide sideways 10px in 7.5-second intervals.", origin: { type: 'biome', source: 'orchard', displayName: 'Orchard' } },

  // Fresh Epic Concepts (new ideas)
  { id: "harbor_wake", name: "Harbor Wake", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#14b8a6", "#2dd4bf"],
    bio: "Teal to seafoam with gentle V-shaped ripple rocking 6px in 8-second cycles.", origin: { type: 'biome', source: 'harbor', displayName: 'Harbor' } },
  { id: "temple_incense", name: "Temple Incense", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#a78bfa"],
    bio: "Sand to clay with soft vertical incense plume fading up in 1.4-second intervals every 9 seconds.", origin: { type: 'biome', source: 'temple', displayName: 'Temple' } },
  { id: "canyon_shade", name: "Canyon Shade", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#ea580c", "#78350f"],
    bio: "Terracotta to umber with drifting cliff-shadow mask in 7-second cycles.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon' } },
  { id: "reef_bloom", name: "Reef Bloom", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22d3ee", "#c4b5fd"],
    bio: "Aqua to lavender with slow rotating anemone petal mask (8° over 8 seconds).", origin: { type: 'biome', source: 'reef', displayName: 'Reef' } },
  { id: "savanna_mirage", name: "Savanna Mirage", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#d97706"],
    bio: "Pale gold to warm tan with horizontal heat-waver (3px sine, 6.5-second cycles).", origin: { type: 'biome', source: 'savanna', displayName: 'Savanna' } },
  { id: "foundry_heatwave", name: "Foundry Heatwave", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#d97706", "#b45309"],
    bio: "Copper to rust with subtle vertical shimmer and rare 1px spark pop every 10 seconds.", origin: { type: 'biome', source: 'foundry', displayName: 'Foundry' } },
  { id: "tundra_halo", name: "Tundra Halo", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#93c5fd", "#f8fafc"],
    bio: "Icy blue to white with soft circular halo breathing (1.05 scale, 7-second cycles).", origin: { type: 'biome', source: 'tundra', displayName: 'Tundra' } },
  { id: "observatory_drift", name: "Observatory Drift", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#1e1b4b", "#6366f1"],
    bio: "Midnight blue to indigo with extremely faint star drift (2 dots over 9 seconds).", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory' } },

  // Pre-Production and Fresh Epic Enhanced Versions
  { id: "dune_drift_enhanced", name: "Dune Drift Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#fbbf24", "#f59e0b"],
    bio: "Enhanced wind-blown sand with micro-identity highlights and amplified movement.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "bog_bubble_enhanced", name: "Bog Bubble Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#16a34a", "#065f46"],
    bio: "Enhanced bog bubbles with micro-identity highlights and improved bubble effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "willow_glow_enhanced", name: "Willow Glow Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22c55e", "#16a34a"],
    bio: "Enhanced willow glow with micro-identity highlights and improved leaf movement.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "geode_core_enhanced", name: "Geode Core Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#a78bfa", "#60a5fa"],
    bio: "Enhanced geode core with micro-identity highlights and amplified shimmer effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "stalactite_drip_enhanced", name: "Stalactite Drip Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#64748b", "#94a3b8"],
    bio: "Enhanced stalactite drip with micro-identity highlights and improved drip effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "sunshower_enhanced", name: "Sunshower Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#bae6fd", "#fde68a"],
    bio: "Enhanced sunshower with micro-identity highlights and amplified sun-ray effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "rainbow_arc_enhanced", name: "Rainbow Arc Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fca5a5", "#fcd34d", "#86efac", "#93c5fd", "#c4b5fd"],
    bio: "Enhanced rainbow arc with micro-identity highlights and improved drift effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "subway_spark_enhanced", name: "Subway Spark Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#334155", "#1f2937"],
    bio: "Enhanced subway spark with micro-identity highlights and improved spark effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "billboard_blink_enhanced", name: "Billboard Blink Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#312e81", "#1e1b4b"],
    bio: "Enhanced billboard blink with micro-identity highlights and improved neon effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "haystack_enhanced", name: "Haystack Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#f59e0b"],
    bio: "Enhanced haystack with micro-identity highlights and improved straw effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "orchard_breeze_enhanced", name: "Orchard Breeze Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22c55e", "#16a34a"],
    bio: "Enhanced orchard breeze with micro-identity highlights and improved leaf fleck effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "harbor_wake_enhanced", name: "Harbor Wake Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#14b8a6", "#2dd4bf"],
    bio: "Enhanced harbor wake with micro-identity highlights and amplified ripple effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "temple_incense_enhanced", name: "Temple Incense Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#a78bfa"],
    bio: "Enhanced temple incense with micro-identity highlights and improved plume effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "canyon_shade_enhanced", name: "Canyon Shade Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#ea580c", "#78350f"],
    bio: "Enhanced canyon shade with micro-identity highlights and improved shadow effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "reef_bloom_enhanced", name: "Reef Bloom Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#22d3ee", "#c4b5fd"],
    bio: "Enhanced reef bloom with micro-identity highlights and improved anemone effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "savanna_mirage_enhanced", name: "Savanna Mirage Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#fde68a", "#d97706"],
    bio: "Enhanced savanna mirage with micro-identity highlights and amplified heat-waver effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "foundry_heatwave_enhanced", name: "Foundry Heatwave Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#d97706", "#b45309"],
    bio: "Enhanced foundry heatwave with micro-identity highlights and improved shimmer effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "tundra_halo_enhanced", name: "Tundra Halo Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#93c5fd", "#f8fafc"],
    bio: "Enhanced tundra halo with micro-identity highlights and amplified halo breathing effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
  { id: "observatory_drift_enhanced", name: "Observatory Drift Enhanced", tier: "epic", source: "pre-production", kind: "gradient", colors: ["#1e1b4b", "#6366f1"],
    bio: "Enhanced observatory drift with micro-identity highlights and improved star drift effects.", origin: { type: 'shop', source: 'shop', displayName: 'Enhanced Version' } },
];

// Epic skins (gentle animated motifs)
export const INSPIRATION_EPIC: UnifiedSkin[] = [
  // Previous production skins (demoted)
  { id: "lava_legacy", name: "Lava (Legacy)", tier: "epic", source: "inspiration", kind: "animated", colors: ["#ef4444", "#f97316", "#fbbf24"] },
  { id: "aurora_legacy", name: "Aurora (Legacy)", tier: "epic", source: "inspiration", kind: "animated", colors: ["#22d3ee", "#22c55e", "#a78bfa"] },
  
  // Original inspiration epics
  { id: "ocean_anim", name: "Ocean", tier: "epic", source: "production", anim: "ocean", base: { fill: "#0ea5e9", stroke: "#075985", shine: "#bae6fd" } },
  { id: "lava_anim", name: "Lava (Inspiration)", tier: "epic", source: "inspiration", anim: "lava", base: { fill: "#f97316", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "blizzard_anim", name: "Blizzard", tier: "epic", source: "inspiration", anim: "blizzard", base: { fill: "#93c5fd", stroke: "#1e3a8a", shine: "#e0f2fe" } },
  { id: "monsoon_anim", name: "Monsoon", tier: "epic", source: "inspiration", anim: "monsoon", base: { fill: "#38bdf8", stroke: "#0c4a6e", shine: "#bae6fd" } },
  { id: "aurora_anim", name: "Aurora (Inspiration)", tier: "epic", source: "inspiration", anim: "aurora", base: { fill: "#10b981", stroke: "#065f46", shine: "#a7f3d0" } },
  { id: "firefly_anim", name: "Firefly", tier: "epic", source: "inspiration", anim: "firefly", base: { fill: "#166534", stroke: "#052e16", shine: "#bbf7d0" } },
  { id: "tidepool_anim", name: "Tidepool", tier: "epic", source: "inspiration", anim: "tidepool", base: { fill: "#06b6d4", stroke: "#083344", shine: "#a5f3fc" } },

  // New Epic Inspiration Concepts - Action & Adventure
  { id: "blaze_knight", name: "Blaze Knight", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#ef4444", "#f97316"],
    bio: "Fiery red/orange body with a faint diagonal shield band. Soft shield gleam sweep.", origin: { type: 'biome', source: 'volcano', displayName: 'Volcano' } },
  { id: "jungle_raider", name: "Jungle Raider", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#16a34a", "#065f46"],
    bio: "Deep green with a subtle strap crossing like a satchel. Strap gets a faint highlight pass.", origin: { type: 'biome', source: 'forest', displayName: 'Forest' } },
  { id: "cave_explorer", name: "Cave Explorer", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#475569", "#64748b"],
    bio: "Slate body with tiny off-center lamp halo (radial, pale yellow). Halo breathes gently.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon/Cave' } },
  { id: "sky_racer", name: "Sky Racer", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#60a5fa", "#93c5fd"],
    bio: "Azure with a racing stripe arc (white/teal) across the top. Stripe shifts horizontally.", origin: { type: 'biome', source: 'day_sky', displayName: 'Day Sky' } },
  { id: "desert_outrider", name: "Desert Outrider", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#facc15", "#f59e0b"],
    bio: "Warm sand to amber body with faint chevron on chest. Chevron gains a gentle pulse.", origin: { type: 'biome', source: 'desert', displayName: 'Desert' } },

  // Tech & Mech
  { id: "turbo_bot", name: "Turbo Bot", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#64748b", "#9ca3af"],
    bio: "Steel blue with tiny vent slots (two short dashes). Vents emit rare teal glow blinks.", origin: { type: 'biome', source: 'foundry', displayName: 'Foundry/City' } },
  { id: "neon_circuit", name: "Neon Circuit", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#312e81", "#1e1b4b"],
    bio: "Midnight violet body with a single circuit trace loop. Trace light runs around occasionally.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory/City' } },
  { id: "magnet_core", name: "Magnet Core", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#111827", "#374151"],
    bio: "Charcoal with a subtle U-magnet silhouette. Magnet emits gentle ripple rings.", origin: { type: 'biome', source: 'foundry', displayName: 'Foundry' } },
  { id: "plasma_pilot", name: "Plasma Pilot", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#22d3ee", "#06b6d4"],
    bio: "Cyan to teal body with a tiny visor glare arc. Visor glare slides smoothly.", origin: { type: 'biome', source: 'harbor', displayName: 'Harbor/Observatory' } },

  // Creatures, Monsters, Dinos
  { id: "rex_roar", name: "Rex Roar", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#22c55e", "#16a34a"],
    bio: "Bold green with faint scale band (low contrast). Scale band drifts diagonally.", origin: { type: 'biome', source: 'savanna', displayName: 'Savanna/Forest' } },
  { id: "thunder_lizard", name: "Thunder Lizard", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#84cc16", "#a16207"],
    bio: "Olive to umber with tiny bone/plate ticks near the top. Plates shimmer in stagger.", origin: { type: 'biome', source: 'canyon', displayName: 'Canyon' } },
  { id: "slimezilla_jr", name: "Slimezilla Jr.", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#0ea5e9", "#0d9488"],
    bio: "Deep teal with a subtle dorsal ridge silhouette. Ridge highlight rolls smoothly.", origin: { type: 'biome', source: 'reef', displayName: 'Reef/Harbor' } },

  // Sports & Speed
  { id: "goal_streak", name: "Goal Streak", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#16a34a", "#22c55e"],
    bio: "Pitch green with a pale panel arc (soccer vibe). Quick streak line flashes occasionally.", origin: { type: 'biome', source: 'meadow', displayName: 'Meadow' } },
  { id: "home_run", name: "Home Run", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#fef3c7", "#fde68a"],
    bio: "Cream to sand body with a single stitch curve (red). Stitch casts a subtle shadow sweep.", origin: { type: 'biome', source: 'harbor', displayName: 'Harbor/Farm' } },
  { id: "drift_king", name: "Drift King", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#4b5563", "#94a3b8"],
    bio: "Smoky gray with a tire-s-curve gloss. S-curve moves sideways with smooth easing.", origin: { type: 'biome', source: 'city', displayName: 'City/Canyon' } },

  // Pirates, Space, Fantasy
  { id: "star_captain", name: "Star Captain", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#0f172a", "#1e1b4b"],
    bio: "Navy to indigo with a small gold star badge. Star badge twinkles occasionally.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory/Harbor' } },
  { id: "coral_corsair", name: "Coral Corsair", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#14b8a6", "#0ea5e9"],
    bio: "Reef teal with a faint bandana knot shape. Knot highlight tilts gently back and forth.", origin: { type: 'biome', source: 'reef', displayName: 'Reef' } },
  { id: "rune_sprinter", name: "Rune Sprinter", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#b45309", "#d97706"],
    bio: "Warm copper with two short rune dashes. Runes glow on in sequence then fade.", origin: { type: 'biome', source: 'temple', displayName: 'Temple/Foundry' } },
  { id: "meteor_glide", name: "Meteor Glide", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#475569", "#64748b"],
    bio: "Blue-gray with a soft meteoroid streak diagonal. Streak slides with tiny spark pop at tail.", origin: { type: 'biome', source: 'observatory', displayName: 'Observatory' } },
  { id: "storm_rider", name: "Storm Rider", tier: "epic", source: "inspiration", kind: "gradient", colors: ["#22d3ee", "#06b6d4"],
    bio: "Electric teal with a single bolt glyph. Bolt fades with micro ripple expansion.", origin: { type: 'biome', source: 'aurora', displayName: 'Aurora/Glacier' } },
  { id: "sandstorm_anim", name: "Sandstorm", tier: "epic", source: "inspiration", anim: "sandstorm", base: { fill: "#f5d0a5", stroke: "#92400e", shine: "#fde68a" } },
  { id: "thunderhead_anim", name: "Thunderhead", tier: "epic", source: "inspiration", anim: "thunderhead", base: { fill: "#94a3b8", stroke: "#334155", shine: "#e2e8f0" } },
  { id: "breeze_anim", name: "Breeze", tier: "epic", source: "inspiration", anim: "breeze", base: { fill: "#a7f3d0", stroke: "#065f46", shine: "#d1fae5" } },
];

// Mythic skins (premium effects)
export const INSPIRATION_MYTHIC: UnifiedSkin[] = [
  // Previous production skins (demoted)
  { id: "nebula_legacy", name: "Nebula (Legacy)", tier: "mythic", source: "inspiration", kind: "animated", colors: ["#6d28d9", "#7c3aed", "#0ea5e9"] },
  
  // Original inspiration mythics
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
  { id: "sunset_beach", name: "Sunset Beach", tier: "uncommon", source: "production", gradient: { stops: [["#f97316", 0], ["#fbbf24", 50], ["#f472b6", 100]], dir: "diag" } },
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
  { id: "berry_fizz", name: "Berry Fizz", tier: "uncommon", source: "production", gradient: { stops: [["#FF6BA0", 0], ["#7D4AA3", 100]], dir: "180deg" }, base: { fill: "#FF6BA0", stroke: "#5B1A4A", shine: "#FDEBFA" } },
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
  { id: "sprinkles", name: "Sprinkles", tier: "rare", source: "production", pattern: { type: "confetti_dots", count: 18, colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"], alpha: 0.50 }, base: { fill: "#F7FBFF", stroke: "#93C5FD", shine: "#0E1B2B" } },
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
  { id: "will_o_glow", name: "Will-o-Glow", tier: "epic", source: "production", anim: "will_o_glow", base: { fill: "#0E1C14", stroke: "#081108", shine: "#F3FFF7" } },
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
  { id: "nebula", name: "Nebula", tier: "mythic", source: "inspiration", anim: "deep_space_parallax", base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" } },
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

// ===== PRE-PRODUCTION SKINS (Review & Testing) =====
export const PRE_PRODUCTION_SKINS: UnifiedSkin[] = [
  // Desert / Canyon Biome
  { 
    id: "oasis", 
    name: "Oasis", 
    tier: "uncommon", 
    source: "pre-production",
    origin: { type: 'biome', source: 'desert', displayName: 'Unlocked in Desert' },
    gradient: { stops: [["#0d9488", 0], ["#f59e0b", 100]], dir: "180deg" },
    base: { fill: "#0d9488", stroke: "#134e4a", shine: "#99f6e4" }
  },
  { 
    id: "sunstone", 
    name: "Sunstone", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'desert', displayName: 'Unlocked in Desert' },
    pattern: { type: "hex_veins", opacity: 0.15, color: "#d97706" },
    base: { fill: "#fbbf24", stroke: "#92400e", shine: "#fef3c7" }
  },
  { 
    id: "dune_drift", 
    name: "Dune Drift", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'desert', displayName: 'Unlocked in Desert' },
    anim: "heat_shimmer",
    base: { fill: "#f3e8ff", stroke: "#7c2d12", shine: "#fef7cd" }
  },
  { 
    id: "mirage", 
    name: "Mirage", 
    tier: "mythic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'desert', displayName: 'Unlocked in Desert' },
    anim: "refractive_lens",
    base: { fill: "#fef3c7", stroke: "#78350f", shine: "#fffbeb" }
  },
  { 
    id: "cactus_bloom", 
    name: "Cactus Bloom", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'desert', displayName: 'Unlocked in Desert' },
    pattern: { type: "cactus_flowers", opacity: 0.1, colors: ["#86efac", "#f9a8d4"] },
    base: { fill: "#65a30d", stroke: "#365314", shine: "#d9f99d" }
  },
  { 
    id: "scarab_gleam", 
    name: "Scarab Gleam", 
    tier: "secret", 
    source: "pre-production",
    origin: { type: 'badge', source: 'streak_master', displayName: 'Earned: Streak Master' },
    anim: "iridescent_shards",
    base: { fill: "#134e4a", stroke: "#042f2e", shine: "#a7f3d0" }
  },

  // Swamp / Bog Biome
  { 
    id: "murk", 
    name: "Murk", 
    tier: "common", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    base: { fill: "#4b5563", stroke: "#1f2937", shine: "#d1fae5" }
  },
  { 
    id: "peat_stripe", 
    name: "Peat Stripe", 
    tier: "uncommon", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    gradient: { stops: [["#16a34a", 0], ["#78716c", 100]], dir: "98deg" },
    base: { fill: "#16a34a", stroke: "#14532d", shine: "#bbf7d0" }
  },
  { 
    id: "algae_vein", 
    name: "Algae Vein", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    pattern: { type: "branching_veins", opacity: 0.12, scale: "large" },
    base: { fill: "#166534", stroke: "#14532d", shine: "#86efac" }
  },
  { 
    id: "bog_bubble", 
    name: "Bog Bubble", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    anim: "rising_bubbles",
    base: { fill: "#059669", stroke: "#064e3b", shine: "#a7f3d0" }
  },
  { 
    id: "willow_glow", 
    name: "Willow Glow", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    anim: "firefly_drift",
    base: { fill: "#15803d", stroke: "#14532d", shine: "#bbf7d0" }
  },
  { 
    id: "frog_chorus", 
    name: "Frog Chorus", 
    tier: "mythic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'swamp', displayName: 'Unlocked in Swamp' },
    anim: "ripple_rings_with_leaves",
    base: { fill: "#166534", stroke: "#14532d", shine: "#86efac" }
  },

  // Cave / Crystal Biome
  { 
    id: "ore_fleck", 
    name: "Ore Fleck", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'cave', displayName: 'Unlocked in Cave' },
    pattern: { type: "gold_flecks", opacity: 0.04, density: "sparse" },
    base: { fill: "#374151", stroke: "#1f2937", shine: "#f3f4f6" }
  },
  { 
    id: "glowshroom", 
    name: "Glowshroom", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'cave', displayName: 'Unlocked in Cave' },
    pattern: { type: "mushroom_caps", opacity: 0.2, color: "#06b6d4", position: "corners" },
    base: { fill: "#1e293b", stroke: "#0f172a", shine: "#e0f2fe" }
  },
  { 
    id: "geode_core", 
    name: "Geode Core", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'cave', displayName: 'Unlocked in Cave' },
    anim: "radial_shine_sweep",
    base: { fill: "#6366f1", stroke: "#3730a3", shine: "#e0e7ff" }
  },
  { 
    id: "stalactite_drip", 
    name: "Stalactite Drip", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'cave', displayName: 'Unlocked in Cave' },
    anim: "top_edge_drips",
    base: { fill: "#475569", stroke: "#1e293b", shine: "#f1f5f9" }
  },
  { 
    id: "biolume_veil", 
    name: "Biolume Veil", 
    tier: "mythic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'cave', displayName: 'Unlocked in Cave' },
    anim: "caustic_ripples_with_motes",
    base: { fill: "#0f172a", stroke: "#020617", shine: "#06b6d4" }
  },
  { 
    id: "echo_rune", 
    name: "Echo Rune", 
    tier: "mythic", 
    source: "pre-production",
    origin: { type: 'badge', source: 'streak_legend', displayName: 'Earned: Streak Legend' },
    anim: "runic_sequence_flash",
    base: { fill: "#1e293b", stroke: "#0f172a", shine: "#8b5cf6" }
  },

  // Day-Sky / Clouds Biome
  { 
    id: "bluebird", 
    name: "Bluebird", 
    tier: "common", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    base: { fill: "#3b82f6", stroke: "#1d4ed8", shine: "#dbeafe" }
  },
  { 
    id: "thermal_lift", 
    name: "Thermal Lift", 
    tier: "uncommon", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    gradient: { stops: [["#3b82f6", 0], ["#f8fafc", 100]], dir: "0deg" },
    anim: "upward_shimmer",
    base: { fill: "#3b82f6", stroke: "#1d4ed8", shine: "#f8fafc" }
  },
  { 
    id: "cloud_puff", 
    name: "Cloud Puff", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    pattern: { type: "cumulus_silhouettes", position: "edges", drift: "0.4px/s" },
    base: { fill: "#93c5fd", stroke: "#2563eb", shine: "#f0f9ff" }
  },
  { 
    id: "sky_kite", 
    name: "Sky Kite", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    pattern: { type: "kite_silhouettes", count: 3, position: "corners", drift: "out" },
    base: { fill: "#60a5fa", stroke: "#2563eb", shine: "#eff6ff" }
  },
  { 
    id: "sunshower", 
    name: "Sunshower", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    anim: "radial_rays_upper_left",
    base: { fill: "#fbbf24", stroke: "#d97706", shine: "#fefce8" }
  },
  { 
    id: "rainbow_arc", 
    name: "Rainbow Arc", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'sky', displayName: 'Unlocked in Day Sky' },
    anim: "slow_rainbow_arc",
    base: { fill: "#93c5fd", stroke: "#1d4ed8", shine: "#f0f9ff" }
  },

  // City / Arcade Biome
  { 
    id: "neon_grid", 
    name: "Neon Grid", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    pattern: { type: "large_grid", cellSize: "80px", opacity: 0.08, colors: ["#06b6d4", "#ec4899"] },
    base: { fill: "#1e293b", stroke: "#0f172a", shine: "#0ea5e9" }
  },
  { 
    id: "pixel_parade", 
    name: "Pixel Parade", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    pattern: { type: "pixel_dust", size: "1-2px", density: "sparse", trigger: "correct_answers" },
    base: { fill: "#581c87", stroke: "#3b0764", shine: "#f3e8ff" }
  },
  { 
    id: "circuit_pop", 
    name: "Circuit Pop", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    pattern: { type: "pcb_traces", scale: "large", opacity: 0.05, trigger: "streak_milestones" },
    base: { fill: "#065f46", stroke: "#022c22", shine: "#34d399" }
  },
  { 
    id: "subway_spark", 
    name: "Subway Spark", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    anim: "traveling_gleam_bottom",
    base: { fill: "#475569", stroke: "#1e293b", shine: "#f1f5f9" }
  },
  { 
    id: "billboard_blink", 
    name: "Billboard Blink", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    anim: "corner_billboards",
    base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#a5b4fc" }
  },
  { 
    id: "synthwave", 
    name: "Synthwave", 
    tier: "mythic", 
    source: "production", 
    bio: "Neon gradient with retro scanline effects.",
    kind: "animated",
    colors: ["#7a3cff", "#ff4d6d", "#2c0c3a"],
    origin: { type: 'biome', source: 'city', displayName: 'Unlocked in City' },
    anim: "horizon_gradient_skyline",
    gradient: { stops: [["#7c3aed", 0], ["#f97316", 100]], dir: "180deg" },
    base: { fill: "#7c3aed", stroke: "#5b21b6", shine: "#fbbf24" }
  },

  // Farm / Orchard Biome
  { 
    id: "apple_shine", 
    name: "Apple Shine", 
    tier: "common", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    base: { fill: "#dc2626", stroke: "#7f1d1d", shine: "#fecaca" }
  },
  { 
    id: "fresh_cream", 
    name: "Fresh Cream", 
    tier: "uncommon", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    gradient: { stops: [["#fef3c7", 0], ["#f3e8ff", 100]], dir: "180deg" },
    base: { fill: "#fef3c7", stroke: "#92400e", shine: "#fffbeb" }
  },
  { 
    id: "berry_patch", 
    name: "Berry Patch", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    pattern: { type: "berry_dots", count: 3, position: "edges", color: "#be185d" },
    base: { fill: "#be185d", stroke: "#9f1239", shine: "#fecdd3" }
  },
  { 
    id: "corn_silk", 
    name: "Corn Silk", 
    tier: "rare", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    pattern: { type: "diagonal_stripes", opacity: 0.1, color: "#fef3c7" },
    base: { fill: "#eab308", stroke: "#a16207", shine: "#fef9c3" }
  },
  { 
    id: "haystack", 
    name: "Haystack", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    anim: "rolling_straw_texture",
    base: { fill: "#d97706", stroke: "#92400e", shine: "#fed7aa" }
  },
  { 
    id: "orchard_breeze", 
    name: "Orchard Breeze", 
    tier: "epic", 
    source: "pre-production",
    origin: { type: 'biome', source: 'farm', displayName: 'Unlocked in Farm' },
    anim: "falling_leaves",
    base: { fill: "#16a34a", stroke: "#15803d", shine: "#bbf7d0" }
  },
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
  // PRE-PRODUCTION REVIEW
  ...PRE_PRODUCTION_SKINS,
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
  "pre-production": ALL_SKINS.filter(s => s.source === "pre-production"),
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
