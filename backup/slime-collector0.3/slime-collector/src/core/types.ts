// Core types shared across modules

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'mythic';

export type SkillID =
  | 'add_1_10'|'add_1_20'
  | 'sub_1_10'|'sub_1_20'
  | 'mixed_20'|'missing_20'
  | 'mul_0_5_10'|'mul_0_10'
  | 'div_facts'
  | 'add_3digit'|'sub_3digit'
  | 'mul_1d_x_2_3d'|'mul_2d_intro'
  | 'longdiv_1d'
  | 'frac_basic'|'frac_equiv'
  | 'frac_add_like'|'frac_sub_like'|'frac_whole_mult'
  | 'dec_place'|'dec_addsub'
  | 'order_ops'|'powers10'
  | 'volume_rect'|'coord_plane'|'word_multi';

export type WorldID =
  | 'meadow'|'beach'|'forest'|'desert'|'cove'|'tundra'|'canyon'|'aurora'
  | 'savanna'|'glacier'|'volcano'|'reef'|'temple'|'harbor'|'observatory'|'foundry';

// Legacy type alias for compatibility
export type SkillId = SkillID;

export type MasteryGate = { attempts: number; minAcc: number; maxAvgMs: number };

export type Problem = {
  a?: number; b?: number;               // operands if applicable
  op?: '+'|'-'|'×'|'÷';
  text?: string;                        // for word/volume/place value, etc
  answer: number;                       // V1 numeric only
  options: number[];                    // 4 choices, shuffled, >= 0
};

export type SkillDef = {
  id: SkillID;
  label: string;
  diff: number;                         // difficulty multiplier
  kind:
    | 'add'|'sub'|'mul'|'div'
    | 'mixed'|'missing'
    | 'place'|'multi-digit'|'fractions'|'decimals'|'order'|'powers'|'geom'|'coord'|'word';
  gen: () => Problem;                   // question generator
};

export type WorldDef = {
  id: WorldID;
  title: string;
  primarySkill: SkillID;                // main gate for this world
  alsoSkills: SkillID[];                // listed in Skills dashboard
  gate: MasteryGate;                    // EARLY / MID / LATE
  rewards: { biomeId: WorldID; shopBiasDays: number }; // unlock behavior
};

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
  biome?: WorldID;  // V1 Curriculum: which biome this skin belongs to
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
    eyeTracking: boolean; // eye tracking preference
  };

  mastered: Partial<Record<SkillID, boolean>>;
  skillStats: Record<SkillID, SkillStat>;

  // Shop bias system
  shopBiasUntil?: number;               // timestamp when bias expires
  shopBiasBiome?: WorldID;              // which biome to bias toward

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



