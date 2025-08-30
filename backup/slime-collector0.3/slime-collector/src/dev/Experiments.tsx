import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, MousePointer, Hand } from "lucide-react";

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
