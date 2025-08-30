import React, { useState } from "react";
import Dialog from "../components/Dialog";
import Slime from "../components/Slime";
import { SKINS } from "../../assets/skins";
import type { Profile } from "../../core/types";
import { BADGES } from "../../core/badges";
import { BIOMES } from "../../assets/biomes";

export default function ProgressModal({
  open,
  profile,
  onClose,
  onRename,
  onEquipSkin,
}: {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onRename: (name: string) => void;
  onEquipSkin: (skinId: string) => void;
}) {
  const [tab, setTab] = useState<"collection" | "badges" | "biomes">("collection");
  const [name, setName] = useState(profile.name);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Progress & Profile"
      maxWidth="max-w-4xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-emerald-700/80">Manage your collection & progress</div>
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player name"
              className="rounded-lg border border-emerald-200 px-2 py-1 text-sm"
            />
            <button
              onClick={() => onRename(name.trim() || profile.name)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Save Name
            </button>
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTab("collection")}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
            tab === "collection" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Collection
        </button>
        <button
          onClick={() => setTab("badges")}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
            tab === "badges" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setTab("biomes")}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
            tab === "biomes" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Biomes
        </button>
      </div>

      {tab === "collection" && (
        <div>
          <div className="mb-2 text-sm text-emerald-700/80">Tap a slime to equip. Locked ones are greyed out.</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Object.keys(SKINS).map((id) => {
              const owned = profile.unlocks.skins.includes(id);
              const isActive = profile.settings.activeSkin === id;
              const pal = (SKINS as any)[id];
              return (
                <button
                  key={id}
                  disabled={!owned}
                  onClick={() => onEquipSkin(id)}
                  className={`rounded-xl border p-3 text-center ${
                    owned ? "bg-white border-emerald-200 hover:bg-emerald-50" : "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="aspect-square grid place-items-center">
                    <Slime paletteId={id as any} className="w-20" />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-emerald-800">{pal.label ?? id}</div>
                  {isActive && <div className="mt-1 text-xs text-emerald-700">Equipped</div>}
                  {!owned && <div className="mt-1 text-xs text-slate-600">Locked</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "badges" && (
        <div>
          <div className="mb-2 text-sm text-emerald-700/80">Badges you can earn by playing.</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((b) => {
              const earned = b.earned(profile);
              return (
                <li
                  key={b.id}
                  className={`rounded-xl border p-3 ${earned ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
                >
                  <div className="font-semibold text-emerald-800">{b.name}</div>
                  <div className="text-xs text-emerald-700/80 mt-1">{b.desc}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "biomes" && (
        <div>
          <div className="mb-2 text-sm text-emerald-700/80">New biomes unlock as you level up.</div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BIOMES.map((b) => {
              const unlocked = profile.unlocks.biomes.includes(b.id);
              return (
                <li
                  key={b.id}
                  className={`rounded-xl border p-3 text-center ${
                    unlocked ? "bg-white border-emerald-200" : "bg-slate-50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className="font-semibold text-emerald-800">{b.name}</div>
                  <div className={`mt-2 h-14 rounded-lg border ${b.bgClass} ${b.borderClass ?? ""}`} />
                  {!unlocked && <div className="mt-1 text-xs text-slate-600">Locked</div>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Dialog>
  );
}



