import { seededRng, TODAY_KEY } from './storage';
import type { ShopItem, Profile, WorldID } from './types';
import { REFRESH_COSTS } from './economy';

// V1 Launch: Shop items using our curated production slimes
// All slimes from our launch roster that are available for purchase
export const ALL_SHOP_ITEMS: ShopItem[] = [
  // Launch Commons - Always unlocked
  { id: 'skin_moss', type: 'skin', skin: 'moss', tier: 'common', biome: 'shop' },
  { id: 'skin_sky', type: 'skin', skin: 'sky', tier: 'common', biome: 'shop' },
  { id: 'skin_coral', type: 'skin', skin: 'coral', tier: 'common', biome: 'shop' },
  { id: 'skin_charcoal', type: 'skin', skin: 'charcoal', tier: 'common', biome: 'shop' },
  
  // Launch Uncommons - Always unlocked
  { id: 'skin_spring_fade', type: 'skin', skin: 'spring_fade', tier: 'uncommon', biome: 'shop' },
  { id: 'skin_blue_lagoon', type: 'skin', skin: 'blue_lagoon', tier: 'uncommon', biome: 'shop' },
  
  // Launch Rares - Always unlocked
  { id: 'skin_polka_mint', type: 'skin', skin: 'polka_mint', tier: 'rare', biome: 'shop' },
  { id: 'skin_ripple', type: 'skin', skin: 'ripple', tier: 'rare', biome: 'shop' },
  
  // Launch Epics - Daily rotation
  { id: 'skin_lava_flow', type: 'skin', skin: 'lava_flow', tier: 'epic', biome: 'shop' },
  { id: 'skin_aurora_veil', type: 'skin', skin: 'aurora_veil', tier: 'epic', biome: 'shop' },
  
  // Launch Mythics - Daily rotation marquee
  { id: 'skin_nebula_prime', type: 'skin', skin: 'nebula_prime', tier: 'mythic', biome: 'shop' },
  { id: 'skin_phoenix_heart', type: 'skin', skin: 'phoenix_heart', tier: 'mythic', biome: 'shop' },
];

// Select 4 "Evergreen" (commons/uncommons) - show owned as purchased
export function evergreenPicks(pool: ShopItem[] = [], owned: string[] = []): ShopItem[] {
  // Create seeded random generator for evergreen (stable across days)
  const evergreenSeed = "evergreen-stable-selection";
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
  
  // Take up to 4 random unique items (show all, mark owned as purchased)
  const selected = [];
  const used = new Set();
  
  while (selected.length < 4 && selected.length < uniqueItems.length) {
    const idx = Math.floor(rng() * uniqueItems.length); // 🔧 FIXED: Use seeded random
    if (!used.has(idx)) {
      used.add(idx);
      selected.push(uniqueItems[idx]);
    }
  }
  
  return selected;
}

// Select 1-4 daily items with biome bias
export function todaysPicks(profile: any, allItems: ShopItem[]): ShopItem[] {
  const hasBias = profile.shopBiasUntil && Date.now() < profile.shopBiasUntil;
  const biasBiome = hasBias ? profile.shopBiasBiome : null;
  
  // Create seeded random generator from daily refresh seed
  const today = TODAY_KEY();
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
  
  // Create weighted pool from unique skin items
  const weightedPool: ShopItem[] = [];
  
  for (const item of uniqueItems) {
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
  
  while (selected.length < targetCount && usedSkins.size < uniqueItems.length) {
    const idx = Math.floor(rng() * weightedPool.length); // 🔧 FIXED: Use seeded random
    const item = weightedPool[idx];
    
    if (!usedSkins.has(item.skin)) {
      usedSkins.add(item.skin);
      selected.push(item);
    }
  }
  
  return selected;
}

// Main shop selection function
export function getShopPicks(profile: any, allItems: ShopItem[]) {
  const owned = profile.unlocks?.skins || [];
  
  // Get evergreen first (fixed pool)
  const evergreen = evergreenPicks(allItems, owned);
  const evergreenSkins = new Set(evergreen.map(item => item.skin));
  
  // Get daily picks that don't overlap with evergreen
  const dailyPool = allItems.filter(item => !evergreenSkins.has(item.skin));
  const daily = todaysPicks(profile, dailyPool);
  
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
    forestItems: allItems.filter(item => item.biome === 'forest'),
    biasMatchingItems: allItems.filter(item => item.biome === profile.shopBiasBiome)
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
  const refreshes = profile.dailyRefresh?.count || 0;
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