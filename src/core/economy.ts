import type { Rarity, ShopItem, Profile } from './types';

// [Sep-11] Dan: Make Epic/Mythic more expensive for V1.1 balance | Changed: Epic 1000→1500, Mythic 2500→3000 | Why: son getting premium items too easily
export const TIER_PRICE: Record<Rarity, number> = {
  common: 100, uncommon: 250, rare: 500, epic: 1500, mythic: 3000,
};

export function priceOf(item: ShopItem): number {
  return TIER_PRICE[item.tier] ?? 100;
}

export function levelUpGoo(levelAfter: number): number {
  // small escalating level-up bonus
  return 20 + 5 * levelAfter;
}

export const REFRESH_COSTS = [100, 200, 400] as const;

export function canAfford(p: Profile, cost: number): boolean {
  return p.goo >= cost;
}



