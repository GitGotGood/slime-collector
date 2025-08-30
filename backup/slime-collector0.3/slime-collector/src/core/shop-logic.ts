import { seededRng, TODAY_KEY } from './storage';
import type { ShopItem, Profile, WorldID } from './types';
import { REFRESH_COSTS } from './economy';

// V1 Curriculum: Biome-mapped shop items
// This maps existing skins to biomes for the shop bias system
export const ALL_SHOP_ITEMS: ShopItem[] = [
  // Meadow (Starting biome) - Basic green/nature skins
  { id: 'skin_green', type: 'skin', skin: 'green', tier: 'common', biome: 'meadow' },
  { id: 'skin_lime', type: 'skin', skin: 'lime', tier: 'common', biome: 'meadow' },
  { id: 'skin_mint', type: 'skin', skin: 'mint', tier: 'uncommon', biome: 'meadow' },
  
  // Beach (Addition 1-20) - Blue/aqua/sandy skins  
  { id: 'skin_blue', type: 'skin', skin: 'blue', tier: 'common', biome: 'beach' },
  { id: 'skin_aqua', type: 'skin', skin: 'aqua', tier: 'uncommon', biome: 'beach' },
  { id: 'skin_sandy', type: 'skin', skin: 'sandy', tier: 'rare', biome: 'beach' },
  
  // Forest (Subtraction 1-10) - Deep green/brown/woody skins
  { id: 'skin_forest', type: 'skin', skin: 'forest', tier: 'uncommon', biome: 'forest' },
  { id: 'skin_bark', type: 'skin', skin: 'bark', tier: 'rare', biome: 'forest' },
  
  // Desert (Subtraction 1-20) - Orange/yellow/tan skins
  { id: 'skin_orange', type: 'skin', skin: 'orange', tier: 'common', biome: 'desert' },
  { id: 'skin_golden', type: 'skin', skin: 'golden', tier: 'rare', biome: 'desert' },
  
  // Cove (Mixed operations) - Purple/crystal skins
  { id: 'skin_purple', type: 'skin', skin: 'purple', tier: 'uncommon', biome: 'cove' },
  { id: 'skin_crystal', type: 'skin', skin: 'crystal', tier: 'epic', biome: 'cove' },
  
  // Tundra (Multiplication basics) - Ice/white/cool skins
  { id: 'skin_ice', type: 'skin', skin: 'ice', tier: 'rare', biome: 'tundra' },
  { id: 'skin_frost', type: 'skin', skin: 'frost', tier: 'epic', biome: 'tundra' },
  
  // Canyon (Multiplication facts) - Red/rock skins
  { id: 'skin_red', type: 'skin', skin: 'red', tier: 'common', biome: 'canyon' },
  { id: 'skin_ruby', type: 'skin', skin: 'ruby', tier: 'epic', biome: 'canyon' },
  
  // Aurora (Division facts) - Rainbow/magical skins
  { id: 'skin_rainbow', type: 'skin', skin: 'rainbow', tier: 'mythic', biome: 'aurora' },
  { id: 'skin_aurora', type: 'skin', skin: 'aurora', tier: 'mythic', biome: 'aurora' },
  
  // Savanna (3-digit addition/subtraction) - Earth tone skins
  { id: 'skin_savanna', type: 'skin', skin: 'savanna', tier: 'rare', biome: 'savanna' },
  
  // Glacier (Multi-digit multiplication) - Advanced ice skins
  { id: 'skin_glacier', type: 'skin', skin: 'glacier', tier: 'epic', biome: 'glacier' },
  
  // Volcano (Long division) - Fire/lava skins
  { id: 'skin_lava', type: 'skin', skin: 'lava', tier: 'epic', biome: 'volcano' },
  { id: 'skin_magma', type: 'skin', skin: 'magma', tier: 'mythic', biome: 'volcano' },
  
  // Reef (Fractions basics) - Ocean/coral skins
  { id: 'skin_coral', type: 'skin', skin: 'coral', tier: 'rare', biome: 'reef' },
  { id: 'skin_pearl', type: 'skin', skin: 'pearl', tier: 'epic', biome: 'reef' },
  
  // Temple (Advanced fractions) - Ancient/mystical skins
  { id: 'skin_ancient', type: 'skin', skin: 'ancient', tier: 'epic', biome: 'temple' },
  { id: 'skin_mystic', type: 'skin', skin: 'mystic', tier: 'mythic', biome: 'temple' },
  
  // Harbor (Decimals) - Naval/trade skins
  { id: 'skin_naval', type: 'skin', skin: 'naval', tier: 'rare', biome: 'harbor' },
  { id: 'skin_captain', type: 'skin', skin: 'captain', tier: 'epic', biome: 'harbor' },
  
  // Observatory (Order of operations) - Space/star skins
  { id: 'skin_stellar', type: 'skin', skin: 'stellar', tier: 'epic', biome: 'observatory' },
  { id: 'skin_cosmic', type: 'skin', skin: 'cosmic', tier: 'mythic', biome: 'observatory' },
  
  // Foundry (Advanced geometry/word problems) - Metal/craft skins
  { id: 'skin_bronze', type: 'skin', skin: 'bronze', tier: 'rare', biome: 'foundry' },
  { id: 'skin_steel', type: 'skin', skin: 'steel', tier: 'epic', biome: 'foundry' },
  { id: 'skin_platinum', type: 'skin', skin: 'platinum', tier: 'mythic', biome: 'foundry' },
  
  // Unbiomed skins (always available)
  { id: 'skin_pink', type: 'skin', skin: 'pink', tier: 'common' },
  { id: 'skin_yellow', type: 'skin', skin: 'yellow', tier: 'common' },
  { id: 'skin_black', type: 'skin', skin: 'black', tier: 'uncommon' },
  { id: 'skin_white', type: 'skin', skin: 'white', tier: 'uncommon' },
];

