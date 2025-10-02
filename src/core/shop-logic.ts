/**
 * MICRO-MEMORY: Shop System - Biome Bias, Daily Rotation, and Item Selection Logic
 * 
 * CORE CONCEPTS:
 * - Biome Bias System: 3x weighting for recently unlocked biome items with 7-day time windows
 * - Daily Rotation: Seeded random selection with consistent daily picks and refresh costs
 * - Evergreen Items: Persistent shop items that show owned status but remain available
 * - Tier Diversity: Ensures balanced representation across common/rare/epic/mythic tiers
 * - Refresh Economics: Escalating costs for manual shop refreshes with daily reset
 * 
 * CRITICAL DEPENDENCIES:
 * - storage.ts: Seeded random number generation and daily key system
 * - economy.ts: Refresh cost calculations and pricing tiers
 * - types.ts: ShopItem, Profile, and biome definitions
 * - SlimeCollectorApp.tsx: Shop modal integration and bias triggering
 * 
 * INLINE DOCUMENTATION STANDARDS:
 * - Bias algorithms: Explain the 3x weighting logic and time window calculations
 * - Selection logic: Document how items are filtered, weighted, and distributed
 * - Refresh mechanics: Explain the cost escalation and daily reset behavior
 * - Data structures: Document the ShopItem format and biome mapping
 * - Debug logging: Explain the shop debug output and bias tracking
 * 
 * RECENT CHANGES: Enhanced biome bias debugging and shop refresh logic
 * 
 * TODO: Add inline documentation for complex selection algorithms and bias calculation formulas
 */

import { seededRng, TODAY_KEY } from './storage';
import type { ShopItem, Profile, WorldID } from './types';
import { getAllLive } from '../assets/slime-roster';
import { REFRESH_COSTS } from './economy';

// V1 Launch: Shop items using our curated production slimes
// All slimes from our launch roster that are available for purchase
export const ALL_SHOP_ITEMS: ShopItem[] = [
  // Launch Commons - Always unlocked
  { id: 'skin_moss', type: 'skin', skin: 'moss', tier: 'common', biome: 'shop' },
  { id: 'skin_sky', type: 'skin', skin: 'sky', tier: 'common', biome: 'shop' },
  { id: 'skin_coral', type: 'skin', skin: 'coral', tier: 'common', biome: 'shop' },
  { id: 'skin_charcoal', type: 'skin', skin: 'charcoal', tier: 'common', biome: 'shop' },
  { id: 'skin_acorn', type: 'skin', skin: 'acorn', tier: 'common', biome: 'shop' },
  { id: 'skin_fog', type: 'skin', skin: 'fog', tier: 'common', biome: 'shop' },
  { id: 'skin_bluebird', type: 'skin', skin: 'bluebird', tier: 'common', biome: 'shop' },
  { id: 'skin_apple_shine', type: 'skin', skin: 'apple_shine', tier: 'common', biome: 'shop' },
  { id: 'skin_honey', type: 'skin', skin: 'honey', tier: 'common', biome: 'shop' },
  { id: 'skin_lilac', type: 'skin', skin: 'lilac', tier: 'common', biome: 'shop' },
  { id: 'skin_berry_jam', type: 'skin', skin: 'berry_jam', tier: 'common', biome: 'shop' },
  
  // Launch Uncommons - Always unlocked
  { id: 'skin_spring_fade', type: 'skin', skin: 'spring_fade', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_autumn_fade', type: 'skin', skin: 'autumn_fade', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_blue_lagoon', type: 'skin', skin: 'blue_lagoon', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_cotton_candy', type: 'skin', skin: 'cotton_candy', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_rainbow', type: 'skin', skin: 'rainbow', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_sunset', type: 'skin', skin: 'sunset', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_sunrise', type: 'skin', skin: 'sunrise', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_watermelon', type: 'skin', skin: 'watermelon', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_copper', type: 'skin', skin: 'copper', tier: 'uncommon', biome: 'shop' },
  
  // Launch Rares - Always unlocked
  { id: 'skin_polka_mint', type: 'skin', skin: 'polka_mint', tier: 'rare', biome: 'shop' },
  { id: 'skin_confetti', type: 'skin', skin: 'confetti', tier: 'rare', biome: 'shop' },
  { id: 'skin_ripple', type: 'skin', skin: 'ripple', tier: 'rare', biome: 'shop' },
  { id: 'skin_sprinkles', type: 'skin', skin: 'sprinkles', tier: 'rare', biome: 'shop' },
  
  // Launch Epics - Daily rotation
  { id: 'skin_lava_flow', type: 'skin', skin: 'lava_flow', tier: 'epic', biome: 'shop' },
  { id: 'skin_aurora_veil', type: 'skin', skin: 'aurora_veil', tier: 'epic', biome: 'shop' },
  { id: 'skin_the_fizz', type: 'skin', skin: 'the_fizz', tier: 'epic', biome: 'shop' },
  { id: 'skin_biolume_veil_enhanced', type: 'skin', skin: 'biolume_veil_enhanced', tier: 'epic', biome: 'shop' },
  { id: 'skin_void_walker', type: 'skin', skin: 'void_walker', tier: 'epic', biome: 'shop' },
  
  // Launch Mythics - Daily rotation marquee
  { id: 'skin_phoenix_heart', type: 'skin', skin: 'phoenix_heart', tier: 'mythic', biome: 'shop' },
  { id: 'skin_nebula', type: 'skin', skin: 'nebula', tier: 'mythic', biome: 'shop' },
  { id: 'skin_cosmic', type: 'skin', skin: 'cosmic', tier: 'mythic', biome: 'shop' },
  { id: 'skin_portal', type: 'skin', skin: 'portal', tier: 'mythic', biome: 'shop' },
  { id: 'skin_vertigo', type: 'skin', skin: 'vertigo', tier: 'mythic', biome: 'shop' },
  { id: 'skin_solar_flare', type: 'skin', skin: 'solar_flare', tier: 'mythic', biome: 'shop' },
  { id: 'skin_infinite_money_glitch', type: 'skin', skin: 'infinite_money_glitch', tier: 'mythic', biome: 'shop' },
];

