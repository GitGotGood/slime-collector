import type { Profile, RootState } from './types';

const STORAGE_KEY = 'slimeCollectorV1.profiles';
const FALLBACK_KEYS = ['slimeSumsV1.profiles']; // auto-migrate old saves (optional)

export const TODAY_KEY = (): string => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Mulberry32 seeded RNG
export function seededRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  h = (h << 13) | (h >>> 19);
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return t / 4294967296;
  };
}

export function mkProfile(id: string, name: string, color: string): Profile {
  return {
    id, name, color,
    goo: 0, xp: 0, level: 1,
    settings: { soundOn: true, activeSkin: 'green', eyeTracking: true },
    mastered: {},
    skillStats: {} as any,
    unlocks: { skins: ['green'], biomes: ['meadow'] },
    best: { score: 0, streak: 0 },
    
    // V1 Curriculum: Shop bias system
    shopBiasUntil: 0,
    shopBiasBiome: 'meadow',
  };
}

export function migrateProfile(p: Partial<Profile>): Profile {
  const np: Profile = {
    id: String(p.id ?? (globalThis.crypto?.randomUUID?.() ?? `p-${Math.random().toString(36).slice(2)}`)),
    name: (p.name as string) ?? 'Player',
    color: (p.color as string) ?? '#22c55e',
    goo: typeof p.goo === 'number' ? p.goo : 0,
    xp: typeof p.xp === 'number' ? p.xp : 0,
    level: typeof p.level === 'number' ? p.level : 1,
    settings: { soundOn: true, activeSkin: 'green', eyeTracking: true, ...(p.settings ?? {}) },
    mastered: p.mastered ?? {},
    skillStats: (p.skillStats as any) ?? {},
    unlocks: { skins: ['green'], biomes: ['meadow'], ...(p.unlocks ?? {}) },
    best: { score: 0, streak: 0, ...(p.best ?? {}) },
    dailyRefresh: p.dailyRefresh,
    
    // V1 Curriculum: Shop bias system
    shopBiasUntil: typeof p.shopBiasUntil === 'number' ? p.shopBiasUntil : 0,
    shopBiasBiome: p.shopBiasBiome ?? 'meadow',
  };
  if (!np.unlocks.skins.includes(np.settings.activeSkin)) {
    if (!np.unlocks.skins.includes('green')) np.unlocks.skins.push('green');
    np.settings.activeSkin = 'green';
  }
  return np;
}

export function migrateState(s: Partial<RootState> | null | undefined): RootState {
  try {
    const out: RootState = {
      currentId: s?.currentId ?? null,
      profiles: Array.isArray(s?.profiles) && s!.profiles.length
        ? (s!.profiles as any).map(migrateProfile)
        : [mkProfile('kid-1', 'Player 1', '#22c55e')],
      wishlist: Array.isArray(s?.wishlist) ? s!.wishlist : [],
    };
    if (!out.currentId || !out.profiles.some(p => p.id === out.currentId)) {
      out.currentId = out.profiles[0]?.id ?? null;
    }
    return out;
  } catch {
    return {
      currentId: 'kid-1',
      profiles: [mkProfile('kid-1','Player 1','#22c55e'), mkProfile('kid-2','Player 2','#60a5fa')],
      wishlist: [],
    };
  }
}

export function loadState(): RootState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateState(JSON.parse(raw));
    for (const k of FALLBACK_KEYS) {
      const old = localStorage.getItem(k);
      if (old) {
        const migrated = migrateState(JSON.parse(old));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch { /* ignore */ }
  return migrateState(null);
}

export function saveState(state: RootState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export function resetAllData(): RootState {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  return loadState();
}



