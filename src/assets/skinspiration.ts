import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Glasses, Sparkles, Star, Lock, ShoppingBag, Palette as PaletteIcon, Timer, Trophy, Egg } from "lucide-react";

// --- Tiny utility ---
const cx = (...cls) => cls.filter(Boolean).join(" ");
const weightedPick = (table) => {
  const total = Object.values(table).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [k, v] of Object.entries(table)) {
    if ((r -= v) < 0) return k;
  }
  return Object.keys(table)[0];
};

// =========================
//  SKIN TIERS (5-LEVEL + Secret)
// =========================
// Common = flat colors; Uncommon = simple gradients; Rare = static patterns; Epic = gentle animation; Mythic = premium animated effects

// COMMON (flat colors)
const COMMON = [
  { id: "green", label: "Green · Common", rarity: "common", palette: { fill: "#22c55e", stroke: "#065f46", shine: "#bbf7d0" } },
  { id: "mint", label: "Mint · Common", rarity: "common", palette: { fill: "#4ade80", stroke: "#065f46", shine: "#bbf7d0" } },
  { id: "blueberry", label: "Blueberry · Common", rarity: "common", palette: { fill: "#60a5fa", stroke: "#1e3a8a", shine: "#dbeafe" } },
  { id: "lemon", label: "Lemon · Common", rarity: "common", palette: { fill: "#fde047", stroke: "#92400e", shine: "#fef9c3" } },
  { id: "cherry", label: "Cherry · Common", rarity: "common", palette: { fill: "#fb7185", stroke: "#7f1d1d", shine: "#fecdd3" } },
  { id: "grape", label: "Grape · Common", rarity: "common", palette: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" } },
  { id: "tangerine", label: "Tangerine · Common", rarity: "common", palette: { fill: "#fb923c", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "bubblegum", label: "Bubblegum · Common", rarity: "common", palette: { fill: "#f472b6", stroke: "#9f1239", shine: "#fbcfe8" } },
  { id: "seafoam", label: "Seafoam · Common", rarity: "common", palette: { fill: "#2dd4bf", stroke: "#134e4a", shine: "#99f6e4" } },
  { id: "slate", label: "Slate · Common", rarity: "common", palette: { fill: "#94a3b8", stroke: "#334155", shine: "#e2e8f0" } },
];

// UNCOMMON (simple gradients — static)
const UNCOMMON = [
  { id: "leaf_fade", label: "Leaf Fade · Uncommon", rarity: "uncommon", gradient: { stops: [["#86efac", 0], ["#10b981", 100]], dir: "diag" }, stroke: "#065f46" },
  { id: "ocean_mist", label: "Ocean Mist · Uncommon", rarity: "uncommon", gradient: { stops: [["#99f6e4", 0], ["#06b6d4", 100]], dir: "diag" }, stroke: "#075985" },
  { id: "sunrise", label: "Sunrise · Uncommon", rarity: "uncommon", gradient: { stops: [["#fdba74", 0], ["#fde047", 100]], dir: "diag" }, stroke: "#92400e" },
  { id: "twilight", label: "Twilight · Uncommon", rarity: "uncommon", gradient: { stops: [["#a5b4fc", 0], ["#6d28d9", 100]], dir: "diag" }, stroke: "#4c1d95" },
  { id: "rose_glow", label: "Rose Glow · Uncommon", rarity: "uncommon", gradient: { stops: [["#fecdd3", 0], ["#fb7185", 100]], dir: "diag" }, stroke: "#9f1239" },
  { id: "sky_drift", label: "Sky Drift · Uncommon", rarity: "uncommon", gradient: { stops: [["#bae6fd",0],["#3b82f6",100]], dir: "diag" }, stroke: "#1e3a8a" },
  { id: "berry_smoothie", label: "Berry Smoothie · Uncommon", rarity: "uncommon", gradient: { stops: [["#f472b6",0],["#a78bfa",100]], dir: "diag" }, stroke: "#6b21a8" },
  { id: "citrus_pop", label: "Citrus Pop · Uncommon", rarity: "uncommon", gradient: { stops: [["#fef08a",0],["#84cc16",100]], dir: "diag" }, stroke: "#3f6212" },
  { id: "lavender_drift", label: "Lavender Drift · Uncommon", rarity: "uncommon", gradient: { stops: [["#e9d5ff",0],["#a78bfa",100]], dir: "diag" }, stroke: "#5b21b6" },
  { id: "copper_patina", label: "Copper Patina · Uncommon", rarity: "uncommon", gradient: { stops: [["#2dd4bf",0],["#b45309",100]], dir: "diag" }, stroke: "#92400e" },
];

// RARE (static patterns)
const RARE = [
  { id: "bumble", label: "Bumble · Rare", rarity: "rare", base: { fill: "#fde047", stroke: "#92400e", shine: "#fef9c3" }, pattern: "stripes" },
  { id: "sprinkles", label: "Sprinkles · Rare", rarity: "rare", base: { fill: "#fef2f2", stroke: "#7c2d12", shine: "#fde68a" }, pattern: "sprinkles" },
  { id: "starlet", label: "Starlet · Rare", rarity: "rare", base: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" }, pattern: "starlet" },
  { id: "pebble", label: "Pebble · Rare", rarity: "rare", base: { fill: "#d1fae5", stroke: "#065f46", shine: "#bbf7d0" }, pattern: "pebble" },
  { id: "plaid", label: "Picnic · Rare", rarity: "rare", base: { fill: "#fee2e2", stroke: "#7f1d1d", shine: "#fecaca" }, pattern: "plaid" },
  { id: "puddles", label: "Puddles · Rare", rarity: "rare", base: { fill: "#bfdbfe", stroke: "#1d4ed8", shine: "#dbeafe" }, pattern: "puddles" },
  { id: "zigzag", label: "Zigzag · Rare", rarity: "rare", base: { fill: "#fde68a", stroke: "#92400e", shine: "#fef9c3" }, pattern: "zigzag" },
  { id: "confetti", label: "Confetti · Rare", rarity: "rare", base: { fill: "#fefce8", stroke: "#6b7280", shine: "#fef9c3" }, pattern: "confetti" },
  { id: "scales", label: "Scales · Rare", rarity: "rare", base: { fill: "#bbf7d0", stroke: "#065f46", shine: "#dcfce7" }, pattern: "scales" },
  { id: "hearts", label: "Hearts · Rare", rarity: "rare", base: { fill: "#fecdd3", stroke: "#9f1239", shine: "#ffe4e6" }, pattern: "hearts" },
];

// EPIC (gentle animated motifs)
const EPIC = [
  { id: "ocean_anim", label: "Ocean · Epic", rarity: "epic", anim: "ocean", base: { fill: "#0ea5e9", stroke: "#075985", shine: "#bae6fd" } },
  { id: "lava_anim", label: "Lava · Epic", rarity: "epic", anim: "lava", base: { fill: "#f97316", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "blizzard_anim", label: "Blizzard · Epic", rarity: "epic", anim: "blizzard", base: { fill: "#93c5fd", stroke: "#1e3a8a", shine: "#e0f2fe" } },
  { id: "monsoon_anim", label: "Monsoon · Epic", rarity: "epic", anim: "monsoon", base: { fill: "#38bdf8", stroke: "#0c4a6e", shine: "#bae6fd" } },
  { id: "aurora_anim", label: "Aurora · Epic", rarity: "epic", anim: "aurora", base: { fill: "#10b981", stroke: "#065f46", shine: "#a7f3d0" } },
  { id: "firefly_anim", label: "Firefly · Epic", rarity: "epic", anim: "firefly", base: { fill: "#166534", stroke: "#052e16", shine: "#bbf7d0" } },
  { id: "tidepool_anim", label: "Tidepool · Epic", rarity: "epic", anim: "tidepool", base: { fill: "#06b6d4", stroke: "#083344", shine: "#a5f3fc" } },
  { id: "sandstorm_anim", label: "Sandstorm · Epic", rarity: "epic", anim: "sandstorm", base: { fill: "#f5d0a5", stroke: "#92400e", shine: "#fde68a" } },
  { id: "thunderhead_anim", label: "Thunderhead · Epic", rarity: "epic", anim: "thunderhead", base: { fill: "#94a3b8", stroke: "#334155", shine: "#e2e8f0" } },
  { id: "breeze_anim", label: "Breeze · Epic", rarity: "epic", anim: "breeze", base: { fill: "#a7f3d0", stroke: "#065f46", shine: "#d1fae5" } },
];

// MYTHIC (premium effects)
const MYTHIC = [
  { id: "nebula_anim", label: "Nebula · Mythic", rarity: "mythic", anim: "nebula", base: { fill: "#581c87", stroke: "#3b0764", shine: "#f5d0fe" } },
  { id: "phoenix_anim", label: "Phoenix · Mythic", rarity: "mythic", anim: "phoenix", base: { fill: "#fb923c", stroke: "#7c2d12", shine: "#fed7aa" } },
  { id: "zeus_anim", label: "Zeus · Mythic", rarity: "mythic", anim: "zeus", base: { fill: "#64748b", stroke: "#0f172a", shine: "#e2e8f0" } },
  { id: "leviathan_anim", label: "Leviathan · Mythic", rarity: "mythic", anim: "leviathan", base: { fill: "#0ea5e9", stroke: "#082f49", shine: "#a5f3fc" } },
  { id: "pegasus_anim", label: "Pegasus · Mythic", rarity: "mythic", anim: "pegasus", base: { fill: "#a78bfa", stroke: "#5b21b6", shine: "#e9d5ff" } },
  { id: "yeti_anim", label: "Yeti · Mythic", rarity: "mythic", anim: "yeti", base: { fill: "#e0f2fe", stroke: "#1e3a8a", shine: "#f0f9ff" } },
  { id: "dragon_anim", label: "Dragon · Mythic", rarity: "mythic", anim: "dragon", base: { fill: "#14532d", stroke: "#022c22", shine: "#86efac" } },
  { id: "sylph_anim", label: "Sylph · Mythic", rarity: "mythic", anim: "sylph", base: { fill: "#67e8f9", stroke: "#075985", shine: "#e0f2fe" } },
  { id: "djinn_anim", label: "Djinn · Mythic", rarity: "mythic", anim: "djinn", base: { fill: "#fde68a", stroke: "#92400e", shine: "#fff7ed" } },
  { id: "gaia_anim", label: "Gaia · Mythic", rarity: "mythic", anim: "gaia", base: { fill: "#16a34a", stroke: "#065f46", shine: "#bbf7d0" } },
];

// SECRET (event-only). Using parody-safe naming for IP risk.
const SECRET = [
  { id: "bigfoot_secret", label: "Bigfoot · Secret", rarity: "secret", base: { fill: "#a16207", stroke: "#713f12", shine: "#fde68a" }, pattern: "fur" },
  { id: "sponge_buddy_secret", label: "Sponge Buddy · Secret", rarity: "secret", base: { fill: "#facc15", stroke: "#92400e", shine: "#fef08a" }, pattern: "pores" },
];

// =========================
//  BIOMES (backgrounds)
// =========================
const BIOMES = [
  { id: "forest", label: "Forest", classes: "from-emerald-50 to-lime-100", deco: (key) => (<>
    <motion.div key={`leaf1-${key}`} className="absolute w-24 h-24 bg-emerald-200/70 rounded-full blur-2xl -left-6 top-6" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6 }} />
    <motion.div key={`leaf2-${key}`} className="absolute w-20 h-20 bg-lime-200/70 rounded-full blur-2xl right-4 bottom-6" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 7 }} />
  </>) },
  { id: "ocean", label: "Ocean", classes: "from-cyan-50 to-sky-100", deco: (key) => (<>
    <motion.div key={`bub1-${key}`} className="absolute w-16 h-16 bg-cyan-200/70 rounded-full blur-xl right-8 bottom-4" animate={{ y: [8, -8, 8] }} transition={{ repeat: Infinity, duration: 5 }} />
    <motion.div key={`bub2-${key}`} className="absolute w-24 h-24 bg-sky-200/70 rounded-full blur-2xl left-6 top-4" animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 6 }} />
  </>) },
  { id: "desert", label: "Desert", classes: "from-amber-50 to-orange-100", deco: (key) => (<>
    <motion.div key={`heat-${key}`} className="absolute right-6 top-6 w-14 h-14 bg-orange-200/60 rounded-full blur-2xl" animate={{ y: [0, -4, 0], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 5 }} />
    <motion.div key={`dune-${key}`} className="absolute left-4 bottom-4 w-40 h-10 bg-amber-200/70 rounded-full blur-xl" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 7 }} />
  </>) },
  { id: "crystal", label: "Crystal Cavern", classes: "from-sky-50 to-indigo-100", deco: (key) => (<>
    <motion.div key={`cr1-${key}`} className="absolute left-6 bottom-6 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-transparent border-b-indigo-300/70" animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 6 }} />
    <motion.div key={`cr2-${key}`} className="absolute right-8 top-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-transparent border-b-sky-300/70" animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 7 }} />
  </>) },
  { id: "space", label: "Space", classes: "from-indigo-100 to-fuchsia-100", deco: (key) => (<>
    <motion.div key={`star1-${key}`} className="absolute w-2 h-2 bg-indigo-400 rounded-full left-8 top-6" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} />
    <motion.div key={`star2-${key}`} className="absolute w-2 h-2 bg-fuchsia-400 rounded-full right-10 bottom-8" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2.6 }} />
  </>) },
];

