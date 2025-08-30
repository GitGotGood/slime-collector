import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Trophy, Zap, Target, Clock, Star } from "lucide-react";
import { WORLDS, meetsMastery, GATES } from "../core/progression";
import { SKILL_ORDER, SKILLS } from "../core/skills";
import { levelFromTotalXP } from "../core/progression";
import { BIOMES, getBiomeAccent } from "../assets/biomes";
import type { SkillID, WorldID } from "../core/types";

interface ProgressDashboardProps {
  profile: any;
  onStartSkill: (skillId: SkillID) => void;
  onClose: () => void;
}

// Stats calculation helpers
const getSkillStats = (profile: any, skillId: SkillID) => {
  const stats = profile.skillStats?.[skillId] || { attempts: 0, correct: 0, totalMs: 0, streakBest: 0 };
  const accuracy = stats.attempts > 0 ? (stats.correct / stats.attempts) : 0;
  const avgMs = stats.attempts > 0 ? (stats.totalMs / stats.attempts) : 0;
  
  return {
    ...stats,
    accuracy,
    avgMs,
    fastCount: stats.fastCount || 0,
    quickCount: stats.quickCount || 0,
  };
};

const getTodayStats = (profile: any) => {
  // For now, we'll use a simple approximation since we don't track daily stats yet
  const allSkillStats = profile.skillStats || {};
  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalTime = 0;
  
  Object.values(allSkillStats).forEach((stats: any) => {
    totalAttempts += stats.attempts || 0;
    totalCorrect += stats.correct || 0;
    totalTime += stats.totalMs || 0;
  });
  
  const avgTime = totalAttempts > 0 ? totalTime / totalAttempts / 1000 : 0;
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  
  return {
    problems: Math.min(totalAttempts, 42), // Cap for demo
    avgTime,
    accuracy
  };
};

const getNextUnlock = (profile: any) => {
  const unlockedSkills = SKILL_ORDER.filter(skillId => {
    if (skillId === "add_1_10") return true;
    const skillIndex = SKILL_ORDER.indexOf(skillId);
    if (skillIndex === 0) return true;
    const prevSkill = SKILL_ORDER[skillIndex - 1];
    const world = WORLDS.find(w => w.primarySkill === prevSkill);
    return world ? meetsMastery(profile, prevSkill, world.gate) : false;
  });
  
  const nextSkillIndex = unlockedSkills.length;
  if (nextSkillIndex >= SKILL_ORDER.length) return null;
  
  const nextSkill = SKILL_ORDER[nextSkillIndex];
  const world = WORLDS.find(w => w.primarySkill === nextSkill);
  const prevWorld = WORLDS.find(w => w.primarySkill === SKILL_ORDER[nextSkillIndex - 1]);
  
  if (!world || !prevWorld) return null;
  
  const prevSkillStats = getSkillStats(profile, SKILL_ORDER[nextSkillIndex - 1]);
  const gate = prevWorld.gate;
  
  const attemptsNeeded = Math.max(0, gate.attempts - prevSkillStats.attempts);
  const accuracyProgress = prevSkillStats.accuracy;
  const timeProgress = prevSkillStats.avgMs;
  
  return {
    fromWorld: prevWorld.title,
    toWorld: world.title,
    attemptsNeeded,
    accuracyProgress,
    timeProgress,
    gate,
    skill: nextSkill
  };
};

