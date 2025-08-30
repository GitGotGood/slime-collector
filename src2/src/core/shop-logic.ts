import { seededRng, TODAY_KEY } from './storage';
import type { ShopItem, Profile } from './types';
import { REFRESH_COSTS } from './economy';

export function todaysPicks(pool: ShopItem[], seedExtra = 0): ShopItem[] {
  const rng = seededRng('daily-' + TODAY_KEY() + '-' + seedExtra);
  const arr = [...pool];
  const picks: ShopItem[] = [];
  const takeOne = () => {
    if (!arr.length) return;
    const i = Math.floor(rng() * arr.length);
    picks.push(arr.splice(i, 1)[0]);
  };
  while (picks.length < 4 && arr.length) takeOne();
  return picks;
}

export function evergreenPicks(pool: ShopItem[], ownedSkins: string[]): ShopItem[] {
  // prefer things the player doesn't own; then fill to 4 if needed
  const candidate = pool.filter((it) => !ownedSkins.includes(it.skin));
  const have = new Set(candidate.map(c => c.id));
  const fill = pool.filter((it) => !have.has(it.id));
  return [...candidate, ...fill].slice(0, 4);
}

export function nextRefreshCost(profile: Profile): number | null {
  const today = TODAY_KEY();
  const prev = (profile.dailyRefresh && profile.dailyRefresh.date === today)
    ? profile.dailyRefresh
    : { date: today, count: 0, seed: 0 };
  return prev.count >= 3 ? null : REFRESH_COSTS[prev.count];
}

export function refreshDaily(profile: Profile, cost: number): Profile {
  const today = TODAY_KEY();
  const prev = (profile.dailyRefresh && profile.dailyRefresh.date === today)
    ? profile.dailyRefresh
    : { date: today, count: 0, seed: 0 };

  if (prev.count >= 3 || profile.goo < cost) return profile;

  return {
    ...profile,
    goo: profile.goo - cost,
    dailyRefresh: { date: today, count: prev.count + 1, seed: prev.seed + 1 },
  };
}



