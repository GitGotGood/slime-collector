import React from "react";
import { motion } from "framer-motion";
import type { WorldID } from "../core/types";

export type BiomeId = WorldID; // Use the 16 WorldID types

export interface BiomeStyle {
  name: string;
  cssVars: {
    '--bgA': string;
    '--bgB': string; 
    '--accent': string;
    '--ink': string;
  };
  style: React.CSSProperties;
}

export const BIOMES: Record<BiomeId, BiomeStyle> = {
  // 1) Meadow (World 1) - bright, cozy, "start here"
  meadow: {
    name: "Meadow",
    cssVars: {
      '--bgA': '#E9FCEB',
      '--bgB': '#CFF7D5', 
      '--accent': '#55C779',
      '--ink': '#0B3A29'
    },
    style: {
      background: "linear-gradient(180deg, #E9FCEB 0%, #CFF7D5 100%)",
    },
  },

  // 2) Beach (World 2) - sunny shoreline
  beach: {
    name: "Beach",
    cssVars: {
      '--bgA': '#BEEBFF',
      '--bgB': '#FFF3B0',
      '--accent': '#48C0E0', 
      '--ink': '#083045'
    },
    style: {
      background: "linear-gradient(180deg, #BEEBFF 0%, #FFF3B0 100%)",
    },
  },

  // 3) Forest (World 3) - calm, shaded
  forest: {
    name: "Forest", 
    cssVars: {
      '--bgA': '#D9F1E0',
      '--bgB': '#9ED4B5',
      '--accent': '#2F6F4B',
      '--ink': '#0B3125'
    },
    style: {
      background: "linear-gradient(180deg, #D9F1E0 0%, #9ED4B5 100%)",
    },
  },

  // 4) Desert (World 4) - warm, open
  desert: {
    name: "Desert",
    cssVars: {
      '--bgA': '#FFE7C4',
      '--bgB': '#FFD3A3',
      '--accent': '#C56B2E',
      '--ink': '#3A1A06'
    },
    style: {
      background: "linear-gradient(180deg, #FFE7C4 0%, #FFD3A3 100%)",
    },
  },

  // 5) Cove (World 5) - sheltered, sparkly water
  cove: {
    name: "Cove",
    cssVars: {
      '--bgA': '#CFF8FF',
      '--bgB': '#9BE2F2',
      '--accent': '#2BA7C7',
      '--ink': '#072435'
    },
    style: {
      background: "linear-gradient(180deg, #CFF8FF 0%, #9BE2F2 100%)",
    },
  },

  // 6) Tundra (World 6) - crisp, quiet
  tundra: {
    name: "Tundra",
    cssVars: {
      '--bgA': '#EAF6FF',
      '--bgB': '#D6ECFF',
      '--accent': '#6DA7D9',
      '--ink': '#0C1C2E'
    },
    style: {
      background: "linear-gradient(180deg, #EAF6FF 0%, #D6ECFF 100%)",
    },
  },

  // 7) Canyon (World 7) - dramatic layers
  canyon: {
    name: "Canyon",
    cssVars: {
      '--bgA': '#FFD6B5',
      '--bgB': '#ECA57B',
      '--accent': '#9A5031',
      '--ink': '#2A1108'
    },
    style: {
      background: "linear-gradient(180deg, #FFD6B5 0%, #ECA57B 100%)",
    },
  },

  // 8) Aurora (World 8) - magical night glow
  aurora: {
    name: "Aurora",
    cssVars: {
      '--bgA': '#0E1428',
      '--bgB': '#172345',
      '--accent': '#72F3D4',
      '--ink': '#EAF4FF'
    },
    style: {
      background: "linear-gradient(180deg, #0E1428 0%, #172345 100%)",
    },
  },

  // 9) Savanna (World 9) - warm horizon
  savanna: {
    name: "Savanna",
    cssVars: {
      '--bgA': '#FFF0C2',
      '--bgB': '#FFE09A',
      '--accent': '#7B5F2A',
      '--ink': '#3A2B12'
    },
    style: {
      background: "linear-gradient(180deg, #FFF0C2 0%, #FFE09A 100%)",
    },
  },

  // 10) Glacier (World 10) - luminous ice
  glacier: {
    name: "Glacier",
    cssVars: {
      '--bgA': '#EAFBFF',
      '--bgB': '#CFEFFF',
      '--accent': '#5BA9D6',
      '--ink': '#0B2140'
    },
    style: {
      background: "linear-gradient(180deg, #EAFBFF 0%, #CFEFFF 100%)",
    },
  },

  // 11) Volcano (World 11) - dark + ember glow
  volcano: {
    name: "Volcano",
    cssVars: {
      '--bgA': '#1A1210',
      '--bgB': '#2A1714',
      '--accent': '#FF7A3D',
      '--ink': '#FFEBDD'
    },
    style: {
      background: "linear-gradient(180deg, #1A1210 0%, #2A1714 100%)",
    },
  },

  // 12) Reef (World 12) - colorful reef wall
  reef: {
    name: "Reef",
    cssVars: {
      '--bgA': '#B7F0FF',
      '--bgB': '#7FD7F0',
      '--accent': '#34B4D6',
      '--ink': '#072435'
    },
    style: {
      background: "linear-gradient(180deg, #B7F0FF 0%, #7FD7F0 100%)",
    },
  },

  // 13) Temple (World 13) - serene, scholarly
  temple: {
    name: "Temple",
    cssVars: {
      '--bgA': '#F7F1E7',
      '--bgB': '#E8DECF',
      '--accent': '#8D6E4A',
      '--ink': '#2B2216'
    },
    style: {
      background: "linear-gradient(180deg, #F7F1E7 0%, #E8DECF 100%)",
    },
  },

  // 14) Harbor (World 14) - nautical, precise
  harbor: {
    name: "Harbor",
    cssVars: {
      '--bgA': '#E2F0FF',
      '--bgB': '#C9E1FF',
      '--accent': '#2767A3',
      '--ink': '#0B2242'
    },
    style: {
      background: "linear-gradient(180deg, #E2F0FF 0%, #C9E1FF 100%)",
    },
  },

  // 15) Observatory (World 15) - cosmic, studious
  observatory: {
    name: "Observatory",
    cssVars: {
      '--bgA': '#101629',
      '--bgB': '#1B2440',
      '--accent': '#8CB6FF',
      '--ink': '#EAF4FF'
    },
    style: {
      background: "linear-gradient(180deg, #101629 0%, #1B2440 100%)",
    },
  },

  // 16) Foundry (World 16) - industrious, glowing
  foundry: {
    name: "Foundry",
    cssVars: {
      '--bgA': '#1B1F27',
      '--bgB': '#2A3240',
      '--accent': '#F2A33A',
      '--ink': '#F8F9FB'
    },
    style: {
      background: "linear-gradient(180deg, #1B1F27 0%, #2A3240 100%)",
    },
  },
};

