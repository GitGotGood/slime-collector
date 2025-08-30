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
  responseTimes?: number[]; // Track individual response times for rolling window
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

// Badge System Types
export type BadgeTier = 'bronze'|'silver'|'gold'|'diamond';
export type BadgeCategory = 'progress'|'skill'|'streak'|'speed'|'accuracy'|'session'|'shop'|'collection'|'biome'|'seasonal'|'secret';

export type BadgeID = string; // e.g., 'skill_add_1_10_master' or 'streak_10'

export type BadgeDef = {
  id: BadgeID;
  name: string;
  category: BadgeCategory;
  tier?: BadgeTier;              // for single-tier badges
  tiers?: { tier: BadgeTier; goal: number; rewardGoo: number }[]; // for tiered
  description: string;
  icon: string;                  // emoji placeholder or key to vector
  // Progress key tells engine what to count; used for tiered tracking.
  progressKey?: 'streakBest'|'fastUnder1_5'|'fastUnder3'|'correctAllTime'|'accuracyWindow'|'sessionsDay'|'skinsOwned'|'biomesUnlocked';
  // Optional: direct predicate for single-shot badges.
  when?: (ctx: BadgeContext) => boolean;
  rewardGoo?: number;            // for single-shot
  hidden?: boolean;              // 'secret' badges
};

export type BadgeProgress = {
  unlocked: Record<BadgeID, { at:number; tier?: BadgeTier }>;
  counters: Record<string, number>; // progressKey -> count
};

export type BadgeContext = {
  profile: any;
  event: (
    | { type:'answer'; correct:boolean; ms:number; skillId:string; streak:number }
    | { type:'session_end'; stats:{ correct:number; attempts:number; streakBest:number; fastUnder1_5:number; fastUnder3:number; } }
    | { type:'mastery'; skillId:string; worldId:string }
    | { type:'shop_buy'; item:{ type:'skin'; skin:string; tier:string } }
    | { type:'biome_unlock'; biomeId:string }
  );
  now: number;
};

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
  
  // Badge system
  badges?: BadgeProgress;
  
  // Additional counters for badge system
  streakDays?: number;       // consecutive days played
  sessionDamageTaken?: number; // lives lost this session
  dayCounters?: {
    solved: number;          // problems solved today
    solvedMonth: number;     // problems solved this month
    date: string;            // YYYY-MM-DD for tracking
  };
  worldStreaks?: Partial<Record<WorldID, number>>; // 20-streaks per world
}

export interface RootState {
  currentId: string | null;
  profiles: Profile[];
  wishlist: string[]; // optional: skin ids player wants
}



