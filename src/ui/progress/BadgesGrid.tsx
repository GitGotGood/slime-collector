import React, { useMemo, useState } from "react";
import type { BadgeDef, BadgeID, BadgeTier, BadgeCategory } from "../../core/types";

type Props = {
  defs: BadgeDef[];
  unlocked: Record<BadgeID, { at:number; tier?: BadgeTier }>;
  counters: Record<string, number>;
};

type FilterKey = 'all' | 'earned' | 'near' | BadgeCategory;

const CATEGORY_ORDER: FilterKey[] = [
  'all','earned','near','progress','skill','streak','speed','accuracy','session','shop','collection','biome','seasonal','secret'
];

const TIER_CLASS: Record<BadgeTier, string> = {
  bronze:  "bg-orange-100 text-orange-900 border-orange-300", // More copper/bronze-like
  silver:  "bg-slate-100 text-slate-800 border-slate-300",     // Keep existing gray
  gold:    "bg-yellow-50 text-yellow-800 border-yellow-200",   // Keep existing gold
  diamond: "bg-sky-100 text-sky-900 border-sky-300",          // Bright blue like #4cd0ff
};

export default function BadgesGrid({ defs, unlocked, counters }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return defs.filter((d) => {
      const isEarned = !!unlocked[d.id];
      const matchesFilter =
        filter === 'all' ? true :
        filter === 'earned' ? isEarned :
        filter === 'near' ? isNear(d, unlocked, counters) :
        d.category === filter;
      const matchesQuery = !term || (d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term));
      return matchesFilter && matchesQuery;
    });
  }, [defs, unlocked, counters, filter, q]);

  const earnedCount = Object.keys(unlocked || {}).length;

  return (
    <div className="w-full">
      {/* Header / filters */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="text-lg font-bold text-emerald-900">Badges</div>
        <div className="text-xs text-emerald-700/80">• {earnedCount} earned</div>
        <div className="ml-auto" />
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search badges…"
          className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-900"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-xs ${filter===c ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
          >
            {labelForFilter(c)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {rows.map((def) => (
          <BadgeCard key={def.id} def={def} unlocked={unlocked[def.id]} counters={counters} />
        ))}
      </div>

      {rows.length === 0 && (
        <div className="mt-8 text-center text-sm text-emerald-700/70">No badges to show.</div>
      )}
    </div>
  );
}

function BadgeCard({
  def,
  unlocked,
  counters,
}: {
  def: BadgeDef;
  unlocked?: { at:number; tier?: BadgeTier };
  counters: Record<string, number>;
}) {
  const isHiddenLocked = def.hidden && !unlocked;
  const name = isHiddenLocked ? "Secret Badge" : def.name;
  const icon = isHiddenLocked ? "❓" : def.icon || "🎖️";
  const desc = isHiddenLocked ? "Unlock this by playing!" : def.description;

  const tierInfo = getTierInfo(def, counters, unlocked?.tier);
  const isEarned = !!unlocked;
  
  // Get container styling based on earned tier
  const containerClass = isEarned && unlocked?.tier 
    ? TIER_CLASS[unlocked.tier]
    : "bg-white border-slate-200";

  return (
    <div className={`relative rounded-xl border p-3 ${containerClass}`}>
      <div className="flex items-start gap-3">
        {/* Badge icon on the left */}
        <div className="text-2xl select-none flex-shrink-0">{icon}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold line-clamp-1 flex-1">{name}</div>
            {/* Tier medal in top-right corner of the card */}
            {isEarned && unlocked?.tier && (
              <div className="absolute top-2 right-2 text-lg select-none">
                {tierEmoji(unlocked.tier)}
              </div>
            )}
            {!isEarned && tierInfo.nextTier && <TierPill tier={tierInfo.nextTier.tier} muted />}
          </div>
          <div className="mt-0.5 text-xs line-clamp-2 opacity-90">{desc}</div>

          {/* Progress */}
          {tierInfo.showProgress && (
            <div className="mt-2">
              <div className="h-2 w-full rounded-full bg-black/10 border border-black/20 overflow-hidden">
                <div
                  className="h-full bg-white/60 transition-all"
                  style={{ width: `${Math.min(100, Math.round(100 * tierInfo.have / tierInfo.need))}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] opacity-80">
                <span>{tierInfo.label}</span>
                <span>{tierInfo.have}/{tierInfo.need}</span>
              </div>
            </div>
          )}

          {/* Earned line */}
          {isEarned && (
            <div className="mt-2 text-[11px] opacity-70">
              Earned {formatDate(unlocked!.at)}{unlocked?.tier ? ` • ${capitalize(unlocked.tier)} tier` : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TierPill({ tier, muted = false }: { tier: BadgeTier; muted?: boolean }) {
  const base = TIER_CLASS[tier];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${muted ? "opacity-60" : ""} ${base}`}>
      {tierEmoji(tier)} {capitalize(tier)}
    </span>
  );
}

function labelForFilter(f: FilterKey) {
  if (f === 'all') return "All";
  if (f === 'earned') return "Earned";
  if (f === 'near') return "Near";
  return capitalize(f);
}

function tierEmoji(t?: BadgeTier) {
  return t === "diamond" ? "💎" : t === "gold" ? "🥇" : t === "silver" ? "🥈" : "🥉";
}

function capitalize(s: string) { return s.slice(0,1).toUpperCase() + s.slice(1); }
function formatDate(ts:number) { const d = new Date(ts); return d.toLocaleDateString(); }

/** Decide if a badge is "near" (≥80% progress to next tier and not earned max) */
function isNear(def: BadgeDef, unlocked: Record<string, { at:number; tier?:BadgeTier }>, counters: Record<string, number>) {
  if (!def.tiers || !def.progressKey) return false;
  const have = counters[def.progressKey] || 0;
  const next = nextTier(def, unlocked[def.id]?.tier);
  if (!next) return false;
  return have / next.goal >= 0.8;
}

function nextTier(def: BadgeDef, current?: BadgeTier) {
  if (!def.tiers) return null;
  const rank = tierRank(current);
  const available = def.tiers
    .slice()
    .sort((a,b)=> tierRank(a.tier)-tierRank(b.tier))
    .find(t => tierRank(t.tier) > rank);
  return available || null;
}

function getTierInfo(def: BadgeDef, counters: Record<string, number>, earnedTier?: BadgeTier) {
  if (def.when && !def.tiers) {
    // single-shot, no bar
    return { showProgress:false, have:0, need:0, label:"" };
  }
  if (!def.tiers || !def.progressKey) return { showProgress:false, have:0, need:0, label:"" };

  const have = counters[def.progressKey] || 0;
  // If already earned some tier, show progress to the next tier (if any).
  const next = nextTier(def, earnedTier);
  if (!next) return { showProgress:false, have, need:0, label:"Max tier reached" };

  return {
    showProgress: true,
    have,
    need: next.goal,
    nextTier: next,
    label: `Progress to ${capitalize(next.tier)}`
  };
}

function tierRank(t?: BadgeTier): number {
  return t==='diamond'?4 : t==='gold'?3 : t==='silver'?2 : t==='bronze'?1 : 0;
}


