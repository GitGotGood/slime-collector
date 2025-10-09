import React, { useState, useEffect } from "react";
import { X, Map, Star, Lock, Zap, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { WORLDS, EVENT_WORLDS } from "../core/progression";
import { SKILLS } from "../core/skills";
import { getEventState } from "../core/events";
import type { WorldID } from "../core/types";

type Props = {
  onClose: () => void;
  onPlayBiome?: (biomeId: WorldID) => void;
  profile?: any; // Add profile prop
};

// No mock data - use real profile data only

// Enhanced branching layout algorithm
function getWorldPosition(worldId: WorldID, index: number, allWorlds: any[], enableBranching: boolean = true): { x: number; y: number } {
  const world = allWorlds.find(w => w.id === worldId);
  if (!world) return { x: 20 + index * 6, y: 50 };
  
  // If branching is disabled, use simple linear layout
  if (!enableBranching) {
    return { x: 20 + index * 6, y: 50 };
  }
  
  // Spine positioning (layer 0) - main progression line
  if (world.layer === 0) {
    return getSpinePosition(index, allWorlds);
  }
  
  // Branch positioning (layer 1+) - branches from parent biomes
  if (world.branchOf) {
    return getBranchPosition(world, allWorlds);
  }
  
  // Fallback for worlds without proper branching data
  return { x: 20 + index * 6, y: 50 };
}

// Spine positioning - main progression line with reserved slots
function getSpinePosition(index: number, allWorlds: any[]): { x: number; y: number } {
  const spineWorlds = allWorlds.filter(w => w.layer === 0);
  const currentWorld = allWorlds[index];
  
  // Only position spine worlds (layer 0) in the main line
  if (currentWorld.layer !== 0) {
    console.warn(`getSpinePosition called for non-spine world: ${currentWorld.id}`);
    return { x: 20, y: 50 };
  }
  
  const spineIndex = spineWorlds.findIndex(w => w.id === currentWorld.id);
  
  // Base spine positioning with reserved slots for future branches
  const baseX = 20;
  const baseY = 50;
  const spacingX = 6; // Slightly increased spacing for better balance
  
  // Add wiggle to spine biomes (both horizontal and vertical)
  const horizontalWiggle = Math.sin(spineIndex * 0.8) * 6; // Left-right wiggle
  const verticalWiggle = Math.cos(spineIndex * 0.6) * 4; // Up-down wiggle
  
  // Limit biome spread - keep wiggle within reasonable bounds
  const maxHorizontalSpread = 4; // Maximum horizontal deviation (increased from 2)
  const maxVerticalSpread = 3; // Maximum vertical deviation (increased from 2)
  
  let finalX = baseX + spineIndex * spacingX + Math.max(-maxHorizontalSpread, Math.min(maxHorizontalSpread, horizontalWiggle));
  let finalY = baseY + Math.max(-maxVerticalSpread, Math.min(maxVerticalSpread, verticalWiggle));
  
  // Simple overlap prevention for spine biomes
  const minSpacing = 8; // Minimum distance between spine biomes
  if (spineIndex > 0) {
    // Check if this biome is too close to the previous one
    const prevBiomeX = baseX + (spineIndex - 1) * spacingX;
    const distance = Math.abs(finalX - prevBiomeX);
    
    if (distance < minSpacing) {
      // Adjust position to maintain minimum spacing
      finalX = prevBiomeX + minSpacing;
    }
  }
  
  // Debug logging for spine positioning
  if (spineIndex < 5) { // Only log first 5 biomes to avoid spam
    console.log(`🗺️ Spine ${currentWorld.id} (index ${spineIndex}):`, {
      baseX: baseX + spineIndex * spacingX,
      horizontalWiggle: horizontalWiggle.toFixed(2),
      clampedWiggle: Math.max(-maxHorizontalSpread, Math.min(maxHorizontalSpread, horizontalWiggle)).toFixed(2),
      finalX: finalX.toFixed(2),
      spacingX,
      minSpacing
    });
  }
  
  return {
    x: finalX,
    y: finalY
  };
}

// Branch positioning - branches from parent biomes
function getBranchPosition(world: any, allWorlds: any[]): { x: number; y: number } {
  const parentWorld = allWorlds.find(w => w.id === world.branchOf);
  if (!parentWorld) {
    console.warn(`Branch world ${world.id} has invalid parent ${world.branchOf}`);
    return { x: 20, y: 50 };
  }
  
  // Get parent position (always use spine positioning for parent)
  const parentIndex = allWorlds.findIndex(w => w.id === parentWorld.id);
  const parentPos = getSpinePosition(parentIndex, allWorlds);
  
  // Calculate branch offset - "wiggle down" pattern instead of diagonal
  const verticalOffset = (world.layer || 1) * 12; // Each layer moves down
  const horizontalWiggle = Math.sin((world.layer || 1) * 0.8) * 4; // Slight left-right wiggle
  
  // Position branches below parent with slight wiggle
  let x = parentPos.x + horizontalWiggle;
  let y = parentPos.y + verticalOffset;
  
  // Handle multiple branches from same parent
  const siblings = allWorlds.filter(w => w.branchOf === world.branchOf);
  const siblingIndex = siblings.findIndex(w => w.id === world.id);
  
  // Add horizontal spacing for multiple branches from same parent
  if (siblings.length > 1) {
    x += (siblingIndex - (siblings.length - 1) / 2) * 8;
  }
  
  // Simple overlap prevention - ensure minimum vertical spacing
  const minVerticalSpacing = 15; // Minimum distance between biomes
  if (world.layer > 1) {
    // For deeper branches, add extra vertical spacing
    y += (world.layer - 1) * 5;
  }
  
  return { x, y };
}

// Color mapping for worlds - matches Progress view biome styling
function getWorldColor(worldId: WorldID): string {
  // Use the same colors as the Progress > Biomes view (bgA colors from gradients)
  const colors: Record<string, string> = {
    // Main progression biomes - using bgA colors from biome gradients
    meadow: '#E9FCEB',      // Meadow bgA
    beach: '#BEEBFF',       // Beach bgA  
    forest: '#CFF7D5',      // Forest bgA
    desert: '#FFF3B0',      // Desert bgB (lighter)
    cove: '#BEEBFF',        // Cove bgA
    tundra: '#E5E7EB',      // Tundra
    canyon: '#A3A3A3',      // Canyon
    aurora: '#EC4899',      // Aurora
    savanna: '#FBBF24',     // Savanna
    glacier: '#DBEAFE',     // Glacier
    volcano: '#DC2626',     // Volcano
    reef: '#0891B2',        // Reef
    temple: '#7C3AED',      // Temple
    harbor: '#E2F0FF',      // Harbor bgA
    observatory: '#101629', // Observatory bgA
    foundry: '#1B1F27',     // Foundry bgA
    // Event biomes - using bgA colors from biome gradients
    pumpkin_patch: '#8B4513', // Pumpkin Patch bgA
    graveyard: '#2C2C2C',     // Graveyard bgA
    haunted_house: '#1A1A1A'  // Haunted House bgA
  };
  
  return colors[worldId] || '#6b7280';
}

function BiomeNode({ 
  world, 
  progress, 
  isUnlocked, 
  onClick,
  index,
  allWorlds,
  enableBranching
}: { 
  world: any; 
  progress: any; 
  isUnlocked: boolean; 
  onClick: (worldId: WorldID) => void;
  index: number;
  allWorlds: any[];
  enableBranching: boolean;
}) {
  const stars = progress.stars || 0;
  const isMastered = stars === 3;
  const isPlacementUnlock = progress.placedUnlock;
  const position = getWorldPosition(world.id, index, allWorlds, enableBranching);
  const isEventBiome = ['pumpkin_patch', 'graveyard', 'haunted_house'].includes(world.id);
  
  // Determine node size based on importance
  const nodeSize = isEventBiome ? 'w-28 h-28' : 'w-24 h-24';
  const textSize = isEventBiome ? 'text-xs' : 'text-xs';

  return (
    <motion.div
      data-biome-node
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => onClick(world.id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {/* Outer glow ring for mastered nodes */}
      {isMastered && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${getWorldColor(world.id)}60 0%, transparent 70%)`,
            width: '140px',
            height: '140px',
            left: '-10px',
            top: '-10px'
          }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Event biome special ring */}
      {isEventBiome && isUnlocked && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ 
            background: `conic-gradient(from 0deg, #ff6b35, #8b5cf6, #dc2626, #ff6b35)`,
            width: '130px',
            height: '130px',
            left: '-9px',
            top: '-9px',
            borderRadius: '50%',
            padding: '2px'
          }}
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "linear"
          }}
        />
      )}

      {/* Main node container with enhanced styling */}
      <div
        className={`
          ${nodeSize} rounded-full relative overflow-hidden
          transition-all duration-300 ease-out
          ${isUnlocked 
            ? 'shadow-xl hover:shadow-2xl' 
            : 'shadow-md opacity-60'
          }
          ${isEventBiome && isUnlocked
            ? 'ring-2 ring-orange-400 ring-opacity-60' 
            : ''
          }
        `}
        style={{ 
          background: isUnlocked 
            ? `linear-gradient(135deg, ${getWorldColor(world.id)} 0%, ${getWorldColor(world.id)}dd 100%)`
            : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
          border: isUnlocked 
            ? '3px solid rgba(255, 255, 255, 0.8)' 
            : '3px solid rgba(156, 163, 175, 0.6)',
          filter: isUnlocked 
            ? 'brightness(1) saturate(1.1)' 
            : 'brightness(0.7) saturate(0.4)'
        }}
      >
        {/* Inner highlight for depth */}
        <div 
          className="absolute inset-1 rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)'
          }}
        />

        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, white 0.5px, transparent 0.5px)`,
            backgroundSize: '12px 12px, 8px 8px'
          }}
        />

        {/* Lock icon and text for locked nodes */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Lock className="w-8 h-8 text-gray-200 drop-shadow-lg mb-1" />
            <div className="text-gray-200 text-xs font-semibold drop-shadow-lg">
              LOCKED
            </div>
          </div>
        )}

        {/* Node content for unlocked nodes */}
        {isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            {/* Title with better typography */}
            <div className={`text-center text-white font-bold leading-tight ${textSize} drop-shadow-lg`}>
              {world.title}
            </div>
            
            {/* Mastery indicator */}
            {isMastered && (
              <div className="absolute top-1 right-1">
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-yellow-800 fill-yellow-800" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced star rating with better positioning */}
      {isUnlocked && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-0.5 bg-white/90 rounded-full px-2 py-1 shadow-md">
          {[1, 2, 3].map(star => (
            <Star
              key={star}
              className={`w-3 h-3 transition-colors duration-200 ${
                star <= stars 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Enhanced placement unlock badge */}
      {isPlacementUnlock && (
        <motion.div 
          className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <Zap className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Enhanced tooltip with better styling */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap">
          <div className="font-semibold text-white mb-1">{world.title}</div>
          <div className="text-gray-300 mb-1">Primary: {SKILLS[world.primarySkill]?.label}</div>
          {!isUnlocked && world.requires && world.requires.length > 0 && (
            <div className="text-red-300">Requires: {world.requires.join(", ")}</div>
          )}
          {isUnlocked && (
            <div className="text-green-300 text-xs mt-1">
              {stars === 3 ? 'Mastered!' : `${stars}/3 stars`}
            </div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </motion.div>
  );
}


function WorldMap({ onClose, onPlayBiome, profile }: Props) {
  const [selectedWorld, setSelectedWorld] = useState<WorldID | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Mobile interaction state
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  // Data validation and error handling
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please log in to view the world map.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  const [touchMoved, setTouchMoved] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  
  // Feature flag for branching system
  const ENABLE_BRANCHING = true; // Toggle this to enable/disable branching layout

  // Get event state and combine worlds
  // Get event state with error handling
  let eventState;
  try {
    eventState = getEventState();
  } catch (error) {
    console.error('Error getting event state:', error);
    eventState = { isEventActive: false };
  }

  // Build world list with error handling
  let allWorlds;
  try {
    allWorlds = [...WORLDS];
    
    // Validate main worlds
    if (!WORLDS || WORLDS.length === 0) {
      console.warn('No main worlds found in progression data');
      allWorlds = [];
    }
    
    // Add event worlds if event is active
    if (eventState.isEventActive && EVENT_WORLDS) {
      allWorlds.push(...EVENT_WORLDS);
      console.log('🎃 WorldMap: Event is active, added event worlds:', EVENT_WORLDS.map(w => w.id));
    }
    
    console.log('🗺️ WorldMap: Total worlds:', allWorlds.length, 'Event active:', eventState.isEventActive);
  } catch (error) {
    console.error('Error loading world data:', error);
    allWorlds = WORLDS || []; // Fallback to main worlds only
  }

  // Use actual profile data - no fallback to mock
  const progress = profile?.unlocks?.biomes ? 
    Object.fromEntries(profile.unlocks.biomes.map((biome: string) => [biome, { stars: 1 }])) :
    {};

  // Handle empty world list
  if (!allWorlds || allWorlds.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Worlds Available
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to load world data. Please try refreshing the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced unlock logic with branching support
  const isUnlocked = (worldId: WorldID) => {
    const world = allWorlds.find(w => w.id === worldId);
    if (!world) return false;
    
    // For spine worlds (layer 0), use normal progression logic
    if (world.layer === 0) {
      return profile?.unlocks?.biomes?.includes(worldId) || false;
    }
    
    // For branch worlds, check if parent is unlocked
    if (world.branchOf) {
      const parentUnlocked = profile?.unlocks?.biomes?.includes(world.branchOf) || false;
      const eventActive = eventState.isEventActive;
      
      // Branch is unlocked if:
      // 1. Event is active AND
      // 2. Parent biome is unlocked AND
      // 3. (For testing) OR if it's explicitly in the profile
      const branchUnlocked = eventActive && parentUnlocked;
      const explicitUnlock = profile?.unlocks?.biomes?.includes(worldId) || false;
      
      const result = branchUnlocked || explicitUnlock;
      
      if (['pumpkin_patch', 'graveyard', 'haunted_house'].includes(worldId)) {
        console.log(`🎃 WorldMap: ${worldId} unlock check:`, {
          parentUnlocked,
          eventActive,
          branchUnlocked,
          explicitUnlock,
          result,
          profileBiomes: profile?.unlocks?.biomes
        });
      }
      
      return result;
    }
    
    // Fallback to profile check
    return profile?.unlocks?.biomes?.includes(worldId) || false;
  };

  const handleWorldClick = (worldId: WorldID) => {
    setSelectedWorld(worldId);
  };

  // Drag and pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if we clicked on a biome node or its children
    const target = e.target as HTMLElement;
    const isBiomeNode = target.closest('[data-biome-node]');
    
    if (!isBiomeNode) { // Only start drag on background, not on biome nodes
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault(); // Prevent text selection
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Enhanced touch handlers for mobile/tablet with long-press detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isBiomeNode = target.closest('[data-biome-node]');
    
    if (!isBiomeNode) { // Only handle touch on background, not on biome nodes
      const touch = e.touches[0];
      const startTime = Date.now();
      
      setTouchStartTime(startTime);
      setTouchMoved(false);
      setIsLongPress(false);
      
      // Start long-press timer (600ms)
      const timer = setTimeout(() => {
        setIsLongPress(true);
        // Visual feedback for long-press (could add haptic feedback here)
        console.log('Long press detected');
      }, 600);
      
      setLongPressTimer(timer);
      setIsDragging(true);
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - (dragStart.x + panOffset.x));
      const deltaY = Math.abs(touch.clientY - (dragStart.y + panOffset.y));
      
      // If touch moved more than 10px, cancel long-press and start drag
      if (deltaX > 10 || deltaY > 10) {
        setTouchMoved(true);
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
        setIsLongPress(false);
      }
      
      setPanOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    // Clear long-press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // If it was a long-press without movement, show context menu or special action
    if (isLongPress && !touchMoved) {
      console.log('Long press action triggered');
      // Could show context menu, reset map position, etc.
      setPanOffset({ x: 0, y: 0 }); // Reset map position on long-press
    }
    
    setIsDragging(false);
    setTouchMoved(false);
    setIsLongPress(false);
  };

  // Cleanup effect for long-press timer
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  const selectedWorldData = selectedWorld ? allWorlds.find(w => w.id === selectedWorld) : null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Map className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Slime World</h1>
          {eventState.isEventActive && (
            <div className="ml-4 px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-semibold flex items-center gap-2">
              🎃 {eventState.currentEvent?.name}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPanOffset({ x: 0, y: 0 })}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Reset map position"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

          {/* Map container - draggable canvas with enhanced mobile support */}
          <div 
            className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              // Ensure minimum touch target size
              minHeight: '44px',
              minWidth: '44px'
            }}
          >
            {/* Long-press visual feedback */}
            {isLongPress && (
              <motion.div
                className="absolute inset-0 bg-blue-500/20 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Draggable content area */}
            <div 
              className="relative w-[200%] h-[150%] min-w-[1200px] min-h-[800px]"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {/* Spine connections - solid lines between main progression biomes */}
              {allWorlds.map((world, index) => {
                // Only connect spine biomes (layer 0) in sequence
                if (world.layer === 0 && index > 0) {
                  const prevWorld = allWorlds[index - 1];
                  if (prevWorld && prevWorld.layer === 0) {
                    const prevPos = getWorldPosition(prevWorld.id, index - 1, allWorlds, ENABLE_BRANCHING);
                    const currentPos = getWorldPosition(world.id, index, allWorlds, ENABLE_BRANCHING);
                    
                    return (
                      <svg
                        key={`spine-connection-${prevWorld.id}-${world.id}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1={`${prevPos.x}%`}
                          y1={`${prevPos.y}%`}
                          x2={`${currentPos.x}%`}
                          y2={`${currentPos.y}%`}
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      </svg>
                    );
                  }
                }
                return null;
              })}

              {/* Branch connections - draw lines between parent and child biomes */}
              {ENABLE_BRANCHING && allWorlds.map((world, index) => {
                if (world.branchOf) {
                  const parentWorld = allWorlds.find(w => w.id === world.branchOf);
                  if (parentWorld) {
                    const parentPos = getWorldPosition(parentWorld.id, allWorlds.findIndex(w => w.id === parentWorld.id), allWorlds, ENABLE_BRANCHING);
                    const childPos = getWorldPosition(world.id, index, allWorlds, ENABLE_BRANCHING);
                    
                    return (
                      <svg
                        key={`connection-${world.id}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1={`${parentPos.x}%`}
                          y1={`${parentPos.y}%`}
                          x2={`${childPos.x}%`}
                          y2={`${childPos.y}%`}
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.6"
                        />
                      </svg>
                    );
                  }
                }
                return null;
              })}

              {/* Biome nodes */}
              {allWorlds.map((world, index) => {
                const unlocked = isUnlocked(world.id);
                const position = getWorldPosition(world.id, index, allWorlds, ENABLE_BRANCHING);
                
                // Debug logging for event biomes
                if (['pumpkin_patch', 'graveyard', 'haunted_house'].includes(world.id)) {
                  console.log(`🎃 Rendering ${world.id}:`, {
                    unlocked,
                    position,
                    progress: progress[world.id],
                    profileBiomes: profile?.unlocks?.biomes
                  });
                }
                
                return (
                  <BiomeNode
                    key={world.id}
                    world={world}
                    progress={progress[world.id] || { stars: 0 }}
                    isUnlocked={unlocked}
                    onClick={handleWorldClick}
                    index={index}
                    allWorlds={allWorlds}
                    enableBranching={ENABLE_BRANCHING}
                  />
                );
              })}
            </div>
          </div>

      {/* World detail panel */}
      {selectedWorldData && (
        <motion.div
          className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-xl p-6 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedWorldData.title}</h3>
              <p className="text-gray-600">Practice {SKILLS[selectedWorldData.primarySkill]?.label} in this biome</p>
            </div>
            <button
              onClick={() => setSelectedWorld(null)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary skill */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 mb-1">Primary Skill</h4>
              <p className="text-blue-700">{SKILLS[selectedWorldData.primarySkill]?.label}</p>
            </div>

            {/* Progress */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-900 mb-1">Progress</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (progress[selectedWorldData.id]?.stars || 0)
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-yellow-700">
                  {progress[selectedWorldData.id]?.stars || 0}/3 stars
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            {isUnlocked(selectedWorldData.id) ? (
              <>
                <button 
                  onClick={() => {
                    if (onPlayBiome) {
                      onPlayBiome(selectedWorldData.id);
                      onClose();
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Play Here
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  View Slimes
                </button>
              </>
            ) : (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Take Placement Test
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-20 right-6 bg-white/10 backdrop-blur rounded-lg p-4 text-white text-sm">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>Mastery stars</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            <span>Locked biome</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>Placement unlock</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Boundary Component for WorldMap
class WorldMapErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry?: () => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WorldMap Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Map Loading Error
            </h3>
            <p className="text-gray-600 mb-4">
              Something went wrong while loading the world map. This might be a temporary issue.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
function WorldMapLoading() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Loading World Map
        </h3>
        <p className="text-gray-600">
          Preparing your adventure...
        </p>
      </div>
    </div>
  );
}

// Enhanced WorldMap with Error Handling
function WorldMapWithErrorHandling(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Simulate loading time and handle potential errors
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [retryCount]);

  if (isLoading) {
    return <WorldMapLoading />;
  }

  return (
    <WorldMapErrorBoundary onRetry={() => setRetryCount(prev => prev + 1)}>
      <WorldMap {...props} />
    </WorldMapErrorBoundary>
  );
}

export default WorldMapWithErrorHandling;

