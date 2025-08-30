import type { BadgeDef, BadgeContext, BadgeID, BadgeTier, SkillID } from './types';
import { SKINS } from '../assets/skins';

const T = (tier: BadgeTier, goal:number, rewardGoo:number) => ({ tier, goal, rewardGoo });

export const BADGES: BadgeDef[] = [
  // Progress / World Badges
  { 
    id:'progress_first_session', 
    name:'World Starter', 
    category:'progress', 
    tier:'bronze', 
    icon:'🌱',
    description:'Complete your first session (10+ questions).',
    when: ({event}) => event.type==='session_end' && (event.stats?.correct + (event.stats?.attempts - event.stats?.correct)) >= 10,
    rewardGoo:50,
  },

  // Biome unlock badges
  { 
    id:'biome_meadow', 
    name:'Biome Buddy: Meadow', 
    category:'biome', 
    tier:'bronze', 
    icon:'🌾',
    description:'Unlock the Meadow biome.',
    when: ({profile}) => (Array.isArray(profile.unlocks?.biomes) ? profile.unlocks.biomes.includes('meadow') : false),
    rewardGoo:50,
  },
  { 
    id:'biome_beach', 
    name:'New Shores', 
    category:'biome', 
    tier:'silver', 
    icon:'🏖️',
    description:'Unlock the Beach biome.',
    when: ({event}) => event.type==='biome_unlock' && event.biomeId==='beach',
    rewardGoo:100,
  },
  { 
    id:'biome_any4', 
    name:'Trailblazer', 
    category:'biome', 
    tier:'gold', 
    icon:'🧭',
    description:'Unlock any 4 biomes.',
    when: ({profile}) => (Array.isArray(profile.unlocks?.biomes) ? profile.unlocks.biomes.length : 0) >= 4,
    rewardGoo:150,
  },
  { 
    id:'biome_any8', 
    name:'Explorer', 
    category:'biome', 
    tier:'diamond', 
    icon:'🗺️',
    description:'Unlock any 8 biomes.',
    when: ({profile}) => (Array.isArray(profile.unlocks?.biomes) ? profile.unlocks.biomes.length : 0) >= 8,
    rewardGoo:250,
  },

  // Skill mastery badges
  { 
    id:'skill_add_1_10_master', 
    name:'Adder Apprentice', 
    category:'skill', 
    tier:'bronze', 
    icon:'➕',
    description:'Master Addition 1–10.',
    when: ({event}) => event.type==='mastery' && event.skillId==='add_1_10',
    rewardGoo:50,
  },
  { 
    id:'skill_add_1_20_master', 
    name:'Adder Adept', 
    category:'skill', 
    tier:'silver', 
    icon:'➕',
    description:'Master Addition 1–20.',
    when: ({event}) => event.type==='mastery' && event.skillId==='add_1_20',
    rewardGoo:100,
  },
  { 
    id:'skill_sub_1_10_master', 
    name:'Subtraction Star', 
    category:'skill', 
    tier:'bronze', 
    icon:'➖',
    description:'Master Subtraction 1–10.',
    when: ({event}) => event.type==='mastery' && event.skillId==='sub_1_10',
    rewardGoo:50,
  },
  { 
    id:'skill_mul_0_10_master', 
    name:'Times Tamer', 
    category:'skill', 
    tier:'silver', 
    icon:'✖️',
    description:'Master Multiplication Facts.',
    when: ({event}) => event.type==='mastery' && event.skillId==='mul_0_10',
    rewardGoo:100,
  },
  { 
    id:'skill_div_facts_master', 
    name:'Division Dynamo', 
    category:'skill', 
    tier:'gold', 
    icon:'➗',
    description:'Master Division Facts.',
    when: ({event}) => event.type==='mastery' && event.skillId==='div_facts',
    rewardGoo:150,
  },

  { 
    id:'skill_frac_any2', 
    name:'Fraction Friend', 
    category:'skill', 
    tier:'gold', 
    icon:'🍰',
    description:'Master any 2 fraction skills.',
    when: ({profile}) => {
      const fractionSkills: SkillID[] = ['frac_basic', 'frac_equiv', 'frac_add_like', 'frac_sub_like', 'frac_whole_mult'];
      const mastered = fractionSkills.filter(skill => profile.mastered?.[skill]).length;
      return mastered >= 2;
    },
    rewardGoo:150,
  },
  { 
    id:'skill_dec_both', 
    name:'Decimal Driver', 
    category:'skill', 
    tier:'gold', 
    icon:'📊',
    description:'Master both decimal skills.',
    when: ({profile}) => profile.mastered?.['dec_place'] && profile.mastered?.['dec_addsub'],
    rewardGoo:150,
  },
  { 
    id:'skill_order_ops_master', 
    name:'Order Oracle', 
    category:'skill', 
    tier:'diamond', 
    icon:'🔢',
    description:'Master Order of Operations.',
    when: ({event}) => event.type==='mastery' && event.skillId==='order_ops',
    rewardGoo:250,
  },

  // Streak badges (tiered)
  { 
    id:'streak_best', 
    name:'Streak Scout', 
    category:'streak', 
    icon:'🎯',
    description:'Reach best streak milestones.',
    progressKey:'streakBest',
    tiers: [ T('bronze',5,50), T('silver',10,100), T('gold',20,150), T('diamond',30,250) ],
  },

  // Speed badges (tiered)
  { 
    id:'speed_fast3', 
    name:'Speedster', 
    category:'speed', 
    icon:'⚡',
    description:'Answer fast in a session (under 3s).',
    progressKey:'fastUnder3',
    tiers: [ T('bronze',5,50), T('silver',15,100), T('gold',30,150), T('diamond',60,250) ],
  },
  { 
    id:'speed_fast1_5', 
    name:'Blazing', 
    category:'speed', 
    icon:'🔥',
    description:'Lightning answers in a session (under 1.5s).',
    progressKey:'fastUnder1_5',
    tiers: [ T('bronze',5,50), T('silver',10,100), T('gold',20,150), T('diamond',40,250) ],
  },

  // Accuracy badges (session-based)
  { 
    id:'acc_90_session', 
    name:'Sharp Shooter', 
    category:'accuracy', 
    tier:'bronze', 
    icon:'🎯',
    description:'≥90% accuracy over ≥20 attempts in a session.',
    when: ({event}) => event.type==='session_end' && (event.stats.attempts>=20) && (event.stats.correct / event.stats.attempts >= 0.90),
    rewardGoo:50,
  },
  { 
    id:'acc_95_session', 
    name:'Bullseye', 
    category:'accuracy', 
    tier:'silver', 
    icon:'🏅',
    description:'≥95% accuracy over ≥20 attempts in a session.',
    when: ({event}) => event.type==='session_end' && (event.stats.attempts>=20) && (event.stats.correct / event.stats.attempts >= 0.95),
    rewardGoo:100,
  },

  // Session / Habit badges
  { 
    id:'days_played_3', 
    name:'Warm-Up Wizard', 
    category:'session', 
    tier:'bronze', 
    icon:'🌞',
    description:'Play 3 days in a row.',
    when: ({profile}) => (profile.streakDays || 0) >= 3,
    rewardGoo:50,
  },
  { 
    id:'days_played_7', 
    name:'Weekly Warrior', 
    category:'session', 
    tier:'silver', 
    icon:'📆',
    description:'Play 7 days in a row.',
    when: ({profile}) => (profile.streakDays || 0) >= 7,
    rewardGoo:100,
  },
  { 
    id:'solve12_session', 
    name:'Daily Dozen', 
    category:'session', 
    tier:'bronze', 
    icon:'🥚',
    description:'Solve 12 problems in one session.',
    when: ({event}) => event.type==='session_end' && event.stats.correct >= 12,
    rewardGoo:50,
  },
  { 
    id:'solve100_day', 
    name:'Marathon Slime', 
    category:'session', 
    tier:'gold', 
    icon:'🏃',
    description:'Solve 100 problems in one day.',
    when: ({profile}) => (profile.dayCounters?.solved || 0) >= 100,
    rewardGoo:150,
  },

  // Shop & Collection badges
  { 
    id:'shop_first', 
    name:'First Find', 
    category:'shop', 
    tier:'bronze', 
    icon:'🛍️',
    description:'Buy any skin from the shop.',
    when: ({event}) => event.type==='shop_buy' && event.item?.type==='skin',
    rewardGoo:50,
  },
  { 
    id:'skins_5', 
    name:'Palette Pal', 
    category:'collection', 
    tier:'silver', 
    icon:'🎨',
    description:'Own 5 different skins.',
    when: ({profile}) => Array.isArray(profile.unlocks?.skins) && profile.unlocks.skins.length >= 5,
    rewardGoo:100,
  },
  { 
    id:'skins_10', 
    name:'Curator', 
    category:'collection', 
    tier:'gold', 
    icon:'🖼️',
    description:'Own 10 different skins.',
    when: ({profile}) => Array.isArray(profile.unlocks?.skins) && profile.unlocks.skins.length >= 10,
    rewardGoo:150,
  },
  { 
    id:'own_mythic', 
    name:'Myth-Peek', 
    category:'collection', 
    tier:'diamond', 
    icon:'👑',
    description:'Own a mythic-tier skin.',
    when: ({profile}) => {
      const owned = profile.unlocks?.skins || [];
      return owned.some((id:string)=> SKINS[id]?.tier === 'mythic');
    },
    rewardGoo:250,
  },

  // Mixed / Combo badges
  { 
    id:'hot_streak', 
    name:'Hot Streak', 
    category:'streak', 
    tier:'silver', 
    icon:'🔥',
    description:'10-streak with average time under 3s.',
    when: ({event}) => event.type==='session_end' && event.stats.streakBest >= 10 && ((event.stats.fastUnder3 || 0) >= 10),
    rewardGoo:100,
  },
  { 
    id:'no_miss_20', 
    name:'Cool Under Pressure', 
    category:'session', 
    tier:'gold', 
    icon:'🧊',
    description:'Answer 20 correct without losing a life.',
    when: ({event,profile}) => event.type==='session_end' && (event.stats.correct >= 20) && ((profile.sessionDamageTaken || 0) === 0),
    rewardGoo:150,
  },

  // Seasonal badges (hidden)
  { 
    id:'season_oct', 
    name:'Pumpkin Patch', 
    category:'seasonal', 
    tier:'bronze', 
    icon:'🎃', 
    hidden:true,
    description:'Solve 30 problems in October.',
    when: ({profile}) => (new Date().getMonth()===9) && (profile.dayCounters?.solvedMonth || 0) >= 30,
    rewardGoo:50,
  },
  { 
    id:'season_dec', 
    name:'Candy Frost', 
    category:'seasonal', 
    tier:'bronze', 
    icon:'❄️', 
    hidden:true,
    description:'Solve 30 problems in December.',
    when: ({profile}) => (new Date().getMonth()===11) && (profile.dayCounters?.solvedMonth || 0) >= 30,
    rewardGoo:50,
  },
  { 
    id:'season_jan', 
    name:'Firecracker', 
    category:'seasonal', 
    tier:'bronze', 
    icon:'🎆', 
    hidden:true,
    description:'Play your first session in January.',
    when: ({event}) => event.type==='session_end' && (new Date().getMonth()===0),
    rewardGoo:50,
  },
  { 
    id:'season_apr', 
    name:'Egg Dye', 
    category:'seasonal', 
    tier:'bronze', 
    icon:'🥚', 
    hidden:true,
    description:'Play any session in April.',
    when: ({event}) => event.type==='session_end' && (new Date().getMonth()===3),
    rewardGoo:50,
  },
  { 
    id:'season_jul', 
    name:'Beach Day', 
    category:'seasonal', 
    tier:'bronze', 
    icon:'☀️', 
    hidden:true,
    description:'Solve 50 problems in July.',
    when: ({profile}) => (new Date().getMonth()===6) && (profile.dayCounters?.solvedMonth || 0) >= 50,
    rewardGoo:50,
  },

  // Secret badges (hidden)
  { 
    id:'secret_forest_footprint', 
    name:'Forest Footprint', 
    category:'secret', 
    tier:'gold', 
    icon:'🦶', 
    hidden:true,
    description:'Achieve three 20-streaks in Forest world.',
    when: ({profile}) => (profile.worldStreaks?.forest || 0) >= 3,
    rewardGoo:150,
  },
];

