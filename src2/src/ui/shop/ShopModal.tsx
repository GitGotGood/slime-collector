import React, { useEffect, useMemo, useState } from "react";
import Dialog from "../components/Dialog";
import Slime from "../components/Slime";
import GooPill from "../components/GooPill";
import RarityPill from "../components/RarityPill";
import { ALL_SHOP_ITEMS } from "../../assets/skins";
import type { Profile, ShopItem } from "../../core/types";
import { priceOf } from "../../core/economy";
import { todaysPicks, evergreenPicks, nextRefreshCost, refreshDaily } from "../../core/shop-logic";
import { Timer } from "lucide-react";

function timeToMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  let ms = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(ms / 3600000); ms -= h * 3600000;
  const m = Math.floor(ms / 60000);   ms -= m * 60000;
  const s = Math.floor(ms / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ShopModal({
  open,
  profile,
  onClose,
  onBuy,
  onEquip,
  onSpendAndRefresh,
}: {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (skinId: string) => void;
  onSpendAndRefresh: (newProfile: Profile) => void; // apply goo deduction + seed bump
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  const { daily, evergreen } = useMemo(() => {
    const seedExtra = profile.dailyRefresh?.seed ?? 0;
    const day = todaysPicks(ALL_SHOP_ITEMS, seedExtra);
    const dayIds = new Set(day.map((d) => d.id));
    const ev = evergreenPicks(ALL_SHOP_ITEMS.filter((i) => !dayIds.has(i.id)), profile.unlocks.skins);
    return { daily: day, evergreen: ev };
  }, [profile.dailyRefresh?.seed, profile.unlocks.skins]);

  const cost = nextRefreshCost(profile);
  const canRefresh = cost !== null && profile.goo >= (cost ?? 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Shop"
      maxWidth="max-w-4xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <GooPill value={profile.goo} />
          <div className="text-xs text-amber-700/80 flex items-center gap-1">
            <Timer className="w-4 h-4" />
            Resets in {timeToMidnight()}
          </div>
        </div>
      }
    >
      {/* Evergreen */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
            Evergreen{" "}
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              Always
            </span>
          </div>
          <div className="text-xs text-emerald-700/80">Basics always available</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {evergreen.slice(0, 4).map((it) => (
            <ShopCard key={it.id} item={it} profile={profile} onBuy={onBuy} onEquip={onEquip} />
          ))}
        </div>
      </section>

      {/* Daily */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
            Today’s Picks{" "}
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
              Daily
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-amber-700/80 flex items-center gap-1">
              <Timer className="w-4 h-4" /> Resets in {timeToMidnight()}
            </div>
            <button
              className="rounded-xl border px-2.5 py-1.5 text-sm bg-white hover:bg-amber-50 text-amber-700 border-amber-200 disabled:opacity-50"
              disabled={!canRefresh}
              onClick={() => {
                if (!canRefresh || cost === null) return;
                const updated = refreshDaily(profile, cost);
                onSpendAndRefresh(updated);
              }}
              title={cost === null ? "No refreshes left today" : `Refresh for ${cost} Goo`}
            >
              Refresh {cost !== null ? `(${cost})` : "(—)"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {daily.map((it) => (
            <ShopCard key={it.id} item={it} profile={profile} onBuy={onBuy} onEquip={onEquip} />
          ))}
        </div>
      </section>
    </Dialog>
  );
}

function ShopCard({
  item,
  profile,
  onBuy,
  onEquip,
}: {
  item: ShopItem;
  profile: Profile;
  onBuy: (item: ShopItem) => void;
  onEquip: (skinId: string) => void;
}) {
  const owned = profile.unlocks.skins.includes(item.skin);
  const active = profile.settings.activeSkin === item.skin;
  const price = priceOf(item);

  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-3 text-center">
      <div className="aspect-square w-full overflow-hidden grid place-items-center">
        <div className="scale-90">
          <Slime paletteId={item.skin as any} className="w-24" />
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold text-emerald-800 capitalize flex items-center justify-center gap-2">
        <span>{item.skin}</span>
        <RarityPill rarity={item.tier} />
      </div>
      <div className="text-xs text-emerald-700/80">🟡 {price} Goo</div>

      {owned ? (
        <button
          disabled={active}
          onClick={() => onEquip(item.skin)}
          className={`mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 ${
            active ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          } text-white shadow`}
        >
          {active ? "Equipped" : "Equip"}
        </button>
      ) : (
        <button
          onClick={() => onBuy(item)}
          disabled={profile.goo < price}
          className="mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow disabled:opacity-60"
        >
          Buy
        </button>
      )}
    </div>
  );
}
