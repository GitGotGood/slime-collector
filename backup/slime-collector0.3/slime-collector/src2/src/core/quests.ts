import type { Profile } from './types';

export type QuestTier = 'daily' | 'weekly';
export interface Quest {
  id: string;
  tier: QuestTier;
  name: string;
  desc: string;
  target: number;   // e.g., 20 correct
  progress(p: Profile): number; // returns current progress toward target
}

export const QUESTS: Quest[] = [
  {
    id: 'daily_20_correct',
    tier: 'daily',
    name: 'Daily Drip',
    desc: 'Get 20 correct answers today',
    target: 20,
    progress: (_p) => 0, // to be wired to a per-day run log later
  },
  {
    id: 'weekly_5_streak15',
    tier: 'weekly',
    name: 'On Fire',
    desc: 'Hit a 15 streak 5 times this week',
    target: 5,
    progress: (_p) => 0,
  }
];



