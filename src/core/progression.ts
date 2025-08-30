import type { Profile, SkillID, WorldDef, WorldID, MasteryGate } from './types';

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

// True if profile meets gate for skillId, using profile.skillStats[skillId]
export function meetsMastery(profile: any, skillId: SkillID, gate: MasteryGate): boolean {
  const st = profile?.skillStats?.[skillId];
  if (!st) return false;
  const acc = st.attempts ? st.correct / st.attempts : 0;
  const avg = st.attempts ? st.totalMs / st.attempts : Infinity;
  return st.attempts >= gate.attempts && acc >= gate.minAcc && avg <= gate.maxAvgMs;
}

// Return the first world not yet mastered (V1 - Simple Linear Progression)
export function nextWorld(profile: any): WorldDef | null {
  for (const w of WORLDS) {
    if (!meetsMastery(profile, w.primarySkill, w.gate)) return w;
  }
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
  const w = WORLDS.find(x => x.id === worldId);
  if (!w) return profile;

  const out = { ...profile };
  // ensure arrays
  out.unlocks = out.unlocks || { skins: ['green'], biomes: ['meadow'] };
  out.unlocks.biomes = Array.isArray(out.unlocks.biomes) ? out.unlocks.biomes : ['meadow'];

  if (!out.unlocks.biomes.includes(w.rewards.biomeId)) {
    out.unlocks.biomes.push(w.rewards.biomeId);
  }
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
  
  // Remove times more than 2.5 standard deviations from mean
  return times.filter(time => Math.abs(time - mean) <= 2.5 * stdDev);
}

// Calculate smart average using rolling window + outlier removal
function calculateSmartAverage(responseTimes: number[], windowSize: number = 15): number {
  if (responseTimes.length === 0) return 999999;
  
  // Use rolling window (most recent attempts)
  const recentTimes = responseTimes.slice(-windowSize);
  
  // Remove outliers from the recent window
  const cleanTimes = removeOutliers(recentTimes);
  
  // If we filtered out too many, fall back to capped times
  if (cleanTimes.length === 0) {
    // Cap extreme times at 45 seconds as fallback
    const cappedTimes = recentTimes.map(t => Math.min(t, 45000));
    return cappedTimes.reduce((a, b) => a + b) / cappedTimes.length;
  }
  
  return cleanTimes.reduce((a, b) => a + b) / cleanTimes.length;
}

export function updateStatsAndCheckMastery(profile: Profile, skillId: SkillID, correct: boolean, ms: number) {
  if (!profile.skillStats) profile.skillStats = {} as any;
  if (!profile.mastered) profile.mastered = {};
  const st = profile.skillStats[skillId] || { 
    attempts: 0, 
    correct: 0, 
    totalMs: 0, 
    avgMs: null as number | null,
    responseTimes: []
  };
  
  // Update basic stats
  st.attempts += 1;
  if (correct) st.correct += 1;
  st.totalMs += ms;
  
  // Track individual response times for smart averaging
  if (!st.responseTimes) st.responseTimes = [];
  st.responseTimes.push(ms);
  
  // Calculate smart average using rolling window + outlier removal
  st.avgMs = calculateSmartAverage(st.responseTimes);
  
  profile.skillStats[skillId] = st;

  // Find the specific gate for this skill
  const world = WORLDS.find(w => w.primarySkill === skillId);
  const gate = world?.gate || GATES.EARLY; // fallback to EARLY if no world found
  
  const accuracy = st.correct / st.attempts;
  const avgMs = st.avgMs ?? 999999;
  
  const isMastered = st.attempts >= gate.attempts && accuracy >= gate.minAcc && avgMs <= gate.maxAvgMs;

  // Debug logging
  console.log(`🎯 MASTERY CHECK: ${skillId}`, {
    attempts: `${st.attempts}/${gate.attempts}`,
    accuracy: `${(accuracy * 100).toFixed(1)}%/${(gate.minAcc * 100).toFixed(1)}%`,
    avgTime: `${(avgMs/1000).toFixed(1)}s/${gate.maxAvgMs/1000}s`,
    smartAvg: `${(st.avgMs/1000).toFixed(1)}s (from ${st.responseTimes?.slice(-15).length || 0} recent)`,
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
