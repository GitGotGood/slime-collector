import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { SKINS } from "../../assets/skins";

function useUid(prefix = "slime") {
  const r = useRef(`${prefix}-${Math.random().toString(36).slice(2, 9)}`);
  return r.current;
}

type Props = {
  skinId?: string;           // preferred
  paletteId?: string;        // legacy fallback
  mood?: "idle" | "happy" | "sad";
  scale?: number;
  className?: string;
  bobDuration?: number;
  bobDelay?: number;
};

export default function Slime({
  skinId,
  paletteId,
  mood = "idle",
  scale = 1,
  className = "w-40 sm:w-48",
  bobDuration = 2.2,
  bobDelay = 0,
}: Props) {
  const id = skinId || paletteId || "green";
  const skin = SKINS[id] ?? SKINS.green;
  const uid = useUid(id);

  const { fill, defs } = useMemo(() => {
    if (skin.kind === "solid") {
      return { fill: skin.colors[0], defs: null as React.ReactNode };
    }
    if (skin.kind === "gradient") {
      return {
        fill: `url(#${uid}-grad)`,
        defs: (
          <defs>
            <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={skin.colors[0]} />
              <stop offset="100%" stopColor={skin.colors[1] ?? skin.colors[0]} />
            </linearGradient>
          </defs>
        ),
      };
    }
    return {
      fill: `url(#${uid}-anim)`,
      defs: (
        <defs>
          <linearGradient id={`${uid}-anim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%">
              <animate attributeName="stop-color" values={`${skin.colors[0]};${skin.colors[1]};${skin.colors[0]}`} dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%">
              <animate attributeName="stop-color" values={`${skin.colors[1]};${skin.colors[2] ?? skin.colors[0]};${skin.colors[1]}`} dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      ),
    };
  }, [skin, uid]);

  const mouthPath =
    {
      idle: "M20 36 Q32 42 44 36",
      happy: "M18 36 Q32 48 46 36",
      sad: "M18 40 Q32 30 46 40",
    }[mood] || "M20 36 Q32 42 44 36";

  return (
    <motion.div
      aria-label="Friendly slime"
      initial={{ scale: 0.95 }}
      animate={{ scale, y: [0, -3, 0] }}
      transition={{ y: { repeat: Infinity, duration: bobDuration, ease: "easeInOut", delay: bobDelay } }}
      className={className}
    >
      <svg viewBox="0 0 64 64" className="w-full h-auto drop-shadow">
        {defs}
        <motion.path
          d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
          fill={fill}
          stroke="#1f2937"
          strokeWidth="1.5"
          initial={{ filter: "brightness(1)" }}
          animate={{ filter: mood === "happy" ? "brightness(1.1)" : mood === "sad" ? "brightness(0.95)" : "brightness(1)" }}
        />
        <path d="M22 18 C26 16 30 16 32 14" stroke="#ffffffaa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="30" r="3.2" fill="#064e3b" />
        <circle cx="40" cy="30" r="3.2" fill="#064e3b" />
        <circle cx="23.3" cy="29.3" r="0.7" fill="#ecfeff" />
        <circle cx="39.3" cy="29.3" r="0.7" fill="#ecfeff" />
        <path d={mouthPath} stroke="#064e3b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