// =========================
//  SLIME COMPONENT
// =========================
function Slime({ palette, gradient, pattern, aura = false, trail = false, crown = false, glasses = false, mood = "idle", stage = "blob", anim = null }) {
  const base = palette || { fill: "#4ade80", stroke: "#065f46", shine: "#bbf7d0" };

  const mouthPath = { idle: "M20 36 Q32 42 44 36", happy: "M18 36 Q32 48 46 36", sad: "M18 40 Q32 30 46 40" }[mood];
  const bodyPath = { sprout: "M10 36 C12 22 24 16 32 14 C40 16 52 22 54 36 C54 46 44 52 32 52 C20 52 10 46 10 36Z", blob: "M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z", mega: "M6 36 C10 20 22 12 32 12 C42 12 54 20 58 36 C58 50 46 58 32 58 C18 58 6 50 6 36Z" }[stage];

  // unique ids for clipPaths & gradients
  const ids = useMemo(() => ({ clip: `clip-${Math.random().toString(36).slice(2)}`, grad: `grad-${Math.random().toString(36).slice(2)}` }), []);

  // Patterns (static overlays)
  const PatternLayer = () => {
    if (!pattern) return null;
    return (
      <g clipPath={`url(#${ids.clip})`}>
        {pattern === "stripes" && (
          <g opacity={0.22}>
            {Array.from({ length: 16 }).map((_, i) => (
              <rect key={i} x={-50 + i * 10} y={-12} width={7} height={110} transform="rotate(25 32 32)" fill="#0f172a" />
            ))}
          </g>
        )}
        {pattern === "sprinkles" && (
          <g opacity={0.5}>
            {Array.from({ length: 34 }).map((_, i) => (
              <rect key={i} x={8 + (i * 17) % 48} y={18 + ((i * 11) % 28)} width={2} height={6} transform={`rotate(${(i * 37) % 360} 32 32)`} rx={1} fill={["#f97316","#22c55e","#3b82f6","#ef4444"][i%4]} />
            ))}
          </g>
        )}
        {pattern === "starlet" && (
          <g opacity={0.7}>
            {Array.from({ length: 28 }).map((_, i) => (
              <circle key={i} cx={10 + (i * 13) % 44} cy={18 + (i * 9) % 28} r={0.8 + ((i % 3) * 0.4)} fill="#ffffff" />
            ))}
          </g>
        )}
        {pattern === "pebble" && (
          <g opacity={0.3}>
            {Array.from({ length: 26 }).map((_, i) => (
              <ellipse key={i} cx={12 + (i * 19) % 40} cy={20 + (i * 13) % 24} rx={2 + (i % 3)} ry={1 + ((i + 1) % 3)} fill="#0f172a" />
            ))}
          </g>
        )}
        {pattern === "plaid" && (
          <g opacity={0.22}>
            {Array.from({ length: 9 }).map((_, i) => (<rect key={`v${i}`} x={8 + i * 5} y={12} width={2} height={44} fill="#0f172a" />))}
            {Array.from({ length: 7 }).map((_, i) => (<rect key={`h${i}`} x={8} y={16 + i * 6} width={48} height={2} fill="#0f172a" />))}
          </g>
        )}
        {pattern === "puddles" && (
          <g opacity={0.18}>
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i} cx={10 + (i*11)%44} cy={22 + (i*7)%22} rx={4 + (i%3)*2} ry={3 + (i%2)} fill="#0f172a" />
            ))}
          </g>
        )}
        {pattern === "zigzag" && (
          <g opacity={0.22}>
            {Array.from({ length: 6 }).map((_, r) => (
              <polyline key={r} points="8,20 16,24 24,20 32,24 40,20 48,24 56,20" fill="none" stroke="#0f172a" strokeWidth="2" transform={`translate(0, ${r*6})`} />
            ))}
          </g>
        )}
        {pattern === "confetti" && (
          <g opacity={0.6}>
            {Array.from({ length: 22 }).map((_, i) => (
              <g key={i} transform={`rotate(${(i*23)%360} ${12 + (i*9)%40} ${16 + (i*7)%28})`}>
                <rect x={12 + (i*9)%40} y={16 + (i*7)%28} width={3} height={3} fill={["#ef4444","#22c55e","#3b82f6","#eab308"][i%4]} />
                <polygon points={`${14 + (i*9)%40},${20 + (i*7)%28} ${16 + (i*9)%40},${20 + (i*7)%28} ${15 + (i*9)%40},${22 + (i*7)%28}`} fill={["#f97316","#06b6d4","#a78bfa","#10b981"][i%4]} />
              </g>
            ))}
          </g>
        )}
        {pattern === "scales" && (
          <g opacity={0.22}>
            {Array.from({ length: 5 }).map((_, r) => (
              Array.from({ length: 7 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={10 + c*8 + (r%2?4:0)} cy={18 + r*6} r={6} stroke="#0f172a" strokeWidth="1.5" fill="none" />
              ))
            ))}
          </g>
        )}
        {pattern === "hearts" && (
          <g opacity={0.5}>
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i} d="M12 20 C12 18 14 18 14 20 C14 18 16 18 16 20 C16 22 14 23 13 24 C12 23 10 22 10 20 Z" fill="#be123c" transform={`translate(${8 + (i*10)%44}, ${16 + (i*6)%26}) scale(0.5)`} />
            ))}
          </g>
        )}
        {pattern === "pores" && (
          <g opacity={0.28}>
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={i} cx={10 + (i*9)%44} cy={18 + (i*7)%28} r={1.2 + (i%3)} fill="#ca8a04" />
            ))}
          </g>
        )}
        {pattern === "fur" && (
          <g opacity={0.3}>
            {Array.from({ length: 40 }).map((_, i) => (
              <path key={i} d={`M${8 + (i*3)%48} ${18 + (i*5)%28} q 1 -2 2 0`} stroke="#6b4423" strokeWidth="1" fill="none" />
            ))}
          </g>
        )}
      </g>
    );
  };

  // Animated overlays (effects)
  const AnimatedLayer = () => {
    if (!anim) return null;
    return (
      <g clipPath={`url(#${ids.clip})`}>
        {anim === "nebula" && (<>
          {["#a78bfa", "#f472b6", "#22d3ee"].map((c, i) => (
            <motion.circle key={i} cx={32 + (i - 1) * 6} cy={34} r={24 - i * 5} fill={c} opacity={0.22}
              animate={{ cx: [26, 38, 26], cy: [28 + i * 2, 38 - i * 2, 28 + i * 2] }}
              transition={{ repeat: Infinity, duration: 7 + i * 1.6, ease: "easeInOut" }} />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.circle key={`s${i}`} cx={8 + (i*7)%48} cy={18 + (i*5)%28} r={(i%5)*0.28 + 0.45} fill="#fff"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.6 + (i%4)*0.4, delay: (i%6)*0.12 }} />
          ))}
        </>)}
        {anim === "aurora" && (<>
          {[0, 1, 2].map((k) => (
            <motion.path key={k} d="M-10 26 Q 16 18 36 22 T 84 20 L 84 64 L -10 64 Z" fill={k===2?"#a78bfa":k ? "#34d399" : "#22d3ee"} opacity={k===2?0.12:k ? 0.2 : 0.16}
              animate={{ x: [-16, 0, 16] }} transition={{ repeat: Infinity, duration: 5 + k * 1.5, ease: "easeInOut" }} />
          ))}
        </>)}
        {anim === "ocean" && (<>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle key={i} cx={10 + (i*5)%44} cy={50} r={1.5 + (i%3)} fill="#e0f2fe" opacity={0.7}
              animate={{ y: [0, -40 - (i%4)*6], opacity: [0.7, 0.15] }} transition={{ repeat: Infinity, duration: 4 + (i%4), delay: (i%5)*0.15 }} />
          ))}
          <motion.rect x={-10} y={38} width={84} height={8} fill="#0ea5e9" opacity={0.16}
            animate={{ y: [40, 36, 40] }} transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }} />
        </>)}
        {anim === "lava" && (<>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.ellipse key={i} cx={12 + (i*6)%40} cy={46} rx={5 + (i%3)*2.5} ry={2.5 + (i%2)} fill={i % 2 ? "#fb923c" : "#f97316"} opacity={0.35}
              animate={{ y: [0, -26 - (i%3)*8], opacity: [0.35, 0.12] }} transition={{ repeat: Infinity, duration: 4 + (i%3), delay: (i%5)*0.15 }} />
          ))}
          <motion.circle cx={32} cy={50} r={10} fill="#ef4444" opacity={0.08} animate={{ r: [8, 14, 8], opacity: [0.08, 0.16, 0.08] }} transition={{ repeat: Infinity, duration: 2.8 }} />
        </>)}
        {anim === "blizzard" && (<>
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.circle key={i} cx={10 + (i*9)%44} cy={16} r={0.8 + (i%3)*0.5} fill="#fff" opacity={0.9}
              animate={{ y: [16, 52], x: [10 + (i*9)%44, 6 + (i*9)%44], opacity: [0.9, 0.4] }} transition={{ repeat: Infinity, duration: 3 + (i%4)*0.5, delay: (i%5)*0.1 }} />
          ))}
        </>)}
        {anim === "monsoon" && (<>
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.rect key={i} x={10 + (i*5)%44} y={14} width={1.5} height={22} fill="#0ea5e9" opacity={0.6}
              animate={{ y: [14, 54] }} transition={{ repeat: Infinity, duration: 1.3 + (i%3)*0.2, delay: (i%5)*0.08 }} />
          ))}
        </>)}
        {anim === "firefly" && (<>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.circle key={i} cx={12 + (i*5)%40} cy={20 + (i%5)*5} r={0.9} fill="#fde68a"
              animate={{ opacity: [0.1, 1, 0.1], y: [20, 22, 20] }} transition={{ repeat: Infinity, duration: 2 + (i%4)*0.5, delay: (i%6)*0.2 }} />
          ))}
        </>)}
        {anim === "tidepool" && (<>
          <motion.rect x={-8} y={34} width={80} height={8} fill="#7dd3fc" opacity={0.18}
            animate={{ x: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.2 }} />
          <motion.rect x={-10} y={40} width={84} height={4} fill="#38bdf8" opacity={0.2}
            animate={{ y: [40, 38, 40] }} transition={{ repeat: Infinity, duration: 2.2 }} />
        </>)}
        {anim === "sandstorm" && (<>
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.circle key={i} cx={8} cy={18 + (i%8)*4} r={0.8} fill="#92400e" opacity={0.25}
              animate={{ x: [8, 60], opacity: [0.25, 0.1] }} transition={{ repeat: Infinity, duration: 3 + (i%3)*0.6, delay: (i%5)*0.1 }} />
          ))}
        </>)}
        {anim === "thunderhead" && (<>
          <motion.ellipse cx={32} cy={30} rx={22} ry={12} fill="#ffffff" opacity={0.06}
            animate={{ opacity: [0.04, 0.18, 0.04] }} transition={{ repeat: Infinity, duration: 3.4 }} />
        </>)}
        {anim === "breeze" && (<>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle key={i} cx={18 + (i%4)*6} cy={24 + (i%3)*6} r={0.9} fill="#ffffff" opacity={0.3}
              animate={{ x: [18, 46, 18], y: [24, 20, 24] }} transition={{ repeat: Infinity, duration: 4 + (i%3), delay: (i%5)*0.2 }} />
          ))}
        </>)}
        {anim === "phoenix" && (<>
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.circle key={i} cx={10 + (i*6)%44} cy={48} r={1 + (i%3)} fill="#fb923c" opacity={0.85}
              animate={{ y: [48, 22], opacity: [0.85, 0.12] }} transition={{ repeat: Infinity, duration: 2.6 + (i%4)*0.5, delay: (i%4)*0.12 }} />
          ))}
          <motion.circle cx={32} cy={34} r={6} fill="#fde68a" opacity={0.25}
            animate={{ r: [6, 14, 6], opacity: [0.25, 0.08, 0.25] }} transition={{ repeat: Infinity, duration: 2.0 }} />
        </>)}
        {anim === "zeus" && (<>
          <motion.rect x={0} y={0} width={64} height={64} fill="#ffffff" opacity={0}
            animate={{ opacity: [0, 0.22, 0] }} transition={{ repeat: Infinity, duration: 0.35, delay: 2.2 }} />
          {Array.from({ length: 2 }).map((_, k) => (
            <motion.path key={k} d={k?"M24 16 L28 28 L22 28 L30 44" : "M40 16 L36 28 L42 28 L34 44"} stroke="#e5e7eb" strokeWidth={1.8} opacity={0.0}
              animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.55 + k*0.2, delay: 2 + k*0.3 }} />
          ))}
        </>)}
        {anim === "leviathan" && (<>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.circle key={i} cx={32} cy={34} r={10 + i*6} fill="#22d3ee" opacity={0.1}
              animate={{ opacity: [0.06, 0.22, 0.06] }} transition={{ repeat: Infinity, duration: 2.6 + i }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.circle key={i} cx={12 + (i*5)%40} cy={48 - (i%5)*4} r={0.9} fill="#a7f3d0" opacity={0.7}
              animate={{ y: [48 - (i%5)*4, 22], opacity: [0.7, 0.1] }} transition={{ repeat: Infinity, duration: 3 + (i%4)*0.5, delay: (i%6)*0.2 }} />
          ))}
        </>)}
        {anim === "pegasus" && (<>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.rect key={i} x={6} y={18 + i*4} width={18} height={1} fill="#ffffff" opacity={0.8}
              animate={{ x: [6, 50], opacity: [0.8, 0.0] }} transition={{ repeat: Infinity, duration: 1.8 + (i%3)*0.4, delay: (i%4)*0.1 }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle key={`tw${i}`} cx={10 + (i*6)%44} cy={16 + (i%4)*8} r={0.8} fill="#ffffff"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.6 + (i%3)*0.4, delay: (i%5)*0.1 }} />
          ))}
        </>)}
        {anim === "yeti" && (<>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.polygon key={i} points="30,18 34,26 26,26" fill="#e0f2fe" opacity={0.5}
              animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2 + (i%3)*0.5, delay: (i%4)*0.1 }} transform={`translate(${(i*5)%30}, ${(i%5)*4})`} />
          ))}
        </>)}
        {anim === "dragon" && (<>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.circle key={i} cx={32} cy={34} r={8 + i*6} fill="#16a34a" opacity={0.1}
              animate={{ r: [8 + i*6, 12 + i*6, 8 + i*6], opacity: [0.1, 0.22, 0.1] }} transition={{ repeat: Infinity, duration: 2.2 + i*0.6 }} />
          ))}
        </>)}
        {anim === "sylph" && (<>
          <motion.g animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} origin="32 34">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={32 + Math.cos((i/6)*Math.PI*2)*10} cy={34 + Math.sin((i/6)*Math.PI*2)*10} r={1} fill="#ffffff" opacity={0.7} />
            ))}
          </motion.g>
        </>)}
        {anim === "djinn" && (<>
          {[0,1].map((k)=>(
            <motion.path key={k} d="M-6 36 C 8 30, 24 34, 34 30 S 60 28, 74 34" fill="#fde68a" opacity={0.08}
              animate={{ x: [-6, 0, 6] }} transition={{ repeat: Infinity, duration: 4 + k }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.circle key={i} cx={10 + (i*6)%44} cy={16 + (i%5)*6} r={0.9} fill="#fff7ed"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.6 + (i%3)*0.4, delay: (i%5)*0.12 }} />
          ))}
        </>)}
        {anim === "gaia" && (<>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.path key={i} d="M0 0 C 2 -2, 4 -2, 6 0 C 4 2, 2 2, 0 0 Z" fill="#a7f3d0" transform={`translate(${10 + (i*5)%44}, ${44 - (i%6)*4})`}
              animate={{ y: [44 - (i%6)*4, 22], opacity: [0.8, 0.1] }} transition={{ repeat: Infinity, duration: 3 + (i%4)*0.6, delay: (i%5)*0.1 }} />
          ))}
        </>)}
      </g>
    );
  };

  return (
    <div className="relative">
      {aura && (
        <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.03, 0.95] }} transition={{ repeat: Infinity, duration: 2.2 }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-white/40 blur-2xl" />
        </motion.div>
      )}
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-40">
        <svg viewBox="0 0 64 64" className="w-full h-auto drop-shadow">
          <defs>
            <clipPath id={ids.clip}><path d={bodyPath} /></clipPath>
            {gradient && (
              <linearGradient id={ids.grad} x1={gradient.dir === "diag" ? "0%" : "0%"} y1={gradient.dir === "diag" ? "0%" : "0%"} x2={gradient.dir === "diag" ? "100%" : "0%"} y2={gradient.dir === "diag" ? "100%" : "100%"}>
                {gradient.stops.map(([color, off], i) => (<stop key={i} offset={`${off}%`} stopColor={color} />))}
              </linearGradient>
            )}
          </defs>
          {/* Body (gradient or flat) */}
          <motion.path d={bodyPath} fill={gradient ? `url(#${ids.grad})` : base.fill} stroke={base.stroke} strokeWidth="1.5" initial={{ filter: "brightness(1)" }} animate={{ filter: mood === "happy" ? "brightness(1.1)" : mood === "sad" ? "brightness(0.95)" : "brightness(1)" }} />

          {/* Overlays */}
          <PatternLayer />
          <AnimatedLayer />

          {/* Shine */}
          <path d="M22 18 C26 16 30 16 32 14" stroke={base.shine} strokeWidth="3" strokeLinecap="round" />
          {stage === "mega" && <path d="M40 18 C43 17 46 17 48 15" stroke={base.shine} strokeWidth="3" strokeLinecap="round" />}

          {/* Face */}
          <circle cx="24" cy="30" r="3.2" fill="#064e3b" />
          <circle cx="40" cy="30" r="3.2" fill="#064e3b" />
          <circle cx="23.3" cy="29.3" r="0.7" fill="#ecfeff" />
          <circle cx="39.3" cy="29.3" r="0.7" fill="#ecfeff" />
          <path d={mouthPath} stroke="#064e3b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {glasses && (<>
            <circle cx="24" cy="30" r="5" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="40" cy="30" r="5" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M29 30 L35 30" stroke="#0f172a" strokeWidth="1.5" />
          </>)}
        </svg>
      </motion.div>
      {crown && (<Crown className="absolute left-1/2 -top-2 -translate-x-1/2 rotate-[-10deg] w-8 h-8 text-yellow-500 drop-shadow" />)}
      {trail && (<motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1" initial={{ opacity: 0.6 }} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.6 }}>
        <span className="w-2 h-2 rounded-full bg-white/70"></span>
        <span className="w-2 h-2 rounded-full bg-white/50"></span>
        <span className="w-2 h-2 rounded-full bg-white/30"></span>
      </motion.div>)}
    </div>
  );
}

