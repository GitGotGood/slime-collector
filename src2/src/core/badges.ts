import type { Profile } from './types';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  earned(p: Profile): boolean;
}

const pct = (n: number, d: number) => (d <= 0 ? 0 : n / d);

export const BADGES: Badge[] = [
  {
    id: 'add_1_10_master',
    name: 'Master of 10s',
    desc: '≥90% on Addition 1–10 (20+ attempts)',
    earned: (p) => {
      const st = p.skillStats?.['add_1_10'];
      return !!st && st.attempts >= 20 && pct(st.correct, st.attempts) >= 0.9;
    }
  },
  {
    id: 'streak_10',
    name: 'Hot Streak',
    desc: '10 in a row',
    earned: (p) => (p.best?.streak ?? 0) >= 10
  },
  {
    id: 'speedster',
    name: 'Speedster',
    desc: 'Avg < 2s in a run (placeholder)',
    earned: (_p) => false
  },
];

export function computeEarnedBadges(p: Profile): string[] {
  return BADGES.filter(b => b.earned(p)).map(b => b.id);
}



