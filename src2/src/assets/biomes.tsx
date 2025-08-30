import React from "react";

export type BiomeId = "meadow" | "beach" | "night";

export const BIOMES: Record<BiomeId, { name: string; style: React.CSSProperties }> = {
  meadow: {
    name: "Meadow",
    style: {
      background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 45%, #bbf7d0 100%)",
    },
  },
  beach: {
    name: "Beach",
    style: {
      background: "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #fde68a 100%)",
    },
  },
  night: {
    name: "Night",
    style: {
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 55%, #0b1324 100%)",
    },
  },
};

export function BiomeLayer({ biome = "meadow" as BiomeId }) {
  const b = BIOMES[biome] ?? BIOMES.meadow;
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10" style={b.style}>
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
