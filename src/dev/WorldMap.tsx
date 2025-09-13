import React, { useState } from "react";
import { X, Map, Star, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { MAP, getUnlockedNodes, canAccessNode, getNodeProgress } from "../core/map";
import type { BiomeNodeID, BiomeProgress } from "../core/map";
import { SKILLS } from "../core/skills";

type Props = {
  onClose: () => void;
};

// Mock progress data for proof of concept
const MOCK_PROGRESS: BiomeProgress = {
  meadow: { stars: 3, masteredAt: "2025-01-15" },
  beach: { stars: 2 },
  forest: { stars: 1 },
  // desert: unlocked but not started
  // others: locked
};

function BiomeNode({ 
  node, 
  progress, 
  isUnlocked, 
  onClick 
}: { 
  node: any; 
  progress: any; 
  isUnlocked: boolean; 
  onClick: (nodeId: BiomeNodeID) => void;
}) {
  const stars = progress.stars || 0;
  const isMastered = stars === 3;
  const isPlacementUnlock = progress.placedUnlock;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${node.pos.x}%`, top: `${node.pos.y}%` }}
      onClick={() => onClick(node.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: MAP.indexOf(node) * 0.1 }}
    >
      {/* Glow ring for mastered nodes */}
      {isMastered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            background: `radial-gradient(circle, ${node.color}40 0%, transparent 70%)`,
            width: '120px',
            height: '120px',
            left: '-10px',
            top: '-10px'
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Main node circle */}
      <div
        className={`
          w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center
          transition-all duration-300 relative overflow-hidden
          ${isUnlocked 
            ? `border-white shadow-lg` 
            : `border-gray-400 opacity-50`
          }
        `}
        style={{ 
          backgroundColor: isUnlocked ? node.color : '#9ca3af',
          filter: isUnlocked ? 'brightness(1)' : 'brightness(0.6) saturate(0.3)'
        }}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, white 2px, transparent 2px),
                        radial-gradient(circle at 70% 70%, white 1px, transparent 1px)`,
            backgroundSize: '20px 20px, 15px 15px'
          }}
        />

        {/* Lock icon for locked nodes */}
        {!isUnlocked && (
          <Lock className="w-8 h-8 text-gray-300" />
        )}

        {/* Node title */}
        {isUnlocked && (
          <div className="text-center text-white text-xs font-bold leading-tight px-1">
            {node.title}
          </div>
        )}
      </div>

      {/* Star rating */}
      {isUnlocked && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-0.5">
          {[1, 2, 3].map(star => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= stars 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Placement unlock badge */}
      {isPlacementUnlock && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Skills tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
        <div className="font-semibold">{node.title}</div>
        <div className="text-gray-300">Primary: {SKILLS[node.primarySkill]?.label}</div>
        {!isUnlocked && node.requires.length > 0 && (
          <div className="text-red-300">Requires: {node.requires.join(", ")}</div>
        )}
      </div>
    </motion.div>
  );
}

function PathLine({ from, to, isUnlocked }: { from: any; to: any; isUnlocked: boolean }) {
  const fromX = from.pos.x;
  const fromY = from.pos.y;
  const toX = to.pos.x;
  const toY = to.pos.y;

  return (
    <motion.line
      x1={`${fromX}%`}
      y1={`${fromY}%`}
      x2={`${toX}%`}
      y2={`${toY}%`}
      stroke={isUnlocked ? "#22c55e" : "#9ca3af"}
      strokeWidth="3"
      strokeDasharray={isUnlocked ? "0" : "10,5"}
      opacity={isUnlocked ? 0.8 : 0.4}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  );
}

export default function WorldMap({ onClose }: Props) {
  const [selectedNode, setSelectedNode] = useState<BiomeNodeID | null>(null);
  const [progress] = useState<BiomeProgress>(MOCK_PROGRESS);

  const unlockedNodes = getUnlockedNodes(progress);

  const handleNodeClick = (nodeId: BiomeNodeID) => {
    setSelectedNode(nodeId);
  };

  const selectedNodeData = selectedNode ? MAP.find(n => n.id === selectedNode) : null;

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
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Map container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* SVG for paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {MAP.map(node => 
            node.requires.map(reqId => {
              const reqNode = MAP.find(n => n.id === reqId);
              if (!reqNode) return null;
              const pathUnlocked = unlockedNodes.includes(node.id);
              return (
                <PathLine
                  key={`${reqId}-${node.id}`}
                  from={reqNode}
                  to={node}
                  isUnlocked={pathUnlocked}
                />
              );
            })
          ).flat()}
        </svg>

        {/* Biome nodes */}
        {MAP.map(node => (
          <BiomeNode
            key={node.id}
            node={node}
            progress={getNodeProgress(node.id, progress)}
            isUnlocked={unlockedNodes.includes(node.id)}
            onClick={handleNodeClick}
          />
        ))}
      </div>

      {/* Node detail panel */}
      {selectedNodeData && (
        <motion.div
          className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-xl p-6 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedNodeData.title}</h3>
              <p className="text-gray-600">{selectedNodeData.description}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary skill */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 mb-1">Primary Skill</h4>
              <p className="text-blue-700">{SKILLS[selectedNodeData.primarySkill]?.label}</p>
            </div>

            {/* All skills */}
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-semibold text-green-900 mb-1">Available Skills</h4>
              <div className="space-y-1">
                {selectedNodeData.skills.map(skillId => (
                  <p key={skillId} className="text-green-700 text-sm">
                    {SKILLS[skillId]?.label}
                  </p>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-900 mb-1">Progress</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (getNodeProgress(selectedNodeData.id, progress).stars || 0)
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-yellow-700">
                  {getNodeProgress(selectedNodeData.id, progress).stars || 0}/3 stars
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            {canAccessNode(selectedNodeData.id, progress) ? (
              <>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

