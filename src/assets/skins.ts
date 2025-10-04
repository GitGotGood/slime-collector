export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic";

export type UnifiedSkin = {
  id: string;
  name: string;
  tier: Rarity;
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

export const SKINS: Record<string, UnifiedSkin> = {
  // ===== COMMONS =====
  moss: {
    id: "moss",
    name: "Moss",
    tier: "common",
    kind: "solid",
    colors: ["#5BA86D"],
    base: {
      fill: "#5BA86D",
      stroke: "#2d5a3d",
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
      stroke: "#1e40af",
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
      stroke: "#cc5c4a",
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
      stroke: "#4a5568",
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
      stroke: "#6B7280",
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
      stroke: "#1e40af",
      shine: "#ffffff"
    }
  },

  apple_shine: {
    id: "apple_shine",
    name: "Apple Shine",
    tier: "common",
    kind: "solid",
    colors: ["#dc2626"],
    base: {
      fill: "#dc2626",
      stroke: "#991b1b",
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
      stroke: "#d97706",
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
      stroke: "#7c3aed",
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
      stroke: "#92400e",
      shine: "#ffffff"
    }
  },

  // ===== UNCOMMONS =====
  spring_fade: {
    id: "spring_fade",
    name: "Spring Fade",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#ff8cb9", "#ffe97a", "#34d399"],
    base: {
      fill: "#ff8cb9",
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
    colors: ["#8f2738", "#e17a2d", "#f7e8a4", "#7fcf61"],
    base: {
      fill: "#5fbf4f",
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
    colors: ["#fed8e1", "#f07896", "#07bed8", "#a8e8ec"],
    base: {
      fill: "#fed8e1",
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

  sprinkles: {
    id: "sprinkles",
    name: "Sprinkles",
    tier: "rare",
    kind: "pattern",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
    base: {
      fill: "#f9a8d4",
      stroke: "#be185d",
      shine: "#0E1B2B"
    },
    pattern: {
      type: "confetti_dots",
      count: 34,
      colors: ["#ff3b3b", "#06e0cf", "#14b8ff", "#ff7b3a"],
      alpha: 0.85
    }
  },

  vanilla_sprinkles: {
    id: "vanilla_sprinkles",
    name: "Vanilla Sprinkles",
    tier: "rare",
    kind: "pattern",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
    base: {
      fill: "#ffffff",
      stroke: "#8b5e34",
      shine: "#ffffff"
    },
    pattern: {
      type: "confetti_dots",
      count: 34,
      colors: ["#ff3b3b", "#06e0cf", "#14b8ff", "#ff7b3a"],
      alpha: 0.85
    }
  },

  // ===== EPICS =====
  rainbow: {
    id: "rainbow",
    name: "Rainbow",
    tier: "uncommon",
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
      fill: "#ffffff",
      stroke: "#2A2F35",
      shine: "#ffffff"
    },
    anim: "confetti_fall"
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
    colors: ["#b189ff", "#43e0c6"],
    base: {
      fill: "#1f7e84",
      stroke: "#1e293b",
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

  biolume: {
    id: "biolume",
    name: "Biolume",
    tier: "epic",
    kind: "animated",
    colors: ["#0f766e", "#14b8a6"],
    base: {
      fill: "#0f766e",
      stroke: "#134e4a",
      shine: "#ffffff"
    },
    anim: "caustic_ripples_with_motes"
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

  // ===== NEW SLIMES FOR UNIFIED GALLERY =====
  the_fizz: {
    id: "the_fizz",
    name: "The Fizz",
    tier: "epic",
    kind: "animated",
    colors: ["#BDEBFF", "#93DBFF", "#ffffff"],
    base: {
      fill: "#BDEBFF",
      stroke: "#93DBFF",
      shine: "#ffffff"
    },
    anim: "the_fizz",
    bio: "Bubbly carbonated slime with effervescent fizz effects and sparkling bubbles that rise and pop."
  },

  berry_jam: {
    id: "berry_jam",
    name: "Berry Jam",
    tier: "common",
    kind: "solid",
    colors: ["#C13A73"],
    base: {
      fill: "#C13A73",
      stroke: "#7F1D3A",
      shine: "#FFF2F7"
    },
    bio: "Rich berry jam with deep purple-red color and sweet shine."
  },

  watermelon: {
    id: "watermelon",
    name: "Watermelon",
    tier: "uncommon",
    kind: "gradient",
    colors: ["#ff69b4", "#ff69b4", "#ff69b4", "#ffb3d1", "#90ee90"],
    base: {
      fill: "#ff69b4",
      stroke: "#228b22",
      shine: "#ffffff"
    },
    gradient: {
      direction: "radial"
    },
    bio: "Juicy summer fruit with radial gradient from watermelon pink to white to light green on the outside."
  }
};

// simple shop listing
export const ALL_SHOP_ITEMS = Object.values(SKINS).map((s) => ({
  id: `skin_${s.id}`,
  type: "skin" as const,
  skin: s.id,
  tier: s.tier,
}));