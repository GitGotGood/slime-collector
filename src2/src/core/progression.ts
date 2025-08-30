import type { Profile, SkillId } from './types';

export const MASTERY = { minAttempts: 20, minAcc: 0.9, maxAvgMs: 6000 };

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

export function updateStatsAndCheckMastery(profile: Profile, skillId: SkillId, correct: boolean, ms: number) {
  if (!profile.skillStats) profile.skillStats = {} as any;
  if (!profile.mastered) profile.mastered = {};
  const st = profile.skillStats[skillId] || { attempts: 0, correct: 0, totalMs: 0, avgMs: null as number | null };
  st.attempts += 1;
  if (correct) st.correct += 1;
  st.totalMs += ms;
  st.avgMs = st.totalMs / st.attempts;
  profile.skillStats[skillId] = st;

  const isMastered =
    st.attempts >= MASTERY.minAttempts &&
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
