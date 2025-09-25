/**
 * MICRO-MEMORY: Core Progression System - Mastery Gates, Rolling Accuracy, and Turbo Detection
 * 
 * CORE CONCEPTS:
 * - Rolling Accuracy Windows: Per-skill ring buffers (20/25/30 answers) for forgiveness-based progression
 * - Smart Speed Averaging: Outlier removal, exponential weighting, and speed caps for fair assessment
 * - Turbo Detection: Identifies rapid-fire answers and triggers intercept modals with cooldown
 * - Mastery Gates: Three-tier system (EARLY/MID/LATE) with attempts, accuracy, and speed requirements
 * - World Progression: Linear skill unlocking with biome rewards and celebration triggers
 * 
 * CRITICAL DEPENDENCIES:
 * - types.ts: Profile, SkillStat, and progression interfaces
 * - skills.ts: Skill definitions and problem generation
 * - SlimeCollectorApp.tsx: Main orchestrator that calls these functions
 * 
 * INLINE DOCUMENTATION STANDARDS:
 * - Rolling buffer algorithms: Explain the ring buffer mechanics and forgiveness logic
 * - Speed calculations: Document outlier removal thresholds and weighting formulas
 * - Turbo detection: Explain the streak counting and cooldown timing
 * - Mastery checks: Document the three-gate system and progression requirements
 * - Data structures: Explain the rollingAccuracy buffer format and usage
 * 
 * RECENT CHANGES: Updated TURBO_MS threshold based on play session data analysis
 * 
 * TODO: Add inline documentation for rolling accuracy buffer management and smart averaging algorithms
 */

import type { Profile, SkillID, WorldDef, WorldID, MasteryGate } from './types';

// Constants for new accuracy/speed system
export const MISTAP_MS = 180;
export const TURBO_MS = 800; // Based on play session data analysis
export const TURBO_STREAK = 3;
export const INTERCEPT_COOLDOWN_S = 75;
export const SPEED_MIN_MS = 200; // exclude from speed calc
export const SPEED_MAX_MS = 10000; // cap to 10s in speed calc

// Three mastery difficulty levels
export const GATES = {
  EARLY: { attempts: 20, minAcc: 0.90, maxAvgMs: 6000 },
  MID:   { attempts: 25, minAcc: 0.88, maxAvgMs: 7000 },
  LATE:  { attempts: 30, minAcc: 0.85, maxAvgMs: 9000 },
} as const;

// Legacy for compatibility
export const MASTERY = GATES.EARLY;

export function xpToNext(level: number): number {
  // Smooth widening gaps: 100, 140, 180, ... capped at 1400
  const raw = 100 + 40 * Math.max(0, level - 1);
  return Math.min(raw, 1400);
}

export function levelFromTotalXP(totalXP: number): { level: number; xpInto: number; xpNeed: number } {
  let lvl = 1;
  let remaining = Math.max(0, Math.floor(totalXP));
  while (remaining >= xpToNext(lvl)) { remaining -= xpToNext(lvl); lvl++; }
  return { level: lvl, xpInto: remaining, xpNeed: xpToNext(lvl) };
}

export function applyXP(profile: Profile, addXp: number) {
  profile.xp += Math.round(addXp);
  profile.level = levelFromTotalXP(profile.xp).level;
}

// 16 Worlds: K→5 Linear Path (V1 - Clean Progression)
export const WORLDS: WorldDef[] = [
  { id:'meadow', title:'Meadow', primarySkill:'add_1_10', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'beach', shopBiasDays:7 } },
  { id:'beach',  title:'Beach',  primarySkill:'add_1_20', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'forest',  shopBiasDays:7 } },
  { id:'forest', title:'Forest', primarySkill:'sub_1_10', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'desert', shopBiasDays:7 } },
  { id:'desert', title:'Desert', primarySkill:'sub_1_20', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'cove', shopBiasDays:7 } },
  { id:'cove',   title:'Cove',   primarySkill:'mixed_20', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'tundra', shopBiasDays:7 } },
  { id:'tundra', title:'Tundra', primarySkill:'mul_0_5_10', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'canyon', shopBiasDays:7 } },
  { id:'canyon', title:'Canyon', primarySkill:'mul_0_10', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'aurora', shopBiasDays:7 } },
  { id:'aurora', title:'Aurora', primarySkill:'div_facts', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'savanna', shopBiasDays:7 } },
  { id:'savanna',title:'Savanna',primarySkill:'add_3digit', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'glacier', shopBiasDays:7 } },
  { id:'glacier',title:'Glacier',primarySkill:'mul_1d_x_2_3d', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'volcano', shopBiasDays:7 } },
  { id:'volcano',title:'Volcano',primarySkill:'longdiv_1d', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'reef', shopBiasDays:7 } },
  { id:'reef',   title:'Reef',   primarySkill:'frac_basic', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'temple', shopBiasDays:7 } },
  { id:'temple', title:'Temple', primarySkill:'frac_add_like', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'harbor', shopBiasDays:7 } },
  { id:'harbor', title:'Harbor', primarySkill:'dec_place', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'observatory', shopBiasDays:7 } },
  { id:'observatory', title:'Observatory', primarySkill:'order_ops', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'foundry', shopBiasDays:7 } },
  { id:'foundry', title:'Foundry', primarySkill:'volume_rect', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'foundry', shopBiasDays:7 } },
];

