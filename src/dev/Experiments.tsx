import { useState, useEffect, useRef } from "react";
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