function Card({ title, children, footer }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-emerald-800 mb-3">{title}</div>
      {children}
      {footer && <div className="mt-3 text-xs text-emerald-700/80">{footer}</div>}
    </div>
  );
}

// =========================
//  EGGS (5-tier rarity preview)
// =========================
const RARITY = { common: 55, uncommon: 25, rare: 12, epic: 6, mythic: 2 };
const rarityColor = { common: "text-slate-600", uncommon: "text-emerald-700", rare: "text-sky-600", epic: "text-purple-600", mythic: "text-amber-600", secret: "text-pink-700" };

function EggPreview() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const doRoll = () => {
    setRolling(true); setResult(null);
    setTimeout(() => { const r = weightedPick(RARITY); setResult(r); setRolling(false); }, 900);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div className="rounded-xl border border-emerald-200 p-4">
        <div className="text-sm font-semibold text-emerald-800 mb-2">Drop Rates</div>
        {Object.entries(RARITY).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3 mb-2">
            <div className={cx("w-24 text-xs font-semibold capitalize", rarityColor[k])}>{k}</div>
            <div className="flex-1 h-2 bg-emerald-100 rounded overflow-hidden"><div className="h-2 bg-emerald-400" style={{ width: `${v}%` }} /></div>
            <div className="w-10 text-right text-xs text-emerald-700/80">{v}%</div>
          </div>
        ))}
        <div className="mt-2 text-[11px] text-emerald-700/70">Secret skins are event-only and not in standard eggs.</div>
      </div>
      <div className="rounded-xl border border-emerald-200 p-4 text-center">
        <div className="text-sm font-semibold text-emerald-800 mb-3">Try a Style-Only Roll</div>
        <div className="h-28 grid place-items-center">
          <AnimatePresence mode="wait">
            {rolling ? (
              <motion.div key="rolling" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-700">
                <Egg className="w-6 h-6 animate-pulse" /> Rolling...
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                <div className={cx("text-lg font-extrabold capitalize", rarityColor[result])}>{result}!</div>
                <div className="text-xs text-emerald-700/80">(Preview demo only)</div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-emerald-700/80">Tap Roll to preview</motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={doRoll} disabled={rolling} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow disabled:opacity-60">
          <Sparkles className="w-5 h-5" /> Roll
        </button>
      </div>
    </div>
  );
}

