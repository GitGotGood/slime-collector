import React from "react";
import type { Rarity } from "../../assets/skins";

const RARITY_STYLES: Record<Rarity, string> = {
  common:   "bg-slate-100 text-slate-700 border-slate-200",
  uncommon: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rare:     "bg-sky-50 text-sky-700 border-sky-200",
  epic:     "bg-purple-50 text-purple-700 border-purple-200",
  mythic:   "bg-amber-50 text-amber-700 border-amber-200",
};

export default function RarityPill({ tier, className = "" }: { tier: Rarity; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${RARITY_STYLES[tier]} ${className}`}
      title={`${tier} rarity`}
    >
      {tier}
    </span>
  );
}
