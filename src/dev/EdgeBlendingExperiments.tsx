import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type BlendingTechnique = 
  | "none" 
  | "gradient_mask" 
  | "feather_blur" 
  | "soft_opacity" 
  | "radial_fade"
  | "color_harmony";

type Props = {
  onClose: () => void;
};

function TestSlime({ technique, slimeColor, animColor }: { 
  technique: BlendingTechnique; 
  slimeColor: string;
  animColor: string;
}) {
  const clipId = `slime-clip-${technique}`;
  const filterId = `blur-filter-${technique}`;
  const maskId = `edge-mask-${technique}`;

  // Different techniques for edge blending
  const getAnimationStyle = () => {
    switch (technique) {
      case "gradient_mask":
        return {
          mask: `radial-gradient(circle at center, white 70%, transparent 95%)`,
          WebkitMask: `radial-gradient(circle at center, white 70%, transparent 95%)`,
        };
      case "feather_blur":
        return {
          filter: `blur(1px)`,
          opacity: 0.8,
        };
      case "soft_opacity":
        return {
          opacity: 0.6,
        };
      case "radial_fade":
        return {
          background: `radial-gradient(circle at center, ${animColor} 60%, transparent 90%)`,
        };
      case "color_harmony":
        // Blend animation color closer to slime base
        const blendedColor = blendColors(animColor, slimeColor, 0.3);
        return {
          color: blendedColor,
          fill: blendedColor,
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-32 h-32 relative">
      <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'auto', shapeRendering: 'geometricPrecision' }}>
        <defs>
          {/* Clipping path for slime body - Production shape */}
          <clipPath id={clipId}>
            <path d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z" />
          </clipPath>
          
          {/* Blur filter */}
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          
          {/* Edge mask */}
          <radialGradient id={maskId}>
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="95%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Slime body - Production shape */}
        <motion.path 
          d="M8 34 C10 18 22 10 32 10 C42 10 54 18 56 34 C56 46 46 54 32 54 C18 54 8 46 8 34Z"
          fill={slimeColor}
          stroke="#1f2937"
          strokeWidth="1.5"
        />
        
        {/* Shine highlight - Production style */}
        <path 
          d="M22 18 C26 16 30 16 32 14" 
          stroke="#ffffffaa" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        
        {/* Animation layer with blending */}
        <g clipPath={`url(#${clipId})`}>
          {/* Background glow effect - GETS BLENDING */}
          <motion.circle
            cx={32}
            cy={34}
            r={8}
            fill={animColor}
            opacity={0.3}
            style={getAnimationStyle()} // Apply blending here
            animate={{
              opacity: [0.3, 0.1, 0.3],
              r: [8, 12, 8],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          />
          
          {/* Sharp particle effects - NO BLENDING */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={32 + Math.cos((i/8)*Math.PI*2)*12}
              cy={34 + Math.sin((i/8)*Math.PI*2)*12}
              r={1.5}
              fill={animColor}
              // No blending style applied - keep particles crisp
              animate={{
                opacity: [0.8, 0.2, 0.8],
                r: [1.5, 0.5, 1.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: (i % 4) * 0.1,
              }}
            />
          ))}
        </g>
        
        {/* Production-style face */}
        <circle cx={25} cy={28} r={2.5} fill="#374151" />
        <circle cx={25.5} cy={27} r={0.8} fill="#ffffff" />
        <circle cx={39} cy={28} r={2.5} fill="#374151" />
        <circle cx={39.5} cy={27} r={0.8} fill="#ffffff" />
        <path d="M20 36 Q32 42 44 36" stroke="#374151" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// Helper function to blend two hex colors
function blendColors(color1: string, color2: string, ratio: number): string {
  const hex = (c: string) => {
    const hex = c.replace('#', '');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  };
  
  const c1 = hex(color1);
  const c2 = hex(color2);
  
  const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
  const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
  const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function EdgeBlendingExperiments({ onClose }: Props) {
  const [selectedSlime, setSelectedSlime] = useState<"starforge" | "runebloom" | "custom">("starforge");
  const [customSlimeColor, setCustomSlimeColor] = useState("#dc2626");
  const [customAnimColor, setCustomAnimColor] = useState("#fbbf24");

  const testCases = {
    starforge: {
      slimeColor: "#dc2626", // red-600
      animColor: "#fbbf24",  // amber-400
      name: "Starforge (Red + Gold Sparks)"
    },
    runebloom: {
      slimeColor: "#7c3aed", // violet-600  
      animColor: "#e9d5ff",  // violet-200
      name: "Runebloom (Purple + Light Runes)"
    },
    custom: {
      slimeColor: customSlimeColor,
      animColor: customAnimColor,
      name: "Custom Colors"
    }
  };

  const techniques: { id: BlendingTechnique; name: string; description: string }[] = [
    { id: "none", name: "None", description: "Original harsh edges" },
    { id: "gradient_mask", name: "Gradient Mask", description: "Radial mask fading at edges" },
    { id: "feather_blur", name: "Feather Blur", description: "Blur background glow only, keep particles sharp" },
    { id: "soft_opacity", name: "Soft Opacity", description: "Reduced opacity only" },
    { id: "radial_fade", name: "Radial Fade", description: "Radial gradient background" },
    { id: "color_harmony", name: "Color Harmony", description: "Blend animation color toward base" },
  ];

  const currentTest = testCases[selectedSlime];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edge Blending Experiments</h2>
            <p className="text-gray-600 mt-1">Testing different techniques to soften animation layer edges</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Test Case Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Test Case:</label>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(testCases).map(([key, test]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSlime(key as typeof selectedSlime)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlime === key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {test.name}
                </button>
              ))}
            </div>

            {/* Custom color controls */}
            {selectedSlime === "custom" && (
              <div className="mt-4 flex gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Slime Color</label>
                  <input
                    type="color"
                    value={customSlimeColor}
                    onChange={(e) => setCustomSlimeColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Animation Color</label>
                  <input
                    type="color"
                    value={customAnimColor}
                    onChange={(e) => setCustomAnimColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {techniques.map((technique) => (
              <div key={technique.id} className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center">
                  <TestSlime
                    technique={technique.id}
                    slimeColor={currentTest.slimeColor}
                    animColor={currentTest.animColor}
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{technique.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{technique.description}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🔍 What to Look For:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Gradient Mask</strong>: Smooth fade-out at edges, maintains intensity at center</li>
                <li>• <strong>Feather Blur</strong>: Softens background glow, keeps particle details crisp</li>
                <li>• <strong>Color Harmony</strong>: Animation color closer to base, less contrast</li>
                <li>• <strong>Radial Fade</strong>: Natural glow effect, works well for auras</li>
                <li>• <strong>Key</strong>: Blending affects the large glow, not the small sparks/details</li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-amber-900 mb-2">⚙️ Production Considerations:</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• <strong>Main Game</strong>: Slimes render at ~160-192px (w-40 sm:w-48)</li>
                <li>• <strong>Shop Cards</strong>: Similar size, should look crisp</li>
                <li>• <strong>Collection View</strong>: Smaller grid, blending more important</li>
                <li>• <strong>Performance</strong>: CSS filters vs SVG masks vs blend modes</li>
                <li>• <strong>Browser Support</strong>: Some techniques may vary across browsers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