// Select 4 "Evergreen" (commons/uncommons) - persistent slots, only refresh at midnight
export function evergreenPicks(pool: ShopItem[] = [], owned: string[] = [], profile: any = null): ShopItem[] {
  const today = TODAY_KEY();
  
  // Check if we have a cached evergreen selection for today
  if (profile?.evergreenSelection?.date === today && profile.evergreenSelection.items) {
    // Return cached selection, but filter out any that are now owned
    return profile.evergreenSelection.items.filter((item: ShopItem) => !owned.includes(item.skin));
  }
  
  // Generate new evergreen selection for today
  const evergreenSeed = `evergreen-${today}`;
  const rng = seededRng(evergreenSeed);
  
  // Filter to common/uncommon items, deduplicate by skin type
  const available = pool.filter(item => 
    ['common', 'uncommon'].includes(item.tier)
  );
  
  // Deduplicate by skin type
  const uniqueBySkin = new Map();
  available.forEach(item => {
    if (!uniqueBySkin.has(item.skin)) {
      uniqueBySkin.set(item.skin, item);
    }
  });
  
  const uniqueItems = Array.from(uniqueBySkin.values());
  
  // Select up to 4 random items (don't filter by owned here - we'll handle that in the UI)
  const selected = [];
  const used = new Set();
  
  while (selected.length < 4 && selected.length < uniqueItems.length) {
    const idx = Math.floor(rng() * uniqueItems.length);
    if (!used.has(idx)) {
      used.add(idx);
      selected.push(uniqueItems[idx]);
    }
  }
  
  return selected;
}