// ---- Badge Evaluation Engine ----

export function evaluateBadges(profile:any, ctx: BadgeContext): { newlyUnlocked: { id:BadgeID; tier?:BadgeTier; rewardGoo:number }[], profile:any } {
  const now = ctx.now || Date.now();
  
  // Initialize badge progress if missing
  if (!profile.badges) {
    profile.badges = { unlocked: {}, counters: {} };
  }

  // Update counters from context (for answer events)
  if (ctx.event.type==='answer') {
    if (ctx.event.correct) {
      profile.badges.counters['correctAllTime'] = (profile.badges.counters['correctAllTime']||0)+1;
      if (ctx.event.ms < 1500) {
        profile.badges.counters['fastUnder1_5'] = (profile.badges.counters['fastUnder1_5']||0)+1;
      }
      if (ctx.event.ms < 3000) {
        profile.badges.counters['fastUnder3'] = (profile.badges.counters['fastUnder3']||0)+1;
      }
      profile.badges.counters['streakBest'] = Math.max(profile.badges.counters['streakBest']||0, ctx.event.streak);
    }
  }

  // Update skill counts for collection tracking
  if (Array.isArray(profile.unlocks?.skins)) {
    profile.badges.counters['skinsOwned'] = profile.unlocks.skins.length;
  }
  if (Array.isArray(profile.unlocks?.biomes)) {
    profile.badges.counters['biomesUnlocked'] = profile.unlocks.biomes.length;
  }

  const newlyUnlocked: { id:BadgeID; tier?:BadgeTier; rewardGoo:number }[] = [];

  for (const badge of BADGES) {
    // Single-shot predicate badges
    if (badge.when) {
      if (!profile.badges.unlocked[badge.id] && badge.when(ctx)) {
        profile.badges.unlocked[badge.id] = { at: now, tier: badge.tier };
        newlyUnlocked.push({ id:badge.id, tier:badge.tier, rewardGoo:badge.rewardGoo || 0 });
      }
      continue;
    }

    // Tiered badges
    if (badge.tiers && badge.progressKey) {
      const currentCount = profile.badges.counters[badge.progressKey] || 0;
      // Find highest tier not yet granted
      const earnedTiers = badge.tiers.filter(t => currentCount >= t.goal);
      const highestEarned = earnedTiers.sort((a,b)=> tierRank(b.tier)-tierRank(a.tier))[0];
      const previousTier = profile.badges.unlocked[badge.id]?.tier;
      
      if (highestEarned && (!previousTier || tierRank(highestEarned.tier) > tierRank(previousTier))) {
        profile.badges.unlocked[badge.id] = { at: now, tier: highestEarned.tier };
        newlyUnlocked.push({ id:badge.id, tier: highestEarned.tier, rewardGoo: highestEarned.rewardGoo });
      }
    }
  }

  return { newlyUnlocked, profile };
}

function tierRank(t?: BadgeTier): number {
  return t==='diamond'?4 : t==='gold'?3 : t==='silver'?2 : t==='bronze'?1 : 0;
}

// Helper to get badge definition by ID
export function getBadgeById(id: BadgeID): BadgeDef | undefined {
  return BADGES.find(b => b.id === id);
}

// Helper to get friendly name for badge
export function getBadgeName(id: BadgeID): string {
  const badge = getBadgeById(id);
  return badge?.name || id;
}

// Helper to get all badges for a category
export function getBadgesByCategory(category: string): BadgeDef[] {
  return BADGES.filter(b => b.category === category);
}

// Profile migration helper
export function migrateBadgeProfile(profile: any): any {
  if (!profile.badges) {
    profile.badges = { unlocked: {}, counters: {} };
  }
  if (!profile.streakDays) {
    profile.streakDays = 0;
  }
  if (!profile.sessionDamageTaken) {
    profile.sessionDamageTaken = 0;
  }
  if (!profile.dayCounters) {
    profile.dayCounters = {
      solved: 0,
      solvedMonth: 0,
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
  }
  if (!profile.worldStreaks) {
    profile.worldStreaks = {};
  }
  return profile;
}