// Select 4 "Evergreen" (commons/uncommons user doesn't own)
export function evergreenPicks(pool: ShopItem[] = [], owned: string[] = []): ShopItem[] {
  const avail = pool.filter(i => i.type === 'skin' && !owned.includes(i.skin));
  // prefer common then uncommon
  const commons = avail.filter(i => i.tier === 'common');
  const uncommons = avail.filter(i => i.tier === 'uncommon');
  const rest = avail.filter(i => !['common', 'uncommon'].includes(i.tier));
  
  const take = (arr: ShopItem[], n: number): ShopItem[] => {
    const out: ShopItem[] = [];
    const a = [...arr];
    while (out.length < n && a.length) {
      out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    }
    return out;
  };
  
  const pick = [...take(commons, 2), ...take(uncommons, 2)];
  return pick.length < 4 ? [...pick, ...take(rest, 4 - pick.length)] : pick.slice(0, 4);
}

// Select 4 "Daily" with optional biome bias
export function todaysPicks(pool: ShopItem[] = [], biasBiome?: string, biasActive = false): ShopItem[] {
  let candidates = [...pool];
  
  if (biasActive && biasBiome) {
    // weight items from that biome 3×
    const boosted = pool.filter(i => i.biome === biasBiome);
    candidates = [...pool, ...boosted, ...boosted]; // simple weight
  }
  
  // ensure diversity by tier
  const tiers = ['common', 'uncommon', 'rare', 'epic', 'mythic'];
  const out: ShopItem[] = [];
  
  for (const t of tiers) {
    const tierItems = candidates.filter(i => i.tier === t);
    if (tierItems.length) out.push(tierItems[Math.floor(Math.random() * tierItems.length)]);
    if (out.length === 4) break;
  }
  
  // fill to 4
  while (out.length < 4 && candidates.length) {
    const i = Math.floor(Math.random() * candidates.length);
    const item = candidates.splice(i, 1)[0];
    if (!out.find(x => x.id === item.id)) out.push(item);
  }
  
  return out.slice(0, 4);
}

// In ShopModal, pass bias like:
export function getShopPicks(profile: Profile, allShopItems: ShopItem[] = []): { daily: ShopItem[]; evergreen: ShopItem[]; biasInfo?: { biome: string; timeLeft: number } } {
  const biasActive = (profile.shopBiasUntil || 0) > Date.now();
  const biasBiome = biasActive ? profile.shopBiasBiome : undefined;
  
  const daily = todaysPicks(allShopItems, biasBiome, biasActive);
  const owned = profile.unlocks?.skins || [];
  const evergreen = evergreenPicks(allShopItems.filter(i => !daily.find(d => d.id === i.id)), owned);
  
  const result: { daily: ShopItem[]; evergreen: ShopItem[]; biasInfo?: { biome: string; timeLeft: number } } = { 
    daily, 
    evergreen 
  };
  
  if (biasActive && biasBiome) {
    result.biasInfo = {
      biome: biasBiome,
      timeLeft: Math.max(0, (profile.shopBiasUntil || 0) - Date.now())
    };
  }
  
  return result;
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