// Component for individual skill cards
const SkillCard: React.FC<{
  skillId: SkillID;
  profile: any;
  onStartSkill: (skillId: SkillID) => void;
  isUnlocked: boolean;
}> = ({ skillId, profile, onStartSkill, isUnlocked }) => {
  const skill = SKILLS[skillId];
  const stats = getSkillStats(profile, skillId);
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY;
  const isMastered = meetsMastery(profile, skillId, gate);
  
  const masteryProgress = {
    attempts: Math.min(stats.attempts / gate.attempts, 1),
    accuracy: stats.accuracy / gate.minAcc,
    time: gate.maxAvgMs / Math.max(stats.avgMs, gate.maxAvgMs)
  };
  
  if (!isUnlocked) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
        <div className="text-gray-500 text-sm font-medium mb-2">🔒 Locked</div>
        <div className="text-gray-600 font-semibold">{skill?.name || skillId}</div>
        <div className="text-xs text-gray-500 mt-1">Master previous skill to unlock</div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="bg-white border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-emerald-800">{skill?.name || skillId}</div>
          {isMastered && <div className="text-xs text-emerald-600 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Mastered
          </div>}
        </div>
        <button
          onClick={() => onStartSkill(skillId)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Play className="w-3 h-3" /> Practice
        </button>
      </div>
      
      {/* Progress bars */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span>Attempts: {stats.attempts}/{gate.attempts}</span>
          <span className={stats.attempts >= gate.attempts ? "text-emerald-600" : "text-gray-500"}>
            {stats.attempts >= gate.attempts ? "✓" : ""}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${masteryProgress.attempts >= 1 ? "bg-emerald-500" : "bg-blue-400"}`}
            style={{ width: `${Math.min(masteryProgress.attempts * 100, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span>Accuracy: {(stats.accuracy * 100).toFixed(0)}%/{(gate.minAcc * 100).toFixed(0)}%</span>
          <span className={stats.accuracy >= gate.minAcc ? "text-emerald-600" : "text-gray-500"}>
            {stats.accuracy >= gate.minAcc ? "✓" : ""}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${masteryProgress.accuracy >= 1 ? "bg-emerald-500" : "bg-orange-400"}`}
            style={{ width: `${Math.min(masteryProgress.accuracy * 100, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span>Avg Time: {(stats.avgMs/1000).toFixed(1)}s/{gate.maxAvgMs/1000}s</span>
          <span className={stats.avgMs <= gate.maxAvgMs && stats.avgMs > 0 ? "text-emerald-600" : "text-gray-500"}>
            {stats.avgMs <= gate.maxAvgMs && stats.avgMs > 0 ? "✓" : ""}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${masteryProgress.time >= 1 ? "bg-emerald-500" : "bg-purple-400"}`}
            style={{ width: `${Math.min(masteryProgress.time * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Fun stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Trophy className="w-3 h-3 text-yellow-500" />
          <span>Best: {stats.streakBest}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-orange-500" />
          <span>Fast: {stats.fastCount}</span>
        </div>
      </div>
      
      {/* Next reward */}
      {!isMastered && world && (
        <div className="mt-3 p-2 bg-emerald-50 rounded-lg">
          <div className="text-xs font-medium text-emerald-800">
            Master to unlock {world.title} + 50 Goo
          </div>
        </div>
      )}
    </motion.div>
  );
};

// World tile component for the horizontal rail
const WorldTile: React.FC<{
  world: any;
  profile: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ world, profile, isSelected, onClick }) => {
  const isMastered = meetsMastery(profile, world.primarySkill, world.gate);
  const isUnlocked = profile.unlocks?.biomes?.includes(world.id) || world.id === "meadow";
  const biomeAccent = getBiomeAccent(world.id);
  
  return (
    <motion.button
      onClick={onClick}
      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all ${
        isSelected 
          ? "border-emerald-500 bg-emerald-50" 
          : isUnlocked
          ? "border-emerald-200 bg-white hover:bg-emerald-50"
          : "border-gray-200 bg-gray-50 opacity-60"
      }`}
      whileHover={isUnlocked ? { scale: 1.05 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
      style={{ borderColor: isSelected ? biomeAccent : undefined }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <div className="text-lg mb-1">
          {isUnlocked ? "🌟" : "🔒"}
        </div>
        <div className="text-xs font-medium text-center leading-tight">
          {world.title}
        </div>
        {isMastered && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default function ProgressDashboard({ profile, onStartSkill, onClose }: ProgressDashboardProps) {
  const [selectedWorldId, setSelectedWorldId] = useState<WorldID | null>(null);
  
  const level = levelFromTotalXP(profile.xp).level;
  const todayStats = getTodayStats(profile);
  const nextUnlock = getNextUnlock(profile);
  
  // Get unlocked skills
  const unlockedSkills = useMemo(() => {
    return SKILL_ORDER.filter(skillId => {
      if (skillId === "add_1_10") return true;
      const skillIndex = SKILL_ORDER.indexOf(skillId);
      if (skillIndex === 0) return true;
      const prevSkill = SKILL_ORDER[skillIndex - 1];
      const world = WORLDS.find(w => w.primarySkill === prevSkill);
      return world ? meetsMastery(profile, prevSkill, world.gate) : false;
    });
  }, [profile]);
  
  // Filter skills by selected world
  const filteredSkills = selectedWorldId 
    ? SKILL_ORDER.filter(skillId => {
        const world = WORLDS.find(w => w.primarySkill === skillId);
        return world?.id === selectedWorldId;
      })
    : SKILL_ORDER;
  
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-lg">{profile.name}</div>
              <div className="text-gray-600">Level {level} • 🟡 {profile.goo} Goo</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Today Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{todayStats.problems}</div>
            <div className="text-sm text-gray-600">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{todayStats.avgTime.toFixed(1)}s</div>
            <div className="text-sm text-gray-600">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{todayStats.accuracy.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
        
        {/* Next Unlock */}
        {nextUnlock && (
          <div className="bg-gradient-to-r from-purple-50 to-emerald-50 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-2">
              🎯 Next Unlock: {nextUnlock.fromWorld} → {nextUnlock.toWorld}
            </div>
            <div className="text-sm text-gray-600">
              {nextUnlock.attemptsNeeded > 0 
                ? `${nextUnlock.attemptsNeeded} more attempts needed`
                : "Ready to unlock! Keep practicing for mastery."
              }
            </div>
          </div>
        )}
      </div>
      
      {/* World Rail */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Worlds</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <motion.button
            onClick={() => setSelectedWorldId(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
              selectedWorldId === null 
                ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Skills
          </motion.button>
          {WORLDS.map(world => (
            <WorldTile
              key={world.id}
              world={world}
              profile={profile}
              isSelected={selectedWorldId === world.id}
              onClick={() => setSelectedWorldId(world.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skillId => (
          <SkillCard
            key={skillId}
            skillId={skillId}
            profile={profile}
            onStartSkill={onStartSkill}
            isUnlocked={unlockedSkills.includes(skillId)}
          />
        ))}
      </div>
    </div>
  );
}