// 🗺️ FUTURE WORLD MAP FEATURE: Additional Skills for Exploration (V2)
// These will become bonus areas on the interactive map with special rewards
export const FUTURE_EXPLORATION_SKILLS = {
  // Cove Bonus: Algebra introduction
  cove_exploration: ['missing_20'], // "Find the Missing" → Special algebra badges/skins
  
  // Savanna Bonus: 3-digit operations
  savanna_exploration: ['sub_3digit'], // Alternative to add_3digit
  
  // Glacier Bonus: Advanced multiplication 
  glacier_exploration: ['mul_2d_intro'], // 2-digit × 2-digit mastery
  
  // Reef Bonus: Fraction equivalence
  reef_exploration: ['frac_equiv'], // Fraction equivalence mastery
  
  // Temple Bonus: Fraction operations
  temple_exploration: ['frac_sub_like', 'frac_whole_mult'], // Advanced fraction work
  
  // Harbor Bonus: Decimal operations
  harbor_exploration: ['dec_addsub'], // Decimal arithmetic
  
  // Observatory Bonus: Powers of 10
  observatory_exploration: ['powers10'], // Powers of 10 mastery
  
  // Foundry Bonus: Advanced geometry & word problems
  foundry_exploration: ['coord_plane', 'word_multi'], // Coordinate plane & word problems
};

// True if profile meets gate for skillId, using rolling accuracy and speed
export function meetsMastery(profile: any, skillId: SkillID, gate: MasteryGate): boolean {
  const st = profile?.skillStats?.[skillId];
  if (!st) {
    console.log(`🎯 MEETS MASTERY DEBUG: No stats for ${skillId}`);
    return false;
  }
  
  // Use rolling accuracy instead of lifetime accuracy
  const rollingAcc = getRollingAccuracy(profile, skillId);
  const rollingSpeed = getRollingSpeed(profile, skillId);
  
  // Check if we have enough counted answers and meet thresholds
  const result = rollingAcc.n >= gate.attempts && 
         rollingAcc.pct >= gate.minAcc && 
         rollingSpeed.avgWeightedMs <= gate.maxAvgMs;
  
  console.log(`🎯 MEETS MASTERY DEBUG for ${skillId}:`, {
    attempts: `${rollingAcc.n}/${gate.attempts}`,
    accuracy: `${rollingAcc.pct.toFixed(1)}%/${gate.minAcc}%`,
    speed: `${rollingSpeed.avgWeightedMs.toFixed(0)}ms/${gate.maxAvgMs}ms`,
    result
  });
  
  return result;
}

// Return the first world not yet mastered (V1 - Simple Linear Progression)
export function nextWorld(profile: any): WorldDef | null {
  console.log('🌍 NEXT WORLD FUNCTION DEBUG:', {
    profileId: profile?.id,
    profileName: profile?.name,
    mastered: profile?.mastered,
    skillStats: profile?.skillStats,
    unlockedBiomes: profile?.unlocks?.biomes
  });
  
  for (const w of WORLDS) {
    const isMastered = meetsMastery(profile, w.primarySkill, w.gate);
    console.log(`🌍 Checking world ${w.id} (${w.title}):`, {
      primarySkill: w.primarySkill,
      gate: w.gate,
      isMastered,
      skillStats: profile?.skillStats?.[w.primarySkill]
    });
    
    if (!isMastered) {
      console.log(`🌍 Returning next world: ${w.id} (${w.title})`);
      return w;
    }
  }
  
  console.log('🌍 All worlds mastered, returning null');
  return null; // all mastered
}

