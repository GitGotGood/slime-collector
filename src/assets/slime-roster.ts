// Centralized roster, alias resolution, and selectors for live/workshop skins
// Non-destructive by design: aliases are applied at read-time only

import SKINS from "./skins";
import type { ShopSkin } from "./skins";

// One-hop alias map: legacyId -> canonicalId
export const ALIASES: Record<string, string> = {
  aurora_veil: "aurora",
};

// Resolve an id through the alias map (one hop only)
export function resolveId(id: string | undefined | null): string | null {
  if (!id) return null;
  return ALIASES[id] ?? id;
}

// Is a skin id live (after alias resolution)?
export function isLive(id: string | undefined | null): boolean {
  const resolved = resolveId(id);
  if (!resolved) return false;
  const skin = (SKINS as Record<string, ShopSkin>)[resolved];
  return !!skin && (skin as any).status !== "hidden"; // status is optional; treat missing as live
}

// Get all live skins as an array (sorted by tier then name for stability)
export function getAllLive(): ShopSkin[] {
  const list = Object.values(SKINS as Record<string, ShopSkin>);
  return list
    .filter((s) => (s as any).status !== "hidden")
    .sort((a, b) => {
      const tierOrder = ["common", "uncommon", "rare", "epic", "mythic"] as const;
      const ta = tierOrder.indexOf(a.tier);
      const tb = tierOrder.indexOf(b.tier);
      if (ta !== tb) return ta - tb;
      return a.name.localeCompare(b.name);
    });
}

// Return a Set of live ids
export function getLiveIds(): Set<string> {
  return new Set(getAllLive().map((s) => s.id));
}

// Order-preserving fetch by ids (alias-aware); unknown ids are skipped
export function getByIds(ids: string[]): ShopSkin[] {
  const result: ShopSkin[] = [];
  const map = SKINS as Record<string, ShopSkin>;
  ids.forEach((raw) => {
    const id = resolveId(raw);
    if (id && map[id]) result.push(map[id]);
  });
  return result;
}

// Filter by tier (alias-aware)
export function getByTier(tier: ShopSkin["tier"]): ShopSkin[] {
  return getAllLive().filter((s) => s.tier === tier);
}

// Simple tag search helper (optional future use)
export function searchByTag(tag: string): ShopSkin[] {
  return getAllLive().filter((s: any) => Array.isArray(s.tags) && s.tags.includes(tag));
}

// Profile collection helper (expects unlocks.skins: string[])
export function getCollectionForProfile(profile: any): ShopSkin[] {
  const owned = new Set<string>((profile?.unlocks?.skins ?? []).map((id: string) => resolveId(id) || id));
  return getAllLive().filter((s) => owned.has(s.id));
}

// Shop helper: guard a candidate id and return a safe canonical id (or null)
export function safeId(id: string | null | undefined): string | null {
  const r = resolveId(id ?? null);
  if (!r) return null;
  return (SKINS as Record<string, ShopSkin>)[r] ? r : null;
}

export default {
  ALIASES,
  resolveId,
  isLive,
  getAllLive,
  getLiveIds,
  getByIds,
  getByTier,
  searchByTag,
  getCollectionForProfile,
  safeId,
};