// =========================
//  SHOP (cosmetics-only mock)
// =========================
const SHOP_ITEMS = [
  { id: "skin_blueberry", type: "skin", label: "Blueberry (Common)", price: 40, preview: () => <Slime palette={COMMON.find(s=>s.id==='blueberry').palette} /> },
  { id: "skin_leaf_fade", type: "skin", label: "Leaf Fade (Uncommon)", price: 80, preview: () => <Slime gradient={UNCOMMON.find(s=>s.id==='leaf_fade').gradient} palette={{stroke:'#065f46', shine:'#bbf7d0'}} /> },
  { id: "skin_bumble", type: "skin", label: "Bumble (Rare)", price: 120, preview: () => <Slime palette={RARE.find(s=>s.id==='bumble').base} pattern="stripes" aura /> },
  { id: "skin_ocean", type: "skin", label: "Ocean (Epic)", price: 160, preview: () => <Slime palette={EPIC.find(s=>s.id==='ocean_anim').base} anim="ocean" aura /> },
  { id: "skin_nebula", type: "skin", label: "Nebula (Mythic)", price: 220, preview: () => <Slime palette={MYTHIC.find(s=>s.id==='nebula_anim').base} anim="nebula" aura trail crown /> },
];

function ShopPreview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {SHOP_ITEMS.map((it) => (
        <div key={it.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
          <div className="h-40 grid place-items-center">{it.preview()}</div>
          <div className="mt-2 text-sm font-semibold text-emerald-800">{it.label}</div>
          <div className="text-xs text-emerald-700/80">{it.price} Goo</div>
          <button disabled className="mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 bg-emerald-600/70 text-white shadow cursor-not-allowed">
            <ShoppingBag className="w-4 h-4" /> Buy (demo)
          </button>
        </div>
      ))}
    </div>
  );
}