// Helper function to determine current biome from player progression
export function getCurrentBiome(profile: any): BiomeId {
  if (!profile?.unlocks?.biomes || !Array.isArray(profile.unlocks.biomes)) {
    return "meadow";
  }
  
  // Find the most recently unlocked biome (last in the array)
  const unlockedBiomes = profile.unlocks.biomes;
  const latestBiome = unlockedBiomes[unlockedBiomes.length - 1];
  
  // Ensure it's a valid biome ID, fallback to meadow
  return BIOMES[latestBiome as BiomeId] ? (latestBiome as BiomeId) : "meadow";
}

// Helper function to get biome for a specific skill (for dynamic biome display)
export function getBiomeForSkill(skillId: any): BiomeId {
  // Import here to avoid circular dependencies
  import("../core/progression").then(({ worldIdOf }) => {
    const worldId = worldIdOf(skillId);
    return worldId && BIOMES[worldId as BiomeId] ? (worldId as BiomeId) : "meadow";
  });
  
  // Fallback mapping for immediate use
  const skillToBiome: Record<string, BiomeId> = {
    "add_1_10": "meadow",
    "add_1_20": "beach", 
    "sub_1_10": "forest",
    "sub_1_20": "desert",
    "add_sub_20": "cove",
    "missing_20": "tundra",
    "ten_more_less": "canyon",
    "place_value": "aurora",
    "mult_facts": "savanna",
    "div_facts": "glacier", 
    "mult_1_dig": "volcano",
    "mult_2_dig": "reef",
    "frac_basics": "temple",
    "frac_adv": "harbor",
    "decimals": "observatory",
    "order_ops": "foundry",
    "powers10": "foundry"
  };
  
  return skillToBiome[skillId] || "meadow";
}