// Select 1-4 daily items with biome bias, persistent until refresh
export function todaysPicks(profile: any, allItems: ShopItem[], owned: string[] = []): ShopItem[] {
  const today = TODAY_KEY();
  
  // Check if we have a cached daily selection for today
  if (profile?.dailySelection?.date === today && profile.dailySelection.items) {
    // Return cached selection, but filter out any that are now owned
    return profile.dailySelection.items.filter((item: ShopItem) => !owned.includes(item.skin));
  }
  
  // Generate new daily selection for today
  const hasBias = profile.shopBiasUntil && Date.now() < profile.shopBiasUntil;
  const biasBiome = hasBias ? profile.shopBiasBiome : null;
  
  // Create seeded random generator from daily refresh seed
  const dailySeed = profile.dailyRefresh?.date === today 
    ? profile.dailyRefresh.seed 
    : 42; // fallback seed for new profiles
  const seedStr = `${today}-${dailySeed}-daily`;
  const rng = seededRng(seedStr);
  
  // Deduplicate by skin type first
  const uniqueBySkin = new Map();
  allItems.forEach(item => {
    if (!uniqueBySkin.has(item.skin)) {
      uniqueBySkin.set(item.skin, item);
    }
  });
  
  const uniqueItems = Array.from(uniqueBySkin.values());
  
  // Filter out owned slimes before creating weighted pool
  const nonOwnedItems = uniqueItems.filter(item => !owned.includes(item.skin));
  
  // Create weighted pool from non-owned unique skin items
  const weightedPool: ShopItem[] = [];
  
  for (const item of nonOwnedItems) {
    const baseWeight = 1;
    const biasWeight = (hasBias && item.biome === biasBiome) ? 3 : 1;
    
    // Add item multiple times based on weight
    for (let i = 0; i < baseWeight * biasWeight; i++) {
      weightedPool.push(item);
    }
  }
  
  // Select exactly 4 unique items by skin type
  const selected = [];
  const usedSkins = new Set();
  const targetCount = 4; // Always 4 items
  
  while (selected.length < targetCount && usedSkins.size < nonOwnedItems.length) {
    const idx = Math.floor(rng() * weightedPool.length);
    const item = weightedPool[idx];
    
    if (!usedSkins.has(item.skin)) {
      usedSkins.add(item.skin);
      selected.push(item);
    }
  }
  
  return selected;
}

// Main shop selection function
export function getShopPicks(profile: any, _allItems: ShopItem[]) {
  const owned = profile.unlocks?.skins || [];
  // Build live catalog for the shop from the roster (ignore legacy list)
  const catalog: ShopItem[] = getAllLive().map((s) => ({
    id: `skin_${s.id}`,
    type: 'skin' as const,
    skin: s.id,
    tier: s.tier,
    biome: (s as any).biome || 'shop'
  }));

  // Get evergreen first (persistent until midnight, shows owned as purchased)
  const evergreen = evergreenPicks(catalog, owned, profile);
  const evergreenSkins = new Set(evergreen.map(item => item.skin));
  
  // Get daily picks that don't overlap with evergreen
  const dailyPool = catalog.filter(item => !evergreenSkins.has(item.skin));
  const daily = todaysPicks(profile, dailyPool, owned);
  
  // Debug logging for shop issues
  console.log('🛒 SHOP DEBUG:', {
    ownedSkins: owned,
    dailyCount: daily.length,
    evergreenCount: evergreen.length,
    dailyItems: daily.map(d => ({ id: d.id, skin: d.skin, tier: d.tier, biome: d.biome })),
    evergreenItems: evergreen.map(e => ({ id: e.id, skin: e.skin, tier: e.tier, biome: e.biome })),
    totalUniqueSkins: new Set([...daily.map(d => d.skin), ...evergreen.map(e => e.skin)]).size
  });
  
  // Enhanced biome bias debugging
  const hasBias = profile.shopBiasUntil && Date.now() < profile.shopBiasUntil;
  console.log('🌟 BIAS DEBUG:', {
    hasBias,
    shopBiasUntil: profile.shopBiasUntil,
    shopBiasBiome: profile.shopBiasBiome,
    currentTime: Date.now(),
    timeLeft: hasBias ? profile.shopBiasUntil - Date.now() : 0,
    forestItems: catalog.filter(item => item.biome === 'forest'),
    biasMatchingItems: catalog.filter(item => item.biome === profile.shopBiasBiome)
  });
  
  // Bias info for UI
  const biasInfo = hasBias ? {
    biome: profile.shopBiasBiome,
    timeLeft: profile.shopBiasUntil - Date.now()
  } : null;
  
  return { daily, evergreen, biasInfo };
}

// Refresh utilities
export function nextRefreshCost(profile: any): number | null {
  const today = TODAY_KEY();
  const currentRefresh = profile.dailyRefresh;
  
  // Reset count if it's a new day
  const refreshes = (currentRefresh?.date === today) ? (currentRefresh.count || 0) : 0;
  
  return refreshes < REFRESH_COSTS.length ? REFRESH_COSTS[refreshes] : null;
}

export function refreshDaily(profile: any, cost: number): any {
  const today = TODAY_KEY();
  const currentRefresh = profile.dailyRefresh;
  
  return {
    ...profile,
    goo: profile.goo - cost,
    dailyRefresh: {
      date: today,
      count: (currentRefresh?.date === today ? currentRefresh.count : 0) + 1,
      seed: Math.floor(Math.random() * 999999)
    }
  };
}