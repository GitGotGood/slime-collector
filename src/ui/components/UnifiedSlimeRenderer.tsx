import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SKINS } from "../../assets/skins";
import { ALL_SKINS } from "../../assets/all-skins";
import Slime from "./Slime";

// Mouse tracking hook for eye tracking
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
}

function useUid(prefix = "slime") {
  const r = useRef(`${prefix}-${Math.random().toString(36).slice(2, 9)}`);
  return r.current;
}

type Props = {
  skinId?: string;
  skinData?: any; // Direct skin data (for comparison tool)
  source?: 'old' | 'new'; // Which system this skin is from
  mood?: "idle" | "happy" | "sad";
  scale?: number;
  className?: string;
  bobDuration?: number;
  bobDelay?: number;
  eyeTracking?: boolean;
};

export default function UnifiedSlimeRenderer({
  skinId,
  skinData,
  source,
  mood = "idle",
  scale = 1,
  className = "w-40 sm:w-48",
  bobDuration = 2.2,
  bobDelay = 0,
  eyeTracking = false,
}: Props) {
  const uid = useUid(skinId || 'unified');
  const slimeRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition();
  const [eyeOffset, setEyeOffset] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

  // Determine which skin data to use
  const skin = useMemo(() => {
    if (skinData) {
      return skinData; // Direct data from comparison tool
    }
    
    if (source === 'old' && skinId) {
      return SKINS[skinId] ?? SKINS.green;
    }
    
    if (source === 'new' && skinId) {
      return ALL_SKINS.find(s => s.id === skinId) ?? SKINS.green;
    }
    
    // Fallback to old system
    return SKINS[skinId || 'green'] ?? SKINS.green;
  }, [skinId, skinData, source]);

  // Eye tracking logic
  useEffect(() => {
    if (!eyeTracking || !slimeRef.current) return;

    const slimeRect = slimeRef.current.getBoundingClientRect();
    const slimeCenterX = slimeRect.left + slimeRect.width / 2;
    const slimeCenterY = slimeRect.top + slimeRect.height / 2;

    const leftEyeX = slimeCenterX - slimeRect.width * 0.125;
    const rightEyeX = slimeCenterX + slimeRect.width * 0.125;
    const eyeY = slimeCenterY - slimeRect.height * 0.1;

    const calculateEyeOffset = (eyeX: number, eyeY: number) => {
      const deltaX = mousePos.x - eyeX;
      const deltaY = mousePos.y - eyeY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const maxMovement = 1.8;
      const responsiveness = 20;
      
      const normalizedX = (deltaX / distance) * Math.min(distance / responsiveness, maxMovement);
      const normalizedY = (deltaY / distance) * Math.min(distance / responsiveness, maxMovement);
      
      return { 
        x: isNaN(normalizedX) ? 0 : normalizedX, 
        y: isNaN(normalizedY) ? 0 : normalizedY 
      };
    };

    setEyeOffset({
      left: calculateEyeOffset(leftEyeX, eyeY),
      right: calculateEyeOffset(rightEyeX, eyeY)
    });
  }, [mousePos, eyeTracking]);

  // Use unified skin format (all skins now use the same format)
  const { fill, stroke, defs, patterns } = useMemo(() => {
    return renderUnifiedSkin(skin, uid);
  }, [skin, uid]);

  // Get face colors based on skin
  const faceColors = useMemo(() => {
    const skinIdToUse = skinId || skin?.id || "green";
    
    // Special case for Charcoal - use grey instead of black
    if (skinIdToUse === "charcoal") {
      return { eyeColor: "#6B7280", mouthColor: "#6B7280" };
    }
    
    // For common slimes, use black for eyes and mouth, otherwise use stroke color
    const isCommon = skin?.tier === "common";
    const isSprinkles = skin?.id === "sprinkles" || skin?.id === "vanilla_sprinkles";
    const eyeColor = isCommon || isSprinkles ? "#000000" : (skin?.base?.stroke || "#000000");
    const mouthColor = isCommon || isSprinkles ? "#000000" : (skin?.base?.stroke || "#000000");
    
    return { eyeColor, mouthColor };
  }, [skinId, skin?.id, skin?.base?.stroke, skin?.tier]);

  // Get special eye and mouth effects for complex slimes
  const specialEffects = useMemo(() => {
    if (!skin) return null;
    
    const id = skin.id;

    // Dark Aurora: teal eyes/mouth override
    if (id === "dark_aurora") {
      return {
        eyeColor: "#43e0c6",
        mouthColor: "#43e0c6"
      } as any;
    }

    if (skin.id === "phoenix_heart" || skin.anim === "ember_rise_trail") {
      // Phoenix Heart Enhanced: Rare yellow flash system
      const isRareFlash = Math.random() < 0.12; // 12% chance
      const flickerColors = isRareFlash 
        ? ["#571616", "#dc2626", "#fbbf24", "#f59e0b", "#571616"] // Darker base, brighter peak
        : ["#571616", "#dc2626", "#571616"]; // Darker base for better contrast
      const flickerDuration = isRareFlash ? 0.25 : (0.7 + Math.random() * 0.5);
      const flickerTimes = isRareFlash ? [0, 0.2, 0.4, 0.6, 1] : [0, 0.5, 1];
      const flickerDelay = 2.0 + Math.random() * 4.0; // 2-6 second pause between flickers
      
      return {
        eyeColor: flickerColors,
        eyeTransition: undefined,
        mouthColor: flickerColors,
        mouthTransition: undefined
      };
    }
    
    if (skin.id === "nebula") {
      // Nebula Enhanced: Slow purple-to-white fade with transparency (more purple)
      const nebulaFadeColors = ["#7c3aed", "#9333ea", "#ddd6fe", "#9333ea", "#7c3aed"]; // Deeper purple → purple → light purple → back
      const nebulaOpacityValues = [0.8, 0.9, 1.0, 0.9, 0.8]; // Subtle transparency changes
      
      return {
        eyeColor: nebulaFadeColors,
        eyeOpacity: nebulaOpacityValues,
        eyeTransition: undefined,
        mouthColor: nebulaFadeColors,
        mouthTransition: undefined
      };
    }
    
    return null;
  }, [skin]);

  // Get mouth path based on mood
  const mouthPath = useMemo(() => {
    return {
      idle: "M20 36 Q32 42 44 36",
      happy: "M18 36 Q32 48 46 36",
      sad: "M18 40 Q32 30 46 40",
    }[mood] || "M20 36 Q32 42 44 36";
  }, [mood]);

  // Complex slime-specific rendering logic
  const complexPatterns = useMemo(() => {
    if (!skin) return null;
    
    const id = skin.id;
    const anim = skin.anim;
    
    // Deep space parallax animation for nebula
    if (skin.anim === "deep_space_parallax") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-nebula-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid}-nebula-clip)`}>
            {/* Swirling cosmic clouds - nebula inspiration */}
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
              {/* Twinkling starfield - nebula inspiration */}
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
            </g>
          </g>
        );
      }

    // Confetti fall animation - perpetual falling with flutter
    if (skin.anim === "confetti_fall") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-confetti-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid}-confetti-clip)`}>
            {/* Perpetual falling confetti with flutter */}
            {[
              { color: "#f472b6", x: 12, y: 0, size: 1.5 },
              { color: "#22d3ee", x: 20, y: -10, size: 1.2 },
              { color: "#fbbf24", x: 35, y: -5, size: 1.8 },
              { color: "#10b981", x: 45, y: -15, size: 1.3 },
              { color: "#8b5cf6", x: 15, y: -8, size: 1.6 },
              { color: "#ef4444", x: 40, y: -12, size: 1.4 },
              { color: "#f472b6", x: 25, y: -20, size: 1.1 },
              { color: "#22d3ee", x: 50, y: -3, size: 1.7 },
              { color: "#fbbf24", x: 8, y: -18, size: 1.0 },
              { color: "#10b981", x: 30, y: -25, size: 1.9 },
              { color: "#8b5cf6", x: 38, y: -7, size: 1.3 },
              { color: "#ef4444", x: 22, y: -14, size: 1.2 },
              { color: "#f472b6", x: 42, y: -22, size: 1.4 },
              { color: "#22d3ee", x: 16, y: -6, size: 1.6 },
              { color: "#fbbf24", x: 48, y: -16, size: 1.1 } // Total: 15 pieces
            ].map((confetti, i) => (
              <motion.rect
                key={i}
                x={confetti.x}
                y={confetti.y}
                width={confetti.size}
                height={confetti.size * 2}
                fill={confetti.color}
                opacity="0.8"
                animate={{ 
                  y: [confetti.y, confetti.y + 80],
                  x: [confetti.x, confetti.x + (Math.sin(i) * 3)],
                  rotate: [0, 360],
                  opacity: [0, 0.8, 0.8, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3 + (i * 0.2), 
                  delay: i * 0.3,
                  ease: "linear"
                }}
              />
            ))}
          </g>
        </g>
      );
    }

    // Ripple rendering - static pattern
    if (skin.id === "ripple") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-ripple-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid}-ripple-clip)`}>
            {/* Static concentric ripple rings */}
            {Array.from({ length: 4 }).map((_, i) => (
              <circle
                key={`ripple-${i}`}
                cx={32}
                cy={34}
                r={8 + (i * 6)}
                fill="none"
                stroke="#134E4A"
                strokeWidth="1.2"
                opacity={0.4 + (i * 0.1)}
              />
            ))}
          </g>
        </g>
      );
    }


    // Biolume veil animation
    if (skin.anim === "biolume_veil") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-biolume-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
            {/* Biolume flowing gradient */}
            <linearGradient id={`${uid}-biolume-flow-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <motion.stop
                offset="0%"
                stopColor="#0ea5e9"
                stopOpacity="0.6"
                animate={{
                  stopOpacity: [0.6, 0.8, 0.6],
                  stopColor: ["#0ea5e9", "#3b82f6", "#0ea5e9"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
              <motion.stop
                offset="30%"
                stopColor="#3b82f6"
                stopOpacity="0.5"
                animate={{
                  stopOpacity: [0.5, 0.7, 0.5],
                  stopColor: ["#3b82f6", "#60a5fa", "#3b82f6"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  delay: 0.8,
                  ease: "easeInOut"
                }}
              />
              <motion.stop
                offset="70%"
                stopColor="#bae6fd"
                stopOpacity="0.4"
                animate={{
                  stopOpacity: [0.4, 0.6, 0.4],
                  stopColor: ["#bae6fd", "#dbeafe", "#bae6fd"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  delay: 1.5,
                  ease: "easeInOut"
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="#dbeafe"
                stopOpacity="0.3"
                animate={{
                  stopOpacity: [0.3, 0.5, 0.3],
                  stopColor: ["#dbeafe", "#eff6ff", "#dbeafe"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5.5,
                  delay: 2,
                  ease: "easeInOut"
                }}
              />
            </linearGradient>
          </defs>
          
          <g clipPath={`url(#${uid}-biolume-clip)`}>
            {/* Main flowing biolume bands */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.rect
                key={`biolume-flow-${i}`}
                x={8}
                y={10 + (i * 12)}
                width={48}
                height={8}
                fill={`url(#${uid}-biolume-flow-gradient)`}
                opacity={0.7}
                animate={{
                  y: [10 + (i * 12), 12 + (i * 12), 10 + (i * 12)],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6 + i * 1.5,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>
        </g>
      );
    }

    // Biolume Veil Enhanced animation (from original Slime.tsx)
    if (skin.anim === "caustic_ripples_with_motes") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-biolume-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid}-biolume-clip)`}>
            {/* Floating bioluminescent organisms */}
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 14 + (i * 4);
              const y = 24 + (i % 4) * 6;
              return (
                <motion.circle
                  key={`bio-${i}`}
                  cx={x}
                  cy={y}
                  r={0.6}
                  fill="#0dd3ff"
                  opacity={0.8}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.4, 0.8],
                    fill: ["#0dd3ff", "#00ffc8", "#0dd3ff"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5 + (i % 3) * 0.5,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            
          </g>
        </g>
      );
    }

    // Aurora veil animation
    if (skin.anim === "aurora_veil") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-aurora-plus-enhanced-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
            {/* Flowing aurora gradient */}
            <linearGradient id={`${uid}-aurora-flow-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <motion.stop
                offset="0%"
                stopColor="#43e0c6"
                stopOpacity="0.6"
                animate={{
                  stopOpacity: [0.6, 0.8, 0.6],
                  stopColor: ["#43e0c6", "#22d3ee", "#43e0c6"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
                    <motion.stop
                      offset="30%"
                      stopColor="#22d3ee"
                      stopOpacity="0.5"
                      animate={{
                        stopOpacity: [0.5, 0.7, 0.5],
                        stopColor: ["#22d3ee", "#60a5fa", "#22d3ee"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4.5,
                        delay: 0.8,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="70%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.4"
                      animate={{
                        stopOpacity: [0.4, 0.6, 0.4],
                        stopColor: ["#8b5cf6", "#b189ff", "#8b5cf6"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        delay: 1.5,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="100%"
                      stopColor="#b189ff"
                      stopOpacity="0.3"
                      animate={{
                        stopOpacity: [0.3, 0.5, 0.3],
                        stopColor: ["#b189ff", "#c4b5fd", "#b189ff"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5.5,
                        delay: 2,
                        ease: "easeInOut"
                      }}
                    />
                  </linearGradient>
                  
                  {/* Secondary flowing gradient with offset */}
                  <linearGradient id={`${uid}-aurora-flow-gradient-2`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <motion.stop
                      offset="0%"
                      stopColor="#b189ff"
                      stopOpacity="0.3"
                    />
                    <motion.stop
                      offset="50%"
                      stopColor="#43e0c6"
                      stopOpacity="0.5"
                    />
                    <motion.stop
                      offset="100%"
                      stopColor="#22d3ee"
                      stopOpacity="0.2"
                    />
                  </linearGradient>
                </defs>
                
                {/* Flowing aurora curtains */}
                <g clipPath={`url(#${uid}-aurora-plus-enhanced-clip)`}>
                  {/* Main flowing aurora bands */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.rect
                      key={`aurora-flow-${i}`}
                      x={12 + (i * 8)}
                      y={6}
                      width={12}
                      height={52}
                      fill={`url(#${uid}-aurora-flow-gradient)`}
                      opacity={0.5}
                      animate={{
                        y: [4, 8, 4],
                        opacity: [0.5, 0.2, 0.5],
                        height: [52, 48, 52]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 6 + (i * 0.5),
                        delay: i * 1.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Secondary aurora bands with different timing */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.rect
                      key={`aurora-flow-2-${i}`}
                      x={16 + (i * 10)}
                      y={8}
                      width={8}
                      height={50}
                      fill={`url(#${uid}-aurora-flow-gradient-2)`}
                      opacity={0.3}
                      animate={{
                        y: [6, 2, 6],
                        opacity: [0.3, 0.1, 0.3],
                        scaleX: [1, 1.2, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 7 + (i * 0.7),
                        delay: i * 1.8 + 3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Aurora sparkle particles */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.circle
                      key={`aurora-sparkle-${i}`}
                      cx={18 + (i * 2.8)}
                      cy={16 + (i % 5) * 6}
                      r={0.6}
                      fill={["#43e0c6", "#b189ff", "#22d3ee", "#c4b5fd"][i % 4]}
                      opacity={0.8}
                      animate={{
                        scale: [1, 0.2, 1],
                        opacity: [0.8, 0.3, 0.8],
                        cy: [16 + (i % 5) * 6, 16 + (i % 5) * 6 + 2, 16 + (i % 5) * 6]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + (i * 0.2),
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

    // Lava flow animation
    if (skin.anim === "lava_flow") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-lava-enhanced-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                  {/* Animated gradient for body */}
                  <radialGradient id={`${uid}-lava-animated-gradient`} cx="50%" cy="40%">
                    <motion.stop
                      offset="0%"
                      stopColor="#ef4444"
                      animate={{
                        stopColor: ["#ef4444", "#dc2626", "#ef4444"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="40%"
                      stopColor="#dc2626"
                      animate={{
                        stopColor: ["#dc2626", "#f97316", "#dc2626"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4.5,
                        delay: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="80%"
                      stopColor="#f97316"
                      animate={{
                        stopColor: ["#f97316", "#fb923c", "#f97316"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        delay: 1,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="100%"
                      stopColor="#b45309"
                      animate={{
                        stopColor: ["#b45309", "#7c2d12", "#b45309"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 5.5,
                        delay: 1.5,
                        ease: "easeInOut"
                      }}
                    />
                  </radialGradient>
                </defs>
                
                {/* Animated gradient body overlay */}
                <path 
                  d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
                  fill={`url(#${uid}-lava-animated-gradient)`}
                  opacity={0.6}
                />
                
                <g clipPath={`url(#${uid}-lava-enhanced-clip)`}>
                  {/* Orange ember sparks floating upward slowly */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.circle
                      key={`orange-ember-${i}`}
                      cx={20 + (i * 4) + (i % 2) * 6}
                      cy={52}
                      r={1.2}
                      fill="#dc2626"
                      opacity={0.8}
                      animate={{
                        cy: [52, 15],
                        opacity: [0.8, 0.4, 0],
                        scale: [1, 0.6, 0.3]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 7 + (i * 0.5),
                        delay: i * 1.3,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Yellow ember sparks floating upward slowly */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.circle
                      key={`yellow-ember-${i}`}
                      cx={24 + (i * 5)}
                      cy={48}
                      r={0.8}
                      fill="#fde047"
                      opacity={0.9}
                      animate={{
                        cy: [48, 12],
                        opacity: [0.9, 0.5, 0],
                        scale: [1, 0.4, 0.2]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 8 + (i * 0.7),
                        delay: i * 1.8 + 2,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

          if (skin.id === "the_fizz") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-fizz-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${uid}-fizz-clip)`}>
                  {/* Fizz bubbles */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.circle
                      key={`fizz-${i}`}
                      cx={16 + (i * 3)}
                      cy={45 + (i % 2) * 5}
                      r={1 + (i % 3)}
                      fill="#22d3ee"
                      opacity={0.8}
                      animate={{
                        cy: [45 + (i % 2) * 5, 15 + (i % 2) * 5, 45 + (i % 2) * 5],
                        opacity: [0.8, 0.2, 0.8],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + (i * 0.2),
                        delay: i * 0.15,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Sparkle effects */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.circle
                      key={`sparkle-${i}`}
                      cx={20 + (i * 8)}
                      cy={25 + (i % 3) * 8}
                      r={0.5}
                      fill="#ffffff"
                      opacity={0.9}
                      animate={{
                        opacity: [0.9, 0.3, 0.9],
                        scale: [1, 2, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5 + (i * 0.3),
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

          if (skin.id === "void_walker") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-void-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${uid}-void-clip)`}>
                  {/* Shadow tendrils */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.ellipse
                      key={`tendril-${i}`}
                      cx={32}
                      cy={34}
                      rx={15 + (i * 2)}
                      ry={8 + (i * 1)}
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="1.5"
                      opacity={0.4}
                      animate={{
                        rx: [15 + (i * 2), 18 + (i * 2), 15 + (i * 2)],
                        ry: [8 + (i * 1), 12 + (i * 1), 8 + (i * 1)],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + (i * 0.5),
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Dark energy particles */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle
                      key={`particle-${i}`}
                      cx={24 + (i * 2)}
                      cy={30 + (i % 3) * 8}
                      r={1}
                      fill="#374151"
                      opacity={0.6}
                      animate={{
                        cx: [24 + (i * 2), 24 + (i * 2) + (i % 2 ? 4 : -4), 24 + (i * 2)],
                        cy: [30 + (i % 3) * 8, 30 + (i % 3) * 8 + (i % 2 ? 6 : -6), 30 + (i % 3) * 8],
                        opacity: [0.6, 0.2, 0.6]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4 + (i * 0.3),
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

          if (skin.id === "cosmic") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-cosmic-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${uid}-cosmic-clip)`}>
                  {/* Cosmic rings */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.ellipse
                      key={`ring-${i}`}
                      cx={32}
                      cy={34}
                      rx={12 + (i * 4)}
                      ry={8 + (i * 3)}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      opacity={0.6}
                      animate={{
                        rotate: [0, 360],
                        opacity: [0.6, 0.3, 0.6]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 8 + (i * 2),
                        ease: "linear"
                      }}
                    />
                  ))}
                  
                  {/* Star field */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.circle
                      key={`star-${i}`}
                      cx={12 + (i * 3)}
                      cy={20 + (i % 4) * 8}
                      r={0.5 + (i % 2) * 0.3}
                      fill="#ffffff"
                      opacity={0.8}
                      animate={{
                        opacity: [0.8, 0.3, 0.8],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + (i * 0.2),
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

          if (skin.id === "ionosong") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-ionosong-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${uid}-ionosong-clip)`}>
                  {/* Audio Equalizer Bars - representing the ionic song */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.rect
                      key={`eq-bar-${i}`}
                      x={16 + (i * 4)} // Spread across the slime width
                      y={34} // Start from middle
                      width={2}
                      height={8}
                      fill="#6366f1"
                      opacity={0.8}
                      style={{ transformOrigin: `${17 + (i * 4)}px 34px` }} // Transform from bottom center
                      animate={{
                        scaleY: [0.5, 1.5, 0.8, 2.0, 0.6], // Equalizer-style height changes
                        opacity: [0.8, 0.9, 0.7, 1.0, 0.8]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.0 + (i % 3) * 0.5, // Different frequencies for each bar
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Floating musical notes */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.g 
                      key={`note-${i}`}
                      animate={{
                        y: [-2, 2, -2],
                        opacity: [0.7, 1.0, 0.4]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.0 + (i * 0.3),
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Musical note head */}
                      <circle
                        cx={20 + (i * 8)}
                        cy={25 + (i % 2) * 8}
                        r={1.2}
                        fill="#8b5cf6"
                      />
                      {/* Musical note stem */}
                      <line
                        x1={21.2 + (i * 8)}
                        y1={25 + (i % 2) * 8}
                        x2={21.2 + (i * 8)}
                        y2={20 + (i % 2) * 8}
                        stroke="#8b5cf6"
                        strokeWidth="0.8"
                      />
                    </motion.g>
                  ))}
                </g>
              </g>
            );
          }

          if (skin.id === "synthwave") {
            return (
              <g>
                <defs>
                  <clipPath id={`${uid}-synthwave-clip`}>
                    <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${uid}-synthwave-clip)`}>
                  {/* Extended retro scanlines covering full slime body (avoiding outline) */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.line
                      key={`scan-${i}`}
                      x1={10}  // Start inside outline
                      y1={14 + (i * 3.5)} // Cover from top to bottom of slime
                      x2={54} // End inside outline (avoid overlapping stroke)
                      y2={14 + (i * 3.5)}
                      stroke="#ff4d6d"
                      strokeWidth="1"
                      opacity={0.7}
                      animate={{
                        opacity: [0.7, 0.1, 0.9, 0.2]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        delay: i * 0.08, // Faster cascading effect
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </g>
            );
          }

    // Ember rise trail animation for Phoenix Heart
    if (skin.anim === "ember_rise_trail") {
      return (
        <g>
          <defs>
            <clipPath id={`${uid}-phoenix-clip`}>
              <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
            </clipPath>
            {/* Animated ember gradient with proper colors */}
            <radialGradient id={`${uid}-ember-gradient`} cx="50%" cy="30%">
              <motion.stop
                offset="0%"
                stopColor="#ff7a3c"
                animate={{
                  stopColor: ["#ff7a3c", "#dc2626", "#ff7a3c"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
              <motion.stop
                offset="50%"
                stopColor="#dc2626"
                animate={{
                  stopColor: ["#dc2626", "#f97316", "#dc2626"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="#7f1d1d"
                animate={{
                  stopColor: ["#7f1d1d", "#dc2626", "#7f1d1d"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: 1,
                  ease: "easeInOut"
                }}
              />
            </radialGradient>
          </defs>
          
          <g clipPath={`url(#${uid}-phoenix-clip)`}>
            {/* Heartbeat pulse overlay */}
            <motion.ellipse
              cx={32}
              cy={34}
              rx={20}
              ry={18}
              fill="#ff6b3d"
              opacity={0.2}
              animate={{
                rx: [20, 24, 20],
                ry: [18, 22, 18],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut"
              }}
            />
            
            {/* Rising ember particles (bubbles) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.circle
                key={`ember-${i}`}
                cx={20 + (i * 4)}
                cy={50 - (i * 1.5)}
                r={1 + (i % 3) * 0.5}
                fill="#ff7a3c"
                opacity={0.7}
                animate={{
                  cy: [50 - (i * 1.5), 15 - (i * 1.5), 50 - (i * 1.5)],
                  opacity: [0.7, 1, 0.7],
                  r: [1 + (i % 3) * 0.5, 1.5 + (i % 3) * 0.5, 1 + (i % 3) * 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5 + (i * 0.2),
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Glowing heart effect with pulsing */}
            <motion.circle
              cx={32}
              cy={34}
              r={12}
              fill="url(#ember-gradient)"
              opacity={0.3}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.15, 1],
                r: [12, 14, 12]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut"
              }}
            />
            
            {/* Additional ember sparks */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.circle
                key={`spark-${i}`}
                cx={25 + (i * 2.5)}
                cy={30 + (i % 2) * 8}
                r={0.5}
                fill="#fbbf24"
                opacity={0.8}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.5, 1],
                  cy: [30 + (i % 2) * 8, 25 + (i % 2) * 8, 30 + (i % 2) * 8]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8 + (i * 0.3),
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>
        </g>
      );
    }

    // Add more complex slimes here as needed
    return null;
  }, [skin, uid]);

  return (
    <div 
      ref={slimeRef}
      className={`relative ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ 
          filter: mood === "sad" ? "brightness(0.8) saturate(0.7)" : 
                  mood === "happy" ? "brightness(1.1) saturate(1.2)" : "none"
        }}
      >
        {defs}
        
        {/* Main slime body */}
        <motion.path
          d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
          fill={fill}
          stroke="none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: bobDelay }}
        />
        
        {/* Shine effect */}
        <path
          d="M12 28 C14 20 22 16 28 16 C32 16 36 18 38 22 C40 26 38 30 36 32 C34 34 30 36 26 36 C20 36 14 32 12 28Z"
          fill="url(#shine-gradient)"
          opacity="0.3"
        />
        
        {/* Patterns (for new format skins) */}
        {patterns}
        
        {/* Complex slime-specific patterns */}
        {complexPatterns}
        
          {/* Eyes */}
          <g style={{ transform: `translate(${eyeOffset.left.x}px, ${eyeOffset.left.y}px)` }}>
          {specialEffects ? (
            // Special effects for complex slimes
            <>
              <motion.circle
                cx={24}
                cy={30}
                r="3"
                fill={faceColors.eyeColor}
                  animate={specialEffects.eyeColor ? { fill: specialEffects.eyeColor } : undefined}
                opacity={1}
                transition={undefined}
              />
              <motion.circle
                cx={40 + (eyeOffset.right.x - eyeOffset.left.x)}
                cy={30 + (eyeOffset.right.y - eyeOffset.left.y)}
                r="3"
                fill={faceColors.eyeColor}
                  animate={specialEffects.eyeColor ? { fill: specialEffects.eyeColor } : undefined}
                opacity={1}
                transition={undefined}
              />
            </>
          ) : (
            // Standard eyes
            <>
              <circle
                cx={24}
                cy={30}
                r="3"
                fill={faceColors.eyeColor}
                  style={{ transition: 'transform 0.1s ease-out' }}
              />
              <circle
                cx={40 + (eyeOffset.right.x - eyeOffset.left.x)}
                cy={30 + (eyeOffset.right.y - eyeOffset.left.y)}
                r="3"
                fill={faceColors.eyeColor}
                  style={{ transition: 'transform 0.1s ease-out' }}
              />
            </>
          )}
          {/* Eye highlights */}
            <circle 
              cx={23.0}
              cy={29.0}
              r={0.7}
              fill="#ecfeff"
              opacity={0.9}
            />
            <circle 
              cx={40 + (eyeOffset.right.x - eyeOffset.left.x) - 1.0}
              cy={29.0 + (eyeOffset.right.y - eyeOffset.left.y)}
              r={0.7}
              fill="#ecfeff"
              opacity={0.9}
            />
        </g>
        
        {/* Mouth */}
        {specialEffects ? (
          <motion.path
            d={mouthPath}
            stroke={faceColors.mouthColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={specialEffects.mouthColor ? { stroke: specialEffects.mouthColor } : {}}
            transition={specialEffects.mouthTransition}
          />
        ) : (
          <path
            d={mouthPath}
            stroke={faceColors.mouthColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Separate stroke element - renders last to ensure it's always on top */}
        <path
          d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
      </svg>
      
      {/* Bob animation */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -2, 0] }}
        transition={{ 
          duration: bobDuration, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: bobDelay 
        }}
      />
    </div>
  );
}

// Render old format skin (from skins.ts)

// Render unified skin format (from skins.ts)
function renderUnifiedSkin(skin: any, uid: string) {
  let fill = skin.base.fill; // Use the actual color from base.fill
  let stroke = skin.base.stroke;
  let defs: React.ReactNode = null;
  let patterns: React.ReactNode = null;

  // Handle different skin kinds
  if (skin.kind === "gradient" && skin.colors && skin.colors.length > 1) {
    fill = `url(#${uid}-grad)`;
    const direction = skin.gradient?.direction || "horizontal";
    const isVertical = direction === "vertical";
    const isHorizontal = direction === "horizontal";
    const isDiagonal = direction === "diagonal";
    const isRadial = direction === "radial";
    
    if (isRadial) {
      defs = (
        <defs>
          <radialGradient id={`${uid}-grad`} cx="50%" cy="50%" r="50%">
            {skin.colors.map((color: string, i: number) => (
              <stop key={i} offset={`${(i / (skin.colors.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </radialGradient>
          <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="60%" y2="40%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      );
    } else {
      defs = (
        <defs>
          <linearGradient 
            id={`${uid}-grad`} 
            x1="0%" 
            y1="0%" 
            x2={isVertical ? "0%" : isHorizontal ? "100%" : "100%"} 
            y2={isVertical ? "100%" : isHorizontal ? "0%" : "100%"}
          >
            {skin.colors.map((color: string, i: number) => (
              <stop key={i} offset={`${(i / (skin.colors.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
          <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      );
    }
  } else if (skin.kind === "animated" && skin.colors && skin.colors.length > 1) {
    // For animated skins, use base.fill as the background color
    // The animation will be rendered on top via complexPatterns
    fill = skin.base.fill;
    defs = (
      <defs>
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    );
  } else {
    // Solid color - use base.fill which is the actual color
    defs = (
      <defs>
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    );
  }

  // Handle patterns
  if (skin.pattern && skin.pattern.type !== "flat") {
    patterns = renderUnifiedPattern(skin.pattern, uid, skin.id);
  }

  return { fill, stroke, defs, patterns };
}

// Render unified patterns
function renderUnifiedPattern(pattern: any, uid: string, skinId: string): React.ReactNode {
  if (!pattern || pattern.type === "flat") {
    return null;
  }

  return (
    <g>
      <defs>
        <clipPath id={`${uid}-unified-pattern-clip`}>
          <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-unified-pattern-clip)`}>
        {/* Enhanced pattern rendering for shop skins */}
        {pattern.type === "dots" && (
          <>
            {Array.from({ length: 25 }).map((_, i) => (
              <circle
                key={i}
                cx={10 + (i * 2.5) % 44}
                cy={14 + (i * 3) % 40}
                r={1 + (i % 3) * 0.5}
                fill={pattern.colors?.[i % (pattern.colors?.length || 1)] || "#000000"}
                opacity="0.7"
              />
            ))}
          </>
        )}
        {pattern.type === "polka_dots" && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={10 + (i * 4.5) % 44}
                cy={14 + (i * 3.5) % 40}
                r={1.5 + (i % 2) * 0.5}
                fill={pattern.colors?.[i % 2] || "#000000"}
                opacity="0.8"
              />
            ))}
          </>
        )}
        {pattern.type === "confetti_dots" && (
          <>
            {Array.from({ length: pattern.count || 18 }).map((_, i) => (
              <rect
                key={i}
                x={8 + (i * 13) % 48}
                y={12 + ((i * 9) % 36)}
                rx="1.2"
                ry="1.2"
                width="1.9"
                height="5.1"
                fill={pattern.colors?.[i % (pattern.colors?.length || 1)] || "#000000"}
                opacity={pattern.alpha || 0.8}
                transform={`rotate(${(i * 15) % 360} ${8 + (i * 13) % 48 + 1.5} ${12 + ((i * 9) % 36) + 4})`}
              />
            ))}
            {/* Additional smaller sprinkles for more coverage */}
            {Array.from({ length: Math.floor((pattern.count || 18) * 0.8) }).map((_, i) => (
              <rect
                key={`small-${i}`}
                x={10 + (i * 19) % 46}
                y={14 + ((i * 13) % 34)}
                rx="1"
                ry="1"
                width="1.3"
                height="3.8"
                fill={pattern.colors?.[(i + 3) % (pattern.colors?.length || 1)] || "#000000"}
                opacity={(pattern.alpha || 0.8) * 0.8}
                transform={`rotate(${(i * 25) % 360} ${10 + (i * 19) % 46 + 1} ${14 + ((i * 13) % 34) + 3})`}
              />
            ))}
          </>
        )}
        {pattern.type === "biolume_glow" && (
          <>
            {/* Concentric glowing ovals */}
            <ellipse
              cx={32}
              cy={34}
              rx={16}
              ry={12}
              fill={pattern.colors?.[0] || "#0ea5e9"}
              opacity="0.6"
            />
            <ellipse
              cx={32}
              cy={34}
              rx={10}
              ry={8}
              fill={pattern.colors?.[1] || "#bae6fd"}
              opacity="0.8"
            />
            {/* Scattered glowing dots */}
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={12 + (i * 3.5) % 40}
                cy={18 + (i * 2.3) % 32}
                r={0.8 + (i % 3) * 0.3}
                fill={pattern.colors?.[i % 2] || "#0ea5e9"}
                opacity="0.7"
              />
            ))}
          </>
        )}
        {pattern.type === "linearBands" && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x={8}
                y={10 + (i * 8)}
                width={48}
                height={3}
                fill={pattern.colors?.[i % (pattern.colors?.length || 1)] || "#000000"}
                opacity="0.4"
              />
            ))}
          </>
        )}
        {pattern.type === "conicSwirl" && (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d={`M32 34 A${6 + i * 1.5} ${6 + i * 1.5} 0 1 1 ${32 + (6 + i * 1.5) * 0.1} ${34 + (6 + i * 1.5) * 0.1}`}
                fill="none"
                stroke={pattern.colors?.[i % (pattern.colors?.length || 1)] || "#000000"}
                strokeWidth="1.5"
                opacity="0.5"
              />
            ))}
          </>
        )}
      </g>
    </g>
  );
}

// Render unified format skin (from unified-skins-v2.ts)
function renderUnifiedFormatSkin(skin: any, uid: string) {
  let fill = skin.base?.fill || skin.colors?.[0] || "#5BA86D";
  let stroke = skin.base?.stroke || "#000000";
  let defs: React.ReactNode = null;
  let patterns: React.ReactNode = null;

  // Handle different skin kinds
  if (skin.kind === "gradient" && skin.colors && skin.colors.length > 1) {
    fill = `url(#${uid}-grad)`;
    defs = (
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          {skin.colors.map((color: string, i: number) => (
            <stop key={i} offset={`${(i / (skin.colors.length - 1)) * 100}%`} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    );
  } else if (skin.kind === "animated" && skin.colors && skin.colors.length > 1) {
    // For animated skins, use base.fill as the background color
    // The animation will be rendered on top via complexPatterns
    fill = skin.base.fill;
    defs = (
      <defs>
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    );
  } else {
    // Solid color - use the actual color from colors array, not the default base
    fill = skin.colors?.[0] || skin.base?.fill || "#5BA86D";
    defs = (
      <defs>
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    );
  }

  // Handle patterns
  if (skin.pattern && skin.pattern.type !== "flat") {
    patterns = renderUnifiedPattern(skin.pattern, uid, skin.id);
  }

  return { fill, stroke, defs, patterns };
}
