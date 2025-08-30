import { useState } from "react";
import { motion } from "framer-motion";
import { X, Layout, Monitor } from "lucide-react";

// Mock components to simulate different layouts
const MockHeart = ({ filled }: { filled: boolean }) => (
  <div className={`w-4 h-4 rounded-full ${filled ? "bg-red-500" : "bg-red-200"}`} />
);

const MockProgressBar = ({ className }: { className?: string }) => (
  <div className={`h-2 bg-emerald-100 rounded-full overflow-hidden ${className}`}>
    <div className="h-full w-3/4 bg-emerald-500" />
  </div>
);

// Layout Option 1: Current (cluttered)
const CurrentLayout = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-emerald-100 p-4 space-y-4">
    <div className="text-xs font-medium text-emerald-800 mb-2">Current Layout</div>
    
    {/* HUD scattered across top */}
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xs">
      <div className="flex items-center gap-1">
        <MockHeart filled />
        <MockHeart filled />
        <MockHeart filled={false} />
        <span className="bg-amber-100 px-1 rounded text-amber-700">2665</span>
      </div>
      <MockProgressBar />
      <div className="flex gap-1">
        <div className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 text-xs">Add</div>
        <div className="bg-emerald-100 px-1 py-1 rounded">🔊</div>
        <div className="bg-amber-100 px-1 py-1 rounded">🛒</div>
        <div className="bg-emerald-100 px-1 py-1 rounded">👤</div>
        <div className="bg-rose-100 px-1 py-1 rounded">⏻</div>
      </div>
    </div>

    {/* Slime area */}
    <div className="bg-emerald-50 rounded-lg p-6 text-center">
      <div className="w-16 h-16 bg-orange-400 rounded-full mx-auto mb-2" />
      <div className="text-2xl font-bold text-emerald-700 mb-4">10 + 2 = ?</div>
      <div className="grid grid-cols-4 gap-2">
        {["12", "10", "16", "7"].map((n, i) => (
          <div key={i} className="bg-white py-2 px-3 rounded text-emerald-700 font-semibold">
            {n}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Layout Option 2: Suggested clean layout
const SuggestedLayout = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-emerald-100 p-4 space-y-4">
    <div className="text-xs font-medium text-emerald-800 mb-2">Suggested Layout</div>
    
    {/* Clean header with title */}
    <div className="text-center">
      <div className="text-lg font-bold text-emerald-700 mb-3">Slime Collector</div>
      <div className="bg-white/90 rounded-lg p-3 flex items-center justify-center gap-6">
        <div className="flex items-center gap-1">
          <MockHeart filled />
          <MockHeart filled />
          <MockHeart filled={false} />
        </div>
        <div className="bg-amber-100 px-3 py-1 rounded text-amber-700 font-semibold">2665 Goo</div>
        <MockProgressBar className="w-24" />
        <div className="text-xs text-emerald-700">Lv 10</div>
      </div>
    </div>

    {/* Slime area (larger, more focus) */}
    <div className="bg-emerald-50 rounded-lg p-6 text-center">
      <div className="w-20 h-20 bg-orange-400 rounded-full mx-auto mb-3" />
      <div className="text-2xl font-bold text-emerald-700 mb-4">10 + 2 = ?</div>
      <div className="grid grid-cols-4 gap-2">
        {["12", "10", "16", "7"].map((n, i) => (
          <div key={i} className="bg-white py-3 px-3 rounded text-emerald-700 font-semibold">
            {n}
          </div>
        ))}
      </div>
    </div>

    {/* Bottom controls */}
    <div className="bg-white/90 rounded-lg p-2 flex items-center justify-center gap-2">
      <select className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 text-xs">
        <option>Addition 1-10</option>
      </select>
      <div className="bg-emerald-100 px-2 py-1 rounded">🔊</div>
      <div className="bg-amber-100 px-2 py-1 rounded">🛒 Shop</div>
      <div className="bg-emerald-100 px-2 py-1 rounded">👤 Progress</div>
      <div className="bg-rose-100 px-2 py-1 rounded">⏻ End</div>
    </div>
  </div>
);

// Layout Option 3: Minimal/mobile-first
const MinimalLayout = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-emerald-100 p-4 space-y-4">
    <div className="text-xs font-medium text-emerald-800 mb-2">Minimal Layout</div>
    
    {/* Condensed top bar */}
    <div className="bg-white/90 rounded-lg p-2">
      <div className="text-center text-sm font-bold text-emerald-700 mb-2">Slime Collector</div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <MockHeart filled />
          <MockHeart filled />
          <MockHeart filled={false} />
        </div>
        <div className="bg-amber-100 px-2 py-1 rounded text-amber-700">2665</div>
        <MockProgressBar className="w-16" />
        <div className="text-emerald-700">L10</div>
      </div>
    </div>

    {/* Large slime focus area */}
    <div className="bg-emerald-50 rounded-lg p-8 text-center">
      <div className="w-24 h-24 bg-orange-400 rounded-full mx-auto mb-4" />
      <div className="text-3xl font-bold text-emerald-700 mb-6">10 + 2 = ?</div>
      <div className="grid grid-cols-2 gap-3">
        {["12", "10", "16", "7"].map((n, i) => (
          <div key={i} className="bg-white py-4 px-4 rounded-lg text-emerald-700 font-bold text-lg">
            {n}
          </div>
        ))}
      </div>
    </div>

    {/* Floating action buttons */}
    <div className="flex justify-center gap-3">
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">🔊</div>
      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">🛒</div>
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">👤</div>
      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">⏻</div>
    </div>
  </div>
);

export default function LayoutPreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedLayout, setSelectedLayout] = useState<"current" | "suggested" | "minimal">("suggested");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-800">UI Layout Preview</h2>
            <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Dev Only
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-lg">
            <X className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Layout selector */}
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
            <Monitor className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-800">Choose Layout:</span>
            <div className="flex gap-2">
              {[
                { id: "current", label: "Current" },
                { id: "suggested", label: "Suggested" },
                { id: "minimal", label: "Minimal" }
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedLayout === layout.id
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layout comparison grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className={`${selectedLayout === "current" ? "ring-2 ring-emerald-500" : ""}`}
            >
              <CurrentLayout />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${selectedLayout === "suggested" ? "ring-2 ring-emerald-500" : ""}`}
            >
              <SuggestedLayout />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${selectedLayout === "minimal" ? "ring-2 ring-emerald-500" : ""}`}
            >
              <MinimalLayout />
            </motion.div>
          </div>

          {/* Layout analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-emerald-800">Layout Analysis</h3>
            
            {selectedLayout === "current" && (
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">Current Issues:</h4>
                <ul className="text-orange-700 space-y-1 text-sm">
                  <li>• HUD elements scattered across the top create visual clutter</li>
                  <li>• No clear game title/branding visible during gameplay</li>
                  <li>• Button labels might be hard to read on mobile</li>
                  <li>• Progress bar gets lost in the middle</li>
                  <li>• Inconsistent visual hierarchy</li>
                </ul>
              </div>
            )}

            {selectedLayout === "suggested" && (
              <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
                <h4 className="font-semibold text-emerald-800 mb-2">Suggested Benefits:</h4>
                <ul className="text-emerald-700 space-y-1 text-sm">
                  <li>• Clear "Slime Collector" title always visible</li>
                  <li>• Hearts, goo, and XP grouped logically in clean white bar</li>
                  <li>• More focus on the slime and question area</li>
                  <li>• All action buttons grouped at bottom for easy access</li>
                  <li>• Better visual hierarchy and information grouping</li>
                  <li>• Maintains all current functionality</li>
                </ul>
              </div>
            )}

            {selectedLayout === "minimal" && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">Minimal Benefits:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Maximum focus on the gameplay area</li>
                  <li>• Perfect for mobile devices and small screens</li>
                  <li>• Larger slime and answer buttons for better touch targets</li>
                  <li>• Floating action buttons reduce visual noise</li>
                  <li>• Single-hand friendly design</li>
                  <li>• Great for focused learning sessions</li>
                </ul>
              </div>
            )}
          </div>

          {/* Implementation notes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🔧 Implementation Notes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• These layouts can be implemented by modifying `Hud.tsx` and the main app structure</li>
              <li>• All existing functionality would be preserved</li>
              <li>• Responsive design ensures layouts work on all screen sizes</li>
              <li>• The suggested layout provides the best balance of clarity and functionality</li>
              <li>• Could add a user preference to switch between layouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