// Helper to get biome accent color for UI elements
export function getBiomeAccent(biomeId: BiomeId): string {
  return BIOMES[biomeId]?.cssVars['--accent'] || BIOMES.meadow.cssVars['--accent'];
}

export function BiomeLayer({ biome = "meadow" as BiomeId }) {
  const b = BIOMES[biome] ?? BIOMES.meadow;
  
  // Combine CSS variables with background style
  const combinedStyle = {
    ...b.cssVars,
    ...b.style,
  };
  
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 -z-10 overflow-hidden" 
      style={combinedStyle}
    >
      {/* Biome-specific animated decorations */}
      {getBiomeDecorations(biome)}
      
      {/* soft vignette */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-20"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// Animated decorative elements for each biome
function getBiomeDecorations(biome: BiomeId) {
  const key = `${biome}-${Date.now()}`;
  
  switch (biome) {
    case "meadow":
      return (
        <>
          {/* Large swaying grass blades */}
          <motion.div 
            key={`grass1-${key}`}
            className="absolute w-8 h-24 bg-green-400/60 rounded-t-full"
            style={{ left: '10%', bottom: '0%' }}
            animate={{ 
              rotate: [0, 8, -8, 0],
              scaleY: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div 
            key={`grass2-${key}`}
            className="absolute w-6 h-20 bg-green-500/50 rounded-t-full"
            style={{ left: '25%', bottom: '0%' }}
            animate={{ 
              rotate: [0, -6, 6, 0],
              scaleY: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            key={`grass3-${key}`}
            className="absolute w-10 h-28 bg-green-300/40 rounded-t-full"
            style={{ right: '15%', bottom: '0%' }}
            animate={{ 
              rotate: [0, 10, -5, 0],
              scaleY: [1, 1.15, 1]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
          />
          {/* Floating dandelion seeds */}
          <motion.div
            key={`seed1-${key}`}
            className="absolute w-3 h-3 bg-white/80 rounded-full"
            style={{ left: '30%', top: '20%' }}
            animate={{ 
              y: [0, -100, 200],
              x: [0, 30, -20, 50],
              rotate: [0, 360],
              opacity: [1, 0.8, 0]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeOut" }}
          />
          <motion.div
            key={`seed2-${key}`}
            className="absolute w-2 h-2 bg-white/70 rounded-full"
            style={{ right: '40%', top: '30%' }}
            animate={{ 
              y: [0, -80, 180],
              x: [0, -25, 15, -30],
              rotate: [0, -270],
              opacity: [1, 0.9, 0]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeOut", delay: 3 }}
          />
          {/* Large wind gust effect */}
          <motion.div
            key={`wind-${key}`}
            className="absolute w-96 h-48 bg-green-200/30 rounded-full blur-2xl"
            style={{ left: '-20%', top: '20%' }}
            animate={{ 
              x: [0, 400],
              scale: [0.8, 1.2, 0.8],
              opacity: [0, 0.6, 0] 
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
        </>
      );
      
    case "beach":
      return (
        <>
          {/* Large animated waves */}
          <motion.div
            key={`wave1-${key}`}
            className="absolute w-full h-16 bg-blue-400/40 rounded-full blur-lg"
            style={{ left: '-20%', bottom: '10%' }}
            animate={{ 
              x: [0, 50, 0],
              scaleX: [1, 1.3, 1],
              scaleY: [1, 1.5, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <motion.div
            key={`wave2-${key}`}
            className="absolute w-full h-12 bg-cyan-300/50 rounded-full blur-md"
            style={{ right: '-30%', bottom: '20%' }}
            animate={{ 
              x: [0, -40, 0],
              scaleX: [1, 1.2, 1],
              scaleY: [1, 1.3, 1]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
          />
          {/* Dramatic sun rays */}
          <motion.div
            key={`sunray1-${key}`}
            className="absolute w-2 h-32 bg-yellow-300/60 blur-sm"
            style={{ right: '15%', top: '5%', transformOrigin: 'bottom' }}
            animate={{ 
              rotate: [0, 5, -5, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            key={`sunray2-${key}`}
            className="absolute w-1.5 h-28 bg-yellow-400/50 blur-sm"
            style={{ right: '20%', top: '8%', transformOrigin: 'bottom' }}
            animate={{ 
              rotate: [0, -3, 3, 0],
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          />
          {/* Seagulls */}
          <motion.div
            key={`seagull-${key}`}
            className="absolute w-4 h-2 bg-white/90"
            style={{ 
              left: '80%', 
              top: '20%',
              clipPath: 'polygon(0% 50%, 30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%)'
            }}
            animate={{ 
              x: [-200, 400],
              y: [0, -20, 10, -15, 0]
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          />
          {/* Beach umbrellas silhouette */}
          <motion.div
            key={`umbrella-${key}`}
            className="absolute w-16 h-8 bg-red-400/30 rounded-t-full"
            style={{ right: '25%', bottom: '25%' }}
            animate={{ 
              rotate: [0, 3, -3, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
        </>
      );
      
    case "forest":
      return (
        <>
          {/* Dramatic tree silhouettes */}
          <motion.div
            key={`tree1-${key}`}
            className="absolute w-16 h-40 bg-green-800/60 rounded-t-full"
            style={{ left: '5%', bottom: '0%' }}
            animate={{ 
              scaleX: [1, 1.05, 1],
              scaleY: [1, 1.02, 1]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            key={`tree2-${key}`}
            className="absolute w-12 h-32 bg-green-700/50 rounded-t-full"
            style={{ right: '10%', bottom: '0%' }}
            animate={{ 
              scaleX: [1, 1.03, 1],
              scaleY: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          />
          {/* Cascading leaves */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`leaf${i}-${key}`}
              className="absolute w-3 h-3 bg-green-500/70 rounded-full"
              style={{ 
                left: `${15 + i * 12}%`, 
                top: '10%',
                clipPath: 'polygon(20% 0%, 0% 50%, 20% 100%, 50% 80%, 100% 100%, 80% 50%, 100% 0%, 50% 20%)'
              }}
              animate={{ 
                y: [0, 300],
                x: [0, 20 * (i % 2 ? 1 : -1), -10 * (i % 2 ? 1 : -1)],
                rotate: [0, 360 * (i % 2 ? 1 : -1)],
                opacity: [1, 0.8, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8 + i * 0.5, 
                ease: "easeOut",
                delay: i * 1.2
              }}
            />
          ))}
          {/* Dramatic sunbeams */}
          <motion.div
            key={`sunbeam1-${key}`}
            className="absolute w-4 h-48 bg-yellow-300/50 blur-sm"
            style={{ left: '70%', top: '0%' }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 1.2, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
          <motion.div
            key={`sunbeam2-${key}`}
            className="absolute w-3 h-40 bg-yellow-400/40 blur-sm"
            style={{ right: '25%', top: '5%' }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              scaleX: [1, 1.15, 1],
              rotate: [0, -1.5, 1.5, 0]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 4 }}
          />
          {/* Fireflies */}
          <motion.div
            key={`firefly1-${key}`}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{ left: '40%', top: '60%' }}
            animate={{ 
              x: [0, 30, -20, 15, 0],
              y: [0, -15, 25, -10, 0],
              opacity: [0.5, 1, 0.3, 0.8, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          <motion.div
            key={`firefly2-${key}`}
            className="absolute w-1 h-1 bg-green-200 rounded-full"
            style={{ right: '45%', bottom: '40%' }}
            animate={{ 
              x: [0, -25, 18, -12, 0],
              y: [0, 20, -18, 8, 0],
              opacity: [0.3, 0.9, 0.2, 0.7, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 5 }}
          />
        </>
      );
      
    case "desert":
      return (
        <>
          {/* Sunset glow in background */}
          <motion.div
            key={`sunset-${key}`}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(252, 211, 77, 0.3) 50%, transparent 100%)',
              right: '10%', 
              top: '5%'
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          
          {/* Sand dunes - layered background shapes */}
          <motion.div
            key={`dune1-${key}`}
            className="absolute w-40 h-12 bg-gradient-to-t from-amber-300/30 to-transparent rounded-full"
            style={{ left: '20%', bottom: '15%' }}
            animate={{ 
              scaleX: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
          <motion.div
            key={`dune2-${key}`}
            className="absolute w-32 h-8 bg-gradient-to-t from-yellow-300/25 to-transparent rounded-full"
            style={{ right: '25%', bottom: '20%' }}
            animate={{ 
              scaleX: [1, 1.03, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            key={`dune3-${key}`}
            className="absolute w-24 h-6 bg-gradient-to-t from-amber-400/20 to-transparent rounded-full"
            style={{ left: '60%', bottom: '18%' }}
            animate={{ 
              scaleX: [1, 1.07, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 16, ease: "easeInOut", delay: 4 }}
          />

          {/* Multiple cacti for perspective */}
          {/* Large foreground cactus */}
          <motion.div
            key={`cactus-large-${key}`}
            className="absolute"
            style={{ left: '12%', bottom: '8%' }}
            animate={{ 
              x: [0, 1, 0],
              y: [0, -1, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="w-4 h-20 bg-green-800/80 rounded-t-lg relative">
              <div className="absolute w-3 h-10 bg-green-800/80 rounded-t-lg -left-2.5 top-4 transform -rotate-15"></div>
              <div className="absolute w-2.5 h-8 bg-green-800/80 rounded-t-lg -right-2 top-7 transform rotate-12"></div>
              {/* Small details */}
              <div className="absolute w-0.5 h-1 bg-green-900 rounded top-2 left-1"></div>
              <div className="absolute w-0.5 h-1 bg-green-900 rounded top-4 right-1"></div>
            </div>
          </motion.div>
          
          {/* Medium middle-ground cactus */}
          <motion.div
            key={`cactus-medium-${key}`}
            className="absolute"
            style={{ right: '20%', bottom: '12%' }}
            animate={{ 
              x: [0, 0.5, 0],
              y: [0, -0.5, 0]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-3 h-14 bg-green-700/70 rounded-t-lg relative">
              <div className="absolute w-2 h-7 bg-green-700/70 rounded-t-lg -left-1.5 top-3 transform -rotate-10"></div>
              <div className="absolute w-1.5 h-5 bg-green-700/70 rounded-t-lg -right-1.5 top-6 transform rotate-8"></div>
            </div>
          </motion.div>
          
          {/* Small background cactus */}
          <motion.div
            key={`cactus-small-${key}`}
            className="absolute"
            style={{ left: '75%', bottom: '15%' }}
            animate={{ 
              x: [0, 0.3, 0],
              y: [0, -0.3, 0]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
          >
            <div className="w-2 h-8 bg-green-600/60 rounded-t-lg relative">
              <div className="absolute w-1 h-4 bg-green-600/60 rounded-t-lg -left-1 top-2 transform -rotate-8"></div>
              <div className="absolute w-1 h-3 bg-green-600/60 rounded-t-lg -right-0.5 top-3 transform rotate-6"></div>
            </div>
          </motion.div>
          
          {/* Heat shimmer */}
          <motion.div
            key={`heat1-${key}`}
            className="absolute w-16 h-20 bg-orange-300/30 rounded-full blur-2xl"
            style={{ left: '70%', bottom: '20%' }}
            animate={{ 
              y: [0, -8, 0],
              scaleY: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <motion.div
            key={`heat2-${key}`}
            className="absolute w-12 h-16 bg-amber-300/35 rounded-full blur-xl"
            style={{ right: '15%', bottom: '30%' }}
            animate={{ 
              y: [0, -6, 0],
              scaleY: [1, 1.15, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Enhanced blowing sand - more dramatic movement */}
          {/* Large sand cloud */}
          <motion.div
            key={`sandcloud-${key}`}
            className="absolute w-8 h-3 bg-yellow-400/20 rounded-full blur-sm"
            style={{ left: '10%', top: '55%' }}
            animate={{ 
              x: [0, 60, 120],
              y: [0, -8, -15],
              opacity: [0, 0.6, 0],
              scaleX: [1, 1.5, 2]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeOut" }}
          />
          
          {/* Individual sand particles */}
          <motion.div
            key={`sand1-${key}`}
            className="absolute w-1 h-1 bg-yellow-400/70 rounded-full"
            style={{ left: '40%', top: '60%' }}
            animate={{ 
              x: [0, 35, 70],
              y: [0, -8, -12],
              opacity: [0, 1, 0]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            key={`sand2-${key}`}
            className="absolute w-1.5 h-1.5 bg-amber-400/60 rounded-full"
            style={{ left: '60%', top: '70%' }}
            animate={{ 
              x: [0, -30, -60],
              y: [0, -10, -18],
              opacity: [0, 0.8, 0]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            key={`sand3-${key}`}
            className="absolute w-0.5 h-0.5 bg-yellow-300/80 rounded-full"
            style={{ left: '25%', top: '50%' }}
            animate={{ 
              x: [0, 45, 90],
              y: [0, -15, -25],
              opacity: [0, 1, 0]
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 4 }}
          />
          <motion.div
            key={`sand4-${key}`}
            className="absolute w-0.5 h-0.5 bg-amber-300/70 rounded-full"
            style={{ right: '30%', top: '65%' }}
            animate={{ 
              x: [0, 25, 50],
              y: [0, -6, -10],
              opacity: [0, 0.9, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            key={`sand5-${key}`}
            className="absolute w-1 h-1 bg-yellow-500/50 rounded-full"
            style={{ left: '80%', top: '75%' }}
            animate={{ 
              x: [0, -40, -80],
              y: [0, -12, -20],
              opacity: [0, 0.7, 0]
            }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 6 }}
          />
          <motion.div
            key={`sand6-${key}`}
            className="absolute w-0.5 h-0.5 bg-orange-300/60 rounded-full"
            style={{ left: '15%', top: '45%' }}
            animate={{ 
              x: [0, 55, 110],
              y: [0, -18, -30],
              opacity: [0, 0.8, 0]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 3 }}
          />
        </>
      );
      
    case "cove":
      return (
        <>
          {/* Crystal reflections */}
          <motion.div
            key={`crystal1-${key}`}
            className="absolute w-4 h-8 bg-cyan-300/40 blur-sm"
            style={{ 
              left: '25%', 
              top: '30%',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
            animate={{ 
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <motion.div
            key={`crystal2-${key}`}
            className="absolute w-3 h-6 bg-blue-300/50 blur-sm"
            style={{ 
              right: '20%', 
              bottom: '25%',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
          />
          {/* Water bubbles */}
          <motion.div
            key={`bubble1-${key}`}
            className="absolute w-2 h-2 bg-cyan-200/60 rounded-full blur-sm"
            style={{ left: '15%', bottom: '20%' }}
            animate={{ 
              y: [0, -60],
              opacity: [1, 0],
              scale: [0.5, 1.2]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
          />
          <motion.div
            key={`bubble2-${key}`}
            className="absolute w-1.5 h-1.5 bg-blue-200/70 rounded-full blur-sm"
            style={{ right: '25%', bottom: '15%' }}
            animate={{ 
              y: [0, -50],
              opacity: [1, 0],
              scale: [0.8, 1]
            }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeOut", delay: 1.5 }}
          />
        </>
      );
      
    case "tundra":
      return (
        <>
          {/* Heavy snowfall */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`snow${i}-${key}`}
              className="absolute w-2 h-2 bg-white/90 rounded-full"
              style={{ 
                left: `${10 + i * 7}%`, 
                top: '-10%' 
              }}
              animate={{ 
                y: [0, window.innerHeight || 800],
                x: [0, 30 * (i % 2 ? 1 : -1), -15 * (i % 2 ? 1 : -1), 0],
                rotate: [0, 360]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6 + i * 0.5, 
                ease: "linear",
                delay: i * 0.3
              }}
            />
          ))}
          {/* Blizzard effect */}
          <motion.div
            key={`blizzard-${key}`}
            className="absolute w-full h-32 bg-white/20 blur-xl"
            style={{ left: '-50%', top: '30%' }}
            animate={{ 
              x: [0, 200, 0],
              opacity: [0, 0.8, 0],
              scaleY: [1, 1.5, 1]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          {/* Ice crystals */}
          <motion.div
            key={`ice1-${key}`}
            className="absolute w-8 h-8 bg-cyan-200/60"
            style={{ 
              left: '20%', 
              bottom: '30%',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          {/* Aurora borealis - much more dramatic */}
          <motion.div
            key={`aurora1-${key}`}
            className="absolute w-full h-24 bg-gradient-to-r from-green-400/40 via-cyan-400/40 to-purple-400/40 blur-xl"
            style={{ left: '-20%', top: '5%' }}
            animate={{ 
              opacity: [0.4, 0.9, 0.4],
              scaleX: [1, 1.5, 1],
              x: [0, 30, 0],
              skewX: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            key={`aurora2-${key}`}
            className="absolute w-96 h-16 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-cyan-400/30 blur-lg"
            style={{ right: '-30%', top: '15%' }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 1.4, 1],
              x: [0, -25, 0],
              skewX: [0, -3, 3, 0]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 3 }}
          />
        </>
      );
      
    case "canyon":
      return (
        <>
          {/* Rock dust */}
          <motion.div
            key={`dust1-${key}`}
            className="absolute w-8 h-3 bg-orange-300/25 rounded-full blur-lg"
            style={{ left: '20%', bottom: '10%' }}
            animate={{ 
              x: [0, 40, 0],
              opacity: [0.3, 0.7, 0.3],
              scaleX: [1, 1.5, 1]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          {/* Mesa shadows */}
          <motion.div
            key={`shadow-${key}`}
            className="absolute w-24 h-12 bg-red-900/20 rounded-full blur-xl"
            style={{ right: '15%', bottom: '0%' }}
            animate={{ 
              scaleX: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
        </>
      );
      
    case "aurora":
      return (
        <>
          {/* Aurora borealis */}
          <motion.div
            key={`aurora1-${key}`}
            className="absolute w-60 h-16 bg-gradient-to-r from-green-300/30 via-cyan-300/30 to-purple-300/30 rounded-full blur-2xl"
            style={{ left: '0%', top: '10%' }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 1.4, 1],
              x: [0, 20, 0]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div
            key={`aurora2-${key}`}
            className="absolute w-40 h-12 bg-gradient-to-r from-purple-300/25 via-pink-300/25 to-cyan-300/25 rounded-full blur-xl"
            style={{ right: '10%', top: '20%' }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              scaleX: [1, 1.3, 1],
              x: [0, -15, 0]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 3 }}
          />
          {/* Stars */}
          <motion.div
            key={`star1-${key}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: '20%', top: '15%' }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <motion.div
            key={`star2-${key}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{ right: '30%', top: '25%' }}
            animate={{ 
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5 }}
          />
        </>
      );
      
    case "volcano":
      return (
        <>
          {/* Massive lava eruption */}
          <motion.div
            key={`lava-eruption-${key}`}
            className="absolute w-32 h-40 bg-orange-500/70 rounded-full blur-lg"
            style={{ left: '5%', bottom: '0%' }}
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.4, 1],
              y: [0, -20, 0]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.div
            key={`lava-flow-${key}`}
            className="absolute w-64 h-16 bg-red-600/60 rounded-full blur-2xl"
            style={{ left: '-10%', bottom: '10%' }}
            animate={{ 
              opacity: [0.6, 0.9, 0.6],
              scaleX: [1, 1.3, 1],
              x: [0, 20, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          {/* Dramatic ash cloud */}
          <motion.div
            key={`ash-cloud-${key}`}
            className="absolute w-48 h-24 bg-gray-700/50 rounded-full blur-xl"
            style={{ right: '10%', top: '20%' }}
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.5, 1],
              x: [0, 30, 0]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          {/* Multiple ember showers */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`ember${i}-${key}`}
              className="absolute w-1 h-1 bg-red-400 rounded-full"
              style={{ 
                left: `${20 + i * 8}%`, 
                bottom: '35%' 
              }}
              animate={{ 
                y: [0, -80, -40, -100],
                x: [0, 20 * (i % 2 ? 1 : -1), 10 * (i % 2 ? -1 : 1)],
                opacity: [1, 0.8, 0.3, 0],
                scale: [1, 0.8, 0.5, 0.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3 + i * 0.2, 
                ease: "easeOut",
                delay: i * 0.3
              }}
            />
          ))}
          {/* Molten rock silhouettes */}
          <motion.div
            key={`rock1-${key}`}
            className="absolute w-12 h-6 bg-orange-800/80 rounded-full"
            style={{ left: '30%', bottom: '15%' }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <motion.div
            key={`rock2-${key}`}
            className="absolute w-8 h-4 bg-red-900/70 rounded-full"
            style={{ right: '35%', bottom: '20%' }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
          />
        </>
      );
      
    default:
      // Minimal decoration for other biomes
      return (
        <motion.div
          key={`ambient-${key}`}
          className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl"
          style={{ left: '20%', bottom: '15%' }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
      );
  }
}
