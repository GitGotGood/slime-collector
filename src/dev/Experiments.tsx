import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, MousePointer, Hand, Image, MessageCircle, Archive } from "lucide-react";
import { BiomeLayer } from "../assets/biomes";
import { PRODUCTION_SKINS, INSPIRATION_COMMON, INSPIRATION_UNCOMMON, INSPIRATION_RARE } from "../assets/all-skins";
import Slime from "../ui/components/Slime";

// Mouse tracking hook
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

// Eye tracking slime variants
function TrackingSlime({ 
  variant, 
  color = "#22c55e", 
  size = "w-32", 
  label 
}: { 
  variant: "subtle" | "full" | "proximity" | "direct"; 
  color?: string; 
  size?: string; 
  label: string;
}) {
  const slimeRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition();
  const [eyeOffset, setEyeOffset] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  const [isNearMouse, setIsNearMouse] = useState(false);

  useEffect(() => {
    if (!slimeRef.current) return;

    const slimeRect = slimeRef.current.getBoundingClientRect();
    const slimeCenterX = slimeRect.left + slimeRect.width / 2;
    const slimeCenterY = slimeRect.top + slimeRect.height / 2;

    // Calculate distance from mouse to slime center
    const distance = Math.sqrt(
      Math.pow(mousePos.x - slimeCenterX, 2) + 
      Math.pow(mousePos.y - slimeCenterY, 2)
    );
    
    const isNear = distance < 150; // 150px proximity threshold
    setIsNearMouse(isNear);

    // Skip eye tracking if proximity mode and mouse is far
    if (variant === "proximity" && !isNear) {
      setEyeOffset({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
      return;
    }

    // Calculate eye positions relative to slime
    const leftEyeX = slimeCenterX - slimeRect.width * 0.125; // Approximate left eye position
    const rightEyeX = slimeCenterX + slimeRect.width * 0.125; // Approximate right eye position
    const eyeY = slimeCenterY - slimeRect.height * 0.1; // Approximate eye height

    // Calculate angles and distances for each eye
    const calculateEyeOffset = (eyeX: number, eyeY: number) => {
      const deltaX = mousePos.x - eyeX;
      const deltaY = mousePos.y - eyeY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Normalize and apply movement limits based on variant
      let maxMovement, responsiveness;
      switch (variant) {
        case "subtle": 
          maxMovement = 0.8; 
          responsiveness = 50;
          break;
        case "full": 
          maxMovement = 1.5; 
          responsiveness = 50;
          break;
        case "proximity": 
          maxMovement = 1.2; 
          responsiveness = 50;
          break;
        case "direct":
          maxMovement = 1.8; // Reduced to keep eyes in sockets
          responsiveness = 20; // More responsive - shorter distance scaling
          break;
        default:
          maxMovement = 1.5;
          responsiveness = 50;
      }
      
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
  }, [mousePos, variant]);

  return (
    <div className="text-center space-y-2">
      <div ref={slimeRef} className={`${size} relative mx-auto ${variant === "proximity" && isNearMouse ? "ring-2 ring-blue-300" : ""}`}>
        <motion.div 
          initial={{ scale: 0.95 }} 
          animate={{ scale: [0.98, 1.02, 0.98] }} 
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            {/* Slime body */}
            <path 
              d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
              fill={color}
              stroke="#065f46"
              strokeWidth="1.5"
            />
            
            {/* Eyes (tracking) - match production slime style */}
            <motion.circle 
              cx={24 + eyeOffset.left.x} 
              cy={30 + eyeOffset.left.y} 
              r="3.2" 
              fill="#064e3b"
              animate={{ 
                cx: 24 + eyeOffset.left.x, 
                cy: 30 + eyeOffset.left.y 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <motion.circle 
              cx={40 + eyeOffset.right.x} 
              cy={30 + eyeOffset.right.y} 
              r="3.2" 
              fill="#064e3b"
              animate={{ 
                cx: 40 + eyeOffset.right.x, 
                cy: 30 + eyeOffset.right.y 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            
            {/* Eye shine (tracking) - match production style */}
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
            
            {/* Happy mouth */}
            <path d="M20 36 Q32 44 44 36" stroke="#064e3b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            
            {/* Shine effect */}
            <path d="M22 18 C26 16 30 16 32 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
          </svg>
        </motion.div>
      </div>
      
      <div className="text-sm">
        <div className="font-semibold text-emerald-800">{label}</div>
        <div className="text-xs text-emerald-600 capitalize">{variant} tracking</div>
        {variant === "proximity" && (
          <div className={`text-xs ${isNearMouse ? "text-blue-600" : "text-gray-400"}`}>
            {isNearMouse ? "👁️ Watching" : "😴 Idle"}
          </div>
        )}
      </div>
    </div>
  );
}

// PNG Background Test Component
function PngBackgroundTest() {
  const [backgroundType, setBackgroundType] = useState<"gradient" | "png">("gradient");
  const [showBiomeAnimations, setShowBiomeAnimations] = useState(true);
  const [showPngAnimations, setShowPngAnimations] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="gradient"
            name="background"
            checked={backgroundType === "gradient"}
            onChange={() => setBackgroundType("gradient")}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="gradient" className="text-sm text-emerald-700">CSS Gradient</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="png"
            name="background"
            checked={backgroundType === "png"}
            onChange={() => setBackgroundType("png")}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="png" className="text-sm text-emerald-700">PNG Image</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="biome-animations"
            checked={showBiomeAnimations}
            onChange={(e) => setShowBiomeAnimations(e.target.checked)}
            className="w-4 h-4 text-emerald-600"
          />
          <label htmlFor="biome-animations" className="text-sm text-emerald-700">Biome Animations</label>
        </div>
        {backgroundType === "png" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="png-animations"
              checked={showPngAnimations}
              onChange={(e) => setShowPngAnimations(e.target.checked)}
              className="w-4 h-4 text-emerald-600"
            />
            <label htmlFor="png-animations" className="text-sm text-emerald-700">PNG Animation Layer</label>
          </div>
        )}
      </div>

      {/* Production-like Layout */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden border border-emerald-200">
        {/* Background Layer */}
        {backgroundType === "gradient" ? (
          <>
            <BiomeLayer biome="meadow" />
            {!showBiomeAnimations && (
              <div 
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, #E9FCEB 0%, #CFF7D5 100%)"
                }}
              />
            )}
          </>
        ) : (
          <>
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'url("./src/images/biomes/meadow.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* PNG Animation Layer */}
            {showPngAnimations && (
              <div className="absolute inset-0 z-10">
                {/* Floating dandelion seeds */}
                <motion.div
                  className="absolute w-2 h-2 bg-white/90 rounded-full"
                  style={{ left: '20%', top: '15%' }}
                  animate={{ 
                    y: [0, -30, 60, 0],
                    x: [0, 15, -8, 20],
                    rotate: [0, 180, 360],
                    opacity: [1, 0.8, 0.3, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 12, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute w-1.5 h-1.5 bg-white/80 rounded-full"
                  style={{ right: '30%', top: '20%' }}
                  animate={{ 
                    y: [0, -25, 50, 0],
                    x: [0, -12, 6, -15],
                    rotate: [0, -120, -240, -360],
                    opacity: [1, 0.9, 0.4, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeOut", delay: 3 }}
                />
                <motion.div
                  className="absolute w-1 h-1 bg-white/70 rounded-full"
                  style={{ left: '60%', top: '25%' }}
                  animate={{ 
                    y: [0, -20, 40, 0],
                    x: [0, 8, -5, 12],
                    opacity: [1, 0.7, 0.2, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeOut", delay: 6 }}
                />
                
                {/* Pollen motes */}
                <motion.div
                  className="absolute w-1 h-1 bg-yellow-200/60 rounded-full"
                  style={{ left: '40%', top: '30%' }}
                  animate={{ 
                    y: [0, -15, 8, -10, 0],
                    x: [0, 5, -3, 8, 0],
                    opacity: [0.6, 1, 0.4, 0.8, 0.6]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-0.5 h-0.5 bg-yellow-300/80 rounded-full"
                  style={{ right: '45%', bottom: '40%' }}
                  animate={{ 
                    y: [0, -12, 5, -8, 0],
                    x: [0, -4, 2, -6, 0],
                    opacity: [0.8, 0.4, 1, 0.3, 0.8]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
                />
                
                {/* Gentle grass shimmer */}
                <motion.div
                  className="absolute w-32 h-16 bg-green-200/10 rounded-full blur-2xl"
                  style={{ left: '10%', bottom: '20%' }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1] 
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
              </div>
            )}
          </>
        )}
        
        {/* Production-like Game Layout */}
        <div className="absolute inset-0 z-20 flex flex-col">
          {/* Top HUD Area */}
          <div className="flex justify-between items-start p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
              <div className="text-sm text-emerald-700">Level 3</div>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                <div className="text-sm text-amber-700">🟡 1,250 Goo</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                <div className="text-sm text-red-600">❤️❤️❤️</div>
              </div>
            </div>
          </div>

          {/* Central Question Area */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full">
              <div className="text-center">
                <h4 className="text-xl font-bold text-emerald-800 mb-6">What is 15 + 7?</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[20, 22, 25, 23].map((answer, i) => (
                    <button
                      key={i}
                      className="px-6 py-4 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-emerald-800 font-bold text-lg transition-colors shadow-sm"
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Area */}
          <div className="flex justify-between items-end p-4">
            {/* Slime Character */}
            <div className="transform scale-75 origin-bottom-left">
              <TrackingSlime 
                variant="full"
                color="#22c55e"
                size="w-24"
                label=""
              />
            </div>
            
            {/* Skill Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
              <div className="text-xs text-emerald-600 mb-1">Current Skill</div>
              <div className="text-sm font-semibold text-emerald-800">Addition 1-20 • Meadow</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-semibold text-emerald-800 mb-2">CSS Gradient + Biome Animations</h4>
          <ul className="text-emerald-700 space-y-1">
            <li>• Lightweight and fast</li>
            <li>• Rich animated decorations</li>
            <li>• Consistent across devices</li>
            <li>• Easy to customize colors</li>
            <li>• Vector-based, scales perfectly</li>
            <li>• Dramatic environmental effects</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">PNG Image Only</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• Rich photographic detail</li>
            <li>• Natural textures and lighting</li>
            <li>• Realistic environments</li>
            <li>• Static background</li>
            <li>• May feel less dynamic</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">PNG + Animation Layer</h4>
          <ul className="text-purple-700 space-y-1">
            <li>• Best of both worlds</li>
            <li>• Photographic base + movement</li>
            <li>• Subtle atmospheric effects</li>
            <li>• Floating dandelion seeds</li>
            <li>• Gentle pollen motes</li>
            <li>• Grass shimmer effects</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">🎮 Production Layout Features</h4>
        <ul className="text-amber-700 text-sm space-y-1">
          <li>• <strong>Realistic HUD:</strong> Level, Goo counter, Lives display</li>
          <li>• <strong>Central focus:</strong> Question card with proper backdrop blur</li>
          <li>• <strong>Character placement:</strong> Slime positioned bottom-left as in game</li>
          <li>• <strong>Skill indicator:</strong> Current skill and biome display</li>
          <li>• <strong>Layered UI:</strong> Semi-transparent overlays that don't obstruct background</li>
        </ul>
      </div>
    </div>
  );
}

// Enhanced Common Slimes Experiment
function EnhancedCommonSlimesTest() {
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [lightingVersion, setLightingVersion] = useState<"v1" | "v2">("v1");
  const [slimeTier, setSlimeTier] = useState<"common" | "uncommon" | "rare">("common");
  const [performanceMode, setPerformanceMode] = useState(false);
  const mousePos = useMousePosition();
  
  // Pre-calculate animation timing for all slimes
  const animationTimings = useMemo(() => {
    const timings = [];
    for (let i = 0; i < 20; i++) {
      timings.push({
        bobDelay: (i * 0.3) % 2,
        blinkDelay: (i * 1.7) % 15,
        blinkDuration: 6 + ((i * 2.3) % 8),
      });
    }
    return timings;
  }, []);

  // Create refs for all slimes
  const slimeRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Create state for all eye offsets
  const [eyeOffsets, setEyeOffsets] = useState<Array<{left: {x: number, y: number}, right: {x: number, y: number}}>>(
    Array(20).fill({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } })
  );

  // Eye tracking calculation for all slimes (disabled in performance mode)
  useEffect(() => {
    if (performanceMode) return;
    
    // Throttle updates to prevent infinite loops
    const timeoutId = setTimeout(() => {
      const newOffsets = slimeRefs.map((ref, index) => {
        if (!ref.current) return { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX);
        const distance = Math.min(
          Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)),
          200
        ) / 200;

        const maxOffset = 1.2;
        const offsetX = Math.cos(angle) * distance * maxOffset;
        const offsetY = Math.sin(angle) * distance * maxOffset;

        return { left: { x: offsetX, y: offsetY }, right: { x: offsetX, y: offsetY } };
      });

      setEyeOffsets(newOffsets);
    }, 16); // ~60fps throttle
    
    return () => clearTimeout(timeoutId);
  }, [mousePos.x, mousePos.y, slimeRefs.length, performanceMode]);
  
  // Current common slimes data
  const currentCommons = [
    { id: "moss", name: "Moss", fill: "#5BA86D", stroke: "#365314", shine: "#d9f99d" },
    { id: "sky", name: "Sky", fill: "#A9D8FF", stroke: "#1e3a8a", shine: "#dbeafe" },
    { id: "coral", name: "Coral", fill: "#FF8B7A", stroke: "#7f1d1d", shine: "#fed7d7" },
    { id: "charcoal", name: "Charcoal", fill: "#2A2F35", stroke: "#0f172a", shine: "#e2e8f0" },
    { id: "clover", name: "Clover", fill: "#65a30d", stroke: "#365314", shine: "#d9f99d" }
  ];

  // Enhanced versions with micro-identity
  const enhancedCommons = [
    { 
      id: "moss_enhanced", name: "Moss", 
      fill: "#3FA05A", stroke: "#0F3E2A", shine: "#D9FBE3",
      faceTone: "#09402A", shineShape: "leaf",
      description: "Calm forest green with leaf highlight"
    },
    { 
      id: "sky_enhanced", name: "Sky", 
      fill: "#9ECBF6", stroke: "#274477", shine: "#E8F3FF",
      faceTone: "#16345A", shineShape: "cloud",
      description: "Breezy powder blue with cloud highlight"
    },
    { 
      id: "coral_enhanced", name: "Coral", 
      fill: "#FF7D6E", stroke: "#7C2530", shine: "#FFE1DC",
      faceTone: "#1F2A2E", shineShape: "arc",
      description: "Friendly warm pink-orange with smile highlight"
    },
    { 
      id: "charcoal_enhanced", name: "Charcoal", 
      fill: "#2B2F36", stroke: "#0F1418", shine: "#C9D4DB",
      faceTone: "#0B6A66", shineShape: "chip",
      description: "Bold deep gray with teal face and chip highlight"
    },
    { 
      id: "clover_enhanced", name: "Clover", 
      fill: "#6FBF2E", stroke: "#173C17", shine: "#E6F7C8",
      faceTone: "#0C4B2B", shineShape: "seed",
      description: "Lucky garden green with seed highlight"
    }
  ];

  // Pre-production enhanced commons
  // Pre-production Uncommon slimes with gradient specifications
  const preProductionUncommons = [
    {
      id: "oasis", name: "Oasis",
      gradient: { stops: ["#5AB6A6", "#E39A3C"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0B3A3A",
      sheen: true, rim: "cool",
      description: "Desert unlock - aqua to sand oasis"
    },
    {
      id: "peat_stripe", name: "Peat Stripe", 
      gradient: { stops: ["#2E7A56", "#397D5A", "#275C45"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0E4A34",
      description: "Swamp unlock - mid to dark banded"
    },
    {
      id: "thermal_lift", name: "Thermal Lift",
      gradient: { stops: ["#CDE5FF", "#71A9FF"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0A2F66",
      rim: "cool", rimColor: "rgba(255, 255, 255, 0.07)",
      description: "Day sky unlock - buoyant airy blue"
    },
    {
      id: "fresh_cream", name: "Fresh Cream",
      gradient: { stops: ["#FFF3DF", "#F0D3B5"], angle: 225 },
      stroke: "#5A3B26", faceTone: "#5A3B26",
      sheen: true, sheenColor: "rgba(255, 250, 245, 0.14)",
      description: "Farm unlock - warm cream to cocoa"
    },
    {
      id: "quench_mist", name: "Quench Mist",
      gradient: { stops: ["#505A62", "#1E2B31"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0D524F",
      rim: "cool", rimColor: "rgba(150, 232, 255, 0.06)",
      description: "Foundry unlock - slate to coal with steam"
    }
  ];

  // Production Uncommon slimes with gradient specifications
  const productionUncommons = [
    {
      id: "spring_fade", name: "Spring Fade",
      gradient: { stops: ["#C8F39B", "#FFE69A"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0F5132",
      sheen: true,
      description: "Shop - evergreen to golden fade"
    },
    {
      id: "blue_lagoon", name: "Blue Lagoon",
      gradient: { stops: ["#55C3E0", "#2563EB"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0A2752",
      rim: "cool",
      description: "Shop - aqua to deep lagoon"
    },
    {
      id: "sea_breeze", name: "Sea Breeze",
      gradient: { stops: ["#7FD8D3", "#2F9E9A"], angle: 225 },
      stroke: "#0B2430", faceTone: "#094A45",
      description: "Shoreline - greener than Blue Lagoon"
    },
    {
      id: "raindrop", name: "Raindrop",
      gradient: { stops: ["#A9D6FF", "#5E86D6"], angle: 225 },
      stroke: "#0B2430", faceTone: "#213B79",
      sheen: true, sheenSize: "large",
      description: "Shoreline - wet with larger sheen"
    },
    {
      id: "acorn_buddy", name: "Acorn Buddy",
      gradient: { stops: ["#7A9A2D", "#C18A2E"], angle: 225 },
      stroke: "#0B2430", faceTone: "#1A4B2A",
      description: "Forest - leafy olive to acorn gold"
    },
    {
      id: "tide_glass", name: "Tide Glass",
      gradient: { stops: ["#CFF8F0", "#74CFE1"], angle: 225 },
      stroke: "#0B2430", faceTone: "#264D5A",
      rim: "cool",
      description: "Cove - glassy blue-grey"
    },
    {
      id: "drift_puff", name: "Drift Puff",
      gradient: { stops: ["#EAF7FF", "#CFE5F1"], angle: 225 },
      stroke: "#0B2430", faceTone: "#2B4C5A",
      description: "Tundra - airy with depth at bottom"
    },
    {
      id: "swallow_sweep", name: "Swallow Sweep",
      gradient: { stops: ["#E8A574", "#C7743D"], angle: 225 },
      stroke: "#0B2430", faceTone: "#4E2D1E",
      sheen: true, sheenSize: "tiny",
      description: "Canyon - warm umber tones"
    },
    {
      id: "sun_drum", name: "Sun Drum",
      gradient: { stops: ["#FFE08A", "#F4B942"], angle: 225 },
      stroke: "#0B2430", faceTone: "#165A33",
      description: "Savanna - golden with dark green face"
    },
    {
      id: "shell_gleam", name: "Shell Gleam",
      gradient: { stops: ["#BDEAD7", "#7ED3C0"], angle: 225 },
      stroke: "#0B2430", faceTone: "#0E5248",
      rim: "warm", rimColor: "rgba(255, 255, 255, 0.06)",
      description: "Reef - nacre-like with warm rim"
    },
    {
      id: "incense_drift", name: "Incense Drift",
      gradient: { stops: ["#D8C4A7", "#A88D73"], angle: 225 },
      stroke: "#0B2430", faceTone: "#53331E",
      sheen: true, sheenSize: "small",
      description: "Temple - warm burnt umber"
    },
    {
      id: "foam_crest", name: "Foam Crest",
      gradient: { stops: ["#D6EDFA", "#9FD7F2"], angle: 225 },
      stroke: "#0B2430", faceTone: "#143B57",
      rim: "cool",
      description: "Harbor - cool foam tones"
    }
  ];

  // Production Rare slimes with static patterns
  const productionRares = [
    {
      id: "polka_mint", name: "Polka Mint",
      gradient: { stops: ["#DDF7EC", "#BFEFD8"], angle: 120 },
      stroke: "#0B4B3C", faceTone: "#0E6B52",
      pattern: { type: "dots", color: "#0E6B52", opacity: 0.15, size: 6, spacing: 12 },
      description: "Shop - mint with polka dots"
    },
    {
      id: "ripple", name: "Ripple",
      gradient: { stops: ["#BDEDE4", "#6FC6BE"], angle: 120 },
      stroke: "#093534", faceTone: "#0D4A45",
      pattern: { type: "rings", color: "#0F5C57", opacity: 0.18, radii: [22, 44, 66] },
      description: "Shop - concentric ripples"
    },
    {
      id: "ocean_drift", name: "Ocean Drift",
      gradient: { stops: ["#BDEBFF", "#5DC3F2"], angle: 120 },
      stroke: "#0A3353", faceTone: "#0F4D76",
      pattern: { type: "waves", color: "#0F4D76", opacity: 0.20, amplitude: 2, period: 28 },
      description: "Shoreline - wave ridges"
    },
    {
      id: "moonlit_pool", name: "Moonlit Pool",
      gradient: { stops: ["#9AA5B1", "#4D5A67"], angle: 120, radial: true },
      stroke: "#0E2230", faceTone: "#163042",
      pattern: { type: "stars", color: "#E6F4FF", opacity: 0.25, size: 1 },
      description: "Night sky - starry pool"
    },
    {
      id: "moss_quilt", name: "Moss Quilt",
      gradient: { stops: ["#98C08F", "#51855A"], angle: 120 },
      stroke: "#0B2D1E", faceTone: "#0F3E2A",
      pattern: { type: "diamond", color: "#1E4E32", opacity: 0.20, size: 14 },
      description: "Forest - diamond quilting"
    },
    {
      id: "kelp_curl", name: "Kelp Curl",
      gradient: { stops: ["#88DACB", "#2FA89A"], angle: 120 },
      stroke: "#073B36", faceTone: "#0B514A",
      pattern: { type: "stripes", color: "#0E655C", opacity: 0.18, spacing: 8, vertical: true },
      description: "Cove - vertical micro-stripes"
    },
    {
      id: "frost_fern", name: "Frost Fern",
      gradient: { stops: ["#DFF5FF", "#BEE3F4"], angle: 120 },
      stroke: "#14394A", faceTone: "#1F4C62",
      pattern: { type: "fern", color: "#3B6B82", opacity: 0.18 },
      description: "Tundra - fern vein patterns"
    },
    {
      id: "desert_varnish", name: "Desert Varnish",
      gradient: { stops: ["#D39A6B", "#B46B3C"], angle: 120 },
      stroke: "#351B12", faceTone: "#4A2819",
      pattern: { type: "varnish", color: "#6B3A22", opacity: 0.20, strokeWidth: 24 },
      description: "Canyon - varnish streaks"
    },
    {
      id: "polar_crown", name: "Polar Crown",
      gradient: { stops: ["#CDE7FF", "#7FB6F0"], angle: 120, radial: true },
      stroke: "#0A2A55", faceTone: "#113E7A",
      pattern: { type: "crown", color: "#EAF6FF", opacity: 0.22, radius: 60, blur: 4 },
      description: "Aurora - crown ring"
    },
    {
      id: "grass_run", name: "Grass Run",
      gradient: { stops: ["#E3F2B3", "#A8CF52"], angle: 120 },
      stroke: "#223E0D", faceTone: "#2F5412",
      pattern: { type: "blades", color: "#3D6A17", opacity: 0.18, height: 10 },
      description: "Savanna - grass blade ticks"
    },
    {
      id: "anemone_wiggle", name: "Anemone Wiggle",
      gradient: { stops: ["#FFB3C8", "#E05C86"], angle: 120 },
      stroke: "#431024", faceTone: "#5E1932",
      pattern: { type: "dashes", color: "#7C2141", opacity: 0.20, distance: 10 },
      description: "Reef - perimeter dashes"
    },
    {
      id: "vine_inlay", name: "Vine Inlay",
      gradient: { stops: ["#BFA37F", "#8F6E4C"], angle: 120 },
      stroke: "#241E15", faceTone: "#2E281C",
      pattern: { type: "vine", color: "#3C3A22", opacity: 0.20 },
      description: "Temple - curling vine filigree"
    },
    {
      id: "rope_coil", name: "Rope Coil",
      gradient: { stops: ["#D4BE95", "#B79262"], angle: 120 },
      stroke: "#3A2918", faceTone: "#4D361F",
      pattern: { type: "spiral", color: "#6E4F2D", opacity: 0.20 },
      description: "Harbor - spiral coil emboss"
    },
    {
      id: "forge_rune", name: "Forge Rune",
      gradient: { stops: ["#3B3B3F", "#191A1D"], angle: 120 },
      stroke: "#0B0C10", faceTone: "#0FA37A",
      pattern: { type: "runes", color: "#9CD7C9", opacity: 0.18, size: 14 },
      description: "Foundry - scattered runes"
    }
  ];

  const preProductionCommons = [
    { 
      id: "murk", name: "Murk", 
      fill: "#3C4953", stroke: "#151C21", shine: "#D7E3EA",
      faceTone: "#12324E", shineShape: "chip",
      description: "Swampy graphite-blue"
    },
    { 
      id: "bluebird", name: "Bluebird", 
      fill: "#2E77FF", stroke: "#113070", shine: "#DCE8FF",
      faceTone: "#0D2651", shineShape: "arc",
      description: "Saturated azure"
    },
    { 
      id: "apple_shine", name: "Apple Shine", 
      fill: "#E9413B", stroke: "#7B1E1B", shine: "#FFD7D4",
      faceTone: "#23181A", shineShape: "seed",
      description: "Cheerful red with apple seed highlight"
    },
    { 
      id: "honey", name: "Honey", 
      fill: "#F7C437", stroke: "#7A4E12", shine: "#FFF1C8",
      faceTone: "#1F2A2E", shineShape: "stripe",
      description: "Warm golden honey"
    },
    { 
      id: "lilac", name: "Lilac", 
      fill: "#BDA7FF", stroke: "#513C8F", shine: "#F0E8FF",
      faceTone: "#16345A", shineShape: "cloud",
      description: "Soft purple lilac"
    }
  ];

  // Pre-Production Rare slimes with static patterns
  const preProductionRares = [
    {
      id: "sunstone", name: "Sunstone",
      gradient: { stops: ["#FFD36A", "#F29B2D"], angle: 120 },
      stroke: "#47280B", faceTone: "#5C340D",
      pattern: { type: "facets", color: "#7B4A12", opacity: 0.06, size: 20 },
      description: "Desert - faceted sunstone"
    },
    {
      id: "cactus_bloom", name: "Cactus Bloom",
      gradient: { stops: ["#A4D66E", "#5FA84B"], angle: 120 },
      stroke: "#1C3414", faceTone: "#27491C",
      pattern: { type: "ribs", color: "#315C23", opacity: 0.07 },
      description: "Desert - cactus ribs + areoles"
    },
    {
      id: "algae_vein", name: "Algae Vein",
      gradient: { stops: ["#5AB97E", "#2A7F55"], angle: 120 },
      stroke: "#08291E", faceTone: "#0C3A2B",
      pattern: { type: "branching", color: "#104C38", opacity: 0.07 },
      description: "Swamp - branching algal veins"
    },
    {
      id: "ore_fleck", name: "Ore Fleck",
      gradient: { stops: ["#88909A", "#4A525C"], angle: 120 },
      stroke: "#121C23", faceTone: "#1C2B36",
      pattern: { type: "flecks", color: "#E6EEF8", opacity: 0.06, size: 2 },
      description: "Cave - metallic flecks"
    },
    {
      id: "glowshroom", name: "Glowshroom",
      gradient: { stops: ["#2D3C55", "#0F1E36"], angle: 120 },
      stroke: "#0A1320", faceTone: "#A5E2FF",
      pattern: { type: "caps", color: "#C9E3FF", opacity: 0.07, size: 2 },
      description: "Cave - glowing mushroom caps"
    },
    {
      id: "cloud_puff", name: "Cloud Puff",
      gradient: { stops: ["#CAE3FF", "#90BCFF"], angle: 120 },
      stroke: "#0B2C4E", faceTone: "#124070",
      pattern: { type: "clouds", color: "#FFFFFF", opacity: 0.06, blur: 3 },
      description: "Day sky - soft cloud blobs"
    },
    {
      id: "sky_kite", name: "Sky Kite",
      gradient: { stops: ["#9ED1FF", "#3EA0F2"], angle: 120 },
      stroke: "#082C59", faceTone: "#0D3F82",
      pattern: { type: "kite", color: "#0E53A7", opacity: 0.07, size: 16 },
      description: "Day sky - diamond kite grid"
    },
    {
      id: "neon_grid", name: "Neon Grid",
      gradient: { stops: ["#1E2430", "#0F1116"], angle: 120 },
      stroke: "#080A10", faceTone: "#EAFBFF",
      pattern: { type: "grid", color: "#3EF1D0", opacity: 0.08, size: 14, glow: true },
      description: "City - neon grid with glow"
    },
    {
      id: "pixel_parade", name: "Pixel Parade",
      gradient: { stops: ["#A767E0", "#6E2FB3"], angle: 120 },
      stroke: "#1C0733", faceTone: "#2B0E4D",
      pattern: { type: "pixels", color: "#FFFFFF", opacity: 0.06, size: 1 },
      description: "Arcade - scattered pixels"
    },
    {
      id: "circuit_pop", name: "Circuit Pop",
      gradient: { stops: ["#6BD7B3", "#2AA882"], angle: 120 },
      stroke: "#08352A", faceTone: "#0C4B3C",
      pattern: { type: "circuit", color: "#0D6C56", opacity: 0.07, width: 1 },
      description: "Arcade - PCB traces + vias"
    },
    {
      id: "berry_patch", name: "Berry Patch",
      gradient: { stops: ["#FFA0C7", "#D6477F"], angle: 120 },
      stroke: "#3E0D21", faceTone: "#5B1430",
      pattern: { type: "seeds", color: "#7A1C3E", opacity: 0.07, size: 1 },
      description: "Farm - micro seed dots"
    },
    {
      id: "corn_silk", name: "Corn Silk",
      gradient: { stops: ["#FFE79B", "#F2B23A"], angle: 120 },
      stroke: "#3F2A0C", faceTone: "#5C3B11",
      pattern: { type: "silk", color: "#8C5E1A", opacity: 0.06, width: 1 },
      description: "Farm - fine silk strands"
    }
  ];

  // Common Shine 2.0 lighting configuration
  const shineV2Config = {
    moss: { cx: 23, cy: 16, rx: 7.5, ry: 4.5, rotate: -18 },
    sky: { cx: 24, cy: 15, rx: 7.8, ry: 4.3, rotate: -16 },
    coral: { cx: 25, cy: 15, rx: 8.0, ry: 4.6, rotate: -14 },
    charcoal: { cx: 22, cy: 17, rx: 8.2, ry: 5.0, rotate: -20 },
    clover: { cx: 23, cy: 16, rx: 7.2, ry: 4.4, rotate: -17 },
    murk: { cx: 22, cy: 17, rx: 8.0, ry: 5.0, rotate: -21 },
    bluebird: { cx: 24, cy: 15, rx: 7.6, ry: 4.2, rotate: -15 },
    apple_shine: { cx: 25, cy: 15, rx: 7.8, ry: 4.6, rotate: -14 }
  };

  const getShinePathData = (shape: string) => {
    switch (shape) {
      case "stripe":
        return "M22 18 C26 16 30 16 32 14";
      case "leaf":
        return "M20 16 Q26 14 30 16 Q26 18 20 16";
      case "cloud":
        return "M21 16 C21 15 22 15 23 15 C24 15 25 15 25 16 C25 17 24 17 23 17 C22 17 21 17 21 16 M25 15 C25 14 26 14 27 14 C28 14 29 14 29 15 C29 16 28 16 27 16 C26 16 25 16 25 15";
      case "arc":
        return "M20 16 Q26 12 32 16";
      case "chip":
        return "M22 15 L28 18 L26 20 L20 17 Z";
      case "seed":
        return "M25 14 Q27 14 27 17 Q25 18 23 17 Q23 14 25 14";
      default:
        return "M22 18 C26 16 30 16 32 14";
    }
  };

  const getShineProps = (shape: string) => {
    if (shape === "cloud" || shape === "chip" || shape === "seed" || shape === "leaf") {
      return { fill: "#ffffff", fillOpacity: "0.85" };
    }
    return { stroke: "#ffffff", strokeWidth: "2.5", strokeLinecap: "round", fill: "none" };
  };

  // Get bloom tint color based on slime ID
  const getBloomTint = (slimeId: string) => {
    // Warm bodies
    if (["coral", "apple_shine", "honey", "swallow_sweep", "sun_drum", "incense_drift"].includes(slimeId)) {
      return "#FFF6EA"; // Warm tint
    }
    // Cool bodies
    if (["sky", "bluebird", "blue_lagoon", "sea_breeze", "raindrop", "tide_glass", "drift_puff", "foam_crest"].includes(slimeId)) {
      return "#EAF6FF"; // Cool tint
    }
    // Green bodies
    if (["moss", "clover", "acorn_buddy", "shell_gleam", "spring_fade"].includes(slimeId)) {
      return "#EFFFF0"; // Slight green tint
    }
    // Default white
    return "#FFFFFF";
  };

  // Get face color with slight darkening for light bodies
  const getFaceColor = (slime: any, isEnhanced: boolean) => {
    if (!isEnhanced || !slime.faceTone) return "#064e3b";
    
    // Darken face features slightly for light bodies to prevent highlight competition
    const baseColor = slime.faceTone;
    if (["fresh_cream", "drift_puff", "tide_glass"].includes(slime.id)) {
      // Add 4% darkening for very light bodies
      return baseColor; // Could implement color darkening here
    }
    
    return baseColor;
  };

  // Render pattern for Rare slimes
  const renderPattern = (slime: any) => {
    if (!slime.pattern) return null;
    
    const { type, color, opacity, ...props } = slime.pattern;
    
    switch (type) {
      case "dots":
        return (
          <g>
            {Array.from({ length: 20 }, (_, i) => (
              <circle
                key={i}
                cx={12 + (i % 4) * props.spacing}
                cy={12 + Math.floor(i / 4) * props.spacing}
                r={props.size / 2}
                fill={color}
                opacity={opacity * 3} // Increase visibility
              />
            ))}
          </g>
        );
      
      case "rings":
        return (
          <g>
            {props.radii.map((radius: number, i: number) => (
              <circle
                key={i}
                cx="32" cy="32"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity={opacity * 2.5} // Increase visibility
              />
            ))}
          </g>
        );
      
      case "waves":
        return (
          <g>
            <path
              d="M8 40 Q16 38 24 40 Q32 42 40 40 Q48 38 56 40"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2.5}
            />
            <path
              d="M8 35 Q16 33 24 35 Q32 37 40 35 Q48 33 56 35"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2}
            />
          </g>
        );
      
      case "stars":
        return (
          <g>
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={16 + (i % 4) * 12}
                cy={16 + Math.floor(i / 4) * 12}
                r={props.size * 1.5}
                fill={color}
                opacity={opacity * 3}
              />
            ))}
          </g>
        );
      
      case "diamond":
        return (
          <g>
            {Array.from({ length: 16 }, (_, i) => (
              <rect
                key={i}
                x={8 + (i % 4) * props.size}
                y={8 + Math.floor(i / 4) * props.size}
                width={props.size - 2}
                height={props.size - 2}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity={opacity * 2.5}
                transform="rotate(45)"
              />
            ))}
          </g>
        );
      
      case "stripes":
        return (
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x={8 + i * props.spacing}
                y="8"
                width="2"
                height="48"
                fill={color}
                opacity={opacity * 2.5}
              />
            ))}
          </g>
        );
      
      case "fern":
        return (
          <g>
            <path
              d="M16 48 Q20 40 24 44 Q28 36 32 40 Q36 32 40 36"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2.5}
            />
            <path
              d="M20 44 Q24 36 28 40 Q32 32 36 36"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity={opacity * 2}
            />
          </g>
        );
      
      case "varnish":
        return (
          <g>
            <path
              d="M12 32 Q20 28 28 32 Q36 28 44 32"
              stroke={color}
              strokeWidth="3"
              fill="none"
              opacity={opacity * 2.5}
            />
            <path
              d="M16 36 Q24 32 32 36 Q40 32 48 36"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2}
            />
          </g>
        );
      
      case "crown":
        return (
          <g>
            <circle
              cx="32" cy="32"
              r={props.radius}
              fill="none"
              stroke={color}
              strokeWidth="3"
              opacity={opacity * 2.5}
            />
          </g>
        );
      
      case "blades":
        return (
          <g>
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                x={12 + i * 8}
                y={40 - props.height}
                width="2"
                height={props.height}
                fill={color}
                opacity={opacity * 2.5}
              />
            ))}
          </g>
        );
      
      case "dashes":
        return (
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x={8 + Math.cos(i * 0.8) * 20}
                y={8 + Math.sin(i * 0.8) * 20}
                width="4"
                height="2"
                fill={color}
                opacity={opacity * 2.5}
              />
            ))}
          </g>
        );
      
      case "vine":
        return (
          <g>
            <path
              d="M16 40 Q20 32 24 36 Q28 28 32 32 Q36 24 40 28"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2.5}
            />
            <path
              d="M20 36 Q24 28 28 32 Q32 24 36 28"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity={opacity * 2}
            />
          </g>
        );
      
      case "spiral":
        return (
          <g>
            <path
              d="M32 32 Q28 28 24 32 Q20 28 16 32 Q12 28 8 32"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2.5}
            />
            <path
              d="M32 32 Q36 28 40 32 Q44 28 48 32 Q52 28 56 32"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity * 2.5}
            />
          </g>
        );
      
      case "runes":
        return (
          <g>
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                x={16 + (i % 3) * 12}
                y={16 + Math.floor(i / 3) * 12}
                width="4"
                height="4"
                fill={color}
                opacity={opacity * 2.5}
              />
            ))}
          </g>
        );
      
      default:
        return null;
    }
  };

  const renderSlime = (slime: any, isEnhanced = false, index = 0) => {
    // Safety checks
    if (!slime || !animationTimings || !eyeOffsets || !slimeRefs) {
      return (
        <div key={`error-${index}`} className="text-center">
          <div className="w-24 h-24 mx-auto mb-2 bg-red-100 border border-red-300 rounded flex items-center justify-center">
            <span className="text-red-600 text-xs">Error</span>
          </div>
          <div className="text-xs font-medium text-red-800">Error</div>
        </div>
      );
    }
    
    const animationTiming = animationTimings[index] || animationTimings[0];
    const eyeOffset = performanceMode ? { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } } : (eyeOffsets[index] || { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
    const slimeRef = slimeRefs[index];
    
    try {
      return (
        <div key={slime.id} className="text-center">
          <motion.div 
            ref={slimeRef}
            className="w-24 h-24 mx-auto mb-2"
            // Idle bob animation - randomized phase per slime (disabled in performance mode)
            animate={performanceMode ? {} : { 
              y: [0, -2, 0],
              scale: [1, 1.01, 1]
            }}
            transition={performanceMode ? {} : {
              repeat: Infinity,
              duration: 2.1 + (index % 3) * 0.1, // Slight duration variation
              delay: animationTiming.bobDelay,
              ease: "easeInOut"
            }}
          >
          <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Gradient definitions for Uncommon slimes */}
            {slime.gradient && (
              <defs>
                <linearGradient 
                  id={`grad-${slime.id}`} 
                  x1="0%" y1="0%" 
                  x2="100%" y2="100%"
                  gradientUnits="objectBoundingBox"
                >
                  {slime.gradient.stops.map((stop, i) => (
                    <stop key={i} offset={`${(i / (slime.gradient.stops.length - 1)) * 100}%`} stopColor={stop} />
                  ))}
                </linearGradient>
                {slime.sheen && (
                  <radialGradient id={`sheen-${slime.id}`} cx="28%" cy="22%" r="65%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.10)" />
                    <stop offset="65%" stopColor="rgba(255, 255, 255, 0)" />
                  </radialGradient>
                )}
              </defs>
            )}

            {/* Slime body */}
            <path 
              d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" 
              fill={slime.gradient ? `url(#grad-${slime.id})` : (slime.fill || "#cccccc")} 
              stroke={slime.stroke || "#000000"} 
              strokeWidth="1.5" 
            />

            {/* Sheen overlay for Uncommon slimes */}
            {slime.sheen && (
              <path 
                d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" 
                fill={`url(#sheen-${slime.id})`}
                pointerEvents="none"
              />
            )}

            {/* Rim tint for Uncommon slimes */}
            {slime.rim && (
              <path 
                d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34" 
                stroke={slime.rimColor || "rgba(255, 255, 255, 0.06)"}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                pointerEvents="none"
              />
            )}

            {/* Pattern overlay for Rare slimes */}
            {slime.pattern && renderPattern(slime)}

            {/* Glossy highlight for Rare slimes */}
            {slime.pattern && (
              <defs>
                <linearGradient id={`gloss-${slime.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            )}
            {slime.pattern && (
              <rect
                x="12" y="8"
                width="20" height="2"
                fill={`url(#gloss-${slime.id})`}
                transform="rotate(30 22 9)"
                pointerEvents="none"
              />
            )}
            
            {/* Eyes with tracking and blinking */}
            <motion.circle 
              cx={24 + eyeOffset.left.x} 
              cy={30 + eyeOffset.left.y} 
              r="3.2" 
              fill={getFaceColor(slime, isEnhanced)}
              animate={performanceMode ? {} : { 
                scaleY: [1, 1, 0.1, 1, 1],
                cx: 24 + eyeOffset.left.x,
                cy: 30 + eyeOffset.left.y 
              }}
              transition={performanceMode ? {} : {
                scaleY: {
                  repeat: Infinity,
                  duration: animationTiming.blinkDuration, // Stable random duration
                  delay: animationTiming.blinkDelay, // Stable random delay
                  times: [0, 0.45, 0.5, 0.55, 1] // Quick blink
                },
                cx: { type: "spring", stiffness: 300, damping: 30 },
                cy: { type: "spring", stiffness: 300, damping: 30 }
              }}
            />
            <motion.circle 
              cx={40 + eyeOffset.right.x} 
              cy={30 + eyeOffset.right.y} 
              r="3.2" 
              fill={getFaceColor(slime, isEnhanced)}
              animate={performanceMode ? {} : { 
                scaleY: [1, 1, 0.1, 1, 1],
                cx: 40 + eyeOffset.right.x,
                cy: 30 + eyeOffset.right.y 
              }}
              transition={performanceMode ? {} : {
                scaleY: {
                  repeat: Infinity,
                  duration: animationTiming.blinkDuration, // Same stable duration
                  delay: animationTiming.blinkDelay, // Same stable delay
                  times: [0, 0.45, 0.5, 0.55, 1]
                },
                cx: { type: "spring", stiffness: 300, damping: 30 },
                cy: { type: "spring", stiffness: 300, damping: 30 }
              }}
            />

            {/* Micro eye glint (V2 lighting only) */}
            {lightingVersion === "v2" && (
              <>
                <circle 
                  cx={23.3 + eyeOffset.left.x - 0.7} 
                  cy={29.3 + eyeOffset.left.y - 0.7} 
                  r="0.7" 
                  fill="#ffffff"
                  opacity="0.5"
                  pointerEvents="none"
                />
                <circle 
                  cx={39.3 + eyeOffset.right.x - 0.7} 
                  cy={29.3 + eyeOffset.right.y - 0.7} 
                  r="0.7" 
                  fill="#ffffff"
                  opacity="0.5"
                  pointerEvents="none"
                />
              </>
            )}
            

            
            {/* Mouth */}
            <path 
              d="M20 36 Q32 42 44 36" 
              stroke={getFaceColor(slime, isEnhanced)} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Specular highlight - V1 (Micro-Identity) or V2 (Realistic Lighting) */}
            {lightingVersion === "v1" ? (
              // V1: Micro-identity system with unique shapes
              <motion.path 
                d={isEnhanced && slime.shineShape ? getShinePathData(slime.shineShape) : "M22 18 C26 16 30 16 32 14"} 
                {...(isEnhanced && slime.shineShape ? getShineProps(slime.shineShape) : { stroke: slime.shine, strokeWidth: "3", strokeLinecap: "round", fill: "none" })}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + (index % 2),
                  delay: animationTiming.bobDelay * 0.5,
                  ease: "easeInOut"
                }}
              />
            ) : (
              // V2: Realistic lighting system (tuned)
              <>
                <defs>
                  {/* Bloom blur filter */}
                  <filter id={`blur8-${slime.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                  </filter>
                  
                  {/* Rim blur filter */}
                  <filter id={`rimBlur-${slime.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
                  </filter>
                </defs>

                {/* BLOOM — soft background glow */}
                <ellipse
                  cx="18" cy="14" rx="10" ry="6"
                  fill={getBloomTint(slime.id)}
                  opacity="0.25"
                  transform="rotate(-20 18 14)"
                  filter={`url(#blur8-${slime.id})`}
                  pointerEvents="none"
                />

                {/* SPECULAR CORE — bright highlight hugging the contour */}
                <motion.path
                  d="M12 16 C16 12 22 12 26 15 C24 16 20 17 16 17.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.6"
                  pointerEvents="none"
                  animate={{
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4 + (index % 2),
                    delay: animationTiming.bobDelay * 0.3,
                    ease: "easeInOut"
                  }}
                />

                {/* RIM TINT — following the top contour */}
                <path
                  d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              </>
            )}
          </svg>
        </motion.div>
          <div className="text-xs font-medium text-emerald-800">{slime.name}</div>
          {isEnhanced && slime.description && (
            <div className="text-xs text-emerald-600 mt-1">{slime.description}</div>
          )}
          {slime.gradient && (
            <div className="text-xs text-blue-600 mt-1">
              Gradient: {slime.gradient.stops.join(" → ")}
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering slime:', error);
      return (
        <div key={slime.id} className="text-center">
          <div className="w-24 h-24 mx-auto mb-2 bg-red-100 border border-red-300 rounded flex items-center justify-center">
            <span className="text-red-600 text-xs">Error</span>
          </div>
          <div className="text-xs font-medium text-red-800">{slime.name}</div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowEnhanced(false)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            !showEnhanced
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          📦 Current Commons
        </button>
        <button
          onClick={() => setShowEnhanced(true)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showEnhanced
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          ✨ Enhanced with Micro-Identity
        </button>
      </div>

      {/* Lighting Version Toggle (only show when enhanced) */}
      {showEnhanced && (
        <div className="flex gap-3">
          <button
            onClick={() => setLightingVersion("v1")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              lightingVersion === "v1"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
            }`}
          >
            🎨 Micro-Identity (V1)
          </button>
          <button
            onClick={() => setLightingVersion("v2")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              lightingVersion === "v2"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
            }`}
          >
            💡 Realistic Lighting (V2)
          </button>
        </div>
      )}

      {/* Slime Tier Toggle (only show when enhanced) */}
      {showEnhanced && (
        <div className="flex gap-3">
          <button
            onClick={() => setSlimeTier("common")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              slimeTier === "common"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
            }`}
          >
            🟢 Common Tier
          </button>
          <button
            onClick={() => setSlimeTier("uncommon")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              slimeTier === "uncommon"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
            }`}
          >
            🔵 Uncommon Tier
          </button>
          <button
            onClick={() => setSlimeTier("rare")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              slimeTier === "rare"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
            }`}
          >
            🟣 Rare Tier
          </button>
        </div>
      )}

      {/* Performance Toggle (only show when enhanced) */}
      {showEnhanced && (
        <div className="flex gap-3">
          <button
            onClick={() => setPerformanceMode(false)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              !performanceMode
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
            }`}
          >
            🎭 Full Animations
          </button>
          <button
            onClick={() => setPerformanceMode(true)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              performanceMode
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
            }`}
          >
            ⚡ Performance Mode
          </button>
        </div>
      )}

      {!showEnhanced ? (
        <>
          {/* Current Commons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-emerald-800">Current Production Commons</h4>
            <div className="grid grid-cols-5 gap-4 bg-emerald-50 p-6 rounded-xl">
              {currentCommons.map((slime, index) => renderSlime(slime, false, index))}
            </div>
            <div className="text-sm text-emerald-600 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <strong>Issues:</strong> All share identical highlight shape and lighting. Two greens (Moss + Clover) crowd the palette. Charcoal's green face reads "cold."
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Enhanced versions */}
          <div className="space-y-6">
            {slimeTier === "common" ? (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-emerald-800">Enhanced Production Commons</h4>
                  <div className="grid grid-cols-5 gap-4 bg-emerald-50 p-6 rounded-xl">
                    {enhancedCommons.map((slime, index) => renderSlime(slime, true, index))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-emerald-800">Pre-Production Commons</h4>
                  <div className="grid grid-cols-5 gap-4 bg-blue-50 p-6 rounded-xl">
                    {preProductionCommons.map((slime, index) => renderSlime(slime, true, index + 5))}
                  </div>
                </div>
              </>
            ) : slimeTier === "uncommon" ? (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Production Uncommons</h4>
                  <div className="grid grid-cols-6 gap-4 bg-blue-50 p-6 rounded-xl">
                    {productionUncommons.map((slime, index) => renderSlime(slime, true, index))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Pre-Production Uncommons</h4>
                  <div className="grid grid-cols-5 gap-4 bg-indigo-50 p-6 rounded-xl">
                    {preProductionUncommons.map((slime, index) => renderSlime(slime, true, index + 12))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800">Production Rares</h4>
                  <div className="grid grid-cols-7 gap-4 bg-purple-50 p-6 rounded-xl">
                    {productionRares.map((slime, index) => renderSlime(slime, true, index))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800">Pre-Production Rares</h4>
                  <div className="grid grid-cols-6 gap-4 bg-violet-50 p-6 rounded-xl">
                    {preProductionRares.map((slime, index) => renderSlime(slime, true, index + 14))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Design system explanation */}
      <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3">
        <h4 className="font-semibold text-emerald-800">Enhanced Design System</h4>
        <div className="grid gap-2 text-sm text-emerald-600">
          <div><strong>Common Tier:</strong> Solid color + outline + single highlight (Micro-Identity or Realistic Lighting)</div>
          <div><strong>Uncommon Tier:</strong> 2-3 stop gradients (225° angle) + optional sheen + rim tint + high contrast faces</div>
          <div><strong>Rare Tier:</strong> 1-2 stop gradients (120° angle) + static patterns + glossy highlight + sophisticated faces</div>
          <div><strong>Micro-Identity (V1):</strong> Each slime gets unique highlight shape + face tone for character</div>
          <div><strong>Realistic Lighting (V2):</strong> Global light direction with radial gradients, rim lighting, and per-skin tuning</div>
          <div><strong>Better Palette:</strong> Reduced green overlap, improved hue spread with warm/cool variety</div>
          <div><strong>Face Tones:</strong> inkDark, inkNavy, inkForest, inkTeal - chosen for contrast and mood</div>
          <div><strong>V1 Highlight Shapes:</strong> stripe, leaf, cloud, arc, chip, seed - themed but still single-color</div>
          <div><strong>V2 Lighting:</strong> Top-left 35° light, radial gradient falloff, glint dots, rim light arc</div>
          <div><strong>Uncommon Gradients:</strong> Top-left to bottom-right (225°) with biome-specific color palettes</div>
          <div><strong>Rare Patterns:</strong> Static patterns (dots, rings, waves, stars, diamonds, stripes) with 4-8% alpha contrast</div>
          <div><strong>Rare Highlights:</strong> Single glossy bar at 30° from top-left (white → transparent, 0.18 → 0)</div>
          <div><strong>Sheen Effects:</strong> Radial gradients at 28% 22% with 65% falloff for glossy appearance</div>
          <div><strong>Rim Tinting:</strong> Subtle edge highlights (5-8% opacity) for depth and gloss</div>
          <div><strong>Micro-Animations:</strong> Randomized idle bob (2.1-2.4s), natural blinking (6-14s cycles), subtle highlight pulse</div>
          <div><strong>Eye Tracking:</strong> Subtle mouse-following eyes with spring physics, eye shine follows naturally</div>
        </div>
      </div>
    </div>
  );
}

// Specular Highlight Experiment
function SpecularHighlightTest() {
  const [highlightStyle, setHighlightStyle] = useState<"classic" | "double" | "crescent" | "star" | "none">("classic");
  
  const getHighlightPath = (style: string) => {
    switch (style) {
      case "classic":
        return "M22 18 C26 16 30 16 32 14";
      case "double":
        return "M22 18 C26 16 30 16 32 14 M20 24 C22 22 24 22 26 20";
      case "crescent":
        return "M20 16 Q28 12 34 16 Q28 18 20 16 Z";
      case "star":
        return "M25 15 L27 19 L31 18 L28 21 L30 25 L26 23 L22 25 L24 21 L21 18 L25 19 Z";
      default:
        return "";
    }
  };

  const getHighlightProps = (style: string) => {
    switch (style) {
      case "classic":
        return { stroke: "#bbf7d0", strokeWidth: "3", strokeLinecap: "round", fill: "none" };
      case "double":
        return { stroke: "#bbf7d0", strokeWidth: "2.5", strokeLinecap: "round", fill: "none" };
      case "crescent":
        return { fill: "#bbf7d0", fillOpacity: "0.8" };
      case "star":
        return { fill: "#bbf7d0", fillOpacity: "0.7" };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Style selector */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: "classic", label: "Classic Stroke", emoji: "✨" },
          { key: "double", label: "Double Lines", emoji: "🔥" },
          { key: "crescent", label: "Crescent Fill", emoji: "🌙" },
          { key: "star", label: "Star Burst", emoji: "⭐" },
          { key: "none", label: "No Highlight", emoji: "🚫" }
        ].map(style => (
          <button
            key={style.key}
            onClick={() => setHighlightStyle(style.key as any)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              highlightStyle === style.key
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {style.emoji} {style.label}
          </button>
        ))}
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-emerald-50 p-6 rounded-xl">
        {[
          { color: "#22c55e", name: "Green" },
          { color: "#3b82f6", name: "Blue" }, 
          { color: "#f59e0b", name: "Orange" },
          { color: "#8b5cf6", name: "Purple" }
        ].map(slime => (
          <div key={slime.name} className="text-center">
            <div className="w-24 h-24 mx-auto mb-2">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                {/* Slime body */}
                <path 
                  d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" 
                  fill={slime.color} 
                  stroke="#065f46" 
                  strokeWidth="1.5" 
                />
                
                {/* Eyes */}
                <circle cx="24" cy="30" r="3.2" fill="#064e3b" />
                <circle cx="40" cy="30" r="3.2" fill="#064e3b" />
                <circle cx="23.3" cy="29.3" r="0.7" fill="#ecfeff" />
                <circle cx="39.3" cy="29.3" r="0.7" fill="#ecfeff" />
                
                {/* Mouth */}
                <path d="M20 36 Q32 42 44 36" stroke="#064e3b" strokeWidth="2" fill="none" strokeLinecap="round" />
                
                {/* Specular highlight */}
                {highlightStyle !== "none" && (
                  <path 
                    d={getHighlightPath(highlightStyle)} 
                    {...getHighlightProps(highlightStyle)}
                  />
                )}
              </svg>
            </div>
            <div className="text-xs text-emerald-600 font-medium">{slime.name}</div>
          </div>
        ))}
      </div>

      {/* Style descriptions */}
      <div className="bg-white border border-emerald-200 rounded-xl p-4">
        <h4 className="font-semibold text-emerald-800 mb-3">Style Details:</h4>
        <div className="grid gap-2 text-sm text-emerald-600">
          <div><strong>Classic Stroke:</strong> Traditional line highlight - clean and simple</div>
          <div><strong>Double Lines:</strong> Two smaller highlights - more dynamic</div>
          <div><strong>Crescent Fill:</strong> Filled crescent shape - soft and natural</div>
          <div><strong>Star Burst:</strong> Star-shaped highlight - playful and magical</div>
          <div><strong>No Highlight:</strong> Plain slime for comparison</div>
        </div>
      </div>
    </div>
  );
}

// Progressive Collection Screen Experiment
function ProgressiveCollectionTest() {
  const [progressStage, setProgressStage] = useState<"early" | "mid" | "late">("early");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Simulate different progress states
  const mockProgress = {
    early: {
      ownedSkins: ["green", "mint"],
      seenInShop: ["green", "mint", "blueberry"],
      unlockedBiomes: ["meadow", "beach"],
      description: "Just started - only has starting slime + one purchase"
    },
    mid: {
      ownedSkins: ["green", "mint", "blueberry", "tangerine", "lava"],
      seenInShop: ["green", "mint", "blueberry", "tangerine", "bubblegum", "lava", "aurora"],
      unlockedBiomes: ["meadow", "beach", "forest", "desert", "cove"],
      description: "Mid-game - unlocked several biomes, seen epic tier"
    },
    late: {
      ownedSkins: ["green", "mint", "blueberry", "tangerine", "bubblegum", "lava", "aurora", "nebula"],
      seenInShop: ["green", "mint", "blueberry", "tangerine", "bubblegum", "lava", "aurora", "nebula", "solar_crown", "dragon_scale"],
      unlockedBiomes: ["meadow", "beach", "forest", "desert", "cove", "tundra", "canyon", "aurora"],
      description: "Late-game - unlocked most content, seen mythic tier"
    }
  };

  const currentProgress = mockProgress[progressStage];
  
  // Sample slimes for the experiment (mixing production and inspiration)
  const allSlimes = [
    ...PRODUCTION_SKINS.slice(0, 6),
    ...INSPIRATION_COMMON.slice(0, 4),
    ...INSPIRATION_UNCOMMON.slice(0, 3),
    ...INSPIRATION_RARE.slice(0, 2)
  ];

  // Determine reveal state for each slime
  const getSlimeState = (slime: any) => {
    if (currentProgress.ownedSkins.includes(slime.id.replace('_prod', '').replace('_insp', ''))) {
      return "owned";
    }
    if (currentProgress.seenInShop.includes(slime.id.replace('_prod', '').replace('_insp', ''))) {
      return "seen";
    }
    // Check if slime's biome is unlocked (simplified logic)
    const biomesForTiers = {
      "common": ["meadow", "beach"],
      "uncommon": ["forest", "desert"], 
      "rare": ["cove", "tundra"],
      "epic": ["canyon", "aurora"],
      "mythic": ["savanna", "glacier"]
    };
    const requiredBiomes = biomesForTiers[slime.tier as keyof typeof biomesForTiers] || [];
    const hasRequiredBiome = requiredBiomes.some(biome => currentProgress.unlockedBiomes.includes(biome));
    
    if (hasRequiredBiome) {
      return "silhouette";
    }
    return "hidden";
  };

  const SlimeCard = ({ slime, state }: { slime: any, state: "owned" | "seen" | "silhouette" | "hidden" }) => {
    if (state === "hidden") return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-xl border border-emerald-200 p-3 text-center"
      >
        {/* Slime Display */}
        <div className="aspect-square w-full overflow-hidden grid place-items-center mb-2">
          <div className="scale-75">
            {state === "owned" ? (
              <Slime skinId={slime.id.replace('_prod', '').replace('_insp', '') as any} className="w-16" eyeTracking={false} />
            ) : state === "seen" ? (
              <div className="relative">
                <Slime skinId={slime.id.replace('_prod', '').replace('_insp', '') as any} className="w-16" eyeTracking={false} />
                <div className="absolute inset-0 bg-gray-400/60 rounded-full"></div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-500">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Info */}
        <div className="text-sm">
          <div className={`font-semibold ${state === "owned" ? "text-emerald-800" : state === "seen" ? "text-gray-600" : "text-gray-500"}`}>
            {state === "silhouette" ? "???" : slime.name}
          </div>
          
          {/* Tier Badge */}
          {state !== "silhouette" && (
            <div className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
              ${slime.tier === "common" ? "bg-gray-100 text-gray-700" :
                slime.tier === "uncommon" ? "bg-green-100 text-green-700" :
                slime.tier === "rare" ? "bg-blue-100 text-blue-700" :
                slime.tier === "epic" ? "bg-purple-100 text-purple-700" :
                "bg-yellow-100 text-yellow-700"}`}>
              {slime.tier}
            </div>
          )}
          
          {/* Description/Bio (only for owned) */}
          {state === "owned" && (
            <div className="text-xs text-gray-500 mt-2 leading-relaxed">
              {slime.tier === "common" ? "A cheerful companion that loves basic math!" :
               slime.tier === "uncommon" ? "An energetic slime with a zest for learning." :
               slime.tier === "rare" ? "A wise slime that excels at complex problems." :
               slime.tier === "epic" ? "A magical slime with extraordinary abilities." :
               "A legendary slime of immense mathematical power."}
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="absolute top-1 right-1">
          {state === "owned" && (
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          {state === "seen" && (
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👁</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-emerald-700 font-medium">Progress Stage:</span>
          {Object.keys(mockProgress).map((stage) => (
            <div key={stage} className="flex items-center gap-2">
              <input
                type="radio"
                id={stage}
                name="progress"
                checked={progressStage === stage}
                onChange={() => setProgressStage(stage as any)}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor={stage} className="text-sm text-emerald-700 capitalize">{stage}</label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-emerald-700 font-medium">View:</span>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="grid"
              name="view"
              checked={viewMode === "grid"}
              onChange={() => setViewMode("grid")}
              className="w-4 h-4 text-emerald-600"
            />
            <label htmlFor="grid" className="text-sm text-emerald-700">Grid</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="list"
              name="view"
              checked={viewMode === "list"}
              onChange={() => setViewMode("list")}
              className="w-4 h-4 text-emerald-600"
            />
            <label htmlFor="list" className="text-sm text-emerald-700">List</label>
          </div>
        </div>
      </div>

      {/* Progress Description */}
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h4 className="font-semibold text-emerald-800 mb-1">Current Progress State</h4>
        <p className="text-emerald-700 text-sm">{currentProgress.description}</p>
        <div className="text-xs text-emerald-600 mt-2">
          Owned: {currentProgress.ownedSkins.length} | 
          Seen: {currentProgress.seenInShop.length} | 
          Biomes: {currentProgress.unlockedBiomes.length}
        </div>
      </div>

      {/* Collection Display */}
      <div className="bg-white rounded-xl border border-emerald-200 p-4 max-h-96 overflow-y-auto">
        <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Slime Collection
        </h4>
        
        <div className={viewMode === "grid" ? "grid grid-cols-4 md:grid-cols-6 gap-3" : "space-y-2"}>
          {allSlimes.map((slime) => {
            const state = getSlimeState(slime);
            return (
              <SlimeCard key={slime.id} slime={slime} state={state} />
            );
          })}
        </div>
      </div>

      {/* Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Owned</h4>
          <p className="text-green-700">
            Full slime + name + tier + bio. Player has purchased and can use.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">👁️ Seen</h4>
          <p className="text-gray-700">
            Grayed out but visible. Player has seen in shop but not purchased.
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">❓ Silhouette</h4>
          <p className="text-amber-700">
            Just name placeholder. Biome unlocked but not yet encountered.
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">🚫 Hidden</h4>
          <p className="text-red-700">
            Not shown at all. Biome not yet reached by player.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🎮 Implementation Benefits</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <strong>Progressive Discovery:</strong> Creates excitement for biome unlocks</li>
          <li>• <strong>Shop Integration:</strong> Seeing slimes in shop adds them to collection</li>
          <li>• <strong>Collectible Feel:</strong> Similar to Pokemon Pokedex progression</li>
          <li>• <strong>Goal Clarity:</strong> Players know what they're working toward</li>
          <li>• <strong>Completion Drive:</strong> Encourages exploring all biomes and tiers</li>
        </ul>
      </div>
    </div>
  );
}

// Chat Bubble Component for Slimes
function ChatBubbleSlime() {
  const [messages] = useState([
    "Great job! 🎉",
    "Let's try another one!",
    "You're getting better!",
    "Math is fun! ✨",
    "Keep it up!",
    "Awesome work! 🌟",
    "You rock! 🎸",
    "Smart cookie! 🍪"
  ]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleStyle, setBubbleStyle] = useState<"rounded" | "speech" | "thought">("speech");

  const showRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(randomIndex);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 3000);
  };

  const bubbleStyles = {
    rounded: "bg-white border border-emerald-200 rounded-xl",
    speech: "bg-white border border-emerald-200 rounded-xl relative before:content-[''] before:absolute before:bottom-[-8px] before:left-[20px] before:w-0 before:h-0 before:border-l-[8px] before:border-r-[8px] before:border-t-[8px] before:border-l-transparent before:border-r-transparent before:border-t-white",
    thought: "bg-white border border-emerald-200 rounded-full relative before:content-[''] before:absolute before:bottom-[-12px] before:left-[16px] before:w-3 before:h-3 before:bg-white before:border before:border-emerald-200 before:rounded-full after:content-[''] after:absolute after:bottom-[-20px] after:left-[12px] after:w-2 after:h-2 after:bg-white after:border after:border-emerald-200 after:rounded-full"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-emerald-700 font-medium">Bubble Style:</span>
        {Object.keys(bubbleStyles).map((style) => (
          <div key={style} className="flex items-center gap-2">
            <input
              type="radio"
              id={style}
              name="bubbleStyle"
              checked={bubbleStyle === style as keyof typeof bubbleStyles}
              onChange={() => setBubbleStyle(style as keyof typeof bubbleStyles)}
              className="w-4 h-4 text-emerald-600"
            />
            <label htmlFor={style} className="text-sm text-emerald-700 capitalize">{style}</label>
          </div>
        ))}
      </div>

      <div className="relative bg-emerald-50 rounded-xl p-8 h-48 flex items-center justify-center">
        {/* Chat bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 shadow-lg z-10 ${bubbleStyles[bubbleStyle]}`}
            >
              <div className="text-sm font-medium text-emerald-800">
                {messages[currentMessage]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slime */}
        <div className="cursor-pointer" onClick={showRandomMessage}>
          <TrackingSlime 
            variant="full"
            color="#22c55e"
            size="w-32"
            label="Click me!"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Rounded Bubble</h4>
          <p className="text-gray-700">
            Clean and modern. Good for UI consistency and minimal distraction.
          </p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-semibold text-emerald-800 mb-2">Speech Bubble</h4>
          <p className="text-emerald-700">
            Classic comic book style. Clear indication of who's speaking.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Thought Bubble</h4>
          <p className="text-blue-700">
            Suggests internal thoughts. More whimsical and character-driven.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">💡 Implementation Ideas</h4>
        <ul className="text-amber-700 text-sm space-y-1">
          <li>• Show encouragement after correct answers</li>
          <li>• Give hints for difficult problems</li>
          <li>• Celebrate milestones and achievements</li>
          <li>• Provide gentle guidance for wrong answers</li>
          <li>• Random personality quirks to build connection</li>
        </ul>
      </div>
    </div>
  );
}

// Interactive click slime variants
function InteractiveSlime({ 
  behavior, 
  color = "#22c55e", 
  size = "w-32", 
  label 
}: { 
  behavior: "bounce" | "hearts" | "sparkle" | "grow" | "color" | "wink";
  color?: string; 
  size?: string; 
  label: string;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [currentColor, setCurrentColor] = useState(color);
  const [showHearts, setShowHearts] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899"];

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    
    switch (behavior) {
      case "bounce":
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 600);
        break;
      case "hearts":
        setShowHearts(true);
        setTimeout(() => setShowHearts(false), 2000);
        break;
      case "sparkle":
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1500);
        break;
      case "grow":
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 800);
        break;
      case "color":
        setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
        break;
      case "wink":
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 500);
        break;
    }
  };

  return (
    <div className="text-center space-y-2 relative">
      <div 
        className={`${size} relative mx-auto cursor-pointer select-none transition-transform hover:scale-105 active:scale-95`}
        onClick={handleClick}
      >
        <motion.div 
          initial={{ scale: 0.95 }} 
          animate={{ 
            scale: behavior === "bounce" && isClicked 
              ? [0.98, 1.3, 0.9, 1.1, 0.98]
              : behavior === "grow" && isClicked
              ? [0.98, 1.4, 0.98]
              : [0.98, 1.02, 0.98]
          }} 
          transition={{ 
            repeat: behavior === "bounce" && isClicked ? 0 : Infinity, 
            duration: behavior === "bounce" && isClicked ? 0.6 : 2.2 
          }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
            {/* Slime body */}
            <motion.path 
              d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
              fill={currentColor}
              stroke="#065f46"
              strokeWidth="1.5"
              animate={behavior === "color" ? { fill: currentColor } : {}}
              transition={{ duration: 0.3 }}
            />
            
            {/* Eye whites */}
            <circle cx="24" cy="30" r="2.8" fill="#ffffff" />
            <circle cx="40" cy="30" r="2.8" fill="#ffffff" />
            
            {/* Eye pupils */}
            <motion.circle 
              cx="24" 
              cy="30" 
              r="1.8" 
              fill="#064e3b"
              animate={isWinking ? { scaleY: 0.1, cy: 29 } : { scaleY: 1, cy: 30 }}
              transition={{ duration: 0.2 }}
            />
            <circle cx="40" cy="30" r="1.8" fill="#064e3b" />
            
            {/* Eye shine */}
            <circle cx="23.3" cy="29.3" r="0.6" fill="#ecfeff" />
            <circle cx="39.3" cy="29.3" r="0.6" fill="#ecfeff" />
            
            {/* Happy mouth */}
            <motion.path 
              d="M20 36 Q32 44 44 36" 
              stroke="#064e3b" 
              strokeWidth="1.8" 
              fill="none" 
              strokeLinecap="round"
              animate={isClicked ? { d: "M20 34 Q32 42 44 34" } : {}}
              transition={{ duration: 0.3 }}
            />
            
            {/* Shine effect */}
            <path d="M22 18 C26 16 30 16 32 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
          </svg>
        </motion.div>

        {/* Hearts animation */}
        <AnimatePresence>
          {showHearts && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-red-500 text-lg"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    opacity: 0, 
                    scale: 0 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 - Math.random() * 100}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Sparkles animation */}
        <AnimatePresence>
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400 text-sm"
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    opacity: 0, 
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 120}%`,
                    y: `${50 + (Math.random() - 0.5) * 120}%`,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-sm">
        <div className="font-semibold text-emerald-800">{label}</div>
        <div className="text-xs text-emerald-600 capitalize">{behavior} behavior</div>
        <div className="text-xs text-gray-500">Clicks: {clickCount}</div>
      </div>
    </div>
  );
}

export default function Experiments({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mousePos = useMousePosition();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <Eye className="w-6 h-6 text-emerald-600" />
              <Hand className="w-6 h-6 text-emerald-600" />
              <Image className="w-6 h-6 text-emerald-600" />
              <MessageCircle className="w-6 h-6 text-emerald-600" />
              <Archive className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">Experiments</h2>
            <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Dev Only
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-lg">
            <X className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        {/* Mouse Position Debug */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-4 text-sm">
            <MousePointer className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700">
              Mouse Position: X: {mousePos.x}, Y: {mousePos.y}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Enhanced Common Slimes Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🎨 Enhanced Common Slimes</h3>
            <p className="text-emerald-600 mb-6">
              Compare current common slimes vs enhanced versions with micro-identity. Each enhanced slime gets unique highlight shapes and face tones for better character while staying within "Common" tier rules.
            </p>
            <EnhancedCommonSlimesTest />
          </section>

          {/* Mythic Slimes Moved to Enhanced Gallery */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🌟 Mythic Slimes → Enhanced Gallery</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">✨ Enhanced Mythic Slimes Moved!</h4>
              <p className="text-blue-700 mb-4 leading-relaxed">
                The enhanced mythic slimes with advanced effects are now available in the <strong>Skin Gallery → ✨ Enhanced</strong> section. 
                This new approach uses the real skin system for better comparison and easier promotion to production.
              </p>
              <div className="bg-blue-100 p-4 rounded border border-blue-300">
                <p className="text-blue-800 text-sm font-medium mb-2">🎯 How to Access:</p>
                <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Click <strong>"Skin Gallery"</strong> in the Dev Panel</li>
                  <li>Click the <strong>"✨ Enhanced"</strong> filter button</li>
                  <li>View side-by-side comparisons of production vs enhanced versions</li>
                  <li>Use <strong>"🚀 Promote Enhanced"</strong> buttons to update production</li>
                </ol>
              </div>
              <p className="text-blue-600 text-xs mt-3">
                <strong>Benefits:</strong> Real slime rendering, easy promotion workflow, no duplicate implementation code!
              </p>
            </div>
          </section>

          {/* Specular Highlight Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">✨ Specular Highlight Styles</h3>
            <p className="text-emerald-600 mb-6">
              Experiment with different highlight styles to make the slimes look more polished and intentional. 
              Your son said the current one looked like an "oops" - let's find something better! 😄
            </p>
            <SpecularHighlightTest />
          </section>

          {/* Progressive Collection Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">📚 Progressive Collection Screen</h3>
            <p className="text-emerald-600 mb-6">
              Test the Pokemon-style Pokedex approach with layers of reveal: hidden → silhouette → seen → owned. 
              Switch between progress stages to see how the collection screen evolves!
            </p>
            <ProgressiveCollectionTest />
          </section>

          {/* PNG Background Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🖼️ PNG Background Test</h3>
            <p className="text-emerald-600 mb-6">
              Compare CSS gradients vs PNG images for biome backgrounds. Test readability, performance, and visual appeal.
            </p>
            <PngBackgroundTest />
          </section>

          {/* Chat Bubble Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">💬 Slime Chat Bubbles</h3>
            <p className="text-emerald-600 mb-6">
              Experiment with different chat bubble styles for slime interactions. Click the slime to see random messages!
            </p>
            <ChatBubbleSlime />
          </section>

          {/* Eye Tracking Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">👁️ Eye Tracking Variants</h3>
            <p className="text-emerald-600 mb-6">
              Move your mouse around to see how each variant responds. The slimes will follow your cursor with different levels of intensity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <TrackingSlime 
                variant="subtle" 
                color="#22c55e" 
                label="Green Slime"
              />
              <TrackingSlime 
                variant="full" 
                color="#3b82f6" 
                label="Blue Slime"
              />
              <TrackingSlime 
                variant="direct" 
                color="#ef4444" 
                label="Red Slime"
              />
              <TrackingSlime 
                variant="proximity" 
                color="#f59e0b" 
                label="Gold Slime"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Subtle Tracking</h4>
                <p className="text-green-700">
                  Eyes move slightly toward cursor. Gentle and non-distracting. 
                  Good for gameplay where focus is important.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Full Tracking</h4>
                <p className="text-blue-700">
                  Eyes clearly follow cursor with moderate responsiveness. 
                  Engaging and lively. Perfect for galleries and shops.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Direct Tracking</h4>
                <p className="text-red-700">
                  Eyes track cursor very closely with high responsiveness. 
                  Almost one-to-one movement. Maximum engagement.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Proximity Tracking</h4>
                <p className="text-amber-700">
                  Eyes only track when cursor is nearby. 
                  Creates moments of surprise and delight.
                </p>
              </div>
            </div>
          </section>

          {/* Multiple Slimes Test */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🎭 Multiple Slimes Test</h3>
            <p className="text-emerald-600 mb-6">
              Testing performance and feel with multiple slimes on screen (gallery simulation).
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { color: "#22c55e", name: "Green" },
                { color: "#3b82f6", name: "Blue" },
                { color: "#f59e0b", name: "Orange" },
                { color: "#ef4444", name: "Red" },
                { color: "#8b5cf6", name: "Purple" },
                { color: "#06b6d4", name: "Cyan" },
                { color: "#84cc16", name: "Lime" },
                { color: "#f97316", name: "Amber" },
                { color: "#ec4899", name: "Pink" },
              ].map((slime, i) => (
                <TrackingSlime 
                  key={i}
                  variant="full" 
                  color={slime.color} 
                  size="w-24"
                  label={slime.name}
                />
              ))}
            </div>
          </section>

          {/* Click Interactions Experiment */}
          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🎪 Click Interactions</h3>
            <p className="text-emerald-600 mb-6">
              Click on the slimes to see different fun behaviors! Each slime tracks how many times you've clicked it.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <InteractiveSlime 
                behavior="bounce" 
                color="#22c55e" 
                label="Bouncy"
              />
              <InteractiveSlime 
                behavior="hearts" 
                color="#ef4444" 
                label="Loving"
              />
              <InteractiveSlime 
                behavior="sparkle" 
                color="#f59e0b" 
                label="Magical"
              />
              <InteractiveSlime 
                behavior="grow" 
                color="#8b5cf6" 
                label="Growing"
              />
              <InteractiveSlime 
                behavior="color" 
                color="#3b82f6" 
                label="Chameleon"
              />
              <InteractiveSlime 
                behavior="wink" 
                color="#06b6d4" 
                label="Flirty"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Bouncy Behavior</h4>
                <p className="text-green-700">
                  Excited bouncing animation when clicked. Great for positive feedback.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Loving Behavior</h4>
                <p className="text-red-700">
                  Spreads hearts when clicked. Perfect for showing affection.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Magical Behavior</h4>
                <p className="text-amber-700">
                  Sparkles burst out when clicked. Adds wonder and delight.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Growing Behavior</h4>
                <p className="text-purple-700">
                  Grows big then shrinks back. Satisfying scale animation.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Chameleon Behavior</h4>
                <p className="text-blue-700">
                  Changes color randomly when clicked. Surprising and fun.
                </p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-800 mb-2">Flirty Behavior</h4>
                <p className="text-cyan-700">
                  Winks when clicked. Cute personality expression.
                </p>
              </div>
            </div>
          </section>

          {/* Performance Notes */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🔧 Implementation Notes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mouse events are tracked globally and shared across all slimes</li>
              <li>• Eye movements use spring animations for natural feel</li>
              <li>• Proximity detection uses distance calculations</li>
              <li>• Performance scales well with multiple slimes</li>
              <li>• Eye positions are calculated relative to each slime's container</li>
              <li>• Click interactions use state-based animations with timeouts</li>
              <li>• Particle effects (hearts, sparkles) use AnimatePresence for smooth enter/exit</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

