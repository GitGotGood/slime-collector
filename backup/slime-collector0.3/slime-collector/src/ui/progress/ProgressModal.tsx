import { useState } from "react";
import Dialog from "../components/Dialog";
import Slime from "../components/Slime";
import { SKINS } from "../../assets/skins";
import type { Profile } from "../../core/types";
import { BADGES } from "../../core/badges";
import { WORLDS, meetsMastery, nextWorld } from "../../core/progression";
import { SKILLS } from "../../core/skills";

export default function ProgressModal({
  open,
  profile,
  onClose,
  onRename,
  onEquipSkin,
  onUpdateSettings,
}: {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onRename: (name: string) => void;
  onEquipSkin: (skinId: string) => void;
  onUpdateSettings: (settings: Partial<Profile['settings']>) => void;
}) {
  const [tab, setTab] = useState<"collection" | "badges" | "biomes" | "options">("collection");
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
        <button
          onClick={() => setTab("options")}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
            tab === "options" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Options
        </button>
      </div>

      {tab === "collection" && (
        <div className="h-[400px] overflow-y-auto">
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
                    <Slime paletteId={id as any} className="w-20" eyeTracking={profile.settings.eyeTracking} />
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
        <div className="h-[400px] overflow-y-auto">
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
        <div className="h-[400px] overflow-y-auto">
          <div className="mb-4">
            <div className="text-sm text-emerald-700/80 mb-2">Master skills to unlock new worlds and their unique biomes!</div>
            {(() => {
              const next = nextWorld(profile);
              if (next) {
                const progress = profile.skillStats[next.primarySkill];
                const attempts = progress?.attempts || 0;
                const accuracy = progress ? (progress.correct / progress.attempts * 100) : 0;
                const avgTime = progress ? (progress.totalMs / progress.attempts / 1000) : 0;
                
                return (
                  <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3 mb-4">
                    <div className="font-semibold text-amber-800 mb-1">🎯 Next World: {next.title}</div>
                    <div className="text-xs text-amber-700/80 mb-2">Master "{next.primarySkill}" to unlock</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`text-center ${attempts >= next.gate.attempts ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className="font-semibold">{attempts}/{next.gate.attempts}</div>
                        <div>attempts</div>
                      </div>
                      <div className={`text-center ${accuracy >= next.gate.minAcc * 100 ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className="font-semibold">{accuracy.toFixed(0)}%/{(next.gate.minAcc * 100).toFixed(0)}%</div>
                        <div>accuracy</div>
                      </div>
                      <div className={`text-center ${avgTime <= next.gate.maxAvgMs / 1000 ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className="font-semibold">{avgTime.toFixed(1)}s/{(next.gate.maxAvgMs / 1000).toFixed(0)}s</div>
                        <div>avg time</div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 mb-4">
                  <div className="font-semibold text-green-800">🎉 All Worlds Unlocked!</div>
                  <div className="text-xs text-green-700/80">You've mastered the entire K→5 curriculum!</div>
                </div>
              );
            })()}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORLDS.map((world) => {
              const unlocked = profile.unlocks.biomes.includes(world.id);
              const mastered = meetsMastery(profile, world.primarySkill, world.gate);
              const progress = profile.skillStats[world.primarySkill];
              const attempts = progress?.attempts || 0;
              
              return (
                <div
                  key={world.id}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    unlocked 
                      ? mastered 
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
                        : "bg-white border-emerald-200"
                      : "bg-slate-50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-sm font-bold ${unlocked ? 'text-emerald-800' : 'text-slate-600'}`}>
                      {world.title}
                    </div>
                    {mastered && <span className="text-green-600">✓</span>}
                  </div>
                  
                  {/* Placeholder biome preview */}
                  <div className={`h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-xs ${
                    unlocked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-100'
                  }`}>
                    <span className={unlocked ? 'text-emerald-600' : 'text-slate-500'}>
                      {world.id.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs">
                    <div className={`font-medium ${unlocked ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {SKILLS[world.primarySkill]?.label || world.primarySkill.replace(/_/g, ' ')}
                    </div>
                    {attempts > 0 && (
                      <div className="text-slate-500 mt-1">
                        {attempts} attempts
                      </div>
                    )}
                  </div>
                  
                  {!unlocked && (
                    <div className="mt-2 text-xs text-slate-500">
                      🔒 Locked
                    </div>
                  )}
                  
                  {unlocked && !mastered && (
                    <div className="mt-2 text-xs text-amber-600">
                      📚 In Progress
                    </div>
                  )}
                  
                  {mastered && (
                    <div className="mt-2 text-xs text-green-600">
                      🌟 Mastered
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "options" && (
        <div className="h-[400px] overflow-y-auto">
          <div className="mb-4 text-sm text-emerald-700/80">Customize your game experience.</div>
          
          {/* Eye Tracking Setting */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-emerald-800">Eye Tracking</div>
                  <div className="text-sm text-emerald-700/80 mt-1">
                    Make slimes' eyes follow your mouse cursor for more interaction
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ eyeTracking: !profile.settings.eyeTracking })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    profile.settings.eyeTracking ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.settings.eyeTracking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Demo Slime */}
              <div className="mt-4 pt-4 border-t border-emerald-100">
                <div className="text-xs text-emerald-700/80 mb-2">Preview:</div>
                <div className="flex justify-center">
                  <div className="w-16">
                    <Slime 
                      skinId={profile.settings.activeSkin as any} 
                      className="w-16" 
                      eyeTracking={profile.settings.eyeTracking}
                      bobDuration={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}