// =========================
//  ACCESSORIES CONFIGURATOR (lightweight)
// =========================
function AccessoriesConfigurator() {
  const [tier, setTier] = useState('common');
  const [skin, setSkin] = useState(COMMON[0].id);
  const [aura, setAura] = useState(true);
  const [trail, setTrail] = useState(false);
  const [crown, setCrown] = useState(false);
  const [glasses, setGlasses] = useState(false);

  const list = tier==='common'? COMMON : tier==='uncommon'? UNCOMMON : tier==='rare'? RARE : tier==='epic'? EPIC : MYTHIC;
  const chosen = list.find(s => s.id === skin) || list[0];

  const preview = () => {
    if (tier==='common') return <Slime palette={chosen.palette} aura={aura} trail={trail} crown={crown} glasses={glasses} mood="happy" />;
    if (tier==='uncommon') return <Slime gradient={chosen.gradient} palette={{ stroke: chosen.stroke || '#065f46', shine: '#ffffff' }} aura={aura} trail={trail} crown={crown} glasses={glasses} mood="happy" />;
    if (tier==='rare') return <Slime palette={chosen.base} pattern={chosen.pattern} aura={aura} trail={trail} crown={crown} glasses={glasses} mood="happy" />;
    if (tier==='epic') return <Slime palette={chosen.base} anim={chosen.anim} aura={aura} trail={trail} crown={crown} glasses={glasses} mood="happy" />;
    return <Slime palette={chosen.base} anim={chosen.anim} aura={aura} trail={trail} crown={crown} glasses={glasses} mood="happy" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-emerald-200 bg-white p-4">
        <div className="h-60 grid place-items-center">{preview()}</div>
        <div className="mt-2 text-xs text-emerald-700/80">Preview only — toggles stack on any skin.</div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold text-emerald-800 mb-2">Skin Tier</div>
          <div className="flex flex-wrap gap-2">
            {["common","uncommon","rare","epic","mythic"].map(t => (
              <button key={t} onClick={()=>{ setTier(t); setSkin((t==='common'?COMMON: t==='uncommon'?UNCOMMON: t==='rare'?RARE: t==='epic'?EPIC:MYTHIC)[0].id); }}
                className={`px-3 py-1.5 rounded-xl border text-sm ${tier===t? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-emerald-800 mb-2">Choose Look</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-auto pr-1">
            {list.slice(0,12).map(s => (
              <button key={s.id} onClick={()=>setSkin(s.id)} className={`text-left rounded-xl border p-2 bg-white hover:bg-emerald-50 ${skin===s.id? 'border-emerald-500 shadow':'border-emerald-200'}`}>
                <div className="h-20 grid place-items-center">
                  {tier==='common' && <Slime palette={s.palette} />}
                  {tier==='uncommon' && <Slime gradient={s.gradient} palette={{ stroke: s.stroke || '#065f46', shine:'#ffffff' }} />}
                  {tier==='rare' && <Slime palette={s.base} pattern={s.pattern} />}
                  {tier==='epic' && <Slime palette={s.base} anim={s.anim} />}
                  {tier==='mythic' && <Slime palette={s.base} anim={s.anim} />}
                </div>
                <div className="mt-1 text-xs font-semibold text-emerald-800 truncate">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={()=>setAura(v=>!v)} className={`rounded-xl border px-3 py-1.5 text-sm ${aura? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700'}`}>Aura</button>
          <button onClick={()=>setTrail(v=>!v)} className={`rounded-xl border px-3 py-1.5 text-sm ${trail? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700'}`}>Trail</button>
          <button onClick={()=>setCrown(v=>!v)} className={`rounded-xl border px-3 py-1.5 text-sm ${crown? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700'}`}>Crown</button>
          <button onClick={()=>setGlasses(v=>!v)} className={`rounded-xl border px-3 py-1.5 text-sm ${glasses? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700'}`}>Glasses</button>
        </div>
      </div>
    </div>
  );
}

// =========================
//  BUDDIES PREVIEW (lightweight)
// =========================
function BuddiesPreview() {
  const buddies = [
    { id:'plumbuddy', name:'Plumbuddy', desc:'Cheery jumper in red.', look:{ palette: COMMON.find(s=>s.id==='tangerine').palette, crown:false, trail:true } },
    { id:'green_hero', name:'Green Hero Sprout', desc:'Forest tinkerer.', look:{ palette: COMMON.find(s=>s.id==='mint').palette, crown:false, glasses:true } },
    { id:'block_miner', name:'Block Miner', desc:'Crafty cube fan.', look:{ palette: COMMON.find(s=>s.id==='slate').palette, crown:false, trail:true } },
    { id:'crew_gel', name:'Crew Gel', desc:'Sus but friendly.', look:{ palette: COMMON.find(s=>s.id==='seafoam').palette, glasses:true } },
    { id:'blue_blur', name:'Blue Blur', desc:'Gotta go fast.', look:{ palette: COMMON.find(s=>s.id==='blueberry').palette, trail:true } },
    { id:'sea_square', name:'Sea Square', desc:'Absorbent pal.', look:{ palette: SECRET.find(s=>s.id==='sponge_buddy_secret').base, crown:true } },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {buddies.map(b => (
        <div key={b.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
          <div className="h-32 grid place-items-center"><Slime palette={b.look.palette} crown={b.look.crown} trail={b.look.trail} glasses={b.look.glasses} mood="happy" /></div>
          <div className="mt-1 text-sm font-semibold text-emerald-800">{b.name}</div>
          <div className="text-[11px] text-emerald-700/80">{b.desc}</div>
        </div>
      ))}
    </div>
  );
}

// =========================
//  BADGES
// =========================
const BADGES = [
  { id: "ten_tastic", label: "Ten‑Tastic", desc: "Master all make‑10 pairs", icon: "🔟", status: "progress", pct: 66 },
  { id: "twins_winner", label: "Twins Winner", desc: "Master all doubles", icon: "👯", status: "locked", pct: 0 },
  { id: "streak_20", label: "On a Roll!", desc: "20 in a row", icon: "🔥", status: "unlocked", pct: 100 },
  { id: "speedy_ace", label: "Speedy Ace", desc: "Avg < 2s for 25 Qs", icon: "⚡", status: "locked", pct: 0 },
  { id: "flip_master", label: "Flip Master", desc: "Do a+b and b+a", icon: "🔁", status: "progress", pct: 40 },
];

function BadgeShelf() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {BADGES.map((b) => (
        <div key={b.id} className="rounded-xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/30 p-3">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <span className="text-xl">{b.icon}</span>
            <span>{b.label}</span>
          </div>
          <div className="mt-1 text-xs text-emerald-700/80">{b.desc}</div>
          {b.status === "unlocked" ? (
            <div className="mt-3 inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold"><Star className="w-4 h-4" /> Unlocked</div>
          ) : b.status === "locked" ? (
            <div className="mt-3 inline-flex items-center gap-1 text-emerald-700/70 text-xs"><Lock className="w-4 h-4" /> Locked</div>
          ) : (
            <div className="mt-3">
              <div className="h-1.5 rounded bg-emerald-100"><div className="h-1.5 rounded bg-emerald-400" style={{ width: `${b.pct}%` }} /></div>
              <div className="mt-1 text-right text-[10px] text-emerald-700/80">{b.pct}%</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// =========================
//  EVOLUTION PREVIEW
// =========================
function EvolutionPreview() {
  const skin = COMMON[0].palette;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div className="rounded-xl border border-emerald-200 bg-white p-3">
        <div className="h-44 grid place-items-center"><Slime palette={skin} stage="sprout" mood="happy" /></div>
        <div className="text-sm font-semibold text-emerald-800">Stage 1 · Sprout</div>
        <div className="text-xs text-emerald-700/80">Start cute & tiny</div>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-white p-3">
        <div className="h-44 grid place-items-center"><Slime palette={skin} stage="blob" aura mood="happy" /></div>
        <div className="text-sm font-semibold text-emerald-800">Stage 2 · Blob</div>
        <div className="text-xs text-emerald-700/80">Bigger bounce, aura glow</div>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-white p-3">
        <div className="h-44 grid place-items-center"><Slime palette={skin} stage="mega" aura trail crown mood="happy" /></div>
        <div className="text-sm font-semibold text-emerald-800">Stage 3 · Mega Goo</div>
        <div className="text-xs text-emerald-700/80">Max flourish: shine + crown</div>
      </div>
    </div>
  );
}

// =========================
//  QUEST PREVIEW
// =========================
function QuestPreview() {
  const Q = [
    { icon: <Timer className="w-4 h-4" />, title: "Finish +7 Set", reward: "+20 Goo" },
    { icon: <Trophy className="w-4 h-4" />, title: "Two 8‑Streaks", reward: "+25 Goo" },
    { icon: <PaletteIcon className="w-4 h-4" />, title: "Beat PB in 3‑min Sprint", reward: "Mystery Egg" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Q.map((q, i) => (
        <div key={i} className="rounded-xl border border-emerald-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-semibold">{q.icon}<span>{q.title}</span></div>
            <span className="text-xs text-emerald-700/80">Reward: {q.reward}</span>
          </div>
          <div className="mt-3 h-1.5 rounded bg-emerald-100"><div className="h-1.5 rounded bg-emerald-400 w-1/3" /></div>
        </div>
      ))}
    </div>
  );
}

// =========================
//  DEV SMOKE TESTS
// =========================
function runSmokeTests() {
  try {
    console.group("Slime Sums Style Preview — Smoke Tests");
    console.assert(typeof AccessoriesConfigurator === 'function', 'AccessoriesConfigurator should be defined');
    console.assert(typeof BuddiesPreview === 'function', 'BuddiesPreview should be defined');
    console.assert(Array.isArray(COMMON) && COMMON.length>=10, 'COMMON has 10+');
    console.assert(Array.isArray(EPIC) && EPIC.length>=10, 'EPIC has 10+');
    console.assert(Array.isArray(MYTHIC) && MYTHIC.length>=10, 'MYTHIC has 10+');
    console.groupEnd();
  } catch (e) {
    console.error('Smoke tests error', e);
  }
}

export default function SlimeSumsStylePreview() {
  const [tab, setTab] = useState("biomes");

  const tabs = [
    { id: "biomes", label: "Biomes" },
    { id: "skins", label: "Skins" },
    { id: "evolution", label: "Evolution" },
    { id: "accessories", label: "Accessories" },
    { id: "auras", label: "Auras" },
    { id: "badges", label: "Badges" },
    { id: "eggs", label: "Eggs" },
    { id: "shop", label: "Shop" },
    { id: "quests", label: "Quests" },
    { id: "buddies", label: "Buddies" },
    { id: "secret", label: "Secret ???" },
  ];

  useEffect(()=>{ runSmokeTests(); }, []);

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-slate-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-800">Slime Sums — Style Preview</h1>
          <div className="text-emerald-700/80 text-sm">Visual concepts only — game unchanged</div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cx("px-3 py-1.5 rounded-xl border text-sm", tab===t.id?"bg-emerald-600 text-white border-emerald-600":"bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50")}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "biomes" && (
            <motion.div key="biomes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Biomes (Backgrounds)">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {BIOMES.map((b) => (
                    <div key={b.id} className={cx("relative h-40 rounded-xl border border-emerald-200 overflow-hidden bg-gradient-to-br", b.classes)}>
                      {b.deco(b.id)}
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="px-3 py-1 rounded-full bg-white/80 text-emerald-800 text-sm font-semibold shadow">{b.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {tab === "skins" && (
            <motion.div key="skins" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Common · Flat Colors (10)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {COMMON.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center"><Slime palette={s.palette} mood="happy" /></div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-slate-600 capitalize">common</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Uncommon · Simple Gradients (10)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {UNCOMMON.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center"><Slime gradient={s.gradient} palette={{ stroke: s.stroke, shine: "#ffffff" }} aura /></div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-emerald-700 capitalize">uncommon</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Rare · Patterns (Static) (10)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {RARE.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center"><Slime palette={s.base} pattern={s.pattern} aura /></div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-sky-700 capitalize">rare</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Epic · Animated (Simple) (10)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {EPIC.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center"><Slime palette={s.base} anim={s.anim} aura /></div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-purple-700 capitalize">epic</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Mythic · Animated (Premium Effects) (10)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {MYTHIC.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center"><Slime palette={s.base} anim={s.anim} aura trail crown={s.id.includes('nebula')}/></div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-amber-700 capitalize">mythic</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {tab === "evolution" && (
            <motion.div key="evolution" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Evolution Track (3 stages)">
                <EvolutionPreview />
              </Card>
            </motion.div>
          )}

          {tab === "accessories" && (
            <motion.div key="accessories" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Accessories (Slots + Rarity + Pop Nods)">
                <AccessoriesConfigurator />
              </Card>
            </motion.div>
          )}

          {tab === "auras" && (
            <motion.div key="auras" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Streak Auras (Level 1 · 2 · 3)">
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map((lvl) => (
                    <div key={lvl} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center">
                        <div className="relative">
                          <div className={cx("absolute inset-0 -z-10 rounded-full blur-2xl", lvl===1?"bg-emerald-200/40 w-40 h-40":"", lvl===2?"bg-emerald-300/50 w-44 h-44":"", lvl===3?"bg-emerald-400/60 w-48 h-48":"")} />
                          <Slime palette={COMMON[0].palette} aura auraStyle={lvl===1?'soft':lvl===2?'aurora':'nebula'} />
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">Aura Level {lvl}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {tab === "badges" && (
            <motion.div key="badges" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Badges (States: Unlocked / In‑Progress / Locked)">
                <BadgeShelf />
              </Card>
            </motion.div>
          )}

          {tab === "eggs" && (
            <motion.div key="eggs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Eggs & Rarity (Demo Roll)">
                <EggPreview />
              </Card>
            </motion.div>
          )}

          {tab === "shop" && (
            <motion.div key="shop" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Cosmetics Shop (Goo‑only, demo)">
                <ShopPreview />
              </Card>
            </motion.div>
          )}

          {tab === "quests" && (
            <motion.div key="quests" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Daily Quests (Style Only)">
                <QuestPreview />
              </Card>
            </motion.div>
          )}

          {tab === "buddies" && (
            <motion.div key="buddies" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Buddies (Boosts · Parody‑safe nods)">
                <BuddiesPreview />
              </Card>
            </motion.div>
          )}

          {tab === "secret" && (
            <motion.div key="secret" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card title="Secret Skins (peek only — event/quest unlock)">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {SECRET.map((s) => (
                    <div key={s.id} className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
                      <div className="h-40 grid place-items-center">
                        <div className="relative">
                          <Slime palette={s.base} pattern={s.pattern} aura />
                          <Lock className="absolute -top-1 -right-1 w-4 h-4 text-emerald-700/70" />
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-emerald-800">{s.label}</div>
                      <div className="text-xs text-pink-700 capitalize">secret</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle background decor */}
      <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.2 }} className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-emerald-200 blur-3xl" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.2, delay: 0.2 }} className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-lime-200 blur-3xl" />
      </div>
    </div>
  );
}