// V2 FEATURE: Check if a world is mastered (including exploration skills)
// export function isWorldMastered(profile: any, world: WorldDef): boolean {
//   // Check primary skill first
//   if (meetsMastery(profile, world.primarySkill, world.gate)) {
//     return true;
//   }
//   
//   // Check if any exploration skill is mastered
//   const explorationSkills = FUTURE_EXPLORATION_SKILLS[`${world.id}_exploration`] || [];
//   for (const skillId of explorationSkills) {
//     if (meetsMastery(profile, skillId, world.gate)) {
//       return true;
//     }
//   }
//   
//   return false;
// }

// On mastery of a world's primary skill: unlock biome & set shop bias
export function onWorldMastered(profile: any, worldId: WorldID): any {
  console.log('🌍 ON WORLD MASTERED CALLED:', {
    worldId,
    profileId: profile?.id,
    profileName: profile?.name,
    currentBiomes: profile?.unlocks?.biomes || [],
    mastered: profile?.mastered || {}
  });

  const w = WORLDS.find(x => x.id === worldId);
  if (!w) {
    console.log('🌍 ERROR: World not found:', worldId);
    return profile;
  }

  console.log('🌍 WORLD FOUND:', {
    worldId: w.id,
    worldTitle: w.title,
    primarySkill: w.primarySkill,
    rewardBiome: w.rewards.biomeId,
    gate: w.gate
  });

  const out = { ...profile };
  // ensure arrays
  out.unlocks = out.unlocks || { skins: ['green'], biomes: ['meadow'] };
  out.unlocks.biomes = Array.isArray(out.unlocks.biomes) ? out.unlocks.biomes : ['meadow'];

  console.log('🌍 BEFORE UNLOCKING - Current biomes:', out.unlocks.biomes);

  // Unlock all biomes up to and including the reward biome
  // This ensures that mastering a later world unlocks all prerequisite biomes
  const rewardBiomeId = w.rewards.biomeId;
  const worldIndex = WORLDS.findIndex(world => world.id === worldId);
  const rewardWorldIndex = WORLDS.findIndex(world => world.id === rewardBiomeId);
  
  console.log('🌍 UNLOCKING LOGIC:', {
    worldIndex,
    rewardWorldIndex,
    rewardBiomeId,
    totalWorlds: WORLDS.length
  });
  
  // If the reward biome is a valid world, unlock all biomes from meadow to that biome
  if (rewardWorldIndex >= 0) {
    console.log('🌍 UNLOCKING BIOMES FROM MEADOW TO:', rewardBiomeId);
    for (let i = 0; i <= rewardWorldIndex; i++) {
      const biomeToUnlock = WORLDS[i].id;
      const alreadyUnlocked = out.unlocks.biomes.includes(biomeToUnlock);
      console.log(`🌍 BIOME ${i}: ${biomeToUnlock} - ${alreadyUnlocked ? 'ALREADY UNLOCKED' : 'UNLOCKING'}`);
      
      if (!alreadyUnlocked) {
        out.unlocks.biomes.push(biomeToUnlock);
        console.log(`🌍 ✅ UNLOCKED BIOME: ${biomeToUnlock} (from mastering ${worldId})`);
      }
    }
  } else {
    console.log('🌍 FALLBACK: Reward biome not found in WORLDS, unlocking directly:', rewardBiomeId);
    // Fallback: just unlock the reward biome (for non-world biomes)
    if (!out.unlocks.biomes.includes(rewardBiomeId)) {
      out.unlocks.biomes.push(rewardBiomeId);
      console.log(`🌍 ✅ UNLOCKED REWARD BIOME: ${rewardBiomeId}`);
    }
  }

  console.log('🌍 AFTER UNLOCKING - New biomes:', out.unlocks.biomes);
  // shop bias window
  const until = Date.now() + w.rewards.shopBiasDays * 86400000;
  out.shopBiasUntil = Math.max(out.shopBiasUntil || 0, until);
  out.shopBiasBiome = w.rewards.biomeId;
  
  // 🔍 DEBUG: Shop bias setting
  console.log('🏪 BIAS SETTING:', {
    worldId,
    worldTitle: w.title,
    rewardBiome: w.rewards.biomeId,
    shopBiasDays: w.rewards.shopBiasDays,
    biasUntil: until,
    currentTime: Date.now(),
    timeLeftMs: until - Date.now(),
    timeLeftHours: (until - Date.now()) / (1000 * 60 * 60),
    shopBiasUntil: out.shopBiasUntil,
    shopBiasBiome: out.shopBiasBiome
  });
  
  return out;
}

