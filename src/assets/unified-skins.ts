/**
 * UNIFIED SKINS - Consolidated Skin Definitions
 * 
 * This file contains the final, consolidated skin definitions based on user decisions
 * from the skin comparison tool. It replaces the dual system of skins.ts and all-skins.ts
 * with a single, authoritative source of truth.
 * 
 * Migration Strategy:
 * 1. Build perfect unified definitions here
 * 2. Test with comparison tool
 * 3. Rename: skins.ts → old-skins.ts, unified-skins.ts → skins.ts
 * 4. Game seamlessly uses new system
 */

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic";

export type Skin = {
  id: string;
  name: string;
  tier: Rarity;
  kind: "solid" | "gradient" | "animated" | "pattern";
  colors: string[]; // 1+ colors (2–3 for gradient/animated)
  pattern?: {
    type: string;
    count: number;
    colors: string[];
    alpha: number;
  };
};

export const SKINS: Record<string, Skin> = {
  // ===== COMMONS =====
  // Chunk 1 decisions: moss, sky, coral, charcoal → variant-1 (old system)
  moss: { id: "moss", name: "Moss", tier: "common", kind: "solid", colors: ["#5BA86D"] },
  sky: { id: "sky", name: "Sky", tier: "common", kind: "solid", colors: ["#A9D8FF"] },
  coral: { id: "coral", name: "Coral", tier: "common", kind: "solid", colors: ["#FF8B7A"] },
  charcoal: { id: "charcoal", name: "Charcoal", tier: "common", kind: "solid", colors: ["#2A2F35"] },
  
  // Biome unlock rewards
  acorn: { id: "acorn", name: "Acorn", tier: "common", kind: "solid", colors: ["#a16207"] },

  // ===== UNCOMMONS =====
  // Chunk 2 decisions: spring_fade, autumn_fade, blue_lagoon, cotton_candy, sunset, sunrise → variant-1 (old system)
  spring_fade: { id: "spring_fade", name: "Spring Fade", tier: "uncommon", kind: "gradient", colors: ["#B7F8C6", "#FFF4A8"] },
  autumn_fade: { id: "autumn_fade", name: "Autumn Fade", tier: "uncommon", kind: "gradient", colors: ["#22c55e", "#dc2626"] },
  blue_lagoon: { id: "blue_lagoon", name: "Blue Lagoon", tier: "uncommon", kind: "gradient", colors: ["#68E0FF", "#3D78C1"] },
  cotton_candy: { id: "cotton_candy", name: "Cotton Candy", tier: "uncommon", kind: "gradient", colors: ["#60a5fa", "#f472b6"] },
  sunset: { id: "sunset", name: "Sunset", tier: "uncommon", kind: "gradient", colors: ["#8b5cf6", "#ec4899", "#f97316", "#fbbf24"] },
  sunrise: { id: "sunrise", name: "Sunrise", tier: "uncommon", kind: "gradient", colors: ["#2196F3", "#64B5F6", "#FFEB3B", "#FF9800", "#F44336"] },
  
  // Chunk 2 decision: rainbow → merge (base=new + readability=old)
  // Note: This uses the old system's gradient colors but keeps new system's metadata structure
  rainbow: { id: "rainbow", name: "Rainbow", tier: "uncommon", kind: "gradient", colors: ["#ef4444", "#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6"] },
  
  // Biome unlock rewards
  sea_breeze: { id: "sea_breeze", name: "Sea Breeze", tier: "uncommon", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },
  raindrop: { id: "raindrop", name: "Raindrop", tier: "uncommon", kind: "gradient", colors: ["#e0e7ff", "#6366f1"] },

  // ===== RARES =====
  // Chunk 2 decisions: polka_mint, ripple → variant-1 (old system)
  polka_mint: { id: "polka_mint", name: "Polka Mint", tier: "rare", kind: "gradient", colors: ["#B6E3B6", "#FFFFFF"] },
  ripple: { id: "ripple", name: "Ripple", tier: "rare", kind: "gradient", colors: ["#7FECD8", "#134E4A"] },
  
  // Chunk 2 decision: confetti → variant-2 (new system)
  confetti: { id: "confetti", name: "Confetti", tier: "rare", kind: "gradient", colors: ["#FEF3C7", "#FDE68A"] },
  
  // Biome unlock rewards
  ocean_drift: { id: "ocean_drift", name: "Ocean Drift", tier: "rare", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },

  // ===== EPICS =====
  // Chunk 2 decisions: lava_flow, aurora_veil → old (keep old system visuals with new system data)
  lava_flow: { id: "lava_flow", name: "Lava Flow", tier: "epic", kind: "animated", colors: ["#3A1D0E", "#FFF0DD", "#dc2626", "#dc2626"] },
  aurora_veil: { id: "aurora_veil", name: "Aurora Veil", tier: "epic", kind: "animated", colors: ["#43e0c6", "#b189ff"] },

  // ===== MYTHICS =====
  // Chunk 2 decisions: nebula, phoenix_heart → variant-1 (old system)
  nebula: { 
    id: "nebula", 
    name: "Nebula", 
    tier: "mythic", 
    source: "inspiration", 
    anim: "deep_space_parallax", 
    kind: "animated", 
    colors: ["#5b2d8f", "#1b1e4b", "#0f1530"],
    base: { fill: "#1e1b4b", stroke: "#0f172a", shine: "#c7d2fe" }
  },
  phoenix_heart: { id: "phoenix_heart", name: "Phoenix Heart", tier: "mythic", kind: "animated", colors: ["#ff7a3c", "#d12525", "#571616"] },

  // ===== CHUNK 3 DECISIONS (2025-09-26) =====
  // Most choices are "variant-1" (old system), with some complex merges and removals
  
  // === EPICS ===
  // All variant-1 choices (old system) - these are actually Epic tier
  magma_vein: { id: "magma_vein", name: "Magma Vein", tier: "epic", kind: "gradient", colors: ["#7f1d1d", "#f97316"] },
  ember_bed: { id: "ember_bed", name: "Ember Bed", tier: "epic", kind: "animated", colors: ["#dc2626", "#fecaca", "#7f1d1d"] },
  glacier: { id: "glacier", name: "Glacier", tier: "epic", kind: "gradient", colors: ["#f0f9ff", "#0ea5e9"] },
  frost_breath: { id: "frost_breath", name: "Frost Breath", tier: "epic", kind: "animated", colors: ["#e0f2fe", "#f0f9ff", "#0c4a6e"] },
  canopy_lantern: { id: "canopy_lantern", name: "Canopy Lantern", tier: "epic", kind: "animated", colors: ["#207a4f", "#2ea271"] },

  // === RARES ===
  moonlit_pool: { id: "moonlit_pool", name: "Moonlit Pool", tier: "rare", kind: "gradient", colors: ["#1e293b", "#e2e8f0"] },
  moss_quilt: { id: "moss_quilt", name: "Moss Quilt", tier: "rare", kind: "solid", colors: ["#2e7d5a"] },

  // === MYTHICS ===
  star_parade: { id: "star_parade", name: "Star Parade", tier: "mythic", kind: "animated", colors: ["#0f3d4b", "#062a36", "#08202a"] },
  galaxy_swirl: { id: "galaxy_swirl", name: "Galaxy Swirl", tier: "mythic", kind: "animated", colors: ["#6a6bd6", "#3443a3", "#1a2454"] },

  // === UNCOMMONS ===
  acorn_buddy: { id: "acorn_buddy", name: "Acorn Buddy", tier: "uncommon", kind: "solid", colors: ["#6c8a3a"] },
  tide_glass: { id: "tide_glass", name: "Tide Glass", tier: "uncommon", kind: "gradient", colors: ["#78d3d0", "#e9fbfb"] },
  drift_puff: { id: "drift_puff", name: "Drift Puff", tier: "uncommon", kind: "animated", colors: ["#bfe7f4", "#ffffff"] },

  // === RARES ===
  kelp_curl: { id: "kelp_curl", name: "Kelp Curl", tier: "rare", kind: "solid", colors: ["#267a6f"] },
  frost_fern: { id: "frost_fern", name: "Frost Fern", tier: "rare", kind: "solid", colors: ["#cfeff8"] },

  // === EPICS ===
  pearl_whisper: { id: "pearl_whisper", name: "Pearl Whisper", tier: "epic", kind: "animated", colors: ["#70c6c0", "#f2f7ff"] },
  snow_lantern: { id: "snow_lantern", name: "Snow Lantern", tier: "epic", kind: "animated", colors: ["#9fd3e6", "#eaf7ff"] },
  redwall_glow: { id: "redwall_glow", name: "Redwall Glow", tier: "epic", kind: "animated", colors: ["#b3562e", "#d67b4d"] },
  acacia_shade: { id: "acacia_shade", name: "Acacia Shade", tier: "epic", kind: "animated", colors: ["#e0b45a", "#f7ddb0"] },

  // === RARES ===
  desert_varnish: { id: "desert_varnish", name: "Desert Varnish", tier: "rare", kind: "solid", colors: ["#a14a2a"] },
  polar_crown: { id: "polar_crown", name: "Polar Crown", tier: "rare", kind: "solid", colors: ["#86c5ff"] },
  grass_run: { id: "grass_run", name: "Grass Run", tier: "rare", kind: "gradient", colors: ["#c9d66c", "#f2f6c6"] },

  // === UNCOMMONS ===
  swallow_sweep: { id: "swallow_sweep", name: "Swallow Sweep", tier: "uncommon", kind: "animated", colors: ["#cf7e50", "#f4c4a2"] },
  sun_drum: { id: "sun_drum", name: "Sun Drum", tier: "uncommon", kind: "animated", colors: ["#ffcc66", "#fff3cc"] },
  shell_gleam: { id: "shell_gleam", name: "Shell Gleam", tier: "uncommon", kind: "gradient", colors: ["#8de3de", "#f6ffff"] },
  incense_drift: { id: "incense_drift", name: "Incense Drift", tier: "uncommon", kind: "animated", colors: ["#b79f80", "#f0e7d8"] },

  // === RARES ===
  anemone_wiggle: { id: "anemone_wiggle", name: "Anemone Wiggle", tier: "rare", kind: "solid", colors: ["#ff9ea0"] },
  vine_inlay: { id: "vine_inlay", name: "Vine Inlay", tier: "rare", kind: "solid", colors: ["#907a5d"] },

  // === EPICS ===
  coral_chorus: { id: "coral_chorus", name: "Coral Chorus", tier: "epic", kind: "animated", colors: ["#ff7e6b", "#2fd3c9"] },
  glyph_bloom: { id: "glyph_bloom", name: "Glyph Bloom", tier: "epic", kind: "animated", colors: ["#6a5d4a", "#d9c7a6"] },
  lighthouse_wink: { id: "lighthouse_wink", name: "Lighthouse Wink", tier: "epic", kind: "animated", colors: ["#5a82b8", "#dbe8ff"] },
  anvil_ember: { id: "anvil_ember", name: "Anvil Ember", tier: "epic", kind: "animated", colors: ["#151515", "#ff6a00"] },

  // === RARES ===
  rope_coil: { id: "rope_coil", name: "Rope Coil", tier: "rare", kind: "solid", colors: ["#c8a06d"] },
  forge_rune: { id: "forge_rune", name: "Forge Rune", tier: "rare", kind: "solid", colors: ["#332b28"] },

  // === UNCOMMONS ===
  foam_crest: { id: "foam_crest", name: "Foam Crest", tier: "uncommon", kind: "gradient", colors: ["#74b7e4", "#e9f7ff"] },
  quench_mist: { id: "quench_mist", name: "Quench Mist", tier: "uncommon", kind: "animated", colors: ["#2a2a2a", "#5f6a71"] },

  // === MYTHICS ===
  // Complex choices with specific notes
  ionosong: { id: "ionosong", name: "Ionōsong", tier: "mythic", kind: "animated", colors: ["#2fd2ff", "#6a79ff", "#121842"] },
  synthwave: { id: "synthwave", name: "Synthwave", tier: "mythic", kind: "animated", colors: ["#7a3cff", "#ff4d6d", "#2c0c3a"] },

  // ===== FINAL CHUNK DECISIONS (2025-09-26 (2)) =====
  // This should be all remaining duplicates - 102 slimes total

  // === RARES ===
  // New slimes from final chunk - all variant-1 choices (old system)
  whirlwind_edge: { id: "whirlwind_edge", name: "Whirlwind Edge", tier: "rare", kind: "gradient", colors: ["#f3e8d7", "#fde68a"] },
  riptide_bowl: { id: "riptide_bowl", name: "Riptide Bowl", tier: "rare", kind: "gradient", colors: ["#22d3ee", "#2563eb"] },
  whirlpool_eye: { id: "whirlpool_eye", name: "Whirlpool Eye", tier: "rare", kind: "gradient", colors: ["#14b8a6", "#0ea5e9"] },
  monsoon_sheet: { id: "monsoon_sheet", name: "Monsoon Sheet", tier: "rare", kind: "gradient", colors: ["#60a5fa", "#1e40af"] },
  crevasse_light: { id: "crevasse_light", name: "Crevasse Light", tier: "rare", kind: "gradient", colors: ["#93c5fd", "#64748b"] },
  black_ice: { id: "black_ice", name: "Black Ice", tier: "rare", kind: "gradient", colors: ["#334155", "#111827"] },
  aurora_curtain: { id: "aurora_curtain", name: "Aurora Curtain", tier: "rare", kind: "gradient", colors: ["#67e8f9", "#3b82f6"] },
  thunder_shelf: { id: "thunder_shelf", name: "Thunder Shelf", tier: "rare", kind: "gradient", colors: ["#06b6d4", "#0ea5e9"] },
  static_sheet: { id: "static_sheet", name: "Static Sheet", tier: "rare", kind: "gradient", colors: ["#0f172a", "#1f2937"] },
  solar_haze: { id: "solar_haze", name: "Solar Haze", tier: "rare", kind: "gradient", colors: ["#fde047", "#f59e0b"] },
  gravity_well: { id: "gravity_well", name: "Gravity Well", tier: "rare", kind: "gradient", colors: ["#0b1026", "#111827"] },
  prism_mist: { id: "prism_mist", name: "Prism Mist", tier: "rare", kind: "gradient", colors: ["#94a3b8", "#64748b"] },
  forge_heat: { id: "forge_heat", name: "Forge Heat", tier: "rare", kind: "gradient", colors: ["#92400e", "#d97706"] },
  quench_mist_inspiration: { id: "quench_mist_inspiration", name: "Quench Mist", tier: "rare", kind: "gradient", colors: ["#1f2937", "#0f172a"] },

  // === EPICS ===
  // Variant-2 and variant-3 choices from final chunk (new system data)
  dune_drift: { id: "dune_drift", name: "Dune Drift", tier: "epic", kind: "gradient", colors: ["#fde68a", "#fbbf24", "#f59e0b"] },
  bog_bubble: { id: "bog_bubble", name: "Bog Bubble", tier: "epic", kind: "gradient", colors: ["#16a34a", "#065f46"] },
  willow_glow: { id: "willow_glow", name: "Willow Glow", tier: "epic", kind: "gradient", colors: ["#22c55e", "#16a34a"] },
  geode_core: { id: "geode_core", name: "Geode Core", tier: "epic", kind: "gradient", colors: ["#a78bfa", "#60a5fa"] },
  stalactite_drip: { id: "stalactite_drip", name: "Stalactite Drip", tier: "epic", kind: "gradient", colors: ["#64748b", "#94a3b8"] },
  sunshower: { id: "sunshower", name: "Sunshower", tier: "epic", kind: "gradient", colors: ["#bae6fd", "#fde68a"] },
  rainbow_arc: { id: "rainbow_arc", name: "Rainbow Arc", tier: "epic", kind: "gradient", colors: ["#fca5a5", "#fcd34d", "#86efac", "#93c5fd", "#c4b5fd"] },
  subway_spark: { id: "subway_spark", name: "Subway Spark", tier: "epic", kind: "gradient", colors: ["#334155", "#1f2937"] },
  billboard_blink: { id: "billboard_blink", name: "Billboard Blink", tier: "epic", kind: "gradient", colors: ["#312e81", "#1e1b4b"] },
  haystack: { id: "haystack", name: "Haystack", tier: "epic", kind: "gradient", colors: ["#fde68a", "#f59e0b"] },
  orchard_breeze: { id: "orchard_breeze", name: "Orchard Breeze", tier: "epic", kind: "gradient", colors: ["#22c55e", "#16a34a"] },
  ocean_anim: { id: "ocean_anim", name: "Ocean", tier: "epic", kind: "animated", colors: ["#0ea5e9", "#bae6fd"] },
  will_o_glow: { id: "will_o_glow", name: "Will-o-Glow", tier: "epic", kind: "animated", colors: ["#0E1C14", "#F3FFF7"] },

  // === UNCOMMONS ===
  // Final chunk slimes - variant-1 choices (old system)
  berry_fizz: { id: "berry_fizz", name: "Berry Fizz", tier: "uncommon", kind: "gradient", colors: ["#FF6BA0", "#7D4AA3"] },
  citrus_pop: { id: "citrus_pop", name: "Citrus Pop", tier: "uncommon", kind: "gradient", colors: ["#fef08a", "#84cc16"] },
  sunset_beach: { id: "sunset_beach", name: "Sunset Beach", tier: "uncommon", kind: "gradient", colors: ["#f97316", "#fbbf24", "#f472b6"] },
  forest_mist: { id: "forest_mist", name: "Forest Mist", tier: "uncommon", kind: "gradient", colors: ["#5BA86D", "#E4EEE7"] },

  // === RARES ===
  // Final chunk slimes - variant-1 choices (old system)
  honeycomb: { id: "honeycomb", name: "Honeycomb", tier: "rare", kind: "pattern", colors: ["#FFD24A", "#92400E"] },
  cloud_puff: { id: "cloud_puff", name: "Cloud Puff", tier: "rare", kind: "pattern", colors: ["#A9D8FF", "#1E3A8A"] },
  starlet: { id: "starlet", name: "Starlet", tier: "rare", kind: "pattern", colors: ["#2A2F35", "#0B0E12"] },
  pebble: { id: "pebble", name: "Pebble", tier: "rare", kind: "pattern", colors: ["#E9D8B5", "#9D8057"] },

  // === EPICS ===
  // Final chunk slimes - variant-1 choices (old system)
  the_fizz: { id: "the_fizz", name: "The Fizz", tier: "epic", kind: "animated", colors: ["#BDEBFF", "#93DBFF"] },
  void_walker: { id: "void_walker", name: "Void Walker", tier: "epic", kind: "animated", colors: ["#0f0f23", "#1e1b4b"] },
  solar_flare: { id: "solar_flare", name: "Solar Flare", tier: "epic", kind: "animated", colors: ["#f59e0b", "#92400e"] },

  // === MYTHICS ===
  // Final chunk slimes - variant-1 choices (old system)
  infinite_money_glitch: { id: "infinite_money_glitch", name: "Infinite Money Glitch", tier: "mythic", kind: "animated", colors: ["#fde047", "#92400e"] },

  // ===== FINAL BATCH DECISIONS (2025-09-27) =====
  // 24 skins from the last comparison tool batch

  // === ENHANCED SKINS (variant-1 choices - old system with animation notes) ===
  mirage_enhanced: { id: "mirage_enhanced", name: "Mirage Enhanced", tier: "epic", kind: "animated", colors: ["#fde68a", "#f59e0b"] },
  frog_chorus_enhanced: { id: "frog_chorus_enhanced", name: "Frog Chorus Enhanced", tier: "epic", kind: "animated", colors: ["#22c55e", "#16a34a"] },
  biolume_veil_enhanced: { id: "biolume_veil_enhanced", name: "Biolume Veil Enhanced", tier: "epic", kind: "animated", colors: ["#0ea5e9", "#bae6fd"] },
  echo_rune_enhanced: { id: "echo_rune_enhanced", name: "Echo Rune Enhanced", tier: "epic", kind: "animated", colors: ["#6a5d4a", "#d9c7a6"] },
  lava_flow_enhanced: { id: "lava_flow_enhanced", name: "Lava Flow Enhanced", tier: "epic", kind: "animated", colors: ["#3A1D0E", "#FFF0DD", "#dc2626", "#dc2626"] },
  aurora_veil_enhanced: { id: "aurora_veil_enhanced", name: "Aurora Veil Enhanced", tier: "epic", kind: "animated", colors: ["#43e0c6", "#b189ff"] },
  glacier_enhanced: { id: "glacier_enhanced", name: "Glacier Enhanced", tier: "epic", kind: "animated", colors: ["#f0f9ff", "#0ea5e9"] },
  aurora_veil_plus_enhanced: { id: "aurora_veil_plus_enhanced", name: "Aurora Veil+ Enhanced", tier: "epic", kind: "animated", colors: ["#43e0c6", "#b189ff"] },

  // === COMMONS (variant-1 and variant-2 choices) ===
  fog: { id: "fog", name: "Fog", tier: "common", kind: "solid", colors: ["#9CA3AF"] },
  bluebird: { id: "bluebird", name: "Bluebird", tier: "common", kind: "solid", colors: ["#60a5fa"] },
  apple_shine: { id: "apple_shine", name: "Apple Shine", tier: "common", kind: "solid", colors: ["#f97316"] },
  honey: { id: "honey", name: "Honey", tier: "common", kind: "solid", colors: ["#fbbf24"] },
  lilac: { id: "lilac", name: "Lilac", tier: "common", kind: "solid", colors: ["#BDA7FF"] },

  // === RARES (variant-1 choices - old system) ===
  deep_dark_cave: { id: "deep_dark_cave", name: "Deep Dark Cave", tier: "rare", kind: "gradient", colors: ["#0ea5e9", "#312e81"] },
  never_ending_cave: { id: "never_ending_cave", name: "Never-Ending Cave", tier: "rare", kind: "gradient", colors: ["#475569", "#1f2937"] },
  spooky_cave: { id: "spooky_cave", name: "Spooky Cave", tier: "rare", kind: "gradient", colors: ["#4338ca", "#1e1b4b"] },
  fault_glow: { id: "fault_glow", name: "Fault Glow", tier: "rare", kind: "gradient", colors: ["#6b7280", "#374151"] },
  aftershock: { id: "aftershock", name: "Aftershock", tier: "rare", kind: "gradient", colors: ["#111827", "#374151"] },
  ember_rim: { id: "ember_rim", name: "Ember Rim", tier: "rare", kind: "gradient", colors: ["#ea580c", "#b45309"] },
  ashfall: { id: "ashfall", name: "Ashfall", tier: "rare", kind: "gradient", colors: ["#9a3412", "#7c2d12"] },
  volcanic_glass: { id: "volcanic_glass", name: "Volcanic Glass", tier: "rare", kind: "gradient", colors: ["#0f172a", "#111827"] },
  sandstorm_wall: { id: "sandstorm_wall", name: "Sandstorm Wall", tier: "rare", kind: "gradient", colors: ["#fde68a", "#f59e0b"] },
  dune_surge: { id: "dune_surge", name: "Dune Surge", tier: "rare", kind: "gradient", colors: ["#fde68a", "#f59e0b"] },
  sprinkles: { id: "sprinkles", name: "Sprinkles", tier: "rare", kind: "pattern", colors: ["#F7FBFF", "#93C5FD"] },

  // ===== MISSING SKINS FROM OLD SYSTEM (58 skins) =====
  // These skins only existed in skins.ts and had no duplicates
  
  // Enhanced variants that were marked for removal but still need to be included
  aurora_veil_plus: { id: "aurora_veil_plus", name: "Aurora Veil+", tier: "epic", kind: "animated", colors: ["#43e0c6", "#b189ff"] },
  acorn_enhanced: { id: "acorn_enhanced", name: "Acorn Enhanced", tier: "common", kind: "solid", colors: ["#a16207"] },
  spring_fade_enhanced: { id: "spring_fade_enhanced", name: "Spring Fade Enhanced", tier: "uncommon", kind: "gradient", colors: ["#B7F8C6", "#FFF4A8"] },
  blue_lagoon_enhanced: { id: "blue_lagoon_enhanced", name: "Blue Lagoon Enhanced", tier: "uncommon", kind: "gradient", colors: ["#68E0FF", "#3D78C1"] },
  sea_breeze_enhanced: { id: "sea_breeze_enhanced", name: "Sea Breeze Enhanced", tier: "uncommon", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },
  raindrop_enhanced: { id: "raindrop_enhanced", name: "Raindrop Enhanced", tier: "uncommon", kind: "gradient", colors: ["#e0e7ff", "#6366f1"] },
  acorn_buddy_enhanced: { id: "acorn_buddy_enhanced", name: "Acorn Buddy Enhanced", tier: "uncommon", kind: "solid", colors: ["#6c8a3a"] },
  polka_mint_enhanced: { id: "polka_mint_enhanced", name: "Polka Mint Enhanced", tier: "rare", kind: "gradient", colors: ["#B6E3B6", "#FFFFFF"] },
  ripple_enhanced: { id: "ripple_enhanced", name: "Ripple Enhanced", tier: "rare", kind: "gradient", colors: ["#7FECD8", "#134E4A"] },
  ocean_drift_enhanced: { id: "ocean_drift_enhanced", name: "Ocean Drift Enhanced", tier: "rare", kind: "gradient", colors: ["#67e8f9", "#0ea5e9"] },
  moonlit_pool_enhanced: { id: "moonlit_pool_enhanced", name: "Moonlit Pool Enhanced", tier: "rare", kind: "gradient", colors: ["#1e293b", "#e2e8f0"] },
  moss_quilt_enhanced: { id: "moss_quilt_enhanced", name: "Moss Quilt Enhanced", tier: "rare", kind: "solid", colors: ["#2e7d5a"] },
  fog_enhanced: { id: "fog_enhanced", name: "Fog Enhanced", tier: "common", kind: "solid", colors: ["#9CA3AF"] },
  bluebird_enhanced: { id: "bluebird_enhanced", name: "Bluebird Enhanced", tier: "common", kind: "solid", colors: ["#60a5fa"] },
  apple_shine_enhanced: { id: "apple_shine_enhanced", name: "Apple Shine Enhanced", tier: "common", kind: "solid", colors: ["#f97316"] },
  honey_enhanced: { id: "honey_enhanced", name: "Honey Enhanced", tier: "common", kind: "solid", colors: ["#fbbf24"] },
  lilac_enhanced: { id: "lilac_enhanced", name: "Lilac Enhanced", tier: "common", kind: "solid", colors: ["#BDA7FF"] },
  green_enhanced: { id: "green_enhanced", name: "Green Enhanced", tier: "common", kind: "solid", colors: ["#22c55e"] },
  mint_enhanced: { id: "mint_enhanced", name: "Mint Enhanced", tier: "common", kind: "solid", colors: ["#4ade80"] },
  blueberry_enhanced: { id: "blueberry_enhanced", name: "Blueberry Enhanced", tier: "common", kind: "solid", colors: ["#60a5fa"] },
  dune_drift_enhanced: { id: "dune_drift_enhanced", name: "Dune Drift Enhanced", tier: "epic", kind: "gradient", colors: ["#fde68a", "#fbbf24", "#f59e0b"] },
  bog_bubble_enhanced: { id: "bog_bubble_enhanced", name: "Bog Bubble Enhanced", tier: "epic", kind: "gradient", colors: ["#16a34a", "#065f46"] },
  willow_glow_enhanced: { id: "willow_glow_enhanced", name: "Willow Glow Enhanced", tier: "epic", kind: "gradient", colors: ["#22c55e", "#16a34a"] },
  geode_core_enhanced: { id: "geode_core_enhanced", name: "Geode Core Enhanced", tier: "epic", kind: "gradient", colors: ["#a78bfa", "#60a5fa"] },
  stalactite_drip_enhanced: { id: "stalactite_drip_enhanced", name: "Stalactite Drip Enhanced", tier: "epic", kind: "gradient", colors: ["#64748b", "#94a3b8"] },
  sunshower_enhanced: { id: "sunshower_enhanced", name: "Sunshower Enhanced", tier: "epic", kind: "gradient", colors: ["#bae6fd", "#fde68a"] },
  rainbow_arc_enhanced: { id: "rainbow_arc_enhanced", name: "Rainbow Arc Enhanced", tier: "epic", kind: "gradient", colors: ["#fca5a5", "#fcd34d", "#86efac", "#93c5fd", "#c4b5fd"] },
  subway_spark_enhanced: { id: "subway_spark_enhanced", name: "Subway Spark Enhanced", tier: "epic", kind: "gradient", colors: ["#334155", "#1f2937"] },
  billboard_blink_enhanced: { id: "billboard_blink_enhanced", name: "Billboard Blink Enhanced", tier: "epic", kind: "gradient", colors: ["#312e81", "#1e1b4b"] },
  haystack_enhanced: { id: "haystack_enhanced", name: "Haystack Enhanced", tier: "epic", kind: "gradient", colors: ["#fde68a", "#f59e0b"] },
  orchard_breeze_enhanced: { id: "orchard_breeze_enhanced", name: "Orchard Breeze Enhanced", tier: "epic", kind: "gradient", colors: ["#22c55e", "#16a34a"] },
  harbor_wake_enhanced: { id: "harbor_wake_enhanced", name: "Harbor Wake Enhanced", tier: "epic", kind: "gradient", colors: ["#0ea5e9", "#bae6fd"] },
  temple_incense_enhanced: { id: "temple_incense_enhanced", name: "Temple Incense Enhanced", tier: "epic", kind: "gradient", colors: ["#6a5d4a", "#d9c7a6"] },
  canyon_shade_enhanced: { id: "canyon_shade_enhanced", name: "Canyon Shade Enhanced", tier: "epic", kind: "gradient", colors: ["#a14a2a", "#d67b4d"] },
  reef_bloom_enhanced: { id: "reef_bloom_enhanced", name: "Reef Bloom Enhanced", tier: "epic", kind: "gradient", colors: ["#ff7e6b", "#2fd3c9"] },
  savanna_mirage_enhanced: { id: "savanna_mirage_enhanced", name: "Savanna Mirage Enhanced", tier: "epic", kind: "gradient", colors: ["#fde68a", "#f59e0b"] },
  foundry_heatwave_enhanced: { id: "foundry_heatwave_enhanced", name: "Foundry Heatwave Enhanced", tier: "epic", kind: "gradient", colors: ["#151515", "#ff6a00"] },
  tundra_halo_enhanced: { id: "tundra_halo_enhanced", name: "Tundra Halo Enhanced", tier: "epic", kind: "gradient", colors: ["#86c5ff", "#e0f2fe"] },
  observatory_drift_enhanced: { id: "observatory_drift_enhanced", name: "Observatory Drift Enhanced", tier: "epic", kind: "gradient", colors: ["#2fd2ff", "#6a79ff"] },

  // Real missing skins from old system (only the ones that actually exist)
  green: { id: "green", name: "Green", tier: "common", kind: "solid", colors: ["#22c55e"] },
  mint: { id: "mint", name: "Mint", tier: "common", kind: "solid", colors: ["#4ade80"] },
  blueberry: { id: "blueberry", name: "Blueberry", tier: "common", kind: "solid", colors: ["#60a5fa"] },
  tangerine: { id: "tangerine", name: "Tangerine", tier: "common", kind: "solid", colors: ["#f97316"] },
  bubblegum: { id: "bubblegum", name: "Bubblegum", tier: "common", kind: "solid", colors: ["#f472b6"] },
  lava: { id: "lava", name: "Lava", tier: "common", kind: "solid", colors: ["#dc2626"] },
  aurora: { id: "aurora", name: "Aurora", tier: "common", kind: "solid", colors: ["#8b5cf6"] },

  // ===== REMAINING MISSING ENHANCED SKINS FROM OLD SYSTEM (12 skins) =====
  magma_vein_enhanced: { id: "magma_vein_enhanced", name: "Magma Vein Enhanced", tier: "epic", kind: "gradient", colors: ["#f59e0b", "#ea580c", "#7c2d12"] },
  ember_bed_enhanced: { id: "ember_bed_enhanced", name: "Ember Bed Enhanced", tier: "epic", kind: "gradient", colors: ["#d97706", "#b45309"] },
  frost_breath_enhanced: { id: "frost_breath_enhanced", name: "Frost Breath Enhanced", tier: "epic", kind: "gradient", colors: ["#94a3b8", "#cbd5e1"] },
  canopy_lantern_enhanced: { id: "canopy_lantern_enhanced", name: "Canopy Lantern Enhanced", tier: "epic", kind: "gradient", colors: ["#16a34a", "#166534"] },
  pearl_whisper_enhanced: { id: "pearl_whisper_enhanced", name: "Pearl Whisper Enhanced", tier: "epic", kind: "gradient", colors: ["#e5e7eb", "#cbd5e1", "#f1f5f9"] },
  snow_lantern_enhanced: { id: "snow_lantern_enhanced", name: "Snow Lantern Enhanced", tier: "epic", kind: "gradient", colors: ["#dbeafe", "#f1f5f9"] },
  redwall_glow_enhanced: { id: "redwall_glow_enhanced", name: "Redwall Glow Enhanced", tier: "epic", kind: "gradient", colors: ["#b91c1c", "#d97706"] },
  acacia_shade_enhanced: { id: "acacia_shade_enhanced", name: "Acacia Shade Enhanced", tier: "epic", kind: "gradient", colors: ["#f59e0b", "#eab308", "#a16207"] },
  coral_chorus_enhanced: { id: "coral_chorus_enhanced", name: "Coral Chorus Enhanced", tier: "epic", kind: "gradient", colors: ["#60a5fa", "#a7f3d0"] },
  glyph_bloom_enhanced: { id: "glyph_bloom_enhanced", name: "Glyph Bloom Enhanced", tier: "epic", kind: "gradient", colors: ["#c7a875", "#a68a56"] },
  lighthouse_wink_enhanced: { id: "lighthouse_wink_enhanced", name: "Lighthouse Wink Enhanced", tier: "epic", kind: "gradient", colors: ["#93c5fd", "#60a5fa"] },
  anvil_ember_enhanced: { id: "anvil_ember_enhanced", name: "Anvil Ember Enhanced", tier: "epic", kind: "gradient", colors: ["#92400e", "#b45309"] },

  // ===== MISSING SKINS FROM NEW SYSTEM (216 skins) =====
  // These skins only existed in all-skins.ts and had no duplicates
  
  // Mythic skins
  cosmic: { id: "cosmic", name: "Cosmic", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  black_hole: { id: "black_hole", name: "Black Hole", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  black_hole_2: { id: "black_hole_2", name: "Black Hole 2", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  black_hole_3: { id: "black_hole_3", name: "Black Hole 3", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  black_hole_4: { id: "black_hole_4", name: "Black Hole 4", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  black_hole_5: { id: "black_hole_5", name: "Black Hole 5", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  portal: { id: "portal", name: "Portal", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },
  vertigo: { id: "vertigo", name: "Vertigo", tier: "mythic", kind: "animated", colors: ["#000000", "#1a1a2e", "#16213e"] },

  // Uncommon skins
  candy_corn: { id: "candy_corn", name: "Candy Corn", tier: "uncommon", kind: "solid", colors: ["#ff6b00", "#ffd700", "#ffffff"] },
  watermelon: { id: "watermelon", name: "Watermelon", tier: "uncommon", kind: "solid", colors: ["#90ee90", "#ffffff", "#ff69b4"] },

  // Epic skins with base structure
  bubble_rise: { id: "bubble_rise", name: "Bubble Rise", tier: "epic", kind: "animated", colors: ["#6DDAD3", "#46C0B7", "#0F3431"] },

  // Common skins
  cherry: { id: "cherry", name: "Cherry", tier: "common", kind: "solid", colors: ["#dc2626"] },
  grape: { id: "grape", name: "Grape", tier: "common", kind: "solid", colors: ["#8b5cf6"] },
  tangerine_insp: { id: "tangerine_insp", name: "Tangerine (Inspiration)", tier: "common", kind: "solid", colors: ["#f97316"] },
  bubblegum_insp: { id: "bubblegum_insp", name: "Bubblegum (Inspiration)", tier: "common", kind: "solid", colors: ["#f472b6"] },
  seafoam: { id: "seafoam", name: "Seafoam", tier: "common", kind: "solid", colors: ["#14b8a6"] },
  slate: { id: "slate", name: "Slate", tier: "common", kind: "solid", colors: ["#64748b"] },

  // Uncommon skins
  leaf_fade: { id: "leaf_fade", name: "Leaf Fade", tier: "uncommon", kind: "gradient", colors: ["#22c55e", "#16a34a"] },
  ocean_mist: { id: "ocean_mist", name: "Ocean Mist", tier: "uncommon", kind: "gradient", colors: ["#0ea5e9", "#bae6fd"] },
  twilight: { id: "twilight", name: "Twilight", tier: "uncommon", kind: "gradient", colors: ["#6366f1", "#8b5cf6"] },
  rose_glow: { id: "rose_glow", name: "Rose Glow", tier: "uncommon", kind: "gradient", colors: ["#f43f5e", "#fb7185"] },

  // ===== REAL MISSING SKINS FROM NEW SYSTEM (with complete data) =====
  // Ice cream skins with pattern data
  ice_cream_swirl: { 
    id: "ice_cream_swirl", 
    name: "Ice Cream Swirl", 
    tier: "uncommon", 
    source: "production",
    origin: { type: "shop", source: "shop", displayName: "Available in Shop" },
    bio: "Classic soft serve swirl with creamy vanilla and rich chocolate bands.",
    kind: "solid", 
    colors: ["#ffffff", "#8b4513"],
    base: { fill: "#ffffff", stroke: "#1f2937", shine: "#ffffff" },
    pattern: { type: "static_swirl", colors: ["#ffffff", "#8b4513"], rotation: false, intensity: 0.9 }
  },
  ice_cream_swirl_2: { 
    id: "ice_cream_swirl_2", 
    name: "Ice Cream Swirl 2", 
    tier: "uncommon", 
    source: "production",
    origin: { type: "shop", source: "shop", displayName: "Available in Shop" },
    bio: "Conic-gradient soft serve with alternating vanilla and chocolate stripes.",
    kind: "solid", 
    colors: ["#ffffff", "#8b4513"],
    base: { fill: "#ffffff", stroke: "#1f2937", shine: "#ffffff" },
    pattern: { type: "conic_gradient", colors: ["#ffffff", "#8b4513"], rotation: false, intensity: 0.9 }
  },
  ice_cream_swirl_3: { 
    id: "ice_cream_swirl_3", 
    name: "Ice Cream Swirl 3", 
    tier: "uncommon", 
    source: "production",
    origin: { type: "shop", source: "shop", displayName: "Available in Shop" },
    bio: "Mathematically perfect logarithmic spiral with vanilla and chocolate turns.",
    kind: "solid", 
    colors: ["#ffffff", "#8b4513"],
    base: { fill: "#ffffff", stroke: "#1f2937", shine: "#ffffff" },
    pattern: { type: "logarithmic_spiral", colors: ["#ffffff", "#8b4513"], rotation: false, intensity: 0.9 }
  },

  // Legacy skins
  green_legacy: { id: "green_legacy", name: "Green (Legacy)", tier: "common", source: "inspiration", kind: "solid", colors: ["#22c55e"] },
  mint_legacy: { id: "mint_legacy", name: "Mint (Legacy)", tier: "common", source: "inspiration", kind: "solid", colors: ["#4ade80"] },
};

// Export for compatibility
export default SKINS;

// Force reload - updated at 2025-09-27 14:35