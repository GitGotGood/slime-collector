/**
 * Shop Skins - Unified System
 * 
 * This file contains the 26 skins currently live in the shop, hand-curated
 * for perfect rendering with the new unified system.
 * 
 * Generated: 2025-09-29
 * 
 * Shop Skins: Moss, Sky, Coral, Charcoal, Spring Fade, Autumn Fade, Blue Lagoon, 
 * Cotton Candy, Rainbow, Sunset, Sunrise, Polka Mint, Confetti, Ripple, Lava Flow, 
 * Aurora Veil, Nebula, Phoenix Heart, Acorn, Biolume Veil Enhanced, Fog, Bluebird, 
 * Apple Shine, Honey, Lilac, Sprinkles
 */

export interface ShopSkin {
  id: string;
  name: string;
  tier: "common" | "uncommon" | "rare" | "epic" | "mythic";
  kind: "solid" | "gradient" | "animated" | "pattern";
  colors: string[];
  base: {
    fill: string;
    stroke: string;
    shine: string;
  };
  pattern?: {
    type: string;
    colors?: string[];
    [key: string]: any;
  };
  gradient?: {
    direction: "vertical" | "horizontal" | "diagonal" | "radial";
  };
  anim?: string;
  bio?: string;
}

export const SHOP_SKINS: Record<string, ShopSkin> = {
  // ===== COMMONS =====
  moss: {
    id: "moss",
    name: "Moss",
    tier: "common",
    kind: "solid",
    colors: ["#5BA86D"],
    base: {
      fill: "#5BA86D",
      stroke: "#2d5a3d", // Darker green stroke (darker than #5BA86D)
      shine: "#ffffff"
    }
  },

  sky: {
    id: "sky",
    name: "Sky",
    tier: "common",
    kind: "solid",
    colors: ["#A9D8FF"],
    base: {
      fill: "#A9D8FF",
      stroke: "#1e40af", // Darker blue stroke (darker than #A9D8FF)
      shine: "#ffffff"
    }
  },

  coral: {
    id: "coral",
    name: "Coral",
    tier: "common",
    kind: "solid",
    colors: ["#FF8B7A"],
    base: {
      fill: "#FF8B7A",
      stroke: "#cc5c4a", // Darker coral stroke (darker than #FF8B7A)
      shine: "#ffffff"
    }
  },

  charcoal: {
    id: "charcoal",
    name: "Charcoal",
    tier: "common",
    kind: "solid",
    colors: ["#2A2F35"],
    base: {
      fill: "#2A2F35",
      stroke: "#4a5568", // Match face color stroke
      shine: "#ffffff"
    }
  },

  fog: {
    id: "fog",
    name: "Fog",
    tier: "common",
    kind: "solid",
    colors: ["#9CA3AF"],
    base: {
      fill: "#9CA3AF",
      stroke: "#6B7280", // Medium gray stroke
      shine: "#ffffff"
    }
  },

  bluebird: {
    id: "bluebird",
    name: "Bluebird",
    tier: "common",
    kind: "solid",
    colors: ["#60a5fa"],
    base: {
      fill: "#60a5fa",
      stroke: "#1e40af", // Dark blue stroke
      shine: "#ffffff"
    }
  },

  apple_shine: {
    id: "apple_shine",
    name: "Apple Shine",
    tier: "common",
    kind: "solid",
    colors: ["#dc2626"], // Apple red
    base: {
      fill: "#dc2626", // Apple red
      stroke: "#991b1b", // Darker red stroke
      shine: "#ffffff"
    }
  },

  honey: {
    id: "honey",
    name: "Honey",
    tier: "common",
    kind: "solid",
    colors: ["#fbbf24"],
    base: {
      fill: "#fbbf24",
      stroke: "#d97706", // Dark orange stroke
      shine: "#ffffff"
    }
  },

  lilac: {
    id: "lilac",
    name: "Lilac",
    tier: "common",
    kind: "solid",
    colors: ["#BDA7FF"],
    base: {
      fill: "#BDA7FF",
      stroke: "#7c3aed", // Dark purple stroke
      shine: "#ffffff"
    }
  },

  acorn: {
    id: "acorn",
    name: "Acorn",
    tier: "common",
    kind: "solid",
    colors: ["#a16207"],
    base: {
      fill: "#a16207",
      stroke: "#92400e", // Dark brown stroke (darker than #a16207)
      shine: "#ffffff"
    }
  },

  // ===== UNCOMMONS =====
  spring_fade: {
    id: "spring_fade",
    name: "Spring Fade",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#B7F8C6", "#FFF4A8"],
    base: {
      fill: "#B7F8C6",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "diagonal"
    }
  },

  autumn_fade: {
    id: "autumn_fade",
    name: "Autumn Fade",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#22c55e", "#dc2626"],
    base: {
      fill: "#22c55e",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "diagonal"
    }
  },

  blue_lagoon: {
    id: "blue_lagoon",
    name: "Blue Lagoon",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#22d3ee", "#2563eb"],
    base: {
      fill: "#22d3ee",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "vertical"
    }
  },

  cotton_candy: {
    id: "cotton_candy",
    name: "Cotton Candy",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#d97899", "#d97899", "#01b7cf"], // Pink, pink, blue for quick transition
    base: {
      fill: "#d97899",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "diagonal"
    }
  },


  sunset: {
    id: "sunset",
    name: "Sunset",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#6B46C1", "#EC4899", "#F97316", "#FCD34D"],
    base: {
      fill: "#6B46C1",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "vertical"
    }
  },

  sunrise: {
    id: "sunrise",
    name: "Sunrise",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#1E90FF", "#87CEEB", "#FFA500", "#FFD700"],
    base: {
      fill: "#1E90FF",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "vertical"
    }
  },

  // ===== RARES =====
  polka_mint: {
    id: "polka_mint",
    name: "Polka Mint",
    tier: "rare",
    kind: "gradient",
    colors: ["#B6E3B6", "#FFFFFF"],
    base: {
      fill: "#B6E3B6",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "vertical"
    },
    pattern: {
      type: "polka_dots",
      colors: ["#B6E3B6", "#FFFFFF"],
      size: "medium"
    }
  },

  ripple: {
    id: "ripple",
    name: "Ripple",
    tier: "rare",
    kind: "gradient",
    colors: ["#7FECD8", "#134E4A"],
    base: {
      fill: "#7FECD8",
      stroke: "#134E4A",
      shine: "#ffffff"
    },
    gradient: {
      direction: "radial"
    },
    pattern: {
      type: "concentric_rings",
      colors: ["#134E4A"]
    }
  },

  lava_flow: {
    id: "lava_flow",
    name: "Lava Flow",
    tier: "epic",
    kind: "animated",
    colors: ["#3A1D0E", "#FFF0DD", "#dc2626"],
    base: {
      fill: "#dc2626",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    anim: "lava_flow"
  },

  aurora: {
    id: "aurora",
    name: "Aurora",
    tier: "epic",
    kind: "gradient",
    colors: ["#b189ff", "#43e0c6"], // Purple to teal gradient
    base: {
      fill: "#43e0c6",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "vertical"
    },
    anim: "aurora_veil"
  },

  dark_aurora: {
    id: "dark_aurora",
    name: "Dark Aurora",
    tier: "epic",
    kind: "animated",
    colors: ["#43e0c6", "#b189ff"],
    base: {
      fill: "#000000",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    anim: "aurora_veil"
  },

  // ===== EPICS =====
  rainbow: {
    id: "rainbow",
    name: "Rainbow",
    tier: "rare",
    kind: "gradient",
    colors: ["#ef4444", "#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#8b5cf6"],
    base: {
      fill: "#ef4444",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    gradient: {
      direction: "horizontal"
    }
  },

  confetti: {
    id: "confetti",
    name: "Confetti",
    tier: "epic",
    kind: "animated",
    colors: ["#f472b6", "#22d3ee", "#fbbf24", "#10b981", "#8b5cf6", "#ef4444"],
    base: {
      fill: "#ffffff", // White background
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    anim: "confetti_fall"
  },

  sprinkles: {
    id: "sprinkles",
    name: "Sprinkles",
    tier: "rare",
    kind: "pattern",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
    base: {
      fill: "#F7FBFF", // Light blue base like original
      stroke: "#93C5FD",
      shine: "#0E1B2B"
    },
    pattern: {
      type: "confetti_dots",
      count: 18,
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
      alpha: 0.8
    }
  },

  // ===== MYTHICS =====
  nebula: {
    id: "nebula",
    name: "Nebula",
    tier: "mythic",
    kind: "animated",
    colors: ["#5b2d8f", "#1b1e4b", "#0f1530"],
    base: {
      fill: "#1e1b4b",
      stroke: "#0f172a",
      shine: "#c7d2fe"
    },
    anim: "deep_space_parallax"
  },

  phoenix_heart: {
    id: "phoenix_heart",
    name: "Phoenix Heart",
    tier: "mythic",
    kind: "animated",
    colors: ["#ff7a3c", "#d12525", "#571616"],
    base: {
      fill: "#dc2626",
      stroke: "#7f1d1d",
      shine: "#fed7d7"
    },
    anim: "ember_rise_trail"
  },

  biolume: {
    id: "biolume",
    name: "Biolume",
    tier: "epic",
    kind: "animated",
    colors: ["#0f766e", "#14b8a6"],
    base: {
      fill: "#0f766e", // Dark teal body
      stroke: "#134e4a", // Darker teal stroke
      shine: "#ffffff"
    },
    anim: "caustic_ripples_with_motes"
  },

  vanilla_sprinkles: {
    id: "vanilla_sprinkles",
    name: "Vanilla Sprinkles",
    tier: "rare",
    kind: "pattern",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
    base: {
      fill: "#ffffff", // White base
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    pattern: {
      type: "confetti_dots",
      count: 18,
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
      alpha: 0.8
    }
  }
};

export default SHOP_SKINS;
