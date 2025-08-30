import React from "react";
import { motion } from "framer-motion";

// Sparkly burst for level-ups / big moments
export default function Starburst({ count = 16 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1.2, 0.6],
            y: [-10 - Math.random() * 30, -80 - Math.random() * 40],
            x: [(Math.random() - 0.5) * 40],
          }}
          transition={{ duration: 1.1 + Math.random() * 0.3, ease: "easeOut" }}
          style={{ left: `${50 + (Math.random() - 0.5) * 40}%`, top: `${55 + (Math.random() - 0.5) * 10}%` }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}

// Fun emoji confetti
export function EmojiBurst({ count = 12, keyPrefix = "burst" }: { count?: number; keyPrefix?: string }) {
  const emojis = ["🎉", "✨", "🌟", "💥", "🟡", "🎈"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={`${keyPrefix}-${i}`}
          className="absolute text-2xl select-none"
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-10, -60 - Math.random() * 60],
            x: [0, (Math.random() - 0.5) * 160],
            rotate: [0, (Math.random() - 0.5) * 180],
            scale: [0.6, 1, 0.6],
          }}
          transition={{ duration: 1.2 + Math.random() * 0.4, ease: "easeOut" }}
          style={{ left: `${50 + (Math.random() - 0.5) * 30}%`, top: `${50 + (Math.random() - 0.5) * 10}%` }}
        >
          {emojis[i % emojis.length]}
        </motion.span>
      ))}
    </div>
  );
}



