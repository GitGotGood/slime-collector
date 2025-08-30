import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Palette, Sparkles } from "lucide-react";

import { ALL_SKINS, SKINS_BY_TIER, SKINS_BY_SOURCE, RARITY_COLORS, NEW_SEASONAL } from "../../assets/all-skins";
import type { UnifiedSkin } from "../../assets/all-skins";
import Slime from "./Slime";

// Enhanced Slime component for rendering all skin types
function GallerySlime({ skin, size = "normal" }: { skin: UnifiedSkin; size?: "small" | "normal" | "large" }) {
  const sizeClass = size === "small" ? "w-20" : size === "large" ? "w-60" : "w-32";
  
  // For production skins, use the existing Slime component
  if (skin.source === "production") {
    const mapping: Record<string, string> = {
      "green_prod": "green",
      "mint_prod": "mint", 
      "blueberry_prod": "blueberry",
      "tangerine_prod": "tangerine",
      "bubblegum_prod": "bubblegum",
      "lava_prod": "lava",
      "aurora_prod": "aurora",
      "nebula_prod": "nebula"
    };
    const skinId = mapping[skin.id] || "green";
    
    return (
      <div className={`${sizeClass} relative flex items-center justify-center`}>
        <Slime skinId={skinId as any} />
      </div>
    );
  }

  // For inspiration skins, create a custom preview




  return (
    <div className={`${sizeClass} relative flex items-center justify-center`}>
      {/* Background aura layer - renders behind slime */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Aura effects that extend beyond slime body */}
          {skin.id === "solar_crown" && (
            <>
              <defs>
                <radialGradient id="solarAura" cx="50%" cy="50%">
                  <stop offset="60%" stopColor="#FFE39A" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FFE39A" stopOpacity="0.3" />
                </radialGradient>
              </defs>
              {/* Corona aura ring - matches original implementation */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={26} fill="url(#solarAura)" />
                {/* Extended sun rays - match original animation */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M${32 + Math.cos(i * Math.PI / 4) * 26} ${34 + Math.sin(i * Math.PI / 4) * 26} L${32 + Math.cos(i * Math.PI / 4) * 30} ${34 + Math.sin(i * Math.PI / 4) * 30}`}
                    stroke="#FFE39A"
                    strokeWidth="2"
                    opacity={0.4}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.3,
                      repeatDelay: 4,
                      delay: i*0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.g>
            </>
          )}

          {skin.id === "solar_crown_2" && (
            <>
              <defs>
                <radialGradient id="solarAura2" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FFE39A" stopOpacity="0" />
                  <stop offset="70%" stopColor="#FFE39A" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FFE39A" stopOpacity="0.3" />
                </radialGradient>
              </defs>
              {/* Larger corona aura ring */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={30} fill="url(#solarAura2)" />
                {/* Longer extended sun rays */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M${32 + Math.cos(i * Math.PI / 4) * 26} ${34 + Math.sin(i * Math.PI / 4) * 26} L${32 + Math.cos(i * Math.PI / 4) * 34} ${34 + Math.sin(i * Math.PI / 4) * 34}`}
                    stroke="#FFE39A"
                    strokeWidth="1.5"
                    opacity={0.4}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.4,
                      repeatDelay: 4,
                      delay: i*0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.g>
            </>
          )}
        </svg>
      </div>

      {/* Main slime body with proper slime shape and animations */}
      <motion.div 
        className="w-full h-full relative z-10"
        initial={{ scale: 0.95 }}
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* Define gradient if needed */}
          {skin.gradient && (
            <defs>
              <linearGradient id={`grad-${skin.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                {skin.gradient.stops.map(([color, pos], i) => (
                  <stop key={i} offset={`${pos}%`} stopColor={color} />
                ))}
              </linearGradient>
            </defs>
          )}
          
          {/* Define animated gradient for hybrid nebula */}
          {skin.anim === "nebula_hybrid" && (
            <defs>
              <linearGradient id="nebulaHybridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%">
                  <animate attributeName="stop-color" values="#6d28d9;#7c3aed;#6d28d9" dur="6s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%">
                  <animate attributeName="stop-color" values="#7c3aed;#0ea5e9;#7c3aed" dur="6s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
          )}
          
          {/* Slime body path (blob shape) */}
          <motion.path 
            d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
            fill={skin.gradient ? `url(#grad-${skin.id})` : (skin.palette?.fill || skin.base?.fill || "#22c55e")}
            stroke={skin.palette?.stroke || skin.base?.stroke || "#065f46"}
            strokeWidth="1.5"
            initial={{ filter: "brightness(1)" }}
            animate={{ filter: "brightness(1.05)" }}
          />
          
          {/* Pattern overlays */}
          {skin.pattern && (
            <g clipPath={`url(#slime-clip-${skin.id})`}>
              <clipPath id={`slime-clip-${skin.id}`}>
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
              
              {skin.pattern === "stripes" && (
                <g opacity={0.25}>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <rect 
                      key={i} 
                      x={-30 + i * 7} 
                      y={-12} 
                      width={4} 
                      height={88} 
                      transform="rotate(25 32 32)" 
                      fill="#0f172a" 
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "sprinkles" && (
                <g opacity={0.5}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <rect 
                      key={i}
                      x={8 + (i * 13) % 48}
                      y={16 + ((i * 9) % 32)}
                      width={1.5}
                      height={5}
                      rx={0.5}
                      transform={`rotate(${(i * 35) % 360} 32 32)`}
                      fill={["#f97316","#22c55e","#3b82f6","#ef4444","#8b5cf6"][i%5]}
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "pores" && (
                <g opacity={0.35}>
                  {Array.from({ length: 18 }).map((_, i) => (
                    <circle 
                      key={i}
                      cx={12 + (i * 8) % 40}
                      cy={18 + (i * 6) % 28}
                      r={0.8 + (i % 3) * 0.4}
                      fill="#ca8a04"
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "starlet" && (
                <g opacity={0.6}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <circle 
                      key={i}
                      cx={10 + (i * 11) % 44}
                      cy={16 + (i * 7) % 32}
                      r={0.6 + ((i % 3) * 0.3)}
                      fill="#ffffff"
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "hearts" && (
                <g opacity={0.4}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <path 
                      key={i}
                      d="M2,1 C2,0 3,0 3,1 C3,0 4,0 4,1 C4,2 3,3 2.5,3.5 C2,3 1,2 1,1 Z"
                      fill="#be123c"
                      transform={`translate(${10 + (i*8)%44}, ${18 + (i*5)%26}) scale(0.7)`}
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "scales" && (
                <g opacity={0.25}>
                  {Array.from({ length: 4 }).map((_, r) => (
                    Array.from({ length: 6 }).map((_, c) => (
                      <circle 
                        key={`${r}-${c}`}
                        cx={12 + c*7 + (r%2?3:0)}
                        cy={20 + r*6}
                        r={4}
                        stroke="#0f172a"
                        strokeWidth="1"
                        fill="none"
                      />
                    ))
                  ))}
                </g>
              )}
              
              {/* NEW PATTERNS */}
              {skin.pattern === "honeycomb" && (
                <g opacity={0.3}>
                  {Array.from({ length: 4 }).map((_, r) => (
                    Array.from({ length: 5 }).map((_, c) => (
                      <polygon 
                        key={`${r}-${c}`}
                        points="2,0 6,0 8,3.5 6,7 2,7 0,3.5"
                        fill="none"
                        stroke="#92400e"
                        strokeWidth="1"
                        transform={`translate(${12 + c*8 + (r%2?4:0)}, ${18 + r*6})`}
                      />
                    ))
                  ))}
                </g>
              )}
              
              {skin.pattern === "circuit" && (
                <g opacity={0.4}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <g key={i}>
                      <rect x={10 + (i*6)%40} y={20 + (i*4)%20} width={8} height={1} fill="#06b6d4" />
                      <rect x={14 + (i*6)%40} y={18 + (i*4)%20} width={1} height={4} fill="#06b6d4" />
                      <circle cx={15 + (i*6)%40} cy={20 + (i*4)%20} r={1} fill="#0891b2" />
                    </g>
                  ))}
                </g>
              )}
              
              {skin.pattern === "dust" && (
                <g opacity={0.5}>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <circle 
                      key={i}
                      cx={8 + (i*7)%48}
                      cy={16 + (i*5)%32}
                      r={0.3 + (i%3)*0.2}
                      fill="#c7d2fe"
                    />
                  ))}
                </g>
              )}
              
              {skin.pattern === "prism" && (
                <g opacity={0.4}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <polygon 
                      key={i}
                      points="0,0 4,2 0,4"
                      fill={["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6"][i]}
                      transform={`translate(${10 + (i*8)%40}, ${20 + (i*6)%20})`}
                    />
                  ))}
                </g>
              )}
            </g>
          )}
          
          {/* Advanced animation effects */}
          {skin.anim && (
            <g>
              {/* Ensure proper clipping for all animations */}
              <defs>
                <clipPath id={`anim-clip-${skin.id}`}>
                  <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                </clipPath>
              </defs>
              <g clipPath={`url(#anim-clip-${skin.id})`}>
              {skin.anim === "nebula" && (
                <>
                  {/* Swirling cosmic clouds */}
                  {["#a78bfa", "#f472b6", "#22d3ee"].map((color, i) => (
                    <motion.circle 
                      key={i}
                      cx={32 + (i - 1) * 4}
                      cy={34}
                      r={18 - i * 4}
                      fill={color}
                      opacity={0.22}
                      animate={{ 
                        cx: [26, 38, 26], 
                        cy: [28 + i * 2, 38 - i * 2, 28 + i * 2] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 7 + i * 1.6, 
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
                  {/* Twinkling starfield */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.circle 
                      key={`s${i}`} 
                      cx={8 + (i*7)%48} 
                      cy={18 + (i*5)%28} 
                      r={(i%5)*0.28 + 0.45} 
                      fill="#fff"
                      animate={{ opacity: [0.2, 1, 0.2] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.6 + (i%4)*0.4, 
                        delay: (i%6)*0.12 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "ocean" && (
                <>
                  {/* Rising bubbles */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={10 + (i*5)%44} 
                      cy={50} 
                      r={1.5 + (i%3)} 
                      fill="#e0f2fe" 
                      opacity={0.7}
                      animate={{ 
                        y: [0, -30 - (i%3)*4], 
                        opacity: [0.7, 0.2] 
                      }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4 + (i%4), 
                        delay: (i%5)*0.15 
                      }} 
                    />
                  ))}
                  {/* Wave effect */}
                  <motion.rect 
                    x={-10} 
                    y={38} 
                    width={84} 
                    height={8} 
                    fill="#0ea5e9" 
                    opacity={0.16}
                    animate={{ y: [40, 36, 40] }} 
                    transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }} 
                  />
                </>
              )}
              
              {skin.anim === "lava" && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.ellipse 
                      key={i}
                      cx={12 + (i*6)%40}
                      cy={46}
                      rx={3 + (i%2)*2}
                      ry={2 + (i%2)}
                      fill={i % 2 ? "#fb923c" : "#f97316"}
                      opacity={0.35}
                      animate={{ 
                        y: [0, -20 - (i%3)*5], 
                        opacity: [0.35, 0.15] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4 + (i%3), 
                        delay: (i%5)*0.15 
                      }}
                    />
                  ))}
                  {/* Lava glow at bottom */}
                  <motion.circle 
                    cx={32} 
                    cy={50} 
                    r={10} 
                    fill="#ef4444" 
                    opacity={0.08} 
                    animate={{ 
                      r: [8, 14, 8], 
                      opacity: [0.08, 0.16, 0.08] 
                    }} 
                    transition={{ repeat: Infinity, duration: 2.8 }} 
                  />
                </>
              )}
              
              {skin.anim === "aurora" && (
                <>
                  {[0, 1, 2].map((k) => (
                    <motion.path 
                      key={k}
                      d="M-10 26 Q 16 18 36 22 T 84 20 L 84 64 L -10 64 Z"
                      fill={k===2?"#a78bfa":k ? "#34d399" : "#22d3ee"}
                      opacity={k===2?0.12:k ? 0.2 : 0.16}
                      animate={{ x: [-16, 0, 16] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 5 + k * 1.5, 
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "firefly" && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={12 + (i*5)%40} 
                      cy={20 + (i%5)*5} 
                      r={0.9} 
                      fill="#fde68a"
                      animate={{ 
                        opacity: [0.1, 1, 0.1], 
                        y: [20, 22, 20] 
                      }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + (i%4)*0.5, 
                        delay: (i%6)*0.2 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "blizzard" && (
                <>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={12 + (i*7)%40} 
                      cy={18} 
                      r={0.8 + (i%3)*0.4} 
                      fill="#fff" 
                      opacity={0.9}
                      animate={{ 
                        y: [18, 46], 
                        x: [12 + (i*7)%40, 8 + (i*7)%40], 
                        opacity: [0.9, 0.4] 
                      }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3 + (i%4)*0.5, 
                        delay: (i%5)*0.1 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "monsoon" && (
                <>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.rect 
                      key={i} 
                      x={10 + (i*5)%44} 
                      y={14} 
                      width={1.5} 
                      height={22} 
                      fill="#0ea5e9" 
                      opacity={0.6}
                      animate={{ y: [14, 54] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.3 + (i%3)*0.2, 
                        delay: (i%5)*0.08 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "zeus" && (
                <>
                  <motion.rect 
                    x={0} 
                    y={0} 
                    width={64} 
                    height={64} 
                    fill="#ffffff" 
                    opacity={0}
                    animate={{ opacity: [0, 0.22, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.35, delay: 2.2 }} 
                  />
                  {Array.from({ length: 2 }).map((_, k) => (
                    <motion.path 
                      key={k} 
                      d={k ? "M24 16 L28 28 L22 28 L30 44" : "M40 16 L36 28 L42 28 L34 44"} 
                      stroke="#e5e7eb" 
                      strokeWidth={1.8} 
                      opacity={0}
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.55 + k*0.2, delay: 2 + k*0.3 }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "leviathan" && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={32} 
                      cy={34} 
                      r={10 + i*6} 
                      fill="#22d3ee" 
                      opacity={0.1}
                      animate={{ opacity: [0.06, 0.22, 0.06] }} 
                      transition={{ repeat: Infinity, duration: 2.6 + i }} 
                    />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={12 + (i*5)%40} 
                      cy={48 - (i%5)*4} 
                      r={0.9} 
                      fill="#a7f3d0" 
                      opacity={0.7}
                      animate={{ 
                        y: [48 - (i%5)*4, 22], 
                        opacity: [0.7, 0.1] 
                      }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3 + (i%4)*0.5, 
                        delay: (i%6)*0.2 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "pegasus" && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.rect 
                      key={i} 
                      x={6} 
                      y={18 + i*4} 
                      width={18} 
                      height={1} 
                      fill="#ffffff" 
                      opacity={0.8}
                      animate={{ x: [6, 50], opacity: [0.8, 0.0] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.8 + (i%3)*0.4, 
                        delay: (i%4)*0.1 
                      }} 
                    />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle 
                      key={`tw${i}`} 
                      cx={10 + (i*6)%44} 
                      cy={16 + (i%4)*8} 
                      r={0.8} 
                      fill="#ffffff"
                      animate={{ opacity: [0.2, 1, 0.2] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.6 + (i%3)*0.4, 
                        delay: (i%5)*0.1 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "yeti" && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.polygon 
                      key={i} 
                      points="30,18 34,26 26,26" 
                      fill="#e0f2fe" 
                      opacity={0.5}
                      animate={{ opacity: [0.2, 0.8, 0.2] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + (i%3)*0.5, 
                        delay: (i%4)*0.1 
                      }} 
                      transform={`translate(${(i*5)%30}, ${(i%5)*4})`} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "dragon" && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={32} 
                      cy={34} 
                      r={8 + i*6} 
                      fill="#16a34a" 
                      opacity={0.1}
                      animate={{ 
                        r: [8 + i*6, 12 + i*6, 8 + i*6], 
                        opacity: [0.1, 0.22, 0.1] 
                      }} 
                      transition={{ repeat: Infinity, duration: 2.2 + i*0.6 }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "sylph" && (
                <>
                  <motion.g 
                    animate={{ rotate: [0, 360] }} 
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    style={{ transformOrigin: "32px 34px" }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <circle 
                        key={i} 
                        cx={32 + Math.cos((i/6)*Math.PI*2)*10} 
                        cy={34 + Math.sin((i/6)*Math.PI*2)*10} 
                        r={1} 
                        fill="#ffffff" 
                        opacity={0.7} 
                      />
                    ))}
                  </motion.g>
                </>
              )}
              
              {skin.anim === "djinn" && (
                <>
                  {[0,1].map((k) => (
                    <motion.path 
                      key={k} 
                      d="M-6 36 C 8 30, 24 34, 34 30 S 60 28, 74 34" 
                      fill="#fde68a" 
                      opacity={0.08}
                      animate={{ x: [-6, 0, 6] }} 
                      transition={{ repeat: Infinity, duration: 4 + k }} 
                    />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={10 + (i*6)%44} 
                      cy={16 + (i%5)*6} 
                      r={0.9} 
                      fill="#fff7ed"
                      animate={{ opacity: [0.2, 1, 0.2] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.6 + (i%3)*0.4, 
                        delay: (i%5)*0.12 
                      }} 
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "phoenix" && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.circle 
                      key={i} 
                      cx={10 + (i*6)%44} 
                      cy={48} 
                      r={1 + (i%3)} 
                      fill="#fb923c" 
                      opacity={0.8}
                      animate={{ 
                        y: [48, 22], 
                        opacity: [0.8, 0.1] 
                      }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.6 + (i%4)*0.5, 
                        delay: (i%4)*0.12 
                      }} 
                    />
                  ))}
                  <motion.circle 
                    cx={32} 
                    cy={34} 
                    r={6} 
                    fill="#fde68a" 
                    opacity={0.25}
                    animate={{ 
                      r: [6, 14, 6], 
                      opacity: [0.25, 0.08, 0.25] 
                    }} 
                    transition={{ repeat: Infinity, duration: 2.0 }} 
                  />
                </>
              )}
              
              {/* NEW EPIC ANIMATIONS */}
              {skin.anim === "comet" && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle 
                      key={i}
                      cx={8}
                      cy={16 + (i*4)%24}
                      r={0.8 + (i%3)*0.4}
                      fill="#dbeafe"
                      opacity={0.8}
                      animate={{ 
                        x: [8, 56], 
                        opacity: [0.8, 0.1] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.5 + (i%3)*0.3, 
                        delay: (i%4)*0.2 
                      }}
                    />
                  ))}
                  <motion.rect 
                    x={6} 
                    y={30} 
                    width={20} 
                    height={1} 
                    fill="#3b82f6" 
                    opacity={0.6}
                    animate={{ x: [6, 50], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.8 }}
                  />
                </>
              )}
              
              {skin.anim === "solar" && (
                <>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.path 
                      key={i}
                      d={`M${32 + Math.cos((i/12)*Math.PI*2)*12} ${34 + Math.sin((i/12)*Math.PI*2)*12} L${32 + Math.cos((i/12)*Math.PI*2)*20} ${34 + Math.sin((i/12)*Math.PI*2)*20}`}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      opacity={0.7}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3 + (i%4)*0.2, 
                        delay: (i%6)*0.1 
                      }}
                    />
                  ))}
                  <motion.circle 
                    cx={32} 
                    cy={34} 
                    r={8} 
                    fill="#f59e0b" 
                    opacity={0.3}
                    animate={{ r: [6, 12, 6], opacity: [0.3, 0.15, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                </>
              )}
              
              {skin.anim === "quantum" && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.circle 
                      key={i}
                      cx={32 + (i-2.5)*6}
                      cy={34}
                      r={2}
                      fill="#a78bfa"
                      opacity={0.6}
                      animate={{ 
                        cx: [32 - 15, 32 + 15, 32 - 15],
                        opacity: [0.6, 0.2, 0.6]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4 + i*0.3, 
                        delay: i*0.2 
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* NEW MYTHIC ANIMATIONS */}
              {skin.anim === "void" && (
                <>
                  <defs>
                    <filter id="voidBlur">
                      <feGaussianBlur stdDeviation="0.8" />
                    </filter>
                  </defs>
                  {/* Dark central void - GETS FEATHER BLUR */}
                  <motion.circle 
                    cx={32} 
                    cy={34} 
                    r={18} 
                    fill="#0f0f23" 
                    opacity={0.3}
                    filter="url(#voidBlur)"
                    animate={{ r: [15, 22, 15], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  />
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.circle 
                      key={i}
                      cx={32 + Math.cos((i/20)*Math.PI*2)*14}
                      cy={34 + Math.sin((i/20)*Math.PI*2)*14}
                      r={0.5}
                      fill="#c7d2fe"
                      opacity={0.8}
                      animate={{ 
                        cx: [32 + Math.cos((i/20)*Math.PI*2)*14, 32 + Math.cos((i/20)*Math.PI*2)*8, 32 + Math.cos((i/20)*Math.PI*2)*14],
                        cy: [34 + Math.sin((i/20)*Math.PI*2)*14, 34 + Math.sin((i/20)*Math.PI*2)*8, 34 + Math.sin((i/20)*Math.PI*2)*14],
                        opacity: [0.8, 0.1, 0.8]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 6 + (i%4), 
                        delay: (i%5)*0.1 
                      }}
                    />
                  ))}
                </>
              )}
              
              {skin.anim === "celestial" && (
                <>
                  {Array.from({ length: 3 }).map((_, ring) => (
                    <motion.g 
                      key={ring}
                      animate={{ rotate: [0, 360] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 8 + ring*2, 
                        ease: "linear"
                      }}
                      style={{ transformOrigin: "32px 34px" }}
                    >
                      {Array.from({ length: 6 + ring*2 }).map((_, i) => (
                        <circle 
                          key={i}
                          cx={32 + Math.cos((i/(6+ring*2))*Math.PI*2)*(8+ring*4)}
                          cy={34 + Math.sin((i/(6+ring*2))*Math.PI*2)*(8+ring*4)}
                          r={0.8}
                          fill="#fbbf24"
                          opacity={0.7}
                        />
                      ))}
                    </motion.g>
                  ))}
                </>
              )}
              
              {skin.anim === "temporal" && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.path 
                      key={i}
                      d={`M${20 + i*3} 20 Q32 ${28 + (i%3)*4} ${44 - i*3} 20`}
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      fill="none"
                      opacity={0.5}
                      animate={{ 
                        pathLength: [0, 1, 0],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3 + (i%4)*0.5, 
                        delay: (i%3)*0.3 
                      }}
                    />
                  ))}
                  <motion.circle 
                    cx={32} 
                    cy={34} 
                    r={1} 
                    fill="#e0e7ff" 
                    animate={{ r: [1, 3, 1], opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </>
              )}
              
              {skin.anim === "nebula_hybrid" && (
                <>
                  {/* Production-style animated gradient background */}
                  <motion.ellipse 
                    cx={32} 
                    cy={34} 
                    rx={22} 
                    ry={20} 
                    fill="url(#nebulaHybridGrad)"
                    opacity={0.8}
                    animate={{ rx: [22, 24, 22], ry: [20, 22, 20] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  />
                  
                  {/* Inspiration-style animated overlays */}
                  {["#a78bfa", "#f472b6", "#22d3ee"].map((color, i) => (
                    <motion.circle 
                      key={i}
                      cx={32 + (i - 1) * 4}
                      cy={34}
                      r={16 - i * 3}
                      fill={color}
                      opacity={0.25}
                      animate={{ 
                        cx: [26, 38, 26], 
                        cy: [28 + i * 2, 38 - i * 2, 28 + i * 2] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 7 + i * 1.6, 
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
                  
                  {/* Enhanced starfield with gradient colors */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.circle 
                      key={i}
                      cx={18 + (i % 4) * 8}
                      cy={20 + Math.floor(i / 4) * 8}
                      r={0.8}
                      fill={["#6d28d9", "#7c3aed", "#0ea5e9"][i % 3]}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + (i % 3) * 0.5, 
                        delay: (i % 4) * 0.4
                      }}
                    />
                  ))}
                  
                  {/* Cosmic dust swirls using gradient colors */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.path 
                      key={i}
                      d={`M${20 + i*4} ${25 + (i%3)*6} Q${28 + i*2} ${30 + (i%2)*8} ${36 + i*3} ${25 + (i%3)*6}`}
                      stroke={["#6d28d9", "#7c3aed", "#0ea5e9"][i % 3]}
                      strokeWidth="1"
                      fill="none"
                      opacity={0.4}
                      animate={{ 
                        pathLength: [0, 1, 0],
                        opacity: [0.2, 0.6, 0.2]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4 + (i%3)*0.8, 
                        delay: (i%2)*0.5 
                      }}
                    />
                  ))}
                </>
              )}
              </g>
            </g>
          )}

          {/* SECRET SLIMES - DETAILED IMPLEMENTATIONS */}
          {skin.id === "bigfoot_update" && (
            <>
              {/* Mossy base gradient */}
              <defs>
                <linearGradient id="mossyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5BA86D" />
                  <stop offset="100%" stopColor="#3E7B4E" />
                </linearGradient>
                <filter id="mossyBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <filter id="bigfootBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
                            <motion.ellipse
                cx={32} cy={34} rx={22} ry={20}
                fill="url(#mossyGrad)"
                filter="url(#bigfootBlur)"
                opacity={0.9}
              />
              
              {/* Spore speckle texture */}
              {Array.from({ length: 15 }).map((_, i) => (
                <circle 
                  key={i}
                  cx={14 + (i*7)%36} 
                  cy={18 + (i*5)%28}
                  r={0.5 + (i%3)*0.2}
                  fill="#2D6A4F"
                  opacity={0.06}
                />
              ))}
              
              {/* Giant footprint with fade animation - GETS FEATHER BLUR */}
              <motion.path
                d="M22 42 C20 40 20 38 22 36 C24 34 26 34 28 36 C30 34 32 34 34 36 C36 34 38 34 40 36 C42 34 44 34 46 36 C48 38 48 40 46 42 C46 44 45 46 44 48 C42 50 38 52 32 52 C26 52 22 50 20 48 C19 46 18 44 18 42 Z"
                fill="#1F5132"
                filter="url(#mossyBlur)"
                opacity={0}
                animate={{ 
                  opacity: [0, 0.45, 0.45, 0] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6, 
                  times: [0, 0.17, 0.5, 1],
                  ease: "easeOut"
                }}
              />
              
              {/* Drifting spore motes */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={16 + (i*6)%32}
                  cy={50}
                  r={1 + (i%2)*0.5}
                  fill="#CDE9D3"
                  opacity={0.3}
                  filter={`blur(${3 + (i%3)}px)`}
                  animate={{
                    cy: [50, 15],
                    opacity: [0.3, 0.1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + (i%3)*2,
                    delay: (i*1.2)%6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "pineapple_pants" && (
            <>
              {/* Pineapple yellow gradient */}
              <defs>
                <linearGradient id="pineappleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F9D34C" />
                  <stop offset="100%" stopColor="#E9B93D" />
                </linearGradient>
                <pattern id="diamondGrid" patternUnits="userSpaceOnUse" width="12" height="12">
                  <path d="M0,6 L6,0 L12,6 L6,12 Z" stroke="#D9A629" strokeWidth="0.5" fill="none" opacity="0.3" />
                </pattern>
                <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#pineappleGrad)" 
              />
              
              {/* Diamond grid pattern */}
              <rect x={10} y={14} width={44} height={40} fill="url(#diamondGrid)" />
              
              {/* Pants belt line */}
              <rect x={10} y={48} width={44} height={4} fill="#EDEDED" />
              
              {/* Tiny red tie */}
              <path d="M30 48 L34 48 L32 58 Z" fill="#D2191A" />
              
              {/* Shimmer sweep */}
              <motion.rect
                x={5} y={10} width={8} height={44}
                fill="url(#shimmerGrad)"
                opacity={0}
                animate={{ 
                  x: [5, 55],
                  opacity: [0, 0.12, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Gentle scale pulse */}
              <motion.g
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                style={{ transformOrigin: "32px 34px" }}
              />
            </>
          )}

          {skin.id === "pipe_jumper" && (
            <>
              {/* Course-clear green gradient */}
              <defs>
                <linearGradient id="courseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2BB673" />
                  <stop offset="100%" stopColor="#1F8E57" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#courseGrad)" 
              />
              
              {/* Brick specks */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect 
                  key={i}
                  x={12 + (i*7)%32} 
                  y={20 + (i*5)%24}
                  width={4 + (i%2)}
                  height={4 + (i%2)}
                  fill="#B86E3B"
                  opacity={0.14}
                />
              ))}
              
              {/* Red cap badge */}
              <motion.g>
                <motion.circle
                  cx={20} cy={24}
                  r={6}
                  fill="#D62828"
                  animate={{ scale: [0.9, 1.05, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.3,
                    repeatDelay: 7,
                    ease: "easeOut"
                  }}
                />
                <text 
                  x={20} y={27} 
                  fill="white" 
                  fontSize="8" 
                  textAnchor="middle"
                  stroke="white"
                  strokeWidth="0.5"
                >
                  S
                </text>
              </motion.g>
              
              {/* Micro hop animation */}
              <motion.g
                animate={{ y: [0, -2, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "easeInOut",
                  delay: 0.5 // Stagger with main bob
                }}
                style={{ transformOrigin: "32px 54px" }}
              />
            </>
          )}

          {skin.id === "ring_runner" && (
            <>
              {/* Electric blue gradient */}
              <defs>
                <linearGradient id="electricBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E90FF" />
                  <stop offset="100%" stopColor="#1160B9" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#electricBlue)" 
              />
              
              {/* Radial glow behind eyes */}
              <ellipse 
                cx={32} cy={30} rx={15} ry={8}
                fill="#7AB7FF"
                opacity={0.1}
              />
              
              {/* Gold ring twinkles */}
              {Array.from({ length: 1 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={32}
                  cy={34}
                  r={12}
                  fill="none"
                  stroke="#F2C14E"
                  strokeWidth={2}
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 1.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    repeatDelay: 8,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Running ring animation */}
              <motion.circle
                cx={-10}
                cy={34}
                r={8}
                fill="none"
                stroke="#F2C14E"
                strokeWidth={2}
                opacity={0}
                animate={{
                  cx: [-10, 74],
                  cy: [34, 30, 34],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatDelay: 10,
                  ease: "easeInOut"
                }}
              />
              
              {/* Star specks */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*8)%28}
                  cy={20 + (i*4)%20}
                  r={1}
                  fill="#FCE38A"
                  opacity={0.25}
                  animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.25, 0.6, 0.25]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.25,
                    delay: i * 0.8,
                    repeatDelay: 3
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "crafted_cube" && (
            <>
              {/* Dirt brown gradient */}
              <defs>
                <linearGradient id="dirtBrown" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7A5232" />
                  <stop offset="100%" stopColor="#5A3A22" />
                </linearGradient>
                <filter id="dirtBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <pattern id="pixelBlocks" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect x="0" y="0" width="4" height="4" fill="#6B462B" opacity="0.4" />
                  <rect x="4" y="4" width="4" height="4" fill="#8C5A39" opacity="0.35" />
                </pattern>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#dirtBrown)" 
                filter="url(#dirtBlur)"
                opacity={0.8}
              />
              
              {/* Pixel block texture */}
              <rect x={10} y={14} width={44} height={40} fill="url(#pixelBlocks)" />
              
              {/* Grass top band */}
              <motion.rect
                x={10} y={14} width={44} height={12}
                fill="#5FBD5B"
                animate={{ x: [10, 12, 10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              
              {/* Grass speckles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect 
                  key={i}
                  x={12 + (i*5)%36} 
                  y={16 + (i%3)*3}
                  width={2}
                  height={2}
                  fill="#9BE38F"
                  opacity={0.3}
                />
              ))}
              
              {/* Grass sparkles */}
              <motion.circle
                cx={32}
                cy={20}
                r={2}
                fill="#CFF7C7"
                opacity={0}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.3,
                  repeatDelay: 5,
                  ease: "easeInOut"
                }}
              />
            </>
          )}

          {/* SEASONAL SLIMES - DETAILED IMPLEMENTATIONS */}
          {skin.id === "pumpkin_patch" && (
            <>
              {/* Pumpkin orange gradient */}
              <defs>
                <linearGradient id="pumpkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F38B2A" />
                  <stop offset="100%" stopColor="#C06515" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#pumpkinGrad)" 
              />
              
              {/* Vertical ridges */}
              {Array.from({ length: 6 }).map((_, i) => (
                <path 
                  key={i}
                  d={`M${16 + i*6} 14 Q${18 + i*6} 34 ${16 + i*6} 54`}
                  stroke="#E39B5A"
                  strokeWidth="1"
                  fill="none"
                  opacity={0.12}
                />
              ))}
              
              {/* Carved grin overlay */}
              <motion.path
                d="M20 38 Q32 46 44 38"
                stroke="#4D2A06"
                strokeWidth="2"
                fill="none"
                opacity={0}
                animate={{ opacity: [0, 0.8, 0.8, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  times: [0, 0.25, 0.5, 1],
                  ease: "easeInOut"
                }}
              />
              
              {/* Falling leaf specks */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*12}
                  cy={10}
                  r={1.5}
                  fill="#8C4E1B"
                  opacity={0.3}
                  animate={{
                    cy: [10, 60],
                    opacity: [0.3, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: i * 1.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "candy_frost" && (
            <>
              {/* Mint frost gradient */}
              <defs>
                <linearGradient id="mintFrost" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9CF0E4" />
                  <stop offset="100%" stopColor="#E7FFFB" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#mintFrost)" 
              />
              
              {/* Candy sprinkles */}
              {[{color: "#FF6B6B", x: 18, y: 25}, {color: "#FFD93D", x: 35, y: 28}, {color: "#6BCB77", x: 42, y: 22}, {color: "#4D96FF", x: 25, y: 40}, {color: "#FF6B6B", x: 38, y: 45}].map((sprinkle, i) => (
                <rect 
                  key={i}
                  x={sprinkle.x} 
                  y={sprinkle.y}
                  width={1}
                  height={4}
                  fill={sprinkle.color}
                  opacity={0.9}
                  rx="0.5"
                />
              ))}
              
              {/* Snowfall */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={12 + (i*7)%40}
                  cy={10}
                  r={1 + (i%2)*0.5}
                  fill="#FFFFFF"
                  opacity={0.8}
                  animate={{
                    cy: [10, 60],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + (i%3)*1.5,
                    delay: (i*0.8)%4,
                    ease: "linear"
                  }}
                />
              ))}
              
              {/* Frost shimmer along top */}
              <motion.path
                d="M10 14 Q32 12 54 14"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                opacity={0}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
            </>
          )}

          {skin.id === "firecracker" && (
            <>
              {/* Vibrant red gradient */}
              <defs>
                <linearGradient id="firecrackerRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D7263D" />
                  <stop offset="100%" stopColor="#8E1123" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#firecrackerRed)" 
              />
              
              {/* Diagonal glitter streaks */}
              {Array.from({ length: 4 }).map((_, i) => (
                <path 
                  key={i}
                  d={`M${15 + i*8} 20 L${25 + i*8} 30`}
                  stroke="#FF9D9D"
                  strokeWidth="1"
                  opacity={0.12}
                />
              ))}
              
              {/* Spark bursts */}
              <motion.g
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4,
                  repeatDelay: 2.2,
                  ease: "easeOut"
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={32 + Math.cos(i * Math.PI / 4) * 8}
                    cy={34 + Math.sin(i * Math.PI / 4) * 8}
                    r={1.5}
                    fill={i % 2 ? "#FFD166" : "#F7B801"}
                  />
                ))}
              </motion.g>
              
              {/* Afterglow ring */}
              <motion.circle
                cx={32}
                cy={34}
                r={12}
                fill="none"
                stroke="#FFD166"
                strokeWidth="2"
                opacity={0}
                animate={{ 
                  scale: [0.8, 1.2],
                  opacity: [0.4, 0] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.2,
                  repeatDelay: 2.4,
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {skin.id === "egg_dye" && (
            <>
              {/* Pastel multicolor base */}
              <defs>
                <radialGradient id="eggDye" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#DCC7FF" />
                  <stop offset="30%" stopColor="#C8F7E6" />
                  <stop offset="60%" stopColor="#FFD7C2" />
                  <stop offset="100%" stopColor="#FFF5BD" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#eggDye)" 
              />
              
              {/* Marble swirls */}
              <motion.path
                d="M15 25 Q25 35 35 25 Q45 35 55 25"
                stroke="#DCC7FF"
                strokeWidth="3"
                fill="none"
                opacity={0.2}
                animate={{ 
                  translateX: [0, 6, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut"
                }}
              />
              <motion.path
                d="M10 40 Q20 30 30 40 Q40 30 50 40"
                stroke="#C8F7E6"
                strokeWidth="2"
                fill="none"
                opacity={0.15}
                animate={{ 
                  translateX: [0, -4, 0],
                  rotate: [0, -1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Speckles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <circle 
                  key={i}
                  cx={16 + (i*5)%32} 
                  cy={20 + (i*7)%24}
                  r={0.5}
                  fill="#FFFFFF"
                  opacity={0.1}
                />
              ))}
            </>
          )}

          {skin.id === "beach_day" && (
            <>
              {/* Sand gradient */}
              <defs>
                <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8E7C7" />
                  <stop offset="100%" stopColor="#E6D1AA" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#sandGrad)" 
              />
              
              {/* Sand speckle */}
              {Array.from({ length: 20 }).map((_, i) => (
                <circle 
                  key={i}
                  cx={12 + (i*6)%40} 
                  cy={25 + (i*4)%20 + (i > 10 ? 10 : 0)} // Denser at bottom
                  r={1 + (i%3)*0.3}
                  fill="#D2B894"
                  opacity={0.2}
                />
              ))}
              
              {/* Shell accents */}
              <ellipse cx={18} cy={46} rx={3} ry={2} fill="#EBD9C3" opacity={0.8} />
              <ellipse cx={46} cy={48} rx={2.5} ry={1.5} fill="#EBD9C3" opacity={0.8} />
              
              {/* Sea breeze shimmer */}
              <motion.rect
                x={15} y={30} width={6} height={15}
                fill="url(#shimmerGrad)"
                opacity={0}
                animate={{ 
                  x: [15, 45],
                  opacity: [0, 0.08, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut"
                }}
              />
              
              {/* Tiny crab cameo */}
              <motion.g
                animate={{ x: [0, 6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  repeatDelay: 20,
                  ease: "easeInOut"
                }}
              >
                <circle cx={20} cy={50} r={1} fill="#D2B894" />
                <rect x={19} y={49} width={1} height={1} fill="#D2B894" />
                <rect x={21} y={49} width={1} height={1} fill="#D2B894" />
              </motion.g>
            </>
          )}

          {/* MYTHIC SLIMES - DETAILED IMPLEMENTATIONS */}
          {skin.id === "nebula_prime" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Deep space gradient */}
              <defs>
                <linearGradient id="nebulaPrimeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2A0E4F" />
                  <stop offset="100%" stopColor="#0D0C28" />
                </linearGradient>
                <filter id="nebulaPrimeBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <radialGradient id="nebulaWisp1" cx="70%" cy="30%">
                  <stop offset="0%" stopColor="#6E3AC9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6E3AC9" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nebulaWisp2" cx="30%" cy="70%">
                  <stop offset="0%" stopColor="#FF7BD5" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FF7BD5" stopOpacity="0" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#nebulaPrimeGrad)" 
                filter="url(#nebulaPrimeBlur)"
                opacity={0.8}
                animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(2deg)", "hue-rotate(0deg)"] }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
              />
              
              {/* Far starfield layer */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={`far-${i}`}
                  cx={14 + (i*5)%36}
                  cy={18 + (i*7)%28}
                  r={0.5}
                  fill="#3AC6FF"
                  opacity={0.4}
                  animate={{ 
                    x: [0, -4, 0],
                    opacity: i < 2 ? [0.4, 0.8, 0.4] : 0.4 
                  }}
                  transition={{ 
                    x: { repeat: Infinity, duration: 60, ease: "linear" },
                    opacity: i < 2 ? { repeat: Infinity, duration: 0.2, delay: i*3, repeatDelay: 8 } : {}
                  }}
                />
              ))}
              
              {/* Near starfield layer */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={`near-${i}`}
                  cx={16 + (i*6)%32}
                  cy={20 + (i*8)%24}
                  r={0.8}
                  fill="#6E3AC9"
                  opacity={0.6}
                  animate={{ 
                    x: [0, -8, 0],
                    scale: i < 1 ? [1, 1.3, 1] : 1
                  }}
                  transition={{ 
                    x: { repeat: Infinity, duration: 30, ease: "linear" },
                    scale: i < 1 ? { repeat: Infinity, duration: 0.25, delay: i*5, repeatDelay: 6 } : {}
                  }}
                />
              ))}
              
              {/* Nebula wisps */}
              <motion.ellipse 
                cx={42} cy={24} rx={12} ry={8} 
                fill="url(#nebulaWisp1)"
                animate={{ opacity: [0.2, 0.12, 0.2] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              />
              <motion.ellipse 
                cx={22} cy={44} rx={10} ry={6} 
                fill="url(#nebulaWisp2)"
                animate={{ opacity: [0.15, 0.08, 0.15] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
              />
            </g>
          )}

          {skin.id === "phoenix_heart" && (
            <>
              {/* Coal base with glowing core */}
              <defs>
                <radialGradient id="phoenixCore" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#FFDFA7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FFB648" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <defs>
                <filter id="phoenixHeartBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#5C1F1F" 
                filter="url(#phoenixHeartBlur)"
                opacity={0.8}
              />
              
              {/* Glowing core */}
              <motion.ellipse 
                cx={32} cy={32} rx={15} ry={12} 
                fill="url(#phoenixCore)"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              
              {/* Rising embers */}
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + (i*3)%20}
                  cy={50}
                  r={1 + (i%3)*0.5}
                  fill={["#FF7A1A", "#FFB648", "#FFDFA7"][i % 3]}
                  opacity={0}
                  animate={{
                    cy: [50, 15],
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + (i%3)*1.5,
                    delay: (i*0.6)%4,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Feathered plume bloom */}
              <motion.g
                animate={{ scale: [0, 1.2, 0], opacity: [0, 0.6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatDelay: 8,
                  ease: "easeOut"
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${30 + i*2} 25 Q${32 + i*3} 20 ${34 + i*2} 25`}
                    stroke="#FFB648"
                    strokeWidth="2"
                    fill="none"
                    opacity={0.4}
                    filter="blur(1px)"
                  />
                ))}
              </motion.g>
            </>
          )}

          {skin.id === "leviathan_tide" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Abyssal teal gradient */}
              <defs>
                <linearGradient id="abyssalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#012A36" />
                  <stop offset="100%" stopColor="#00171D" />
                </linearGradient>
                <filter id="leviathanBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <pattern id="causticLines" patternUnits="userSpaceOnUse" width="8" height="12">
                  <path d="M0,6 Q4,2 8,6 Q4,10 0,6" stroke="#57F1FF" strokeWidth="0.5" fill="none" opacity="0.1" />
                </pattern>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#abyssalGrad)" 
                filter="url(#leviathanBlur)"
                opacity={0.8}
              />
              
              {/* Caustic lines */}
              <motion.rect
                x={10} y={14} width={44} height={40}
                fill="url(#causticLines)"
                animate={{ x: [10, 18, 10] }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              />
              
              {/* Surge band near bottom */}
              <motion.rect
                x={10} y={42} width={44} height={8}
                fill="#78D0E3"
                opacity={0.15}
                animate={{ x: [10, 4, 16, 10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />
              
              {/* Glint arcs */}
              <motion.path
                d="M18 28 Q25 24 32 28"
                stroke="#57F1FF"
                strokeWidth="1"
                fill="none"
                opacity={0}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  repeatDelay: 9,
                  ease: "easeInOut"
                }}
              />
              
              {/* Micro bubbles */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*6)%28}
                  cy={50}
                  r={0.5 + (i%2)*0.3}
                  fill="#57F1FF"
                  opacity={0.3}
                  animate={{
                    cy: [50, 15],
                    opacity: [0.3, 0.1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + (i%3)*2,
                    delay: (i*1.5)%5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          )}

          {skin.id === "pegasus_gale" && (
            <>
              {/* Sky gradient */}
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#BFD9FF" />
                  <stop offset="100%" stopColor="#7FB3FF" />
                </linearGradient>
                <linearGradient id="lightSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#skyGrad)" 
              />
              
              {/* Wing silhouettes */}
              <motion.path
                d="M18 30 Q15 25 12 28 Q15 32 18 30"
                fill="#FFFFFF"
                opacity={0.15}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <motion.path
                d="M46 30 Q49 25 52 28 Q49 32 46 30"
                fill="#FFFFFF"
                opacity={0.15}
                animate={{ y: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
              />
              
              {/* Light sweep */}
              <motion.rect
                x={10} y={14} width={6} height={16}
                fill="url(#lightSweep)"
                opacity={0}
                animate={{ 
                  x: [10, 48],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Drifting motes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={16 + (i*6)%32}
                  cy={20 + (i*4)%20}
                  r={1}
                  fill="#FFFFFF"
                  opacity={0.6}
                  animate={{
                    x: [0, 4, 0],
                    y: [0, -2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + (i%3)*2,
                    delay: i*1.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "zephyr_lord" && (
            <>
              {/* Sage gradient */}
              <defs>
                <linearGradient id="sageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B9E3C6" />
                  <stop offset="100%" stopColor="#86C8AD" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#sageGrad)" 
              />
              
              {/* Wind rings */}
              <motion.g>
                <motion.circle
                  cx={32} cy={34} r={8}
                  fill="none"
                  stroke="#76A17C"
                  strokeWidth="1"
                  opacity={0}
                  animate={{
                    r: [8, 18],
                    opacity: [0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 3,
                    ease: "easeOut"
                  }}
                />
                <motion.circle
                  cx={32} cy={34} r={8}
                  fill="none"
                  stroke="#76A17C"
                  strokeWidth="1"
                  opacity={0}
                  animate={{
                    r: [8, 18],
                    opacity: [0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 3,
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                />
              </motion.g>
              
              {/* Drifting leaves */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.ellipse
                  key={i}
                  cx={18 + (i*5)%28}
                  cy={20 + (i*6)%24}
                  rx={2}
                  ry={1}
                  fill="#7FB77E"
                  opacity={0.7}
                  animate={{
                    x: [0, 6, 0],
                    y: [0, -3, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + (i%3)*2,
                    delay: i*0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "thunder_rune" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Storm gradient */}
              <defs>
                <linearGradient id="stormGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0B1020" />
                  <stop offset="100%" stopColor="#212B47" />
                </linearGradient>
                <filter id="thunderBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#stormGrad)" 
                filter="url(#thunderBlur)"
                opacity={0.8}
              />
              
              {/* Runic glyphs */}
              {[
                "M20 25 L22 20 L24 25 M22 20 L22 27",
                "M38 25 Q40 22 42 25 Q40 28 38 25",
                "M30 45 L32 42 L34 45 L32 48 Z"
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="#E1EEFF"
                  strokeWidth="1"
                  fill="none"
                  opacity={0.12}
                  animate={{ opacity: [0.12, 0.7, 0.1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    repeatDelay: 2.2,
                    delay: i*0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Lightning flash */}
              <motion.rect
                x={10} y={14} width={44} height={40}
                fill="#9EC8FF"
                opacity={0}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.05,
                  repeatDelay: 2.7,
                  ease: "easeInOut"
                }}
              />
              
              {/* Micro sparks */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={25 + i*6}
                  cy={30 + (i%2)*8}
                  r={0.5}
                  fill="#CFE4FF"
                  opacity={0}
                  animate={{
                    r: [0.5, 2, 1],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.12,
                    repeatDelay: 2.6,
                    delay: i*0.02,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          )}

          {skin.id === "solar_crown" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Solar gradient */}
              <defs>
                <linearGradient id="solarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFB200" />
                  <stop offset="100%" stopColor="#FF6A00" />
                </linearGradient>
                <radialGradient id="innerCorona" cx="50%" cy="50%">
                  <stop offset="70%" stopColor="#FFE39A" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FFE39A" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#solarGrad)" 
              />
              
              {/* Inner corona (contained within body) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={20} fill="url(#innerCorona)" />
                {/* Inner solar flares */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M${32 + Math.cos(i * Math.PI / 3) * 18} ${34 + Math.sin(i * Math.PI / 3) * 18} L${32 + Math.cos(i * Math.PI / 3) * 22} ${34 + Math.sin(i * Math.PI / 3) * 20}`}
                    stroke="#FFE39A"
                    strokeWidth="1"
                    opacity={0.6}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.4,
                      repeatDelay: 3,
                      delay: i*0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.g>
              
              {/* Photonic dots (contained) */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + (i*4)%24}
                  cy={20 + (i*6)%24}
                  r={0.5}
                  fill="#FFE39A"
                  opacity={0.6}
                  animate={{
                    x: [0, 2, 0],
                    y: [0, -1, 0],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (i%3)*1,
                    delay: i*0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          )}

          {skin.id === "solar_crown_2" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Solar gradient - deeper and more intense */}
              <defs>
                <linearGradient id="solarGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF8C00" />
                  <stop offset="50%" stopColor="#FFB200" />
                  <stop offset="100%" stopColor="#FF4500" />
                </linearGradient>
                <radialGradient id="innerCorona2" cx="50%" cy="50%">
                  <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="80%" stopColor="#FFE39A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#solarGrad2)" 
              />
              
              {/* Intense inner corona (contained within body) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={18} fill="url(#innerCorona2)" />
                {/* Counter-rotating inner solar flares */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M${32 + Math.cos(i * Math.PI / 4) * 16} ${34 + Math.sin(i * Math.PI / 4) * 16} L${32 + Math.cos(i * Math.PI / 4) * 20} ${34 + Math.sin(i * Math.PI / 4) * 18}`}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    opacity={0.7}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      repeatDelay: 2,
                      delay: i*0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.g>
              
              {/* Intense photonic dots (contained) */}
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*6)%28}
                  cy={18 + (i*4)%28}
                  r={0.7}
                  fill="#FFFFFF"
                  opacity={0.8}
                  animate={{
                    scale: [0.8, 1.4, 0.8],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + (i%3)*0.5,
                    delay: i*0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          )}

          {skin.id === "moonlit_pool" && (
            <>
              {/* Deep navy base */}
              <defs>
                <pattern id="causticMesh" patternUnits="userSpaceOnUse" width="12" height="8">
                  <path d="M0,4 Q3,1 6,4 Q9,7 12,4" stroke="#BFD3FF" strokeWidth="0.5" fill="none" opacity="0.1" />
                </pattern>
                <filter id="moonlitBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0C1424" 
                filter="url(#moonlitBlur)"
                opacity={0.8}
              />
              
              {/* Caustic mesh */}
              <motion.rect
                x={10} y={14} width={44} height={40}
                fill="url(#causticMesh)"
                animate={{ 
                  transform: ["scale(1)", "scale(1.05)", "scale(1)"],
                  x: [10, 12, 10]
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              />
              
              {/* Sparse stars on top half */}
              {Array.from({ length: 10 }).map((_, i) => (
                i < 6 ? (
                  <motion.circle
                    key={i}
                    cx={16 + (i*6)%32}
                    cy={18 + (i*4)%12}
                    r={0.5}
                    fill="#BFD3FF"
                    opacity={0.7}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.2,
                      repeatDelay: 6,
                      delay: i*1.2,
                      ease: "easeInOut"
                    }}
                  />
                ) : null
              ))}
            </>
          )}

          {skin.id === "starlace" && (
            <>
              {/* Midnight gradient */}
              <defs>
                <linearGradient id="midnightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#13182B" />
                  <stop offset="100%" stopColor="#0D1122" />
                </linearGradient>
                <filter id="starlaceBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
                <linearGradient id="laceShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E7DAFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#E7DAFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E7DAFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#midnightGrad)" 
                filter="url(#starlaceBlur)"
                opacity={0.8}
              />
              
              {/* Lace filigree lines avoiding face */}
              <g opacity={0.3}>
                <path d="M15 20 Q20 18 25 20 Q30 22 35 20" stroke="#E7DAFF" strokeWidth="0.5" fill="none" />
                <path d="M20 45 Q25 43 30 45 Q35 47 40 45" stroke="#E7DAFF" strokeWidth="0.5" fill="none" />
                <path d="M15 35 Q18 32 20 35" stroke="#E7DAFF" strokeWidth="0.5" fill="none" />
                <path d="M44 35 Q46 32 49 35" stroke="#E7DAFF" strokeWidth="0.5" fill="none" />
              </g>
              
              {/* Shimmer wave */}
              <motion.rect
                x={10} y={14} width={4} height={40}
                fill="url(#laceShimmer)"
                opacity={0}
                animate={{ 
                  x: [10, 50],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  repeatDelay: 4,
                  ease: "easeInOut"
                }}
              />
              
              {/* Micro stars */}
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*5)%28}
                  cy={22 + (i*6)%20}
                  r={0.4}
                  fill="#E7DAFF"
                  opacity={0.5}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.15,
                    delay: i*0.3 + 1.5, // Sync with shimmer
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "eclipse" && (
            <>
              {/* Dark body */}
              <defs>
                <radialGradient id="eclipseRim" cx="50%" cy="50%">
                  <stop offset="80%" stopColor="#0A0A12" />
                  <stop offset="95%" stopColor="#5E6BFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F0F3FF" stopOpacity="0.5" />
                </radialGradient>
                <filter id="eclipseBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#eclipseRim)"
                filter="url(#eclipseBlur)"
                opacity={0.8}
                animate={{ 
                  scale: [1, 0.98, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Rim glow cycle */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="none"
                stroke="#5E6BFF"
                strokeWidth="2"
                opacity={0}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Orbiting glints */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={32 + Math.cos((i * 120 * Math.PI) / 180) * 28}
                  cy={34 + Math.sin((i * 120 * Math.PI) / 180) * 24}
                  r={1}
                  fill="#F0F3FF"
                  opacity={0.6}
                  animate={{
                    x: [
                      Math.cos((i * 120 * Math.PI) / 180) * 28,
                      Math.cos(((i * 120 + 360) * Math.PI) / 180) * 28
                    ],
                    y: [
                      Math.sin((i * 120 * Math.PI) / 180) * 24,
                      Math.sin(((i * 120 + 360) * Math.PI) / 180) * 24
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    delay: i*3.3,
                    ease: "linear"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "dragon_scale" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Dark base */}
              <defs>
                <pattern id="dragonScales" patternUnits="userSpaceOnUse" width="8" height="8">
                  <polygon points="4,0 8,3 4,6 0,3" fill="#3BE39A" opacity="0.2" stroke="#50E3E3" strokeWidth="0.3" />
                </pattern>
                <linearGradient id="scaleHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BA8CFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#50E3E3" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3BE39A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <defs>
                <filter id="dragonScaleBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#182022" 
                filter="url(#dragonScaleBlur)"
                opacity={0.8}
              />
              
              {/* Scale pattern */}
              <rect x={10} y={14} width={44} height={40} fill="url(#dragonScales)" />
              
              {/* Highlight sweep */}
              <motion.rect
                x={5} y={10} width={8} height={44}
                fill="url(#scaleHighlight)"
                opacity={0}
                animate={{ 
                  x: [5, 55],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut"
                }}
              />
              
              {/* Subtle hue shift */}
              <motion.rect
                x={10} y={14} width={44} height={40}
                fill="url(#dragonScales)"
                animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(8deg)", "hue-rotate(-8deg)", "hue-rotate(0deg)"] }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
              />
            </g>
          )}

          {skin.id === "auric_king" && (
            <>
              {/* Velvet base */}
              <defs>
                <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#221B0E" />
                  <stop offset="100%" stopColor="#1A150B" />
                </linearGradient>
                <radialGradient id="topGlow" cx="50%" cy="0%">
                  <stop offset="0%" stopColor="#FFDF7C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F4C957" stopOpacity="0" />
                </radialGradient>
                <filter id="auricBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              {/* Dark velvet base - GETS FEATHER BLUR */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#velvetGrad)" 
                filter="url(#auricBlur)"
                opacity={0.8}
              />
              
              {/* Top glow */}
              <ellipse cx={32} cy={20} rx={18} ry={10} fill="url(#topGlow)" />
              
              {/* Golden dust rain */}
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={16 + (i*3)%32}
                  cy={10}
                  r={i % 8 === 0 ? 2 : 1} // Rare 2px sparkles
                  fill={i % 8 === 0 ? "#FFDF7C" : "#F4C957"}
                  opacity={i % 8 === 0 ? 0 : 0.6}
                  animate={{
                    cy: [10, 55],
                    opacity: i % 8 === 0 ? [0, 1, 0] : [0.6, 0.3, 0],
                    scale: i % 8 === 0 ? [1, 1.3, 1] : 1
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: i % 8 === 0 ? 0.2 : 6 + (i%3)*1.5,
                    delay: i % 8 === 0 ? (i*2)%10 : (i*0.8)%6,
                    ease: i % 8 === 0 ? "easeOut" : "linear"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "glacial_core" && (
            <>
              {/* Ice gradient */}
              <defs>
                <linearGradient id="iceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A6E3FF" />
                  <stop offset="100%" stopColor="#6FBDE2" />
                </linearGradient>
                <radialGradient id="glacialCore" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#EFFFFF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#A6E3FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6FBDE2" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#iceGrad)" 
              />
              
              {/* Inner core pulse */}
              <motion.ellipse 
                cx={32} cy={34} rx={12} ry={10} 
                fill="url(#glacialCore)"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />
              
              {/* Crystalline cracks */}
              {[
                "M20 25 L28 32 L35 28",
                "M18 40 L25 35 L30 42",
                "M38 22 L42 28 L46 24"
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="#EFFFFF"
                  strokeWidth="0.5"
                  fill="none"
                  opacity={0.3}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    repeatDelay: 7,
                    delay: i*2,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Snow motes */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*6}
                  cy={50}
                  r={0.8}
                  fill="#EFFFFF"
                  opacity={0.7}
                  animate={{
                    cy: [50, 15],
                    opacity: [0.7, 0.3, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + (i%3)*2,
                    delay: i*1.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "stormcaller" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Squall gradient */}
              <defs>
                <linearGradient id="squallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1B2235" />
                  <stop offset="100%" stopColor="#2F3B55" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#squallGrad)" 
              />
              
              {/* Cloud puffs near top */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.ellipse
                  key={i}
                  cx={18 + i*12}
                  cy={20}
                  rx={6 + i}
                  ry={3}
                  fill="#2F3B55"
                  opacity={0.6}
                  animate={{ x: [0, 8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 12,
                    delay: i*2,
                    ease: "linear"
                  }}
                />
              ))}
              
              {/* Horizon haze strip */}
              <rect x={10} y={46} width={44} height={6} fill="#2F3B55" opacity={0.3} />
              
              {/* Distant bolt flashes */}
              <motion.path
                d="M42 22 L44 18 L46 22 L44 26"
                stroke="#E9F2FF"
                strokeWidth="1"
                fill="none"
                opacity={0}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.08,
                  repeatDelay: 15,
                  ease: "easeInOut"
                }}
              />
              
              {/* Afterglow */}
              <motion.circle
                cx={44}
                cy={22}
                r={3}
                fill="#E9F2FF"
                opacity={0}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.12,
                  repeatDelay: 15,
                  delay: 0.08,
                  ease: "easeOut"
                }}
              />
              
              {/* Drizzle dots */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*8}
                  cy={10}
                  r={0.5}
                  fill="#E9F2FF"
                  opacity={0.2}
                  animate={{
                    cy: [10, 50],
                    opacity: [0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + (i%2)*2,
                    delay: i*2,
                    ease: "linear"
                  }}
                />
              ))}
            </g>
          )}

          {skin.id === "chrono" && (
            <>
              {/* Charcoal gradient */}
              <defs>
                <linearGradient id="charcoalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#111317" />
                  <stop offset="100%" stopColor="#292E35" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#charcoalGrad)" 
              />
              
              {/* Tick rings */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={18} fill="none" stroke="#86E7FF" strokeWidth="1" opacity={0.4} />
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={i}
                    x1={32 + Math.cos((i * 30 * Math.PI) / 180) * 16}
                    y1={34 + Math.sin((i * 30 * Math.PI) / 180) * 16}
                    x2={32 + Math.cos((i * 30 * Math.PI) / 180) * 18}
                    y2={34 + Math.sin((i * 30 * Math.PI) / 180) * 18}
                    stroke="#86E7FF"
                    strokeWidth="0.5"
                    opacity={0.6}
                  />
                ))}
              </motion.g>
              
              {/* Second ring (faster) */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                <circle cx={32} cy={34} r={12} fill="none" stroke="#86E7FF" strokeWidth="0.5" opacity={0.6} />
                
                {/* Spark riding the ring */}
                <motion.circle
                  cx={32 + 12}
                  cy={34}
                  r={1}
                  fill="#86E7FF"
                  opacity={0.8}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                />
              </motion.g>
              
              {/* Time sparks */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + (i*6)%20}
                  cy={26 + (i*4)%16}
                  r={0.5}
                  fill="#86E7FF"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    delay: i*0.5,
                    repeatDelay: 1.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "mystwood" && (
            <>
              {/* Deep wood base */}
              <defs>
                <radialGradient id="woodVignette" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#182615" />
                  <stop offset="100%" stopColor="#0F1A0C" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#woodVignette)" 
              />
              
              {/* Floating leaves */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.ellipse
                  key={i}
                  cx={18 + (i*5)%28}
                  cy={20 + (i*6)%24}
                  rx={[3, 2, 4][i % 3]}
                  ry={[1.5, 1, 2][i % 3]}
                  fill="#6AAE5B"
                  opacity={0.7}
                  animate={{
                    y: [0, -4, 0],
                    x: [0, 3, 0],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + (i%3)*2,
                    delay: i*0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Wandering motes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + (i*6)%24}
                  cy={22 + (i*8)%20}
                  r={0.5 + (i%2)*0.3}
                  fill="#C7F3B8"
                  opacity={0.6}
                  animate={{
                    x: [0, 8, -4, 0],
                    y: [0, -6, 4, 0],
                    opacity: [0.6, 0.9, 0.3, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12 + (i%3)*3,
                    delay: i*2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "prismlord" && (
            <>
              {/* Light silver base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#E2E8F0" />
              
              {/* Rainbow shards */}
              {[
                { color: "#FF6B6B", x: 20, y: 25, angle: 30 },
                { color: "#FFD93D", x: 35, y: 22, angle: 60 },
                { color: "#6BCB77", x: 42, y: 35, angle: 90 },
                { color: "#4D96FF", x: 28, y: 42, angle: 120 },
                { color: "#C77DFF", x: 18, y: 38, angle: 150 }
              ].map((shard, i) => (
                <motion.g key={i}>
                  <motion.polygon
                    points={`${shard.x},${shard.y-3} ${shard.x+4},${shard.y} ${shard.x},${shard.y+3} ${shard.x-4},${shard.y}`}
                    fill={shard.color}
                    opacity={0.15}
                    transform={`rotate(${shard.angle} ${shard.x} ${shard.y})`}
                    animate={{
                      x: [0, 2, 0],
                      y: [0, -1, 0],
                      opacity: [0.15, 0.4, 0.15],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6 + (i%3)*2,
                      delay: i*1.2,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Refract flash */}
                  <motion.polygon
                    points={`${shard.x},${shard.y-3} ${shard.x+4},${shard.y} ${shard.x},${shard.y+3} ${shard.x-4},${shard.y}`}
                    fill={shard.color}
                    opacity={0}
                    transform={`rotate(${shard.angle} ${shard.x} ${shard.y})`}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.3,
                      repeatDelay: 8,
                      delay: i*2,
                      ease: "easeOut"
                    }}
                  />
                </motion.g>
              ))}
              
              {/* Micro glitters */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + (i*4)%20}
                  cy={28 + (i*6)%16}
                  r={0.3}
                  fill="#EEF6FF"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.2,
                    delay: i*0.8,
                    repeatDelay: 4,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "lotus_spirit" && (
            <>
              {/* Soft pink base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#E8B4CB" />
              
              {/* Center glow */}
              <defs>
                <radialGradient id="lotusCore" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FFF6D7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFF6D7" stopOpacity="0" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={8} ry={6} 
                fill="url(#lotusCore)"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut"
                }}
              />
              
              {/* Petal arcs */}
              {[
                { x: 32, y: 20, angle: 0 },
                { x: 40, y: 28, angle: 60 },
                { x: 40, y: 40, angle: 120 },
                { x: 32, y: 48, angle: 180 },
                { x: 24, y: 40, angle: 240 },
                { x: 24, y: 28, angle: 300 }
              ].map((petal, i) => (
                <motion.g key={i}>
                  <motion.ellipse
                    cx={petal.x}
                    cy={petal.y}
                    rx={6}
                    ry={3}
                    fill="url(#petalGrad)"
                    opacity={0}
                    transform={`rotate(${petal.angle} ${petal.x} ${petal.y})`}
                    animate={{
                      scale: [0, 1, 1, 0],
                      opacity: [0, 0.7, 0.7, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.6,
                      times: [0, 0.3, 0.7, 1],
                      repeatDelay: 4.4,
                      delay: i*0.1,
                      ease: "easeInOut"
                    }}
                  />
                </motion.g>
              ))}
              
              <defs>
                <linearGradient id="petalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4B5FF" />
                  <stop offset="100%" stopColor="#FFE2FF" />
                </linearGradient>
              </defs>
              
              {/* Pollen motes */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={28 + i*2}
                  cy={45}
                  r={0.5}
                  fill="#FFF6D7"
                  opacity={0.8}
                  animate={{
                    cy: [45, 20],
                    opacity: [0.8, 0.3, 0],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + (i%2)*2,
                    delay: i*1.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "obsidian_flame" && (
            <>
              <defs>
                <filter id="obsidianBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              {/* Near-black base - GETS FEATHER BLUR */}
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0A0A0A" 
                filter="url(#obsidianBlur)"
                opacity={0.8}
              />
              
              {/* Blackfire tongues */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${28 + i*2} 48 Q${30 + i*2} 35 ${26 + i*3} 22`}
                  stroke={i % 2 ? "#7A4DFF" : "#00D1FF"}
                  strokeWidth="2"
                  fill="none"
                  opacity={0.3}
                  filter="blur(1px)"
                  animate={{
                    pathLength: [0, 1, 0.8, 0],
                    opacity: [0, 0.5, 0.3, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2 + (i%3)*0.3,
                    delay: i*0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Color shift on edges */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="none"
                stroke="#7A4DFF"
                strokeWidth="1"
                opacity={0}
                animate={{ 
                  opacity: [0, 0.2, 0],
                  stroke: ["#7A4DFF", "#00D1FF", "#7A4DFF"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
              
              {/* Dark cinders rising */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={26 + i*4}
                  cy={50}
                  r={0.8}
                  fill="#4A4A4A"
                  opacity={0.6}
                  animate={{
                    cy: [50, 18],
                    opacity: [0.6, 0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + (i%2)*2,
                    delay: i*1.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {/* Universal clipPath for slime animations */}
          <defs>
            <clipPath id={`slime-body-clip-${skin.id}`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
          </defs>

          {skin.id === "starforge" && (
            <g clipPath={`url(#slime-body-clip-${skin.id})`}>
              {/* Forge base */}
              <defs>
                <linearGradient id="forgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4C1D1D" />
                  <stop offset="100%" stopColor="#3C1515" />
                </linearGradient>
                <radialGradient id="forgeBelly" cx="50%" cy="60%">
                  <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FFD089" stopOpacity="0.4" />
                </radialGradient>
                {/* Feather blur filter for dark interior edges */}
                <filter id="starforgeBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              
              {/* Dark interior - GETS FEATHER BLUR to soften edges */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#forgeGrad)" 
                filter="url(#starforgeBlur)"
                opacity={0.8}
              />
              
              {/* Anvil silhouette hint */}
              <rect x={26} y={48} width={12} height={4} fill="#4C1D1D" opacity={0.05} />
              
              {/* Belly glow bloom - NO BLUR */}
              <motion.ellipse 
                cx={32} cy={40} rx={12} ry={8} 
                fill="url(#forgeBelly)"
                animate={{ 
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.3,
                  repeatDelay: 2.2,
                  ease: "easeOut"
                }}
              />
              
              {/* Hammer sparks burst - STAY CRISP */}
              <motion.g
                animate={{
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.2,
                  repeatDelay: 2.3,
                  ease: "easeOut"
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={32 + Math.cos(i * Math.PI / 4) * 6}
                    cy={34 + Math.sin(i * Math.PI / 4) * 6}
                    r={1}
                    fill={i % 2 ? "#FF8A3D" : "#FFD089"}
                    animate={{
                      x: [0, Math.cos(i * Math.PI / 4) * 12],
                      y: [0, Math.sin(i * Math.PI / 4) * 12]
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.g>
            </g>
          )}

          {skin.id === "aurora_crown" && (
            <>
              {/* Cyan base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#67E8F9" />
              
              {/* Aurora band above eyes */}
              <defs>
                <linearGradient id="auroraFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#88F7F1" />
                  <stop offset="50%" stopColor="#85F78B" />
                  <stop offset="100%" stopColor="#B287FF" />
                </linearGradient>
              </defs>
              <motion.path
                d="M15 24 Q32 20 49 24"
                stroke="url(#auroraFlow)"
                strokeWidth="3"
                fill="none"
                opacity={0.7}
                animate={{
                  strokeDasharray: ["0 100", "50 50", "100 0"],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Vertical curtains behind */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.rect
                  key={i}
                  x={18 + i*8}
                  y={14}
                  width={2}
                  height={20}
                  fill={["#88F7F1", "#85F78B", "#B287FF", "#88F7F1"][i]}
                  opacity={0.2}
                  animate={{
                    height: [20, 24, 20],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    delay: i*0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Starlets above band */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*6}
                  cy={18}
                  r={0.5}
                  fill="#F5FBFF"
                  opacity={0.8}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    delay: i*0.6,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "runebloom" && (
            <>
              <defs>
                {/* Feather blur filter for dark interior edges */}
                <filter id="runebloomBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              
              {/* Dark purple interior - GETS FEATHER BLUR to soften edges */}
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#2D1B4E" 
                filter="url(#runebloomBlur)"
                opacity={0.8}
              />
              
              {/* Glyph paths - STAY CRISP, NO BLUR */}
              {[
                { d: "M20 25 L22 22 L24 25 L22 28 Z", x: 20, y: 25 },
                { d: "M38 30 Q40 28 42 30 Q40 32 38 30", x: 40, y: 30 },
                { d: "M25 42 L27 40 L29 42 M27 40 L27 44", x: 27, y: 42 },
                { d: "M35 20 Q37 18 39 20 L37 22 Z", x: 37, y: 20 },
                { d: "M18 35 L20 33 L22 35 L20 37 L18 35", x: 20, y: 35 },
                { d: "M42 42 Q44 40 46 42 Q44 44 42 42", x: 44, y: 42 }
              ].map((glyph, i) => (
                <motion.path
                  key={i}
                  d={glyph.d}
                  stroke="#B794F6"
                  strokeWidth="1"
                  fill="none"
                  opacity={0.12}
                  animate={{
                    scale: [0.9, 1.05, 1],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatDelay: 5,
                    delay: i*1,
                    ease: "easeInOut"
                  }}
                  style={{ transformOrigin: `${glyph.x}px ${glyph.y}px` }}
                />
              ))}
              
              {/* Drifting sigil dots - STAY CRISP, NO BLUR */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={24 + i*8}
                  cy={50}
                  r={0.8}
                  fill="#E1F8FF"
                  opacity={0.5}
                  animate={{
                    cy: [50, 20],
                    x: [0, 3, -2, 0],
                    opacity: [0.5, 0.8, 0.3, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12 + i*2,
                    delay: i*4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "solaris" && (
            <>
              {/* Bright solar gradient */}
              <defs>
                <linearGradient id="solarisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFDA6A" />
                  <stop offset="100%" stopColor="#FFAF45" />
                </linearGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#solarisGrad)" 
              />
              
              {/* Sunspots */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                style={{ transformOrigin: "32px 34px" }}
              >
                {[
                  { x: 25, y: 28, r: 3 },
                  { x: 38, y: 38, r: 2 },
                  { x: 30, y: 45, r: 2.5 }
                ].map((spot, i) => (
                  <ellipse
                    key={i}
                    cx={spot.x}
                    cy={spot.y}
                    rx={spot.r}
                    ry={spot.r - 0.5}
                    fill="#8C5A24"
                    opacity={0.4}
                  />
                ))}
              </motion.g>
              
              {/* Magnetic arcs */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${22 + i*8} ${26 + i*4} Q${30 + i*4} ${20 + i*2} ${38 + i*2} ${28 + i*3}`}
                  stroke="#FFDA6A"
                  strokeWidth="1"
                  fill="none"
                  opacity={0}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    repeatDelay: 4,
                    delay: i*1.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Tiny photons */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*6)%28}
                  cy={20 + (i*8)%24}
                  r={0.5}
                  fill="#FFDA6A"
                  opacity={0.7}
                  animate={{
                    x: [0, 3, -2, 0],
                    y: [0, -2, 1, 0],
                    opacity: [0.7, 1, 0.4, 0.7]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + (i%3)*1,
                    delay: i*0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "nocturne" && (
            <>
              {/* Core darkness */}
              <defs>
                <radialGradient id="nocturneRim" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#07070B" />
                  <stop offset="85%" stopColor="#07070B" />
                  <stop offset="100%" stopColor="#6AF7FF" stopOpacity="0.8" />
                </radialGradient>
              </defs>
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#nocturneRim)"
                animate={{ 
                  filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
              
              {/* Neon rim pulse */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="none"
                stroke="#6AF7FF"
                strokeWidth="2"
                opacity={0.6}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  stroke: ["#6AF7FF", "#9A7CFF", "#6AF7FF"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
              
              {/* Hue shift */}
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#nocturneRim)"
                animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(6deg)", "hue-rotate(-6deg)", "hue-rotate(0deg)"] }}
                transition={{
                  repeat: Infinity,
                  duration: 12,
                  ease: "easeInOut"
                }}
              />
              
              {/* Neon specks flicker */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + (i*6)%20}
                  cy={26 + (i*8)%16}
                  r={0.5}
                  fill="#6AF7FF"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.12,
                    delay: i*1.5,
                    repeatDelay: 3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "comet_choir" && (
            <>
              {/* Deep space base */}
              <defs>
                <filter id="cometChoirBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0B0E18" 
                filter="url(#cometChoirBlur)"
                opacity={0.8}
              />
              
              {/* Background starfield */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={`star-${i}`}
                  cx={16 + (i*6)%32}
                  cy={18 + (i*8)%28}
                  r={0.3}
                  fill="#CFE7FF"
                  opacity={0.6}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.15,
                    delay: i*0.8,
                    repeatDelay: 4,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Comet streaks */}
              <motion.g>
                {/* First comet path */}
                <motion.g
                  animate={{
                    x: [-20, 84],
                    y: [10, 40]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.9,
                    repeatDelay: 3.5,
                    ease: "easeInOut"
                  }}
                >
                  <circle cx={0} cy={0} r={1.5} fill="#99C8FF" />
                  <motion.path
                    d="M0 0 L-8 -2 L-12 0 L-8 2 Z"
                    fill="url(#cometTail1)"
                    animate={{ opacity: [0, 0.8, 0.3] }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.g>
                
                {/* Second comet path */}
                <motion.g
                  animate={{
                    x: [84, -20],
                    y: [20, 50]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    repeatDelay: 4,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                >
                  <circle cx={0} cy={0} r={1.2} fill="#CFE7FF" />
                  <motion.path
                    d="M0 0 L8 -1 L12 0 L8 1 Z"
                    fill="url(#cometTail2)"
                    animate={{ opacity: [0, 0.8, 0.3] }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </motion.g>
              </motion.g>
              
              <defs>
                <linearGradient id="cometTail1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#99C8FF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#99C8FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cometTail2" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#CFE7FF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#CFE7FF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </>
          )}

          {/* EPIC SLIMES - DETAILED IMPLEMENTATIONS */}
          {skin.id === "lava_flow" && (
            <>
              {/* Base gradient */}
              <defs>
                <linearGradient id="lavaBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3A1D0E" />
                  <stop offset="100%" stopColor="#200E08" />
                </linearGradient>
                <filter id="lavaBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
                </filter>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#lavaBase)" />
              
              {/* Lava rivers */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${20 + i*6} 15 Q${25 + i*4} ${25 + i*3} ${22 + i*5} ${35 + i*4} Q${28 + i*3} ${45 + i*2} ${24 + i*4} 55`}
                  stroke={i % 2 ? "#FF6A00" : "#FFB347"}
                  strokeWidth={6 + i*2}
                  fill="none"
                  filter="url(#lavaBlur)"
                  opacity={0.6}
                  animate={{
                    strokeDasharray: ["0 100", "50 50", "100 0"],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + i*0.5,
                    ease: "linear"
                  }}
                />
              ))}
              
              {/* Tiny embers */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + i*8}
                  cy={50}
                  r={1}
                  fill="#FFC97A"
                  opacity={0.5}
                  animate={{
                    cy: [50, 18],
                    opacity: [0.5, 0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + i*1,
                    delay: i*2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "aurora_veil" && (
            <>
              {/* Deep night base */}
              <defs>
                <filter id="auroraVeilBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#101424" 
                filter="url(#auroraVeilBlur)"
                opacity={0.8}
              />
              
              {/* Aurora curtains */}
              <defs>
                <linearGradient id="auroraCurtain1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#88F7F1" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#88F7F1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#88F7F1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="auroraCurtain2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7CF79F" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#7CF79F" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#7CF79F" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <motion.rect
                x={18} y={14} width={8} height={40}
                fill="url(#auroraCurtain1)"
                animate={{ 
                  x: [18, 22, 18],
                  filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(-10deg)", "hue-rotate(0deg)"]
                }}
                transition={{ 
                  x: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                  filter: { repeat: Infinity, duration: 12, ease: "easeInOut" }
                }}
              />
              <motion.rect
                x={38} y={14} width={8} height={40}
                fill="url(#auroraCurtain2)"
                animate={{ 
                  x: [38, 34, 38],
                  filter: ["hue-rotate(0deg)", "hue-rotate(-10deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"]
                }}
                transition={{ 
                  x: { repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 },
                  filter: { repeat: Infinity, duration: 12, ease: "easeInOut", delay: 3 }
                }}
              />
              
              {/* Micro stars */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*8}
                  cy={22 + (i%2)*12}
                  r={0.5}
                  fill="#EAF6FF"
                  opacity={0.4}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + i*0.5,
                    delay: i*0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "ocean_drift" && (
            <>
              {/* Sea gradient */}
              <defs>
                <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0E3A4D" />
                  <stop offset="100%" stopColor="#062531" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#seaGrad)" />
              
              {/* Wave bands */}
              <motion.path
                d="M10 28 Q20 26 30 28 Q40 30 50 28"
                stroke="#9FE8FF"
                strokeWidth="1"
                fill="none"
                opacity={0.15}
                animate={{ x: [0, 12, 0], y: [0, -1, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              />
              <motion.path
                d="M10 38 Q25 36 35 38 Q45 40 55 38"
                stroke="#9FE8FF"
                strokeWidth="1"
                fill="none"
                opacity={0.12}
                animate={{ x: [0, 10, 0], y: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              />
              
              {/* Rising bubbles */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*8}
                  cy={50}
                  r={1 + (i%2)}
                  fill="#9FE8FF"
                  opacity={0.4}
                  animate={{
                    cy: [50, 18],
                    opacity: [0.4, 0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + i*1,
                    delay: i*1.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "breathing_jelly" && (
            <>
              {/* Jelly gradient */}
              <defs>
                <linearGradient id="jellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8ED7FF" />
                  <stop offset="100%" stopColor="#69B8FF" />
                </linearGradient>
                <radialGradient id="jellyCore" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              <motion.ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="url(#jellyGrad)"
                animate={{ scale: [0.99, 1.01, 0.99] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              />
              
              {/* Inner core */}
              <motion.ellipse 
                cx={32} cy={34} rx={12} ry={10} 
                fill="url(#jellyCore)"
                animate={{ 
                  scale: [0.99, 1.01, 0.99],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              />
            </>
          )}

          {skin.id === "glow_pulse" && (
            <>
              {/* Base dark */}
              <defs>
                <filter id="rainfallBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#1B1F2B" 
                filter="url(#rainfallBlur)"
                opacity={0.8}
              />
              
              {/* Outer rim glow */}
              <defs>
                <radialGradient id="glowRim" cx="50%" cy="50%">
                  <stop offset="85%" stopColor="#1B1F2B" />
                  <stop offset="100%" stopColor="#7CD6FF" stopOpacity="0.06" />
                </radialGradient>
              </defs>
              
              <motion.ellipse 
                cx={32} cy={34} rx={24} ry={22} 
                fill="url(#glowRim)"
                animate={{ 
                  filter: ["brightness(1)", "brightness(3)", "brightness(1)"]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />
            </>
          )}

          {skin.id === "rainfall" && (
            <>
              {/* Storm base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#2A3247" />
              
              {/* Rain drops */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={16 + (i*8)%32}
                  cy={10}
                  r={1}
                  fill="#BFD4FF"
                  opacity={0.6}
                  animate={{
                    cy: [10, 50],
                    x: [0, (i%2 ? 2 : -2), 0],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + (i%3)*1,
                    delay: (i*0.8)%5,
                    ease: "linear"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "spark_run" && (
            <>
              {/* Charcoal base */}
              <defs>
                <filter id="sparkRunBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#111318" 
                filter="url(#sparkRunBlur)"
                opacity={0.8}
              />
              
              {/* Diagonal streak guide */}
              <path 
                d="M15 40 L45 20" 
                stroke="#FFD166" 
                strokeWidth="1" 
                opacity={0.02}
              />
              
              {/* Moving spark dash */}
              <motion.g
                animate={{
                  x: [0, 30],
                  y: [0, -20],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.25,
                  repeatDelay: 2.5,
                  ease: "easeOut"
                }}
              >
                <circle cx={15} cy={40} r={2} fill="#FFD166" />
                <path 
                  d="M15 40 L10 42" 
                  stroke="#F7B801" 
                  strokeWidth="1" 
                  opacity={0.8}
                />
              </motion.g>
            </>
          )}

          {skin.id === "magneto" && (
            <>
              {/* Dark steel base */}
              <defs>
                <filter id="magnetoBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#1C2230" 
                filter="url(#magnetoBlur)"
                opacity={0.8}
              />
              
              {/* Ripple rings */}
              <motion.circle
                cx={32} cy={34} r={8}
                fill="none"
                stroke="#6ECBF5"
                strokeWidth="1"
                opacity={0}
                animate={{
                  r: [8, 20],
                  opacity: [0.4, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  repeatDelay: 5.5,
                  ease: "easeOut"
                }}
              />
              
              {/* Secondary ripple */}
              <motion.circle
                cx={32} cy={34} r={8}
                fill="none"
                stroke="#6ECBF5"
                strokeWidth="1"
                opacity={0}
                animate={{
                  r: [8, 16],
                  opacity: [0.2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4,
                  repeatDelay: 5.6,
                  delay: 0.1,
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {skin.id === "bubble_rise" && (
            <>
              {/* Aqua gradient */}
              <defs>
                <linearGradient id="aquaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6DDAD3" />
                  <stop offset="100%" stopColor="#46C0B7" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#aquaGrad)" />
              
              {/* Rising bubbles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*4)%28}
                  cy={45}
                  r={2 + (i%4)}
                  fill="#FFFFFF"
                  opacity={0.6}
                  animate={{
                    cy: [45, 18],
                    scale: [1, 1.2, 0],
                    opacity: [0.6, 0.8, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (i%3)*1,
                    delay: (i*0.4)%3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "tidepool" && (
            <>
              {/* Teal gradient */}
              <defs>
                <linearGradient id="tidepoolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1D7573" />
                  <stop offset="100%" stopColor="#0F4B4A" />
                </linearGradient>
                <radialGradient id="tidalSwirl" cx="50%" cy="85%">
                  <stop offset="0%" stopColor="#5AE1D8" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#5AE1D8" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#tidepoolGrad)" />
              
              {/* Bottom swirl */}
              <motion.ellipse 
                cx={32} cy={45} rx={16} ry={8} 
                fill="url(#tidalSwirl)"
                animate={{ 
                  rotate: 360,
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 12, ease: "linear" },
                  scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                }}
                style={{ transformOrigin: "32px 45px" }}
              />
              
              {/* Sand specks */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + i*12}
                  cy={48}
                  r={0.5}
                  fill="#5AE1D8"
                  opacity={0.4}
                  animate={{
                    x: [0, 8, 0],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + i*2,
                    delay: i*2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "wind_ripple" && (
            <>
              {/* Sky slate gradient */}
              <defs>
                <linearGradient id="skySlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9EC7FF" />
                  <stop offset="100%" stopColor="#6AA6FF" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#skySlateGrad)" />
              
              {/* Diagonal ribs */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.rect
                  key={i}
                  x={15 + i*10}
                  y={20}
                  width={2}
                  height={28}
                  fill="#FFFFFF"
                  opacity={0.1}
                  transform={`rotate(20 ${16 + i*10} 34)`}
                  animate={{
                    x: [15 + i*10, 25 + i*10, 15 + i*10]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    delay: i*2,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Dust motes */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + i*8}
                  cy={26 + i*6}
                  r={0.5}
                  fill="#FFFFFF"
                  opacity={0.3}
                  animate={{
                    x: [0, 4, 0],
                    y: [0, -2, 0],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + i*2,
                    delay: i*1.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "comet_streak" && (
            <>
              {/* Night base */}
              <defs>
                <filter id="cometStreakBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0D111C" 
                filter="url(#cometStreakBlur)"
                opacity={0.8}
              />
              
              {/* Static stars */}
              {Array.from({ length: 3 }).map((_, i) => (
                <circle
                  key={i}
                  cx={18 + i*14}
                  cy={22 + (i%2)*12}
                  r={0.5}
                  fill="#BEE3FF"
                  opacity={0.6}
                />
              ))}
              
              {/* Comet streak */}
              <motion.g
                animate={{
                  x: [-15, 35],
                  y: [15, -10],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  repeatDelay: 7,
                  ease: "easeInOut"
                }}
              >
                <circle cx={15} cy={25} r={1.5} fill="#BEE3FF" />
                <path 
                  d="M15 25 L8 28 L10 25 L8 22 Z" 
                  fill="#BEE3FF" 
                  opacity={0.6}
                />
              </motion.g>
            </>
          )}

          {skin.id === "ember_bed" && (
            <>
              {/* Coal base */}
              <defs>
                <linearGradient id="coalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#231816" />
                  <stop offset="80%" stopColor="#231816" />
                  <stop offset="100%" stopColor="#FFB36A" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#coalGrad)" />
              
              {/* Ember twinkles */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*6)%28}
                  cy={40 + (i%3)*4}
                  r={1}
                  fill="#FFB36A"
                  opacity={0.2}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.25,
                    delay: Math.random() * 5,
                    repeatDelay: 2 + Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "crystal_shine" && (
            <>
              {/* Crystal gradient */}
              <defs>
                <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#AEE3FF" />
                  <stop offset="100%" stopColor="#7AC2E7" />
                </linearGradient>
                <linearGradient id="crystalSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E6FAFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#E6FAFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E6FAFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#crystalGrad)" />
              
              {/* Crystal facets */}
              {[
                "M20 25 L25 20 L30 25 L25 30 Z",
                "M35 30 L40 25 L45 30 L40 35 Z", 
                "M25 40 L30 35 L35 40 L30 45 Z",
                "M15 35 L20 30 L25 35 L20 40 Z"
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="#E6FAFF"
                  opacity={0.08}
                  animate={{ opacity: [0.08, 0.3, 0.08] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    delay: i*2,
                    repeatDelay: 7.7,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Light sweep */}
              <motion.rect
                x={10} y={14} width={6} height={40}
                fill="url(#crystalSweep)"
                opacity={0}
                animate={{ 
                  x: [10, 48],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "linear"
                }}
              />
            </>
          )}

          {skin.id === "heartbeat" && (
            <>
              {/* Berry gradient */}
              <defs>
                <linearGradient id="berryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7C2F58" />
                  <stop offset="100%" stopColor="#561F3C" />
                </linearGradient>
                <radialGradient id="heartGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FF69B4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#berryGrad)" />
              
              {/* Heart glow */}
              <motion.ellipse 
                cx={32} cy={34} rx={8} ry={6} 
                fill="url(#heartGlow)"
                animate={{ 
                  scale: [0.98, 1.02, 0.98],
                  opacity: [0.1, 0.25, 0.1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.9,
                  repeatDelay: 1.6,
                  ease: "easeInOut" 
                }}
              />
            </>
          )}

          {skin.id === "sunshower" && (
            <>
              {/* Air base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#C6E7FF" />
              
              {/* Rays emanating from top */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${26 + i*2} 18 L${24 + i*2} 10`}
                  stroke="#FFE794"
                  strokeWidth="1"
                  opacity={0}
                  animate={{ opacity: [0, 0.25, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i*0.1,
                    repeatDelay: 3.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Falling bright dots */}
              {Array.from({ length: 2 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={28 + i*8}
                  cy={15}
                  r={0.5}
                  fill="#FFE794"
                  opacity={0.8}
                  animate={{
                    cy: [15, 50],
                    opacity: [0.8, 0.4, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + i*1,
                    delay: i*2,
                    ease: "linear"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "snow_drift" && (
            <>
              {/* Dusk gradient */}
              <defs>
                <linearGradient id="duskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#132033" />
                  <stop offset="100%" stopColor="#0C1626" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#duskGrad)" />
              
              {/* Swaying snowflakes */}
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={18 + (i*6)%28}
                  cy={10}
                  r={1 + (i%2)*0.5}
                  fill="#FFFFFF"
                  opacity={0.8}
                  animate={{
                    cy: [10, 55],
                    x: [0, 4, -2, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 7 + (i%3)*1,
                    delay: (i*1.2)%6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "will_o_glow" && (
            <>
              {/* Night forest base */}
              <defs>
                <filter id="willOGlowBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0E1C14" 
                filter="url(#willOGlowBlur)"
                opacity={0.8}
              />
              
              {/* Fairy orbs */}
              {[
                { x: 22, y: 26, color: "#8FF7D0" },
                { x: 38, y: 30, color: "#D6FF9A" },
                { x: 28, y: 40, color: "#8FF7D0" },
                { x: 42, y: 42, color: "#D6FF9A" },
                { x: 20, y: 38, color: "#8FF7D0" }
              ].map((orb, i) => (
                <motion.circle
                  key={i}
                  cx={orb.x}
                  cy={orb.y}
                  r={3 + (i%2)}
                  fill={orb.color}
                  opacity={0.1}
                  filter="blur(2px)"
                  animate={{
                    x: [0, 3, -2, 0],
                    y: [0, -2, 1, 0],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + i*2,
                    delay: i*1.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Orb pulses */}
              {[
                { x: 22, y: 26, color: "#8FF7D0" },
                { x: 38, y: 30, color: "#D6FF9A" },
                { x: 28, y: 40, color: "#8FF7D0" }
              ].map((orb, i) => (
                <motion.circle
                  key={`pulse-${i}`}
                  cx={orb.x}
                  cy={orb.y}
                  r={2}
                  fill={orb.color}
                  opacity={0.3}
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i*1.5,
                    repeatDelay: 4.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "vine_crawl" && (
            <>
              {/* Olive gradient */}
              <defs>
                <linearGradient id="oliveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#415A31" />
                  <stop offset="100%" stopColor="#2C3E23" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#oliveGrad)" />
              
              {/* Vine paths */}
              <motion.g
                animate={{ 
                  y: [0, -20, 0],
                  x: [0, 2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut"
                }}
              >
                <path 
                  d="M12 50 Q14 40 16 30 Q18 20 20 15" 
                  stroke="#79A85D" 
                  strokeWidth="1" 
                  fill="none" 
                  opacity={0.6}
                />
                <path 
                  d="M50 45 Q48 35 46 25 Q44 18 42 12" 
                  stroke="#79A85D" 
                  strokeWidth="1" 
                  fill="none" 
                  opacity={0.6}
                />
                
                {/* Leaves */}
                <motion.ellipse 
                  cx={16} cy={25} rx={2} ry={1} 
                  fill="#79A85D" 
                  opacity={0.7}
                  animate={{ rotate: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <motion.ellipse 
                  cx={46} cy={30} rx={2} ry={1} 
                  fill="#79A85D" 
                  opacity={0.7}
                  animate={{ rotate: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                />
              </motion.g>
            </>
          )}

          {skin.id === "galaxy_swirl" && (
            <>
              {/* Deep space base */}
              <defs>
                <filter id="galaxySwirlBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#12152B" 
                filter="url(#galaxySwirlBlur)"
                opacity={0.8}
              />
              
              {/* Spiral overlay */}
              <defs>
                <radialGradient id="galaxySpiral" cx="50%" cy="50%">
                  <stop offset="20%" stopColor="#8B7CFF" stopOpacity="0.12" />
                  <stop offset="60%" stopColor="#8B7CFF" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              <motion.ellipse 
                cx={32} cy={34} rx={18} ry={15} 
                fill="url(#galaxySpiral)"
                animate={{ 
                  rotate: 360,
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                  scale: { repeat: Infinity, duration: 16, ease: "easeInOut" }
                }}
                style={{ transformOrigin: "32px 34px" }}
              />
              
              {/* Tiny stars */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={20 + (i*6)%24}
                  cy={26 + (i*8)%16}
                  r={0.3}
                  fill="#EEF3FF"
                  opacity={0.4}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5 + i*0.5,
                    delay: i*0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "jelly_ripple" && (
            <>
              {/* Cyan jelly gradient */}
              <defs>
                <linearGradient id="jellyRippleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7FE4FF" />
                  <stop offset="100%" stopColor="#5ACAF0" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#jellyRippleGrad)" />
              
              {/* Ripple rings */}
              <motion.circle
                cx={32} cy={34} r={8}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity={0}
                animate={{
                  r: [8, 18],
                  opacity: [0.3, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  repeatDelay: 6.4,
                  ease: "easeOut"
                }}
              />
              
              {/* Secondary ripple */}
              <motion.circle
                cx={32} cy={34} r={8}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity={0}
                animate={{
                  r: [8, 14],
                  opacity: [0.2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  repeatDelay: 6.5,
                  delay: 0.15,
                  ease: "easeOut"
                }}
              />
              
              {/* Idle tiny ripple */}
              <motion.circle
                cx={32} cy={34} r={12}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.5"
                opacity={0}
                animate={{
                  r: [12, 16],
                  opacity: [0.1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  repeatDelay: 6,
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {skin.id === "mirror_gleam" && (
            <>
              {/* Slate base */}
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="#2A2F3A" />
              
              {/* Moving gleam band */}
              <defs>
                <linearGradient id="mirrorGleam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8F2FF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#E8F2FF" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#E8F2FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <motion.rect
                x={5} y={10} width={8} height={48}
                fill="url(#mirrorGleam)"
                transform="rotate(20 32 34)"
                opacity={0.06}
                animate={{ 
                  x: [5, 55],
                  opacity: [0.06, 0.16, 0.06]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5.5,
                  ease: "easeInOut"
                }}
              />
            </>
          )}

          {skin.id === "magma_vein" && (
            <>
              {/* Basalt base */}
              <defs>
                <filter id="magmaVeinBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#1A1412" 
                filter="url(#magmaVeinBlur)"
                opacity={0.8}
              />
              
              {/* Branching veins */}
              {[
                { path: "M20 45 Q25 35 30 25 L35 20", delay: 0 },
                { path: "M25 25 L30 22 L35 18", delay: 0.3 },
                { path: "M30 25 Q35 30 40 35 L45 40", delay: 0.6 },
                { path: "M35 35 L40 38 L45 42", delay: 0.9 }
              ].map((vein, i) => (
                <motion.g key={i}>
                  <motion.path
                    d={vein.path}
                    stroke="#FF7A3D"
                    strokeWidth="2"
                    fill="none"
                    opacity={0.4}
                    animate={{ 
                      opacity: [0.4, 0.8, 0.4],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: vein.delay,
                      repeatDelay: 6,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.path
                    d={vein.path}
                    stroke="#FFC49E"
                    strokeWidth="1"
                    fill="none"
                    opacity={0.2}
                    animate={{ 
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: vein.delay,
                      repeatDelay: 6,
                      ease: "easeInOut"
                    }}
                  />
                </motion.g>
              ))}
              
              {/* Micro sparks on tips */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={[35, 35, 45][i]}
                  cy={[20, 18, 42][i]}
                  r={0.5}
                  fill="#FFD089"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.15,
                    delay: i*0.3 + 1.5,
                    repeatDelay: 7.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "frost_breath" && (
            <>
              {/* Arctic gradient */}
              <defs>
                <linearGradient id="arcticGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0E2030" />
                  <stop offset="100%" stopColor="#18354A" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#arcticGrad)" />
              
              {/* Frost puffs near mouth */}
              <motion.g
                animate={{
                  scale: [0, 1, 1.2],
                  y: [0, -10],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  repeatDelay: 5.3,
                  ease: "easeOut"
                }}
              >
                <ellipse cx={28} cy={38} rx={4} ry={2} fill="#BFE9FF" opacity={0.3} filter="blur(1px)" />
                <ellipse cx={36} cy={40} rx={3} ry={1.5} fill="#BFE9FF" opacity={0.2} filter="blur(1px)" />
                
                {/* Motes in puff */}
                <circle cx={30} cy={38} r={0.5} fill="#BFE9FF" opacity={0.6} />
                <circle cx={34} cy={39} r={0.3} fill="#BFE9FF" opacity={0.5} />
                <circle cx={32} cy={36} r={0.4} fill="#BFE9FF" opacity={0.7} />
              </motion.g>
            </>
          )}

          {skin.id === "sand_sift" && (
            <>
              {/* Sand gradient */}
              <defs>
                <linearGradient id="sandSiftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EED9B7" />
                  <stop offset="100%" stopColor="#DCC39F" />
                </linearGradient>
                <pattern id="sandSpeckle" patternUnits="userSpaceOnUse" width="8" height="8">
                  <circle cx="2" cy="2" r="0.5" fill="#C8A97C" opacity="0.08" />
                  <circle cx="6" cy="4" r="0.3" fill="#C8A97C" opacity="0.06" />
                  <circle cx="4" cy="6" r="0.4" fill="#C8A97C" opacity="0.1" />
                </pattern>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#sandSiftGrad)" />
              
              {/* Dense speckle on bottom 30% */}
              <motion.rect
                x={10} y={42} width={44} height={12}
                fill="url(#sandSpeckle)"
                animate={{ x: [10, 16, 10] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
              
              {/* Floating specks */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={22 + i*8}
                  cy={40 + i*3}
                  r={0.5}
                  fill="#C8A97C"
                  opacity={0.4}
                  animate={{
                    x: [0, 6, 0],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + i*2,
                    delay: i*2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "ink_bloom" && (
            <>
              {/* Ink base */}
              <defs>
                <filter id="inkBloomBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#12131A" 
                filter="url(#inkBloomBlur)"
                opacity={0.8}
              />
              
              {/* Bloom gradient */}
              <defs>
                <radialGradient id="inkBloom" cx="45%" cy="40%">
                  <stop offset="0%" stopColor="#5B6BFF" stopOpacity="0.12" />
                  <stop offset="60%" stopColor="#6BE5FF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              <motion.ellipse 
                cx={35} cy={30} rx={8} ry={12} 
                fill="url(#inkBloom)"
                animate={{ 
                  scale: [0.5, 1.3, 0.5],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatDelay: 7.8,
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {skin.id === "lightning_wink" && (
            <>
              {/* Storm base */}
              <defs>
                <filter id="lightningWinkBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0F172A" 
                filter="url(#lightningWinkBlur)"
                opacity={0.8}
              />
              
              {/* Lightning forks */}
              {[
                { path: "M25 22 L28 18 L26 16", delay: 0 },
                { path: "M40 28 L37 24 L39 22", delay: 0.1 }
              ].map((fork, i) => (
                <motion.path
                  key={i}
                  d={fork.path}
                  stroke="#DDF1FF"
                  strokeWidth="1"
                  fill="none"
                  opacity={0}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.08,
                    delay: fork.delay,
                    repeatDelay: 5,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Afterglow */}
              <motion.circle
                cx={26} cy={20}
                r={3}
                fill="#DDF1FF"
                opacity={0}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.12,
                  delay: 0.08,
                  repeatDelay: 5,
                  ease: "easeOut"
                }}
              />
              
              {/* Micro sparks */}
              {Array.from({ length: 2 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={28 + i*3}
                  cy={20 + i*2}
                  r={0.3}
                  fill="#DDF1FF"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.1,
                    delay: i*0.05 + 0.1,
                    repeatDelay: 5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "tonic_fizz" && (
            <>
              {/* Tonic gradient */}
              <defs>
                <linearGradient id="tonicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#BDEBFF" />
                  <stop offset="100%" stopColor="#93DBFF" />
                </linearGradient>
              </defs>
              <ellipse cx={32} cy={34} rx={22} ry={20} fill="url(#tonicGrad)" />
              
              {/* Dense micro bubbles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={16 + (i*4)%32}
                  cy={40 + (i%4)*3}
                  r={0.5 + (i%3)*0.3}
                  fill="#FFFFFF"
                  opacity={0.6}
                  animate={{
                    cy: [40 + (i%4)*3, 18],
                    opacity: [0.6, 0.4, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + (i%3)*0.5,
                    delay: (i*0.2)%2,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Sparkle pops */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={`pop-${i}`}
                  cx={20 + i*12}
                  cy={25 + (i%2)*8}
                  r={1}
                  fill="#FFFFFF"
                  opacity={0}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.12,
                    delay: Math.random() * 3,
                    repeatDelay: 2 + Math.random() * 2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {skin.id === "star_parade" && (
            <>
              {/* Midnight base */}
              <defs>
                <filter id="starParadeBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#0E1424" 
                filter="url(#starParadeBlur)"
                opacity={0.8}
              />
              
              {/* Marching stars */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.g
                  key={i}
                  animate={{
                    x: [-15, 50]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 7 + i*0.5,
                    delay: i*1.5,
                    ease: "linear"
                  }}
                >
                  <path
                    d={`M${15 + i*8} 32 L${17 + i*8} 28 L${19 + i*8} 32 L${23 + i*8} 30 L${21 + i*8} 34 L${23 + i*8} 38 L${19 + i*8} 36 L${17 + i*8} 40 L${15 + i*8} 36 L${11 + i*8} 38 L${13 + i*8} 34 L${11 + i*8} 30 Z`}
                    stroke="#F8E38A"
                    strokeWidth="0.5"
                    fill="none"
                    opacity={0.7}
                  />
                </motion.g>
              ))}
            </>
          )}

          {skin.id === "rainbow_drip" && (
            <>
              {/* Dark base */}
              <defs>
                <filter id="rainbowDripBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <ellipse 
                cx={32} cy={34} rx={22} ry={20} 
                fill="#101218" 
                filter="url(#rainbowDripBlur)"
                opacity={0.8}
              />
              
              {/* Rainbow drips from top */}
              {[
                { x: 18, color: "#FF7B7B", delay: 0 },
                { x: 24, color: "#FFD166", delay: 0.5 },
                { x: 30, color: "#6BCB77", delay: 1 },
                { x: 36, color: "#4D96FF", delay: 1.5 },
                { x: 42, color: "#C77DFF", delay: 2 },
                { x: 48, color: "#FF7B7B", delay: 2.5 }
              ].map((drip, i) => (
                <motion.rect
                  key={i}
                  x={drip.x - 1}
                  y={14}
                  width={2}
                  height={0}
                  fill={drip.color}
                  opacity={0.4}
                  rx={1}
                  animate={{
                    height: [0, 6, 0],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: drip.delay,
                    repeatDelay: 5.2,
                    ease: "easeInOut",
                    times: [0, 0.25, 1]
                  }}
                />
              ))}
            </>
          )}
          
          {/* Eyes and Mouth */}
          {(() => {
            // NEW FACE COLOR LOGIC: Use specific color rules from style guidelines
            const baseColor = skin.base?.fill || "#22c55e";
            
            // Helper function to detect color characteristics
            const getColorType = (hexColor: string) => {
              const r = parseInt(hexColor.slice(1, 3), 16);
              const g = parseInt(hexColor.slice(3, 5), 16);
              const b = parseInt(hexColor.slice(5, 7), 16);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Detect if it's a saturated green (high green value, medium-high saturation)
              const isGreen = g > r && g > b && g > 100;
              const isBlue = b > r && b > g && b > 80;
              
              return { luminance, isGreen, isBlue };
            };
            
            const { luminance, isGreen, isBlue } = getColorType(baseColor);
            
            // Apply specific face color rules from guidelines
            let faceColor: string;
            let eyeShine: string;
            
            if (luminance < 0.4) {
              // Dark bases → light face
              faceColor = "#EAF4FF";
              eyeShine = "#FFFFFF";
            } else if (luminance > 0.7) {
              // Light bases → dark face
              faceColor = "#0E0E0E";
              eyeShine = "#64748B";
            } else if (isGreen) {
              // Saturated green → specific green face
              faceColor = "#064E3B";
              eyeShine = "#DCFCE7";
            } else if (isBlue) {
              // Saturated blue → specific blue face
              faceColor = "#0B2140";
              eyeShine = "#DBEAFE";
            } else {
              // Medium luminance, non-saturated colors → use stroke color as fallback
              faceColor = skin.base?.stroke || "#0E0E0E";
              eyeShine = skin.base?.shine || "#FFFFFF";
            }
            
            return (
              <>
                {/* Eyes */}
                <circle cx="24" cy="30" r="2.8" fill={faceColor} />
                <circle cx="40" cy="30" r="2.8" fill={faceColor} />
                <circle cx="23.3" cy="29.3" r="0.6" fill={eyeShine} />
                <circle cx="39.3" cy="29.3" r="0.6" fill={eyeShine} />
                
                {/* Happy mouth */}
                <path d="M20 36 Q32 44 44 36" stroke={faceColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </>
            );
          })()}
          
          {/* Shine effect */}
          <path d="M22 18 C26 16 30 16 32 14" stroke={skin.palette?.shine || skin.base?.shine || "#ffffff"} strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
          

        </svg>
      </motion.div>
    </div>
  );
}

// Main Gallery Component
export default function SkinGallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState<"all" | "production" | "inspiration">("all");
  const [rarityFilter, setRarityFilter] = useState<"all" | keyof typeof SKINS_BY_TIER | "seasonal">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkins = useMemo(() => {
    let skins = ALL_SKINS;
    
    // Source filter
    if (filter !== "all") {
      skins = SKINS_BY_SOURCE[filter];
    }
    
    // Rarity filter
    if (rarityFilter !== "all") {
      if (rarityFilter === "seasonal") {
        skins = skins.filter(s => NEW_SEASONAL.some(seasonal => seasonal.id === s.id));
      } else {
        skins = skins.filter(s => s.tier === rarityFilter);
      }
    }
    
    // Search filter
    if (searchTerm) {
      skins = skins.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return skins;
  }, [filter, rarityFilter, searchTerm]);

  const stats = {
    total: ALL_SKINS.length,
    production: SKINS_BY_SOURCE.production.length,
    inspiration: SKINS_BY_SOURCE.inspiration.length,
    seasonal: NEW_SEASONAL.length,
    byTier: Object.entries(SKINS_BY_TIER).map(([tier, skins]) => [tier, skins.length])
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-4 flex items-center justify-center">
        <div className="w-full max-w-[95vw] max-h-[95vh] bg-white rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-800">Skin Gallery</h2>
            <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {filteredSkins.length} of {stats.total} skins
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-lg">
            <X className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            <div className="text-sm">
              <div className="font-semibold text-emerald-800">{stats.production}</div>
              <div className="text-emerald-600">Production</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-emerald-800">{stats.inspiration}</div>
              <div className="text-emerald-600">Inspiration</div>
            </div>
            {stats.byTier.map(([tier, count]) => (
              <div key={tier} className="text-sm">
                <div className={`font-semibold ${RARITY_COLORS[tier as keyof typeof RARITY_COLORS]}`}>{count}</div>
                <div className="text-emerald-600 capitalize">{tier}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-emerald-100 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Source filter */}
            <div className="flex gap-2">
              {["all", "production", "inspiration"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                    filter === f 
                      ? "bg-emerald-600 text-white border-emerald-600" 
                      : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {f === "all" ? "All Sources" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Rarity filter */}
            <div className="flex gap-2">
              {["all", "common", "uncommon", "rare", "epic", "mythic", "secret", "seasonal"].map(r => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r as any)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium capitalize ${
                    r === "seasonal"
                      ? (rarityFilter === r 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50")
                      : (rarityFilter === r 
                          ? "bg-emerald-600 text-white border-emerald-600" 
                          : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50")
                  }`}
                >
                  {r === "seasonal" ? "🎃 seasonal" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search skins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Skin Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSkins.map((skin) => (
              <div
                key={skin.id}
                className="bg-white border border-emerald-100 rounded-xl p-3 hover:shadow-lg transition-shadow"
              >
                <div className="h-32 flex items-center justify-center mb-3">
                  <GallerySlime skin={skin} size="normal" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-emerald-800 mb-1">{skin.name}</div>
                  <div className={`text-xs font-medium capitalize ${RARITY_COLORS[skin.tier]}`}>
                    {skin.tier}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {skin.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredSkins.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <div className="text-emerald-600">No skins found matching your filters</div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}