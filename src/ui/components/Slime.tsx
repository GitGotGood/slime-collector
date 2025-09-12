import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SKINS } from "../../assets/skins";

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
  skinId?: string;           // preferred
  paletteId?: string;        // legacy fallback
  mood?: "idle" | "happy" | "sad";
  scale?: number;
  className?: string;
  bobDuration?: number;
  bobDelay?: number;
  eyeTracking?: boolean;     // enable mouse eye tracking
};

export default function Slime({
  skinId,
  paletteId,
  mood = "idle",
  scale = 1,
  className = "w-40 sm:w-48",
  bobDuration = 2.2,
  bobDelay = 0,
  eyeTracking = false,
}: Props) {
  const id = skinId || paletteId || "green";
  const skin = SKINS[id] ?? SKINS.green;
  const uid = useUid(id);
  const slimeRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition();
  const [eyeOffset, setEyeOffset] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

  // Eye tracking logic (Direct Tracking style)
  useEffect(() => {
    if (!eyeTracking || !slimeRef.current) return;

    const slimeRect = slimeRef.current.getBoundingClientRect();
    const slimeCenterX = slimeRect.left + slimeRect.width / 2;
    const slimeCenterY = slimeRect.top + slimeRect.height / 2;

    // Calculate eye positions relative to slime
    const leftEyeX = slimeCenterX - slimeRect.width * 0.125; // Approximate left eye position
    const rightEyeX = slimeCenterX + slimeRect.width * 0.125; // Approximate right eye position
    const eyeY = slimeCenterY - slimeRect.height * 0.1; // Approximate eye height

    const calculateEyeOffset = (eyeX: number, eyeY: number) => {
      const deltaX = mousePos.x - eyeX;
      const deltaY = mousePos.y - eyeY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Direct tracking parameters (from experiments)
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

  const { fill, defs } = useMemo(() => {
    // Special case for Galaxy Swirl Enhanced - custom rotating gradient
    if (id === "galaxy_swirl") {
      return {
        fill: `url(#${uid}-rotating-grad)`,
        defs: (
          <defs>
            <radialGradient 
              id={`${uid}-rotating-grad`} 
              cx="0.5" 
              cy="0.5" 
              r="0.7"
            >
              <stop offset="0%">
                <animate attributeName="stop-color" 
                  values="#22d3ee;#0891b2;#22d3ee" 
                  dur="8s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="25%">
                <animate attributeName="stop-color" 
                  values="#0891b2;#ea580c;#0891b2" 
                  dur="10s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="50%">
                <animate attributeName="stop-color" 
                  values="#ea580c;#7c2d12;#ea580c" 
                  dur="12s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="75%">
                <animate attributeName="stop-color" 
                  values="#7c2d12;#1f2937;#7c2d12" 
                  dur="14s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#1f2937" />
            </radialGradient>
          </defs>
        ),
      };
    }
    
    if (skin.kind === "solid") {
      return { fill: skin.colors[0], defs: null as React.ReactNode };
    }
    if (skin.kind === "gradient") {
      return {
        fill: `url(#${uid}-grad)`,
        defs: (
          <defs>
            <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="1">
              {skin.colors.map((color, index) => (
                <stop 
                  key={index}
                  offset={`${(index / (skin.colors.length - 1)) * 100}%`} 
                  stopColor={color} 
                />
              ))}
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
  }, [skin, uid, id]);

  const mouthPath =
    {
      idle: "M20 36 Q32 42 44 36",
      happy: "M18 36 Q32 48 46 36",
      sad: "M18 40 Q32 30 46 40",
    }[mood] || "M20 36 Q32 42 44 36";

  return (
    <motion.div
      ref={slimeRef}
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
          stroke={(() => {
            // Epic Inspiration Slimes Stroke Colors (from design specs)
            const strokeColors: Record<string, string> = {
              blaze_knight: "#3b0a02",
              jungle_raider: "#0f3a2a", 
              cave_explorer: "#273341",
              sky_racer: "#1e3a8a",
              desert_outrider: "#6b3f0c",
              turbo_bot: "#1f2937",
              neon_circuit: "#0b1026",
              magnet_core: "#0b0f14",
              plasma_pilot: "#0e3a40",
              rex_roar: "#0b3a2a",
              thunder_lizard: "#3e2a12",
              slimezilla_jr: "#07323a",
              goal_streak: "#0b3a2a",
              home_run: "#5b3b0a",
              drift_king: "#1f2937",
              star_captain: "#0b1026",
              coral_corsair: "#0f2a2f",
              rune_sprinter: "#3a1f0a",
              meteor_glide: "#273341",
              storm_rider: "#08343a"
            };
            return strokeColors[id] || "#1f2937";
          })()}
          strokeWidth="1.5"
          initial={{ filter: "brightness(1)" }}
          animate={{ filter: mood === "happy" ? "brightness(1.1)" : mood === "sad" ? "brightness(0.95)" : "brightness(1)" }}
        />
        <path d="M22 18 C26 16 30 16 32 14" stroke="#ffffffaa" strokeWidth="3" strokeLinecap="round" />
        
        {/* Eyes with optional tracking */}
        {(() => {
          // Custom face colors for enhanced mythics
          const getFaceColor = () => {
            if (id === "nebula") return "#9333ea"; // Deep purple to match nebula theme
            if (id === "galaxy_swirl") return "#0891b2"; // Teal/cyan from Crab Nebula
            if (id === "star_parade") return "#f1f5f9"; // Light stellar silver
            if (id === "ionosong") return "#6366f1"; // Electric indigo
            if (id === "mirage_enhanced") return "#d97706"; // Desert amber
            if (id === "frog_chorus_enhanced") return "#15803d"; // Forest green
            if (id === "biolume_veil_enhanced") return "#06b6d4"; // Bright cyan bioluminescence
            if (id === "echo_rune_enhanced") return "#0f766e"; // Mystical teal
            if (id === "synthwave") return "#ec4899"; // Brighter neon pink for better contrast
            if (id === "phoenix_heart") return "#571616"; // Darker base for better contrast
            
            // Inspiration Slimes Face Colors (from design specs)
            if (id === "deep_dark_cave") return "#0b3b2e";
            if (id === "never_ending_cave") return "#10b981"; 
            if (id === "spooky_cave") return "#06b6d4";
            if (id === "fault_glow") return "#064e3b";
            if (id === "aftershock") return "#10b981";
            if (id === "ember_rim") return "#052e25";
            if (id === "ashfall") return "#10b981";
            if (id === "volcanic_glass") return "#06b6d4";
            if (id === "sandstorm_wall") return "#064e3b";
            if (id === "dune_surge") return "#065f46"; 
            if (id === "whirlwind_edge") return "#0b3b2e";
            if (id === "riptide_bowl") return "#064e3b";
            if (id === "whirlpool_eye") return "#052e25";
            if (id === "monsoon_sheet") return "#052e25";
            if (id === "crevasse_light") return "#07423a";
            if (id === "black_ice") return "#06b6d4";
            if (id === "aurora_curtain") return "#052e25";
            if (id === "thunder_shelf") return "#052e25";
            if (id === "static_sheet") return "#10b981";
            if (id === "solar_haze") return "#064e3b";
            if (id === "gravity_well") return "#06b6d4";
            if (id === "prism_mist") return "#07423a";
            if (id === "forge_heat") return "#052e25";
            if (id === "quench_mist_inspiration") return "#10b981";
            
            // Epic Inspiration Slimes Face Colors (from design specs)
            if (id === "blaze_knight") return "#064e3b";
            if (id === "jungle_raider") return "#052e25";
            if (id === "cave_explorer") return "#07423a";
            if (id === "sky_racer") return "#065f46";
            if (id === "desert_outrider") return "#064e3b";
            if (id === "turbo_bot") return "#064e3b";
            if (id === "neon_circuit") return "#059669";
            if (id === "magnet_core") return "#06b6d4";
            if (id === "plasma_pilot") return "#064e3b";
            if (id === "rex_roar") return "#052e25";
            if (id === "thunder_lizard") return "#0b3b2e";
            if (id === "slimezilla_jr") return "#022c22";
            if (id === "goal_streak") return "#064e3b";
            if (id === "home_run") return "#064e3b";
            if (id === "drift_king") return "#10b981";
            if (id === "star_captain") return "#10b981";
            if (id === "coral_corsair") return "#052e25";
            if (id === "rune_sprinter") return "#064e3b";
            if (id === "meteor_glide") return "#06b6d4";
            if (id === "storm_rider") return "#052e25";
            
            // Epic Slimes Face Colors (from design specs)
            if (id === "lava_flow_enhanced") return "#dc2626"; // Brighter red for better visibility
            if (id === "aurora_veil_enhanced") return "#064e3b";
            if (id === "glacier_enhanced") return "#065f46";
            if (id === "aurora_veil_plus_enhanced") return "#000000"; // Black for contrast against aurora
            if (id === "ripple_enhanced") return "#000000"; // Black for contrast against ripple pattern
            if (id === "dune_drift" || id === "dune_drift_enhanced") return "#7c2d12";
            if (id === "bog_bubble" || id === "bog_bubble_enhanced") return "#064e3b";
            if (id === "willow_glow" || id === "willow_glow_enhanced") return "#0f3a2a";
            if (id === "geode_core" || id === "geode_core_enhanced") return "#4c1d95";
            if (id === "stalactite_drip" || id === "stalactite_drip_enhanced") return "#334155";
            if (id === "sunshower" || id === "sunshower_enhanced") return "#ca8a04";
            if (id === "rainbow_arc" || id === "rainbow_arc_enhanced") return "#1f2937";
            if (id === "subway_spark" || id === "subway_spark_enhanced") return "#0f172a";
            if (id === "billboard_blink" || id === "billboard_blink_enhanced") return "#0b1026";
            if (id === "haystack" || id === "haystack_enhanced") return "#7c2d12";
            if (id === "orchard_breeze" || id === "orchard_breeze_enhanced") return "#0f3a2a";
            if (id === "harbor_wake" || id === "harbor_wake_enhanced") return "#0f2a2f";
            if (id === "temple_incense" || id === "temple_incense_enhanced") return "#5b4630";
            if (id === "canyon_shade" || id === "canyon_shade_enhanced") return "#3b2012";
            if (id === "reef_bloom" || id === "reef_bloom_enhanced") return "#113046";
            if (id === "savanna_mirage" || id === "savanna_mirage_enhanced") return "#6b4b1f";
            if (id === "foundry_heatwave" || id === "foundry_heatwave_enhanced") return "#3a1f0a";
            if (id === "tundra_halo" || id === "tundra_halo_enhanced") return "#1e3a8a";
            if (id === "observatory_drift" || id === "observatory_drift_enhanced") return "#0b1026";
            
            // Enhanced common slimes with specific face colors
            if (id === "moss") return "#09402A"; // Dark forest green for moss
            if (id === "sky") return "#16345A"; // Deep blue-navy for sky contrast
            if (id === "coral") return "#1F2A2E"; // Dark charcoal for coral contrast
            if (id === "clover") return "#0C4B2B"; // Deep forest green for clover
            if (id === "charcoal") return "#4a5568"; // Dark grey for charcoal ash look
            
            // Enhanced uncommon slimes with specific face colors
            if (id === "spring_fade" || id === "spring_fade_enhanced") return "#0F5132"; // Deep forest green
            if (id === "blue_lagoon" || id === "blue_lagoon_enhanced") return "#0A2752"; // Deep navy blue
            if (id === "sea_breeze" || id === "sea_breeze_enhanced") return "#094A45"; // Deep teal
            if (id === "raindrop" || id === "raindrop_enhanced") return "#213B79"; // Deep blue
            if (id === "acorn_buddy" || id === "acorn_buddy_enhanced") return "#1A4B2A"; // Deep forest green
            if (id === "tide_glass") return "#264D5A"; // Blue-grey
            if (id === "drift_puff") return "#2B4C5A"; // Steel blue
            if (id === "swallow_sweep") return "#4E2D1E"; // Warm brown
            if (id === "sun_drum") return "#165A33"; // Dark green contrast
            if (id === "shell_gleam") return "#0E5248"; // Deep sea green
            if (id === "incense_drift") return "#53331E"; // Warm brown
            if (id === "foam_crest") return "#143B57"; // Deep blue
            if (id === "quench_mist") return "#0D524F"; // Steel teal
            if (id === "berry_fizz") return "#4A1A4A"; // Deep purple
            if (id === "citrus_pop") return "#7A4A1A"; // Deep orange-brown
            if (id === "sunset_beach") return "#2A1A4A"; // Deep purple
            if (id === "autumn_fade") return "#0f172a"; // Deep charcoal for contrast across full spectrum
            if (id === "cotton_candy") return "#831843"; // Deep pink for vibrant contrast
            if (id === "rainbow") return "#0f172a"; // Deep charcoal for multi-color contrast
            if (id === "sunset") return "#1e1b4b"; // Deep indigo for vibrant sunset contrast
            
            return "#064e3b"; // Default emerald
          };
          
          // Phoenix Heart Enhanced: Rare yellow flash system
          const isRareFlash = id === "phoenix_heart" && Math.random() < 0.12; // 12% chance
          const flickerColors = isRareFlash 
            ? ["#571616", "#dc2626", "#fbbf24", "#f59e0b", "#571616"] // Darker base, brighter peak
            : ["#571616", "#dc2626", "#571616"]; // Darker base for better contrast
          const flickerDuration = isRareFlash ? 0.25 : (0.7 + Math.random() * 0.5);
          const flickerTimes = isRareFlash ? [0, 0.2, 0.4, 0.6, 1] : [0, 0.5, 1];
          const flickerDelay = 2.0 + Math.random() * 4.0; // 2-6 second pause between flickers
          
          // Nebula Enhanced: Slow purple-to-white fade with transparency (more purple)
          const nebulaFadeColors = ["#7c3aed", "#9333ea", "#ddd6fe", "#9333ea", "#7c3aed"]; // Deeper purple → purple → light purple → back
          const nebulaOpacityValues = [0.8, 0.9, 1.0, 0.9, 0.8]; // Subtle transparency changes
          
          const eyeColor = getFaceColor();
          
          return eyeTracking ? (
            <>
              {/* Eyes with special effects for enhanced mythics */}
              <motion.circle 
                cx={24 + eyeOffset.left.x} 
                cy={30 + eyeOffset.left.y} 
                r="3.2" 
                fill={eyeColor}
                animate={id === "phoenix_heart" ? { 
                  cx: 24 + eyeOffset.left.x, 
                  cy: 30 + eyeOffset.left.y,
                  fill: flickerColors // Phoenix fire flicker
                } : id === "nebula" ? {
                  cx: 24 + eyeOffset.left.x, 
                  cy: 30 + eyeOffset.left.y,
                  fill: nebulaFadeColors, // Nebula purple-to-white fade
                  opacity: nebulaOpacityValues // Transparency effects
                } : { 
                  cx: 24 + eyeOffset.left.x, 
                  cy: 30 + eyeOffset.left.y 
                }}
                transition={id === "phoenix_heart" ? {
                  fill: { 
                    repeat: Infinity, 
                    duration: flickerDuration,
                    ease: "easeInOut",
                    times: flickerTimes,
                    repeatDelay: flickerDelay
                  },
                  cx: { type: "spring", stiffness: 300, damping: 30 },
                  cy: { type: "spring", stiffness: 300, damping: 30 }
                } : id === "nebula" ? {
                  fill: { 
                    repeat: Infinity, 
                    duration: 8.0, // Slow, dreamy fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  },
                  opacity: { 
                    repeat: Infinity, 
                    duration: 8.0, // Same timing as color fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  },
                  cx: { type: "spring", stiffness: 300, damping: 30 },
                  cy: { type: "spring", stiffness: 300, damping: 30 }
                } : { type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.circle 
                cx={40 + eyeOffset.right.x} 
                cy={30 + eyeOffset.right.y} 
                r="3.2" 
                fill={eyeColor}
                animate={id === "phoenix_heart" ? { 
                  cx: 40 + eyeOffset.right.x, 
                  cy: 30 + eyeOffset.right.y,
                  fill: flickerColors // Phoenix fire flicker
                } : id === "nebula" ? {
                  cx: 40 + eyeOffset.right.x, 
                  cy: 30 + eyeOffset.right.y,
                  fill: nebulaFadeColors, // Nebula purple-to-white fade
                  opacity: nebulaOpacityValues // Transparency effects
                } : { 
                  cx: 40 + eyeOffset.right.x, 
                  cy: 30 + eyeOffset.right.y 
                }}
                transition={id === "phoenix_heart" ? {
                  fill: { 
                    repeat: Infinity, 
                    duration: flickerDuration,
                    ease: "easeInOut",
                    times: flickerTimes,
                    repeatDelay: flickerDelay
                  },
                  cx: { type: "spring", stiffness: 300, damping: 30 },
                  cy: { type: "spring", stiffness: 300, damping: 30 }
                } : id === "nebula" ? {
                  fill: { 
                    repeat: Infinity, 
                    duration: 8.0, // Slow, dreamy fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  },
                  opacity: { 
                    repeat: Infinity, 
                    duration: 8.0, // Same timing as color fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  },
                  cx: { type: "spring", stiffness: 300, damping: 30 },
                  cy: { type: "spring", stiffness: 300, damping: 30 }
                } : { type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.circle 
                cx={24 + eyeOffset.left.x - 0.7} 
                cy={30 + eyeOffset.left.y - 0.7} 
                r="0.7" 
                fill="#ecfeff"
                animate={{ 
                  cx: 24 + eyeOffset.left.x - 0.7, 
                  cy: 30 + eyeOffset.left.y - 0.7 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.circle 
                cx={40 + eyeOffset.right.x - 0.7} 
                cy={30 + eyeOffset.right.y - 0.7} 
                r="0.7" 
                fill="#ecfeff"
                animate={{ 
                  cx: 40 + eyeOffset.right.x - 0.7, 
                  cy: 30 + eyeOffset.right.y - 0.7 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </>
          ) : (
            <>
                          {/* Static eyes with special effects for enhanced mythics */}
            <motion.circle 
              cx="24" 
              cy="30" 
              r="3.2" 
              fill={eyeColor}
              animate={id === "phoenix_heart" ? { 
                fill: flickerColors // Phoenix fire flicker
                } : id === "nebula" ? {
                fill: nebulaFadeColors, // Nebula purple-to-white fade
                opacity: nebulaOpacityValues // Transparency effects
              } : {}}
              transition={id === "phoenix_heart" ? {
                repeat: Infinity, 
                duration: flickerDuration,
                ease: "easeInOut",
                times: flickerTimes,
                repeatDelay: flickerDelay
                } : id === "nebula" ? {
                fill: { 
                  repeat: Infinity, 
                  duration: 8.0, // Slow, dreamy fade
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1]
                },
                opacity: { 
                  repeat: Infinity, 
                  duration: 8.0, // Same timing as color fade
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1]
                }
              } : {}}
              />
              <motion.circle 
                cx="40" 
                cy="30" 
                r="3.2" 
                fill={eyeColor}
                animate={id === "phoenix_heart" ? { 
                  fill: flickerColors // Phoenix fire flicker
                } : id === "nebula" ? {
                  fill: nebulaFadeColors, // Nebula purple-to-white fade
                  opacity: nebulaOpacityValues // Transparency effects
                } : {}}
                transition={id === "phoenix_heart" ? {
                  repeat: Infinity, 
                  duration: flickerDuration,
                  ease: "easeInOut",
                  times: flickerTimes,
                  repeatDelay: flickerDelay
                } : id === "nebula" ? {
                  fill: { 
                    repeat: Infinity, 
                    duration: 8.0, // Slow, dreamy fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  },
                  opacity: { 
                    repeat: Infinity, 
                    duration: 8.0, // Same timing as color fade
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  }
                } : {}}
              />
        <circle cx="23.3" cy="29.3" r="0.7" fill="#ecfeff" />
        <circle cx="39.3" cy="29.3" r="0.7" fill="#ecfeff" />
            </>
          );
        })()}
        {/* Mouth with special effects for enhanced mythics */}
        {(() => {
          if (id === "phoenix_heart") {
            // Phoenix fire flicker system for mouth
            const isRareFlash = Math.random() < 0.12;
            const flickerColors = isRareFlash 
              ? ["#571616", "#dc2626", "#fbbf24", "#f59e0b", "#571616"] // Darker base, brighter peak
              : ["#571616", "#dc2626", "#571616"]; // Darker base for better contrast
            const flickerDuration = isRareFlash ? 0.25 : (0.7 + Math.random() * 0.5);
            const flickerTimes = isRareFlash ? [0, 0.2, 0.4, 0.6, 1] : [0, 0.5, 1];
            const flickerDelay = 2.0 + Math.random() * 4.0;
            
            return (
              <motion.path 
                d={mouthPath} 
                stroke="#571616"
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                animate={{ 
                  stroke: flickerColors
                }}
                transition={{
                  repeat: Infinity, 
                  duration: flickerDuration,
                  ease: "easeInOut",
                  times: flickerTimes,
                  repeatDelay: flickerDelay
                }}
              />
            );
          } else if (id === "nebula") {
            // Nebula purple-to-white fade for mouth (more purple)
            const nebulaFadeColors = ["#7c3aed", "#9333ea", "#ddd6fe", "#9333ea", "#7c3aed"];
            
            return (
              <motion.path 
                d={mouthPath} 
                stroke="#9333ea"
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                animate={{ 
                  stroke: nebulaFadeColors
                }}
                transition={{
                  repeat: Infinity, 
                  duration: 8.0, // Same slow timing as eyes
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1]
                }}
              />
            );
          } else {
            // Default mouth for other enhanced mythics
            const mouthColor = id === "galaxy_swirl" ? "#0891b2" : 
                             id === "star_parade" ? "#f1f5f9" : 
                             id === "ionosong" ? "#6366f1" :
                             id === "mirage_enhanced" ? "#d97706" :
                             id === "frog_chorus_enhanced" ? "#15803d" :
                             id === "biolume_veil_enhanced" ? "#06b6d4" :
                             id === "echo_rune_enhanced" ? "#0f766e" :
                             id === "synthwave" ? "#ec4899" : 
                             id === "lava_flow_enhanced" ? "#dc2626" :  // Same as eyes
                             id === "aurora_veil_plus_enhanced" ? "#000000" :  // Same as eyes
                             id === "ripple_enhanced" ? "#000000" :  // Same as eyes
                             id === "moss" ? "#09402A" :  // Dark forest green for moss
                             id === "sky" ? "#16345A" :  // Deep blue-navy for sky contrast
                             id === "coral" ? "#1F2A2E" :  // Dark charcoal for coral contrast
                             id === "clover" ? "#0C4B2B" :  // Deep forest green for clover
                             id === "charcoal" ? "#4a5568" :  // Dark grey for charcoal ash look
                             // Enhanced uncommon slimes
                             (id === "spring_fade" || id === "spring_fade_enhanced") ? "#0F5132" :
                             (id === "blue_lagoon" || id === "blue_lagoon_enhanced") ? "#0A2752" :
                             (id === "sea_breeze" || id === "sea_breeze_enhanced") ? "#094A45" :
                             (id === "raindrop" || id === "raindrop_enhanced") ? "#213B79" :
                             (id === "acorn_buddy" || id === "acorn_buddy_enhanced") ? "#1A4B2A" :
                             id === "tide_glass" ? "#264D5A" :
                             id === "drift_puff" ? "#2B4C5A" :
                             id === "swallow_sweep" ? "#4E2D1E" :
                             id === "sun_drum" ? "#165A33" :
                             id === "shell_gleam" ? "#0E5248" :
                             id === "incense_drift" ? "#53331E" :
                             id === "foam_crest" ? "#143B57" :
                             id === "quench_mist" ? "#0D524F" :
                             id === "berry_fizz" ? "#4A1A4A" :
                             id === "citrus_pop" ? "#7A4A1A" :
                             id === "sunset_beach" ? "#2A1A4A" :
                             id === "autumn_fade" ? "#0f172a" :  // Deep charcoal for contrast across full spectrum
                             id === "cotton_candy" ? "#831843" :  // Deep pink for vibrant contrast
                             id === "rainbow" ? "#0f172a" :  // Deep charcoal for multi-color contrast
                             id === "sunset" ? "#1e1b4b" :  // Deep indigo for vibrant sunset contrast
                             "#064e3b";
            return (
              <path 
                d={mouthPath} 
                stroke={mouthColor}
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
              />
            );
          }
        })()}
        
        {/* Inspiration Slimes Visual Effects */}
        
        {/* Cave / Shadow / Earth Theme */}
        {id === "deep_dark_cave" && (
          <g>
            {/* Breathing vignette hole effect */}
            <motion.circle
              cx={32}
              cy={34}
              r={18}
              fill="none"
              stroke="#0b1026"
              strokeWidth="3"
              opacity={0.6}
              animate={{
                scale: [0.96, 1.02, 0.96]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.5,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx={32}
              cy={34}
              r={12}
              fill="#0b1026"
              opacity={0.3}
              animate={{
                scale: [1.0, 1.06, 1.0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.5,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "never_ending_cave" && (
          <g>
            {/* Concentric tunnel rings */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.circle
                key={`ring-${i}`}
                cx={32}
                cy={34}
                r={8 + (i * 6)}
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                opacity={0.4}
                animate={{
                  r: [8 + (i * 6), 2 + (i * 6), 8 + (i * 6)],
                  opacity: [0.4, 0.1, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>
        )}

        {id === "spooky_cave" && (
          <g>
            {/* Rolling mist near bottom */}
            <motion.ellipse
              cx={32}
              cy={45}
              rx={15}
              ry={4}
              fill="#06b6d4"
              opacity={0.2}
              animate={{
                cx: [32, 42, 32],
                opacity: [0, 0.12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "fault_glow" && (
          <g>
            {/* Amber fault line seam */}
            <motion.path
              d="M20 25 Q28 30 35 40 Q40 45 45 50"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
              opacity={0.6}
              animate={{
                opacity: [0.6, 1.0, 0.6]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "aftershock" && (
          <g>
            {/* Expanding ripple oval */}
            <motion.ellipse
              cx={32}
              cy={36}
              rx={8}
              ry={6}
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
              opacity={0.5}
              animate={{
                rx: [8, 18, 8],
                ry: [6, 12, 6],
                opacity: [0.5, 0.1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.8,
                ease: "easeOut"
              }}
            />
          </g>
        )}

        {/* Fire / Heat / Ash Theme */}
        {id === "ember_rim" && (
          <g>
            {/* Glowing ember ring */}
            <motion.circle
              cx={32}
              cy={34}
              r={20}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity={0.7}
              animate={{
                opacity: [0, 0.12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "ashfall" && (
          <g>
            {/* Drifting ash flecks */}
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.circle
                key={`ash-${i}`}
                cx={25 + (i * 10)}
                cy={20}
                r={1}
                fill="#7c2d12"
                opacity={0.6}
                animate={{
                  cy: [20, 48],
                  opacity: [0.6, 0.2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  delay: i * 2,
                  ease: "linear"
                }}
              />
            ))}
          </g>
        )}

        {id === "volcanic_glass" && (
          <g>
            {/* Glassy diagonal highlight */}
            <motion.path
              d="M15 20 L45 35"
              stroke="#64748b"
              strokeWidth="3"
              opacity={0.8}
              animate={{
                x: [0, 10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {/* Sand / Wind Theme */}
        {id === "sandstorm_wall" && (
          <g>
            {/* Sliding gradient wall */}
            <motion.rect
              x={45}
              y={15}
              width={8}
              height={35}
              fill="#f59e0b"
              opacity={0.3}
              animate={{
                x: [45, 15, 45]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "dune_surge" && (
          <g>
            {/* S-curve dune band */}
            <motion.path
              d="M10 30 Q25 25 40 35 Q50 40 60 35"
              stroke="#eab308"
              strokeWidth="4"
              fill="none"
              opacity={0.6}
              animate={{
                x: [0, 8, 0],
                y: [0, -4, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.5,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "whirlwind_edge" && (
          <g>
            {/* Rotating spiral */}
            <motion.path
              d="M45 25 Q50 30 48 35 Q45 40 40 38 Q35 35 37 30 Q40 25 45 25"
              stroke="#fde68a"
              strokeWidth="2"
              fill="none"
              opacity={0.5}
              animate={{
                rotate: [0, 8, -8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {/* Water / Tides / Storm Theme */}
        {id === "riptide_bowl" && (
          <g>
            {/* Bowl rim with shimmer */}
            <motion.ellipse
              cx={32}
              cy={34}
              rx={18}
              ry={16}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              opacity={0.5}
              animate={{
                rx: [18, 28, 18],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "whirlpool_eye" && (
          <g>
            {/* Spiral rings tightening */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.circle
                key={`whirl-${i}`}
                cx={32}
                cy={34}
                r={15 - (i * 4)}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="1"
                opacity={0.4}
                animate={{
                  r: [15 - (i * 4), 9 - (i * 4), 15 - (i * 4)],
                  rotate: [0, 360]
                }}
                transition={{
                  r: {
                    repeat: Infinity,
                    duration: 6.2,
                    ease: "easeInOut"
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear"
                  }
                }}
              />
            ))}
          </g>
        )}

        {id === "monsoon_sheet" && (
          <g>
            {/* Vertical rain sheet */}
            <motion.rect
              x={28}
              y={10}
              width={6}
              height={40}
              fill="#1e40af"
              opacity={0.1}
              animate={{
                y: [10, 30, 10],
                opacity: [0, 0.1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.5,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {/* Ice / Aurora / Cold Theme */}
        {id === "crevasse_light" && (
          <g>
            {/* White crevasse slash */}
            <motion.path
              d="M20 15 L45 50"
              stroke="#ffffff"
              strokeWidth="2"
              opacity={0.6}
              animate={{
                opacity: [0.6, 1.0, 0.6]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "black_ice" && (
          <g>
            {/* Glass wedge highlight */}
            <motion.path
              d="M25 20 L40 30 L35 40 L20 30 Z"
              fill="#cbd5e1"
              opacity={0.4}
              animate={{
                x: [0, 8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "aurora_curtain" && (
          <g>
            {/* Vertical color curtain */}
            <motion.rect
              x={28}
              y={15}
              width={8}
              height={30}
              fill="url(#aurora-gradient)"
              opacity={0.12}
              animate={{
                x: [28, 36, 28],
                scaleX: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 7.5,
                ease: "easeInOut"
              }}
            />
            <defs>
              <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* Sky / Lightning / Space Theme */}
        {id === "thunder_shelf" && (
          <g>
            {/* Anvil shelf highlight band */}
            <motion.rect
              x={15}
              y={25}
              width={35}
              height={8}
              fill="#0ea5e9"
              opacity={0.5}
              animate={{
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "static_sheet" && (
          <g>
            {/* Blinking static lines */}
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.line
                key={`static-${i}`}
                x1={20 + (i * 15)}
                y1={20}
                x2={25 + (i * 15)}
                y2={20}
                stroke="#10b981"
                strokeWidth="2"
                opacity={0}
                animate={{
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.15,
                  repeatDelay: 8,
                  delay: i * 0.1
                }}
              />
            ))}
          </g>
        )}

        {id === "solar_haze" && (
          <g>
            {/* Radial haze breathing */}
            <motion.circle
              cx={32}
              cy={34}
              r={16}
              fill="#fde047"
              opacity={0.2}
              animate={{
                scale: [1.0, 1.06, 1.0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.8,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "gravity_well" && (
          <g>
            {/* Lensing ring warping */}
            <motion.circle
              cx={40}
              cy={30}
              r={8}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity={0.6}
              animate={{
                r: [8, 14, 8],
                cx: [40, 36, 40]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "prism_mist" && (
          <g>
            {/* Triangular prism highlight */}
            <motion.path
              d="M25 25 L35 20 L30 35 Z"
              fill="url(#prism-gradient)"
              opacity={0.5}
              animate={{
                x: [0, 8, 0],
                opacity: [0.5, 0.8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            />
            <defs>
              <linearGradient id="prism-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* Metal / Forge / Industrial Theme */}
        {id === "forge_heat" && (
          <g>
            {/* Heat bloom at bottom */}
            <motion.ellipse
              cx={32}
              cy={45}
              rx={12}
              ry={6}
              fill="#f59e0b"
              opacity={0.4}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                ry: [6, 8, 6]
              }}
              transition={{
                repeat: Infinity,
                duration: 6.2,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {id === "quench_mist_inspiration" && (
          <g>
            {/* Steam plume wedge */}
            <motion.path
              d="M28 15 Q32 10 36 15 Q35 25 32 30 Q29 25 28 15"
              fill="#64748b"
              opacity={0.2}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 0.12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut"
              }}
            />
          </g>
        )}

        {/* Enhanced Mythic Effects */}
        {id === "nebula" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="nebula-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#nebula-clip)">
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
        )}
        
        {id === "galaxy_swirl" && (
          <g>
            {/* Clip path to keep stars inside slime body */}
            <defs>
              <clipPath id="galaxy-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            
            {/* Slow swirl rotation base layer - stars can go outside, dark rim will be on top */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 240, ease: "linear" }} // 0.25°/s = 240s for full rotation
              style={{ transformOrigin: "32px 34px" }}
            >
              {/* 14 tiny stars orbiting at two depths - galaxy swirl */}
              {Array.from({ length: 14 }).map((_, i) => {
                const angle = (i * 360) / 14;
                const depth = i % 2 === 0 ? 0.7 : 1.0; // Two depth layers
                const radius = 14 + (depth * 3); // Smaller radius to keep stars inside body (14-17px from center)
                const x = 32 + Math.cos((angle * Math.PI) / 180) * radius;
                const y = 34 + Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={depth === 0.7 ? 0.8 : 1.2}
                    fill="#ffffff" // All stars white again
                    opacity={depth === 0.7 ? 0.6 : 0.8}
                    animate={{ 
                      opacity: [
                        depth === 0.7 ? 0.6 : 0.8, 
                        depth === 0.7 ? 1.0 : 1.0, 
                        depth === 0.7 ? 0.4 : 0.6
                      ] 
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.4 + (i * 0.2), // Random twinkle timing
                      repeatDelay: 0.6 + (i * 0.1),
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </motion.g>
            
            {/* Additional static twinkles inside body */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.circle
                key={`twinkle-${i}`}
                cx={18 + (i * 5)}
                cy={26 + (i % 3) * 4}
                r={0.5}
                fill="#a5b4fc"
                opacity={0.4}
                animate={{ opacity: [0.4, 0.9, 0.2] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8 + (i * 0.3),
                  repeatDelay: 0.8 + (i * 0.2),
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Dark rim stroke on top to contain the stars visually */}
            <path 
              d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
              fill="none"
              stroke="#1a2454"
              strokeWidth="1.5"
            />
          </g>
        )}
        
        {id === "star_parade" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="star-parade-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#star-parade-clip)">
              {/* Star Parade - marching stars in formation */}
              {Array.from({ length: 8 }).map((_, i) => {
                const yLevel = 22 + (i % 3) * 8; // 3 rows of stars
                const startX = -10 + (i * 6); // Spaced formation
                
                return (
                  <motion.circle
                    key={`parade-${i}`}
                    cx={startX}
                    cy={yLevel}
                    r={i % 2 === 0 ? 1.5 : 1.0} // Different sizes for depth
                    fill="#f8fafc"
                    opacity={0.9}
                    animate={{
                      cx: [startX, startX + 64, startX + 128], // March across and exit
                      opacity: [0, 0.9, 0.9, 0] // Fade in/out at edges
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6 + (i * 0.3), // Slightly staggered timing
                      ease: "linear",
                      delay: i * 0.4 // Delayed start for parade effect
                    }}
                  />
                );
              })}
              
              {/* Sparkling trail behind stars */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={`sparkle-${i}`}
                  cx={12 + (i * 4)}
                  cy={26 + (i % 4) * 3}
                  r={0.4}
                  fill="#e2e8f0"
                  opacity={0.6}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.0,
                    delay: (i * 0.15) + 0.5, // Follow behind the parade
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "ionosong" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="ionosong-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#ionosong-clip)">
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
        )}
        
        {id === "mirage_enhanced" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="mirage-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#mirage-clip)">
              {/* Heat shimmer waves - vertical wavy distortion */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.path
                  key={`shimmer-${i}`}
                  d={`M${12 + i * 8},20 Q${16 + i * 8},${26 + Math.sin(i) * 4} ${12 + i * 8},32 T${12 + i * 8},44`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  opacity={0.6}
                  animate={{
                    d: [
                      `M${12 + i * 8},20 Q${16 + i * 8},${26 + Math.sin(i) * 4} ${12 + i * 8},32 T${12 + i * 8},44`,
                      `M${12 + i * 8},20 Q${14 + i * 8},${28 + Math.sin(i + 1) * 6} ${12 + i * 8},32 T${12 + i * 8},44`,
                      `M${12 + i * 8},20 Q${18 + i * 8},${24 + Math.sin(i + 2) * 5} ${12 + i * 8},32 T${12 + i * 8},44`
                    ],
                    opacity: [0.6, 0.3, 0.8, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.0 + (i * 0.2),
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Floating heat particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.circle
                  key={`heat-${i}`}
                  cx={16 + (i * 6)}
                  cy={40}
                  r={0.8}
                  fill="#f59e0b"
                  opacity={0.7}
                  animate={{
                    cy: [40, 22, 40],
                    opacity: [0, 0.7, 0],
                    scale: [0.5, 1.2, 0.8]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.0,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "frog_chorus_enhanced" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="frog-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#frog-clip)">
              {/* Pond ripples - concentric circles */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.circle
                  key={`ripple-${i}`}
                  cx={32}
                  cy={38}
                  r={4 + (i * 6)}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1"
                  opacity={0.6}
                  animate={{
                    r: [4 + (i * 6), 20 + (i * 6)],
                    opacity: [0.6, 0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Chorus sound waves */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.ellipse
                  key={`sound-${i}`}
                  cx={32}
                  cy={30}
                  rx={6 + (i * 4)}
                  ry={3 + (i * 2)}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  opacity={0.5}
                  animate={{
                    rx: [6 + (i * 4), 16 + (i * 4)],
                    ry: [3 + (i * 2), 8 + (i * 2)],
                    opacity: [0.5, 0.1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "biolume_veil_enhanced" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="biolume-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#biolume-clip)">
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
              
              {/* Veil shimmer effect */}
              <motion.ellipse
                cx={32}
                cy={34}
                rx={18}
                ry={12}
                fill="none"
                stroke="#16e0ae"
                strokeWidth="0.5"
                opacity={0.4}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  strokeWidth: [0.5, 1.5, 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "echo_rune_enhanced" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="echo-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#echo-clip)">
              {/* Mystical runes appearing and fading */}
              {[
                { x: 20, y: 26, symbol: "◊" },
                { x: 44, y: 28, symbol: "△" },
                { x: 32, y: 22, symbol: "○" },
                { x: 24, y: 40, symbol: "◈" },
                { x: 40, y: 42, symbol: "◇" }
              ].map((rune, i) => (
                <motion.text
                  key={`rune-${i}`}
                  x={rune.x}
                  y={rune.y}
                  fill="#14b8a6"
                  fontSize="6"
                  textAnchor="middle"
                  opacity={0}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.0,
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                >
                  {rune.symbol}
                </motion.text>
              ))}
              
              {/* Echo waves expanding from runes */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={`echo-${i}`}
                  cx={32}
                  cy={34}
                  r={6 + (i * 4)}
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="1"
                  opacity={0.5}
                  animate={{
                    r: [6 + (i * 4), 18 + (i * 4)],
                    opacity: [0.5, 0.1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.0,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "synthwave" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="synthwave-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#synthwave-clip)">
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
        )}
        
        {id === "phoenix_heart" && (
          <g>
            {/* Heartbeat pulse overlay */}
            <motion.ellipse
              cx={32}
              cy={34}
              rx={20}
              ry={18}
              fill="#ff6b3d"
              opacity={0.2}
              animate={{ 
                scale: [1.0, 1.06, 1.0],
                opacity: [0.2, 0.4, 0.1]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2, // Heartbeat timing
                ease: "easeInOut"
              }}
            />
            
            {/* Rising ember motes */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.g key={`ember-${i}`}>
                <motion.circle
                  cx={24 + (i * 2)}
                  cy={50}
                  r={1}
                  fill="#ff6b3d"
                  animate={{
                    cy: [50, 15],
                    opacity: [0.8, 0.3],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.0 + (i * 0.2),
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
                
                {/* Glow trail for each ember */}
                <motion.ellipse
                  cx={24 + (i * 2)}
                  cy={50}
                  rx={2}
                  ry={4}
                  fill="#ff6b3d"
                  opacity={0.3}
                  animate={{
                    cy: [50, 15],
                    opacity: [0.3, 0],
                    ry: [4, 8]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.0 + (i * 0.2),
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              </motion.g>
            ))}
            
            {/* Occasional flare effect */}
            <motion.circle
              cx={32}
              cy={34}
              r={25}
              fill="#ff7a3c"
              opacity={0}
              animate={{ 
                scale: [1.0, 1.06, 1.0],
                opacity: [0, 0.15, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.3,
                repeatDelay: 4.0, // Occasional flare every ~4 seconds
                ease: "easeOut"
              }}
            />
          </g>
        )}
        
        {/* Enhanced Epic Effects */}
        {id === "lava_flow_enhanced" && (
          <g>
            {/* Clip path to keep effects inside slime body */}
            <defs>
              <clipPath id="lava-enhanced-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
              {/* Animated gradient for body */}
              <radialGradient id="lava-animated-gradient" cx="50%" cy="40%">
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
              fill="url(#lava-animated-gradient)"
              opacity={0.6}
            />
            
            <g clipPath="url(#lava-enhanced-clip)">
              {/* Orange ember sparks floating upward slowly */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={`orange-ember-${i}`}
                  cx={20 + (i * 4) + (i % 2) * 6}
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
        )}
        
        {id === "aurora_veil_enhanced" && (
          <g>
            <defs>
              <clipPath id="aurora-enhanced-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#aurora-enhanced-clip)">
              {/* Sweeping highlights */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.line
                  key={`sweep-${i}`}
                  x1={10}
                  y1={18 + (i * 6)}
                  x2={54}
                  y2={18 + (i * 6)}
                  stroke="#60a5fa"
                  strokeWidth="2"
                  opacity={0.5}
                  animate={{
                    x1: [10, 54, 10],
                    x2: [20, 64, 20],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.0,
                    delay: i * 0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Aurora color waves */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.ellipse
                  key={`aurora-wave-${i}`}
                  cx={32}
                  cy={34}
                  rx={10 + (i * 6)}
                  ry={6 + (i * 3)}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  opacity={0.4}
                  animate={{
                    rx: [10 + (i * 6), 20 + (i * 6)],
                    ry: [6 + (i * 3), 12 + (i * 3)],
                    opacity: [0.4, 0.1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5.0 + (i * 0.5),
                    delay: i * 1.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "glacier_enhanced" && (
          <g>
            <defs>
              <clipPath id="glacier-enhanced-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#glacier-enhanced-clip)">
              {/* Sliding ice walls */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.rect
                  key={`ice-wall-${i}`}
                  x={12 + (i * 8)}
                  y={12}
                  width={3}
                  height={40}
                  fill="#93c5fd"
                  opacity={0.6}
                  animate={{
                    y: [12, 22, 12],
                    opacity: [0.6, 0.3, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.0 + (i * 0.3),
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Frost particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={`frost-${i}`}
                  cx={15 + (i * 3.5)}
                  cy={16 + (i % 4) * 8}
                  r={0.6}
                  fill="#e0f2fe"
                  opacity={0.8}
                  animate={{
                    scale: [1, 0.4, 1],
                    opacity: [0.8, 0.3, 0.8],
                    y: [0, -2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.0 + (i % 3) * 0.5,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {id === "aurora_veil_plus_enhanced" && (
          <g>
            <defs>
              <clipPath id="aurora-plus-enhanced-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
              {/* Flowing aurora gradient */}
              <linearGradient id="aurora-flow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
              <linearGradient id="aurora-flow-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
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
            <g clipPath="url(#aurora-plus-enhanced-clip)">
              {/* Main flowing aurora bands */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.rect
                  key={`aurora-flow-${i}`}
                  x={12 + (i * 8)}
                  y={6}
                  width={12}
                  height={52}
                  fill="url(#aurora-flow-gradient)"
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
                  fill="url(#aurora-flow-gradient-2)"
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
              
              {/* Aurora sparkle particles (kept from original) */}
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
                    fill: [
                      ["#43e0c6", "#b189ff", "#22d3ee", "#c4b5fd"][i % 4],
                      ["#22d3ee", "#c4b5fd", "#43e0c6", "#b189ff"][(i + 1) % 4],
                      ["#43e0c6", "#b189ff", "#22d3ee", "#c4b5fd"][i % 4]
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5 + (i % 4) * 0.4,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          </g>
        )}
        
        {/* Enhanced Rare Effects - Static Patterns Only */}
        {id === "ripple_enhanced" && (
          <g>
            <defs>
              <clipPath id="ripple-enhanced-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#ripple-enhanced-clip)">
              {/* Static concentric ripple rings */}
              <circle
                cx={32}
                cy={34}
                r={12}
                fill="none"
                stroke="#0F5C57"
                strokeWidth="1.2"
                opacity={0.25}
              />
              <circle
                cx={32}
                cy={34}
                r={18}
                fill="none"
                stroke="#0F5C57"
                strokeWidth="1"
                opacity={0.20}
              />
              <circle
                cx={32}
                cy={34}
                r={24}
                fill="none"
                stroke="#0F5C57"
                strokeWidth="0.8"
                opacity={0.15}
              />
              
              {/* Secondary ripple pattern with lighter color */}
              <circle
                cx={32}
                cy={34}
                r={9}
                fill="none"
                stroke="#6FC6BE"
                strokeWidth="0.8"
                opacity={0.30}
              />
              <circle
                cx={32}
                cy={34}
                r={15}
                fill="none"
                stroke="#6FC6BE"
                strokeWidth="0.6"
                opacity={0.25}
              />
              <circle
                cx={32}
                cy={34}
                r={21}
                fill="none"
                stroke="#6FC6BE"
                strokeWidth="0.5"
                opacity={0.20}
              />
              
              {/* Static water surface texture */}
              {Array.from({ length: 8 }).map((_, i) => (
                <ellipse
                  key={`water-texture-${i}`}
                  cx={16 + (i * 3)}
                  cy={26 + (i % 3) * 4}
                  rx={1.2}
                  ry={0.6}
                  fill="#BDEDE4"
                  opacity={0.35}
                  transform={`rotate(${(i * 25) % 360} ${16 + (i * 3)} ${26 + (i % 3) * 4})`}
                />
              ))}
              
              {/* Static droplet pattern */}
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={`static-droplet-${i}`}
                  cx={22 + (i * 4)}
                  cy={28 + (i % 2) * 8}
                  r={0.8}
                  fill="#BDEDE4"
                  opacity={0.40}
                />
              ))}
            </g>
          </g>
        )}
        
        {/* Epic Inspiration Effects */}
        {id === "blaze_knight" && (
          <g>
            <defs>
              <clipPath id="blaze-knight-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#blaze-knight-clip)">
              {/* Diagonal shield band with gleam sweep */}
              <motion.line
                x1={16}
                y1={20}
                x2={48}
                y2={40}
                stroke="#f97316"
                strokeWidth="3"
                opacity={0.3}
              />
              <motion.line
                x1={16}
                y1={20}
                x2={48}
                y2={40}
                stroke="#fbbf24"
                strokeWidth="1"
                opacity={0.6}
                animate={{
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "jungle_raider" && (
          <g>
            <defs>
              <clipPath id="jungle-raider-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#jungle-raider-clip)">
              {/* Satchel strap crossing */}
              <motion.path
                d="M20 16 Q32 24 44 32"
                stroke="#065f46"
                strokeWidth="2"
                fill="none"
                opacity={0.4}
              />
              <motion.path
                d="M20 16 Q32 24 44 32"
                stroke="#22c55e"
                strokeWidth="1"
                fill="none"
                opacity={0.7}
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "cave_explorer" && (
          <g>
            <defs>
              <clipPath id="cave-explorer-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#cave-explorer-clip)">
              {/* Off-center lamp halo */}
              <motion.circle
                cx={28}
                cy={26}
                r={8}
                fill="none"
                stroke="#fde68a"
                strokeWidth="1"
                opacity={0.4}
                animate={{
                  r: [8, 8.5, 8],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.5,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "sky_racer" && (
          <g>
            <defs>
              <clipPath id="sky-racer-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#sky-racer-clip)">
              {/* Racing stripe arc */}
              <motion.path
                d="M12 18 Q32 14 52 18"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                opacity={0.5}
                animate={{
                  x: [-3, 3, -3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.0,
                  ease: "easeInOut"
                }}
              />
              <motion.path
                d="M12 20 Q32 16 52 20"
                stroke="#22d3ee"
                strokeWidth="1"
                fill="none"
                opacity={0.6}
                animate={{
                  x: [-3, 3, -3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "desert_outrider" && (
          <g>
            <defs>
              <clipPath id="desert-outrider-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#desert-outrider-clip)">
              {/* Chevron on chest */}
              <motion.path
                d="M24 28 L32 24 L40 28"
                stroke="#f59e0b"
                strokeWidth="2"
                fill="none"
                opacity={0.4}
                animate={{
                  opacity: [0.4, 0.5, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "turbo_bot" && (
          <g>
            <defs>
              <clipPath id="turbo-bot-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#turbo-bot-clip)">
              {/* Vent slots */}
              <line x1={24} y1={28} x2={28} y2={28} stroke="#9ca3af" strokeWidth="1" opacity={0.5} />
              <line x1={36} y1={28} x2={40} y2={28} stroke="#9ca3af" strokeWidth="1" opacity={0.5} />
              {/* Vent glow blinks */}
              <motion.line
                x1={24} y1={28} x2={28} y2={28}
                stroke="#22d3ee"
                strokeWidth="2"
                opacity={0}
                animate={{
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  repeatDelay: 7.0,
                  ease: "easeInOut"
                }}
              />
              <motion.line
                x1={36} y1={28} x2={40} y2={28}
                stroke="#22d3ee"
                strokeWidth="2"
                opacity={0}
                animate={{
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  repeatDelay: 9.0,
                  delay: 0.2,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "neon_circuit" && (
          <g>
            <defs>
              <clipPath id="neon-circuit-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#neon-circuit-clip)">
              {/* Circuit trace loop */}
              <motion.path
                d="M20 26 L44 26 L44 42 L20 42 Z"
                stroke="#1e1b4b"
                strokeWidth="2"
                fill="none"
                opacity={0.3}
              />
              <motion.circle
                r={1}
                fill="#8b5cf6"
                opacity={0}
                animate={{
                  opacity: [0, 0.14, 0],
                  offsetDistance: ["0%", "100%"]
                }}
                style={{
                  offsetPath: "path('M20 26 L44 26 L44 42 L20 42 Z')"
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  repeatDelay: 6.8,
                  ease: "linear"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "magnet_core" && (
          <g>
            <defs>
              <clipPath id="magnet-core-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#magnet-core-clip)">
              {/* U-magnet silhouette */}
              <path d="M24 22 L24 36 L28 36 L28 26 L36 26 L36 36 L40 36 L40 22" 
                    stroke="#374151" strokeWidth="2" fill="none" opacity={0.4} />
              {/* Magnet ripple ring */}
              <motion.circle
                cx={32}
                cy={34}
                r={8}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1"
                opacity={0.5}
                animate={{
                  r: [8, 18],
                  opacity: [0.5, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.5,
                  ease: "easeOut"
                }}
              />
            </g>
          </g>
        )}
        
        {id === "plasma_pilot" && (
          <g>
            <defs>
              <clipPath id="plasma-pilot-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#plasma-pilot-clip)">
              {/* Visor glare arc */}
              <motion.path
                d="M20 20 Q32 16 44 20"
                stroke="#22d3ee"
                strokeWidth="2"
                fill="none"
                opacity={0.6}
                animate={{
                  x: [-4, 4, -4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7.0,
                  ease: "easeInOut"
                }}
              />
            </g>
          </g>
        )}
        
        {/* Creatures, Monsters, Dinos */}
        {id === "rex_roar" && (
          <g>
            <defs>
              <clipPath id="rex-roar-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#rex-roar-clip)">
              <motion.path d="M18 24 L46 24" stroke="#16a34a" strokeWidth="2" opacity={0.3}
                animate={{ x: [-2.5, 2.5, -2.5], y: [-2.5, 2.5, -2.5] }}
                transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "thunder_lizard" && (
          <g>
            <defs>
              <clipPath id="thunder-lizard-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#thunder-lizard-clip)">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.rect key={i} x={20 + (i * 6)} y={18} width={2} height={4} fill="#a16207" opacity={0.4}
                  animate={{ opacity: [0.4, 0.48, 0.4] }}
                  transition={{ repeat: Infinity, duration: 8.0, delay: i * 0.5, ease: "easeInOut" }} />
              ))}
            </g>
          </g>
        )}
        
        {id === "slimezilla_jr" && (
          <g>
            <defs>
              <clipPath id="slimezilla-jr-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#slimezilla-jr-clip)">
              <motion.path d="M20 20 Q32 16 44 20" stroke="#0d9488" strokeWidth="2" fill="none" opacity={0.5}
                animate={{ x: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 7.0, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {/* Sports & Speed */}
        {id === "goal_streak" && (
          <g>
            <defs>
              <clipPath id="goal-streak-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#goal-streak-clip)">
              <path d="M18 28 Q32 24 46 28" stroke="#f3f4f6" strokeWidth="2" fill="none" opacity={0.4} />
              <motion.line x1={16} y1={30} x2={48} y2={30} stroke="#22c55e" strokeWidth="1" opacity={0}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 8.4, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "home_run" && (
          <g>
            <defs>
              <clipPath id="home-run-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#home-run-clip)">
              <path d="M20 26 Q32 22 44 26" stroke="#dc2626" strokeWidth="1" fill="none" opacity={0.5} />
              <motion.path d="M20 26 Q32 22 44 26" stroke="#991b1b" strokeWidth="1" fill="none" opacity={0.3}
                animate={{ x: [-1, 1, -1] }}
                transition={{ repeat: Infinity, duration: 7.0, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "drift_king" && (
          <g>
            <defs>
              <clipPath id="drift-king-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#drift-king-clip)">
              <motion.path d="M18 26 Q28 30 32 26 Q36 22 46 26" stroke="#94a3b8" strokeWidth="2" fill="none" opacity={0.5}
                animate={{ x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {/* Pirates, Space, Fantasy */}
        {id === "star_captain" && (
          <g>
            <defs>
              <clipPath id="star-captain-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#star-captain-clip)">
              <path d="M32 24 L33 26 L35 26 L33.5 27.5 L34 29.5 L32 28.5 L30 29.5 L30.5 27.5 L29 26 L31 26 Z" 
                    fill="#fbbf24" opacity={0.4} />
              <motion.path d="M32 24 L33 26 L35 26 L33.5 27.5 L34 29.5 L32 28.5 L30 29.5 L30.5 27.5 L29 26 L31 26 Z" 
                    fill="#fbbf24" opacity={0}
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 8.4, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "coral_corsair" && (
          <g>
            <defs>
              <clipPath id="coral-corsair-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#coral-corsair-clip)">
              <motion.ellipse cx={30} cy={22} rx={6} ry={3} fill="none" stroke="#0ea5e9" strokeWidth="1" opacity={0.5}
                animate={{ transform: ["rotate(0deg)", "rotate(8deg)", "rotate(0deg)"] }}
                transition={{ repeat: Infinity, duration: 6.0, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "rune_sprinter" && (
          <g>
            <defs>
              <clipPath id="rune-sprinter-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#rune-sprinter-clip)">
              <line x1={26} y1={26} x2={30} y2={26} stroke="#d97706" strokeWidth="2" opacity={0.4} />
              <line x1={34} y1={28} x2={38} y2={28} stroke="#d97706" strokeWidth="2" opacity={0.4} />
              <motion.line x1={26} y1={26} x2={30} y2={26} stroke="#f59e0b" strokeWidth="2" opacity={0}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 6.8, ease: "easeInOut" }} />
              <motion.line x1={34} y1={28} x2={38} y2={28} stroke="#f59e0b" strokeWidth="2" opacity={0}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 6.6, delay: 0.2, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "meteor_glide" && (
          <g>
            <defs>
              <clipPath id="meteor-glide-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#meteor-glide-clip)">
              <motion.line x1={20} y1={22} x2={44} y2={36} stroke="#94a3b8" strokeWidth="2" opacity={0.5}
                animate={{ x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }} />
              <motion.circle cx={44} cy={36} r={1} fill="#e2e8f0" opacity={0}
                animate={{ opacity: [0, 0.12, 0], x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 6.35, ease: "easeInOut" }} />
            </g>
          </g>
        )}
        
        {id === "storm_rider" && (
          <g>
            <defs>
              <clipPath id="storm-rider-clip">
                <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#storm-rider-clip)">
              <motion.path d="M28 20 L32 28 L30 28 L34 36" stroke="#06b6d4" strokeWidth="2" fill="none" opacity={0.6}
                animate={{ opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }} />
              <motion.circle cx={32} cy={34} r={6} fill="none" stroke="#22d3ee" strokeWidth="1" opacity={0.4}
                animate={{ r: [6, 14], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 6.0, ease: "easeOut" }} />
            </g>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