// Helper to find world by skill
export function worldIdOf(skillId: SkillID): WorldID | null {
  const world = WORLDS.find(w => w.primarySkill === skillId);
  return world?.id ?? null;
}

// Helper function to remove statistical outliers from response times
function removeOutliers(times: number[]): number[] {
  if (times.length < 3) return times; // Need at least 3 data points
  
  const mean = times.reduce((a, b) => a + b) / times.length;
  const variance = times.map(t => (t - mean) ** 2).reduce((a, b) => a + b) / times.length;
  const stdDev = Math.sqrt(variance);
  
  // Remove times more than 3.0 standard deviations from mean (less aggressive)
  return times.filter(time => Math.abs(time - mean) <= 3.0 * stdDev);
}

// Calculate smart average using rolling window + outlier removal
function calculateSmartAverage(responseTimes: number[], windowSize: number = 20): number {
  if (responseTimes.length === 0) return 999999;
  
  // Use rolling window (most recent attempts) - increased from 15 to 20
  const recentTimes = responseTimes.slice(-windowSize);
  
  // Remove outliers from the recent window
  const cleanTimes = removeOutliers(recentTimes);
  
  // If we filtered out too many, fall back to capped times
  if (cleanTimes.length === 0) {
    // Cap extreme times at 45 seconds as fallback
    const cappedTimes = recentTimes.map(t => Math.min(t, 45000));
    return cappedTimes.reduce((a, b) => a + b) / cappedTimes.length;
  }
  
  // Give more weight to recent answers (exponential decay)
  const weights = cleanTimes.map((_, i) => Math.pow(1.1, i)); // 10% more weight for each recent answer
  const weightedSum = cleanTimes.reduce((sum, time, i) => sum + time * weights[i], 0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  return weightedSum / totalWeight;
}

export function updateStatsAndCheckMastery(profile: Profile, skillId: SkillID, correct: boolean, ms: number, counted: boolean = true, scrub: 'none' | 'mis_tap' | 'turbo' = 'none') {
  if (!profile.skillStats) profile.skillStats = {} as any;
  if (!profile.mastered) profile.mastered = {};
  const st = profile.skillStats[skillId] || { 
    attempts: 0, 
    correct: 0, 
    totalMs: 0, 
    avgMs: null as number | null,
    responseTimes: [],
    rollingAccuracy: []
  };
  
  // Update basic stats (for backward compatibility)
  st.attempts += 1;
  if (correct) st.correct += 1;
  st.totalMs += ms;
  
  // Track individual response times for smart averaging (legacy)
  if (!st.responseTimes) st.responseTimes = [];
  st.responseTimes.push(ms);
  
  // Add to rolling accuracy buffer
  addToRollingBuffer(st, skillId, correct, ms, counted, scrub);
  
  // Calculate smart average using rolling window + outlier removal (legacy)
  st.avgMs = calculateSmartAverage(st.responseTimes);
  
  profile.skillStats[skillId] = st;

  // Find the specific gate for this skill
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY; // fallback to EARLY if no world found
  
  // Use rolling accuracy and speed for mastery check
  const rollingAcc = getRollingAccuracy(profile, skillId);
  const rollingSpeed = getRollingSpeed(profile, skillId);
  
  const isMastered = rollingAcc.n >= gate.attempts && 
                    rollingAcc.pct >= gate.minAcc && 
                    rollingSpeed.avgWeightedMs <= gate.maxAvgMs;

  // Debug logging
  console.log(`🎯 MASTERY CHECK: ${skillId}`, {
    attempts: `${st.attempts}/${gate.attempts}`,
    rollingAccuracy: `${(rollingAcc.pct * 100).toFixed(1)}% (${rollingAcc.n}/${rollingAcc.N})/${(gate.minAcc * 100).toFixed(1)}%`,
    rollingSpeed: `${(rollingSpeed.avgWeightedMs/1000).toFixed(1)}s/${gate.maxAvgMs/1000}s`,
    counted: counted,
    scrub: scrub,
    isMastered,
    wasAlreadyMastered: profile.mastered[skillId]
  });

  if (isMastered && !profile.mastered[skillId]) {
    console.log(`🌟 SKILL MASTERED: ${skillId}!`);
    profile.mastered[skillId] = true;
    applyXP(profile, 100);
    profile.goo += 50;
  }
}

export function getMasteryBonus(profile: Profile): number {
  const masteredCount = Object.values(profile.mastered ?? {}).filter(Boolean).length;
  return Math.max(1, Math.min(1.25, 1 + masteredCount * 0.05));
}

// Helper function to get rolling accuracy for a skill
export function getRollingAccuracy(profile: Profile, skillId: SkillID): { n: number; N: number; pct: number } {
  const stats = profile.skillStats?.[skillId];
  if (!stats?.rollingAccuracy) return { n: 0, N: 0, pct: 0 };
  
  // Find the gate for this skill to determine buffer size
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY;
  const N = gate.attempts; // 20/25/30 based on tier
  
  // Get only counted answers (exclude mis-taps and scrubbed)
  const countedAnswers = stats.rollingAccuracy.filter(answer => answer.counted);
  const correctCount = countedAnswers.filter(answer => answer.correct).length;
  const n = countedAnswers.length;
  
  return {
    n: Math.min(n, N), // Don't exceed buffer size
    N,
    pct: n > 0 ? correctCount / n : 0
  };
}

// Helper function to get rolling speed for a skill
export function getRollingSpeed(profile: Profile, skillId: SkillID): { avgWeightedMs: number; n: number } {
  const stats = profile.skillStats?.[skillId];
  if (!stats?.rollingAccuracy) return { avgWeightedMs: 999999, n: 0 };
  
  // Get only counted answers (exclude mis-taps and scrubbed)
  const countedAnswers = stats.rollingAccuracy.filter(answer => answer.counted);
  const n = countedAnswers.length;
  
  if (n === 0) return { avgWeightedMs: 999999, n: 0 };
  
  // Extract response times and apply speed caps
  const responseTimes = countedAnswers
    .map(answer => answer.t_ms)
    .filter(time => time >= SPEED_MIN_MS) // Exclude too-fast answers
    .map(time => Math.min(time, SPEED_MAX_MS)); // Cap at 10 seconds
  
  if (responseTimes.length === 0) return { avgWeightedMs: 999999, n: 0 };
  
  // Use existing smart averaging logic
  const avgWeightedMs = calculateSmartAverage(responseTimes, 20);
  
  return { avgWeightedMs, n: responseTimes.length };
}

// Helper function to get buffer size for a skill tier
export function getBufferSizeForSkill(skillId: SkillID): number {
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY;
  return gate.attempts; // 20/25/30 based on tier
}

// Helper function to add answer to rolling buffer
function addToRollingBuffer(stats: any, skillId: SkillID, correct: boolean, t_ms: number, counted: boolean, scrub: 'none' | 'mis_tap' | 'turbo' = 'none') {
  if (!stats.rollingAccuracy) stats.rollingAccuracy = [];
  
  const bufferSize = getBufferSizeForSkill(skillId);
  const newAnswer = {
    correct,
    t_ms,
    counted,
    scrub,
    ts: Date.now()
  };
  
  // Add to buffer
  stats.rollingAccuracy.push(newAnswer);
  
  // Trim to buffer size (ring buffer behavior)
  if (stats.rollingAccuracy.length > bufferSize) {
    stats.rollingAccuracy = stats.rollingAccuracy.slice(-bufferSize);
  }
}

// Helper function to retro-scrub the last N turbo answers
export function retroScrubTurboAnswers(profile: Profile, skillId: SkillID, count: number = 3) {
  const stats = profile.skillStats?.[skillId];
  if (!stats?.rollingAccuracy) return;
  
  // Find the last N turbo answers and mark them as scrubbed
  let scrubbedCount = 0;
  for (let i = stats.rollingAccuracy.length - 1; i >= 0 && scrubbedCount < count; i--) {
    const answer = stats.rollingAccuracy[i];
    if (answer.t_ms < TURBO_MS && answer.scrub === 'none') {
      answer.scrub = 'turbo';
      answer.counted = false;
      scrubbedCount++;
    }
  }
  
  console.log(`🧹 Retro-scrubbed ${scrubbedCount} turbo answers for ${skillId}`);
}

// Helper function to calculate strong answers for a skill
// A strong answer is one that is correct AND fast enough to contribute to mastery
export function getStrongAnswerCount(profile: Profile, skillId: SkillID): number {
  const stats = profile.skillStats?.[skillId];
  if (!stats?.rollingAccuracy) return 0;
  
  // Find the gate for this skill
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY;
  
  // Count strong answers from rolling accuracy buffer
  // Strong = correct AND fast (under gate.maxAvgMs) AND counted
  const strongAnswers = stats.rollingAccuracy.filter(answer => 
    answer.counted && 
    answer.correct && 
    answer.t_ms <= gate.maxAvgMs
  ).length;
  
  return strongAnswers;
}
