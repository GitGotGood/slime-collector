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

// 16 Worlds: K→5 Linear Path
export const WORLDS: WorldDef[] = [
  { id:'meadow', title:'Meadow', primarySkill:'add_1_10', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'beach', shopBiasDays:7 } },
  { id:'beach',  title:'Beach',  primarySkill:'add_1_20', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'forest',  shopBiasDays:7 } },
  { id:'forest', title:'Forest', primarySkill:'sub_1_10', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'desert', shopBiasDays:7 } },
  { id:'desert', title:'Desert', primarySkill:'sub_1_20', alsoSkills:[], gate:GATES.EARLY, rewards:{ biomeId:'cove', shopBiasDays:7 } },
  { id:'cove',   title:'Cove',   primarySkill:'mixed_20', alsoSkills:['missing_20'], gate:GATES.EARLY, rewards:{ biomeId:'tundra', shopBiasDays:7 } },
  { id:'tundra', title:'Tundra', primarySkill:'mul_0_5_10', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'tundra', shopBiasDays:7 } },
  { id:'canyon', title:'Canyon', primarySkill:'mul_0_10', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'canyon', shopBiasDays:7 } },
  { id:'aurora', title:'Aurora', primarySkill:'div_facts', alsoSkills:[], gate:GATES.MID, rewards:{ biomeId:'aurora', shopBiasDays:7 } },
  { id:'savanna',title:'Savanna',primarySkill:'add_3digit', alsoSkills:['sub_3digit'], gate:GATES.MID, rewards:{ biomeId:'savanna', shopBiasDays:7 } },
  { id:'glacier',title:'Glacier',primarySkill:'mul_1d_x_2_3d', alsoSkills:['mul_2d_intro'], gate:GATES.MID, rewards:{ biomeId:'glacier', shopBiasDays:7 } },
  { id:'volcano',title:'Volcano',primarySkill:'longdiv_1d', alsoSkills:[], gate:GATES.LATE, rewards:{ biomeId:'volcano', shopBiasDays:7 } },
  { id:'reef',   title:'Reef',   primarySkill:'frac_basic', alsoSkills:['frac_equiv'], gate:GATES.LATE, rewards:{ biomeId:'reef', shopBiasDays:7 } },
  { id:'temple', title:'Temple', primarySkill:'frac_add_like', alsoSkills:['frac_sub_like','frac_whole_mult'], gate:GATES.LATE, rewards:{ biomeId:'temple', shopBiasDays:7 } },
  { id:'harbor', title:'Harbor', primarySkill:'dec_place', alsoSkills:['dec_addsub'], gate:GATES.LATE, rewards:{ biomeId:'harbor', shopBiasDays:7 } },
  { id:'observatory', title:'Observatory', primarySkill:'order_ops', alsoSkills:['powers10'], gate:GATES.LATE, rewards:{ biomeId:'observatory', shopBiasDays:7 } },
  { id:'foundry', title:'Foundry', primarySkill:'volume_rect', alsoSkills:['coord_plane','word_multi'], gate:GATES.LATE, rewards:{ biomeId:'foundry', shopBiasDays:7 } },
];

// True if profile meets gate for skillId, using profile.skillStats[skillId]
export function meetsMastery(profile: any, skillId: SkillID, gate: MasteryGate): boolean {
  const st = profile?.skillStats?.[skillId];
  if (!st) return false;
  const acc = st.attempts ? st.correct / st.attempts : 0;
  const avg = st.attempts ? st.totalMs / st.attempts : Infinity;
  return st.attempts >= gate.attempts && acc >= gate.minAcc && avg <= gate.maxAvgMs;
}

// Return the first world not yet mastered
export function nextWorld(profile: any): WorldDef | null {
  for (const w of WORLDS) {
    if (!meetsMastery(profile, w.primarySkill, w.gate)) return w;
  }
  return null; // all mastered
}

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
  return out;
}

// Helper to find world by skill
export function worldIdOf(skillId: SkillID): WorldID | null {
  const world = WORLDS.find(w => w.primarySkill === skillId);
  return world?.id ?? null;
}

export function updateStatsAndCheckMastery(profile: Profile, skillId: SkillID, correct: boolean, ms: number) {
  if (!profile.skillStats) profile.skillStats = {} as any;
  if (!profile.mastered) profile.mastered = {};
  const st = profile.skillStats[skillId] || { attempts: 0, correct: 0, totalMs: 0, avgMs: null as number | null };
  st.attempts += 1;
  if (correct) st.correct += 1;
  st.totalMs += ms;
  st.avgMs = st.totalMs / st.attempts;
  profile.skillStats[skillId] = st;

  const isMastered =
    st.attempts >= MASTERY.attempts &&
    (st.correct / st.attempts) >= MASTERY.minAcc &&
    (st.avgMs ?? 999999) <= MASTERY.maxAvgMs;

  if (isMastered && !profile.mastered[skillId]) {
    profile.mastered[skillId] = true;
    applyXP(profile, 100);
    profile.goo += 50;
  }
}

export function getMasteryBonus(profile: Profile): number {
  const masteredCount = Object.values(profile.mastered ?? {}).filter(Boolean).length;
  return Math.max(1, Math.min(1.25, 1 + masteredCount * 0.05));
}
