// Work-in-Progress Slimes
// These slimes are being developed and tested in the Unified Gallery
// They will be moved to skins.ts when ready for production

export const WIP_SKINS = {
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
  },

  cosmic: {
    id: "cosmic",
    name: "Cosmic",
    tier: "mythic",
    kind: "animated",
    colors: ["#000000", "#1a1a2e", "#16213e"],
    base: {
      fill: "#000000",
      stroke: "#00d4ff",
      shine: "#ff6b35"
    },
    anim: "cosmic",
    bio: "A cosmic void with swirling accretion disk and gravitational lensing effects."
  },

  portal: {
    id: "portal",
    name: "Portal",
    tier: "mythic",
    kind: "animated",
    colors: ["#000000", "#1a1a2e", "#16213e"],
    base: {
      fill: "#000000",
      stroke: "#ff6b35",
      shine: "#00d4ff"
    },
    anim: "portal",
    bio: "Overlapping ring gradients with different rotation speeds for dynamic motion."
  },

  black_hole_5: {
    id: "black_hole_5",
    name: "Black Hole 5",
    tier: "mythic",
    kind: "animated",
    colors: ["#000000", "#1a1a2e", "#16213e"],
    base: {
      fill: "#000000",
      stroke: "#ff6b35",
      shine: "#00d4ff"
    },
    anim: "black_hole_5",
    bio: "A wobbly purple gradient ring with feathered edges and hard pink cut to black center."
  },

  solar_crown: {
    id: "solar_crown",
    name: "Solar Crown",
    tier: "mythic",
    kind: "animated",
    colors: ["#fbbf24"],
    base: {
      fill: "#fbbf24",
      stroke: "#92400e",
      shine: "#fef3c7"
    },
    anim: "coronas_flares",
    bio: "A majestic solar crown with coronas and flares emanating from its golden core."
  },

  solar_flare: {
    id: "solar_flare",
    name: "Solar Flare",
    tier: "mythic",
    kind: "animated",
    colors: ["#ff8c00"],
    base: {
      fill: "#ff8c00",
      stroke: "#b45309",
      shine: "#fef3c7"
    },
    anim: "intense_solar_aura",
    bio: "An intense solar flare with powerful aura effects and brilliant orange glow."
  },

  slime1: {
    id: "slime1",
    name: "Slime1",
    tier: "mythic",
    kind: "animated",
    anim: "slime1_solar",
    colors: ["#fbbf24", "#f59e0b"],
    base: {
      fill: "#fbbf24",
      stroke: "#92400e",
      shine: "#ffffff"
    },
    bio: "Custom solar crown with golden flares and coronas."
  },

  slime2: {
    id: "slime2",
    name: "Slime2",
    tier: "mythic",
    kind: "animated",
    anim: "slime2_solar",
    colors: ["#ff8c00", "#ff4500"],
    base: {
      fill: "#ff8c00",
      stroke: "#b45309",
      shine: "#ffffff"
    },
    bio: "Custom solar flare with intense orange energy."
  },

  slime3: {
    id: "slime3",
    name: "Solar Inferno",
    tier: "mythic",
    kind: "animated",
    anim: "solar_inferno",
    colors: ["#ff4500", "#ff6b35", "#ffa500"],
    base: {
      fill: "#ff4500",
      stroke: "#cc3700",
      shine: "#ffff00"
    },
    bio: "A living embodiment of solar fury with swirling plasma and magnetic loops."
  },

  slime4: {
    id: "slime4",
    name: "Stellar Core",
    tier: "mythic",
    kind: "animated",
    anim: "stellar_core",
    colors: ["#ffff00", "#ffd700", "#ffa500"],
    base: {
      fill: "#ffff00",
      stroke: "#ff8c00",
      shine: "#ffffff"
    },
    bio: "The heart of a star with nuclear fusion energy and solar wind particles."
  }
};

export default WIP_SKINS;
