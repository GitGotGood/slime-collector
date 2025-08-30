import type { Rarity, ShopItem, Profile } from './types';

export const TIER_PRICE: Record<Rarity, number> = {
  common: 100, uncommon: 250, rare: 500, epic: 1000, mythic: 2500,
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



