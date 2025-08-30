import { useEffect, useMemo, useState } from "react";
import Dialog from "../components/Dialog";
import Slime from "../components/Slime";
import GooPill from "../components/GooPill";
import RarityPill from "../components/RarityPill";
import { SKINS } from "../../assets/skins";
import { PRODUCTION_SKINS } from "../../assets/all-skins";
import type { Profile, ShopItem } from "../../core/types";
import { priceOf } from "../../core/economy";
import { ALL_SHOP_ITEMS, getShopPicks, nextRefreshCost, refreshDaily } from "../../core/shop-logic";
import { Timer, MapPin } from "lucide-react";
import { getBiomeAccent } from "../../assets/biomes";

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
  // tick forces a re-render each second so the countdown updates
  const [tick, setTick] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _forceRender = tick; // tick is used to trigger re-renders
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  const { daily, evergreen, biasInfo } = useMemo(() => {
    return getShopPicks(profile, ALL_SHOP_ITEMS);
  }, [profile.shopBiasUntil, profile.shopBiasBiome, profile.unlocks.skins]);

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

      {/* Bias Info (if active) */}
      {biasInfo && (
        <section className="mb-4">
          <div 
            className="rounded-xl border p-3"
            style={{
              backgroundColor: `${getBiomeAccent(biasInfo.biome as any)}10`, // 10% opacity
              borderColor: `${getBiomeAccent(biasInfo.biome as any)}40`, // 40% opacity
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">🌟</span>
                <span 
                  className="text-sm font-bold"
                  style={{ color: getBiomeAccent(biasInfo.biome as any) }}
                >
                  {biasInfo.biome.toUpperCase()} BONUS ACTIVE
                </span>
              </div>
              <div 
                className="text-xs"
                style={{ color: `${getBiomeAccent(biasInfo.biome as any)}cc` }} // 80% opacity
              >
                {Math.floor(biasInfo.timeLeft / (1000 * 60 * 60 * 24))}d {Math.floor((biasInfo.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h left
              </div>
            </div>
            <div 
              className="text-xs mt-1"
              style={{ color: `${getBiomeAccent(biasInfo.biome as any)}cc` }} // 80% opacity
            >
              Higher chance for {biasInfo.biome} skins in today's picks!
            </div>
          </div>
        </section>
      )}

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

  const meta = SKINS[item.skin];
  const displayName = meta?.name ?? item.skin; // fallback to id if no pretty name
  
  // Find origin information from production skins
  const unifiedSkin = PRODUCTION_SKINS.find(skin => skin.id === item.skin);
  const origin = unifiedSkin?.origin;

  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-3 text-center transition-all">
      <div className="aspect-square w-full overflow-hidden grid place-items-center">
        <div className="scale-90">
          {/* Use skinId (new Slime prop) */}
          <Slime skinId={item.skin as any} className="w-24" eyeTracking={profile.settings.eyeTracking} />
        </div>
      </div>

      {/* name + rarity pill */}
      <div className="mt-2 text-sm font-semibold text-emerald-800 flex items-center justify-center gap-2">
        <span className="capitalize">{displayName}</span>
        <RarityPill tier={item.tier as any} />
      </div>

      {/* origin info */}
      {origin && (
        <div className="text-xs text-emerald-600/80 flex items-center justify-center gap-1 mt-1">
          <MapPin className="w-3 h-3" />
          <span>{origin.displayName}</span>
        </div>
      )}

      {/* price */}
      <div className="text-xs text-emerald-700/80 flex items-center justify-center gap-1 mt-1">
        <span>🟡</span>
        <span>{price} Goo</span>
      </div>

      {/* action */}
      {owned ? (
        <button
          disabled={active}
          onClick={() => onEquip(item.skin)}
          className={`mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 shadow transition-colors ${
            active 
              ? "bg-emerald-800 cursor-not-allowed text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {active ? "Equipped" : "Equip"}
        </button>
      ) : (
        <button
          onClick={() => onBuy(item)}
          disabled={profile.goo < price}
          className="mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white shadow disabled:opacity-60 transition-colors"
        >
          Buy
        </button>
      )}
    </div>
  );
}
