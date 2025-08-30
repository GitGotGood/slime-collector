// Core types shared across modules

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'mythic';

export type SkillId =
  | 'add_1_10' | 'add_1_20'
  | 'sub_1_10' | 'sub_1_20'
  | 'mul_0_5_10' | 'mul_0_10'
  | 'div_facts'
  | 'mixed_all';

export interface SkillStat {
  attempts: number;
  correct: number;
  totalMs: number;
  avgMs: number | null;
}

export interface ShopItem {
  id: string;
  type: 'skin';   // future: 'accessory' | 'booster'
  skin: string;   // links to assets/skins.ts palette id
  tier: Rarity;
}

export interface DailyRefresh {
  date: string;   // YYYY-MM-DD
  count: number;  // 0..3 per day
  seed: number;   // extra seed to reshuffle daily picks
}

export interface Profile {
  id: string;
  name: string;
  color: string;

  goo: number;
  xp: number;
  level: number;

  settings: {
    soundOn: boolean;
    activeSkin: string; // skin id
  };

  mastered: Partial<Record<SkillId, boolean>>;
  skillStats: Record<SkillId, SkillStat>;

  unlocks: {
    skins: string[];
    biomes: string[];
    // future: accessories, buddies, badges
  };

  best: { score: number; streak: number };
  dailyRefresh?: DailyRefresh;
}

export interface RootState {
  currentId: string | null;
  profiles: Profile[];
  wishlist: string[]; // optional: skin ids player wants
}



