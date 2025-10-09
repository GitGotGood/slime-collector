import { useState } from "react";
import Dialog from "../components/Dialog";
import Slime from "../components/Slime";
import UnifiedSlimeRenderer from "../components/UnifiedSlimeRenderer";
import ErrorBoundary from "../components/ErrorBoundary";
import { SKINS } from "../../assets/skins";
import { getAllLive, resolveId, isLive } from "../../assets/slime-roster";
import RarityPill from "../components/RarityPill";
import type { Profile } from "../../core/types";
import { BADGES } from "../../core/badges";
import { WORLDS, meetsMastery, nextWorld } from "../../core/progression";
import { SKILLS } from "../../core/skills";
import { BIOMES } from "../../assets/biomes";
import BadgesGrid from "./BadgesGrid";
import { getCenteredWeek, getGraceWindowDate } from "../../core/streak";
import WorldMap from "../../dev/WorldMap";
import { Map } from "lucide-react";

export default function ProgressModal({
  open,
  profile,
  onClose,
  onRename,
  onEquipSkin,
  onUpdateSettings,
  onUnlockAllShopSlimes,
}: {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onRename: (name: string) => void;
  onEquipSkin: (skinId: string) => void;
  onUpdateSettings: (settings: Partial<Profile['settings']>) => void;
  onUnlockAllShopSlimes?: () => void;
}) {
  const [tab, setTab] = useState<"collection" | "badges" | "biomes" | "stats" | "options">("collection");
  const [name, setName] = useState(profile.name);
  const [showWorldMap, setShowWorldMap] = useState(false);

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
          onClick={() => setTab("stats")}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
            tab === "stats" ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Stats
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
        <CollectionTab 
          profile={profile} 
          onEquipSkin={onEquipSkin}
          onUnlockAllShopSlimes={onUnlockAllShopSlimes}
        />
      )}

      {tab === "badges" && (
        <div className="h-[400px] overflow-y-auto">
          <BadgesGrid 
            defs={BADGES} 
            unlocked={profile.badges?.unlocked || {}} 
            counters={profile.badges?.counters || {}} 
          />
        </div>
      )}

      {tab === "biomes" && (
        <div className="h-[400px] overflow-y-auto">
          <div className="mb-4">
            <div className="text-sm text-emerald-700/80 mb-2">Master skills to unlock new worlds and their unique biomes!</div>
            {(() => {
              const next = nextWorld(profile);
              
            // Debug logging
            console.log('🎯 PROGRESS MODAL DEBUG:', {
              nextWorld: next?.id,
              nextWorldTitle: next?.title,
              nextWorldSkill: next?.primarySkill,
              profileMastered: profile.mastered,
              skillStats: profile.skillStats,
              currentSkill: (profile.settings as any)?.currentSkill,
              unlockedBiomes: profile.unlocks?.biomes || [],
              allWorlds: WORLDS.map(w => ({ id: w.id, title: w.title, primarySkill: w.primarySkill }))
            });
              
              if (next) {
                const progress = profile.skillStats[next.primarySkill];
                const attempts = progress?.attempts || 0;
                const accuracy = progress ? (progress.correct / progress.attempts * 100) : 0;
                const avgTime = progress ? (progress.totalMs / progress.attempts / 1000) : 0;
                
                return (
                  <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3 mb-4">
                    <div className="font-semibold text-amber-800 mb-1">🎯 {next.title} Math Progress</div>
                    <div className="text-xs text-amber-700/80 mb-2">Master "{next.primarySkill}" to unlock</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`text-center ${attempts >= next.gate.attempts ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className="font-semibold">{attempts}/{next.gate.attempts}</div>
                        <div>strong answers</div>
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
              
              // Debug logging for biome status
              console.log('🌍 BIOME STATUS:', {
                worldId: world.id,
                worldTitle: world.title,
                primarySkill: world.primarySkill,
                unlocked,
                mastered,
                attempts,
                rewardBiome: world.rewards?.biomeId,
                allUnlockedBiomes: profile.unlocks?.biomes || []
              });
              
              const biomeStyle = BIOMES[world.id];
              const isLocked = !unlocked;
              
              return (
                <div
                  key={world.id}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    isLocked ? "border-slate-300 opacity-50" : "border-white/30 shadow-lg"
                  }`}
                  style={isLocked ? {} : {
                    background: biomeStyle?.style.background || 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                    borderColor: biomeStyle?.cssVars['--accent'] + '40' || '#e2e8f0'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="text-sm font-bold drop-shadow-sm"
                      style={{ 
                        color: isLocked ? '#64748b' : biomeStyle?.cssVars['--ink'] || '#1e293b'
                      }}
                    >
                      {world.title}
                    </div>
                    {mastered && (
                      <span 
                        className="text-lg drop-shadow-sm"
                        style={{ color: biomeStyle?.cssVars['--accent'] || '#22c55e' }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  
                  {/* Beautiful biome preview */}
                  <div 
                    className={`h-16 rounded-lg flex items-center justify-center text-xs font-medium border ${
                      isLocked ? 'border-slate-300' : 'border-white/40'
                    }`}
                    style={isLocked ? {
                      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
                    } : {
                      background: `linear-gradient(45deg, ${biomeStyle?.cssVars['--bgA']}dd, ${biomeStyle?.cssVars['--bgB']}dd)`,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <span 
                      className="drop-shadow-sm tracking-wide"
                      style={{ 
                        color: isLocked ? '#94a3b8' : biomeStyle?.cssVars['--ink'] + 'cc' || '#1e293b'
                      }}
                    >
                      {isLocked ? '🔒' : '✨'} {world.id.charAt(0).toUpperCase() + world.id.slice(1)}
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

      {tab === "stats" && (
        <div className="h-[400px] overflow-y-auto">
          <div className="mb-4 text-sm text-emerald-700/80">Track your progress and achievements.</div>
          
          {/* Daily Streak Status */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-orange-800 flex items-center gap-2">
                  🔥 Practice Streak
                  {(profile.streakData?.currentStreak || 0) > 0 && (
                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                      Active!
                    </span>
                  )}
                </div>
                <div className="text-sm text-orange-700/80 mt-1">
                  {(() => {
                    const current = profile.streakData?.currentStreak || 0;
                    const today = new Date().toISOString().slice(0, 10);
                    const lastPracticeDate = profile.streakData?.lastLoginDate;
                    const earnedToday = lastPracticeDate === today;
                    
                    if (current === 0) return "Start your streak today!";
                    if (earnedToday) {
                      if (current === 1) return "✅ Great start! You practiced today!";
                      if (current < 7) return `✅ You practiced today! ${7 - current} more days for a week!`;
                      if (current < 30) return `✅ You practiced today! ${30 - current} more days for a month!`;
                      return "✅ You practiced today! Incredible dedication!";
                    } else {
                      if (current === 1) return "Great start! Come back tomorrow!";
                      if (current < 7) return `Keep it up! ${7 - current} more days for a week!`;
                      if (current < 30) return `Amazing! ${30 - current} more days for a month!`;
                      return "Incredible dedication! You're a streak master!";
                    }
                  })()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">
                  {profile.streakData?.currentStreak || 0}
                </div>
                <div className="text-xs text-orange-600/80">days</div>
                {(() => {
                  const today = new Date().toISOString().slice(0, 10);
                  const lastPracticeDate = profile.streakData?.lastLoginDate;
                  const earnedToday = lastPracticeDate === today;
                  
                  if (earnedToday) {
                    return <div className="text-xs text-green-600 font-medium mt-1">✓ Practiced today</div>;
                  } else if (profile.streakData?.currentStreak > 0) {
                    return <div className="text-xs text-orange-500 font-medium mt-1">Practice today to continue</div>;
                  }
                  return null;
                })()}
              </div>
            </div>
            
            {/* Streak Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center bg-white/50 rounded-lg p-2">
                <div className="font-semibold text-orange-700 text-lg">
                  {profile.streakData?.longestStreak || 0}
                </div>
                <div className="text-orange-600/80">Best Streak</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-2">
                <div className="font-semibold text-orange-700 text-lg">
                  {profile.streakData?.totalLogins || 0}
                </div>
                <div className="text-orange-600/80">Total Practice Days</div>
              </div>
            </div>
            
            {/* Weekly Calendar */}
            {(() => {
              const centeredWeek = getCenteredWeek();
              const graceDate = getGraceWindowDate();
              
              return (
                <div className="mt-3 pt-3 border-t border-orange-100">
                  <div className="text-xs text-orange-700/80 mb-2">This Week:</div>
                  <div className="grid grid-cols-7 gap-1">
                    {centeredWeek.map((date, index) => {
                      // Parse date correctly to avoid timezone issues
                      const [year, month, day] = date.split('-').map(Number);
                      const dateObj = new Date(year, month - 1, day); // month is 0-indexed
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      
                      const isToday = date === graceDate;
                      const isPast = date < graceDate;
                      const isCompleted = profile.streakData?.streakHistory?.includes(date) || false;
                      const isMissed = isPast && !isCompleted;
                      
                      return (
                        <div key={date} className="flex flex-col items-center">
                          <div className={`text-xs mb-1 w-6 text-center ${
                            isToday ? 'text-orange-600 font-bold' : 'text-gray-600'
                          }`}>
                            {dayName}
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isCompleted 
                              ? 'bg-orange-500 text-white' 
                              : isMissed
                              ? 'bg-blue-500 text-white'
                              : isToday
                              ? 'bg-orange-200 text-orange-600 border border-orange-400'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isCompleted ? '✓' : isMissed ? '✗' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
          
          {/* Additional Stats Section */}
          <div className="bg-white rounded-xl border border-emerald-200 p-4">
            <div className="font-semibold text-emerald-800 mb-3">📊 Game Statistics</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-emerald-700">
                  {profile.level || 1}
                </div>
                <div className="text-emerald-600/80">Current Level</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-emerald-700">
                  {profile.goo || 0}
                </div>
                <div className="text-emerald-600/80">Total Goo</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-emerald-700">
                  {profile.unlocks?.skins?.length || 0}
                </div>
                <div className="text-emerald-600/80">Slimes Collected</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-emerald-700">
                  {profile.unlocks?.biomes?.length || 0}
                </div>
                <div className="text-emerald-600/80">Biomes Unlocked</div>
              </div>
            </div>
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
                      skinId={(profile.settings.activeSkin && SKINS[profile.settings.activeSkin]) ? profile.settings.activeSkin : "moss"}
                      className="w-16"
                      eyeTracking={profile.settings.eyeTracking}
                      bobDuration={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* World Map Button */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-emerald-800">World Map</div>
                  <div className="text-sm text-emerald-700/80 mt-1">
                    Explore the game world and discover new biomes
                  </div>
                </div>
                <button
                  onClick={() => setShowWorldMap(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <Map className="w-4 h-4" />
                  Open Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* World Map Modal */}
      {showWorldMap && (
        <WorldMap
          onClose={() => setShowWorldMap(false)}
          profile={profile}
        />
      )}
    </Dialog>
  );
}

// Collection Tab Component with filters and rarity pills
function CollectionTab({ profile, onEquipSkin, onUnlockAllShopSlimes }: { 
  profile: Profile; 
  onEquipSkin: (skinId: string) => void;
  onUnlockAllShopSlimes?: () => void;
}) {
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  
  // Helper function to get rarity button styles
  const getRarityButtonStyle = (tier: string) => {
    const styles = {
      common: 'bg-slate-100 text-slate-700 border-slate-200',
      uncommon: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rare: 'bg-sky-100 text-sky-700 border-sky-200',
      epic: 'bg-purple-100 text-purple-700 border-purple-200',
      mythic: 'bg-amber-100 text-amber-700 border-amber-200',
      secret: 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return styles[tier as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  // Get owned slimes via roster (alias-aware, live only) and de-duplicate by id
  const liveMap = Object.fromEntries(getAllLive().map(s => [s.id, s] as const));
  const ownedSlimes = Array.from(
    new Set(
      (profile.unlocks?.skins || [])
        .map((id: string) => resolveId(id) || null)
        .filter((id): id is string => !!id && !!liveMap[id])
    )
  ).map((id) => liveMap[id]);
  
  // Define the desired tier order: All, Common, Uncommon, Rare, Epic, Mythic
  const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'mythic'];
  const ownedTiers = [...new Set(ownedSlimes.map((skin) => skin.tier))]
    .sort((a, b) => tierOrder.indexOf(a) - tierOrder.indexOf(b));
  
  // Filter slimes by rarity
  const filteredSlimes = ownedSlimes.filter((skin) => {
    if (rarityFilter === 'all') return true;
    return skin.tier === rarityFilter;
  });
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log('🔍 Collection Filter Debug:', {
      rarityFilter,
      ownedSlimesCount: ownedSlimes.length,
      filteredSlimesCount: filteredSlimes.length,
      ownedTiers,
      sampleSlimes: ownedSlimes.slice(0, 3).map(s => ({ id: s.id, name: s.name, tier: s.tier })),
      epicSlimes: ownedSlimes.filter(s => s.tier === 'epic').map(s => ({ id: s.id, name: s.name, tier: s.tier })),
      filteredEpicSlimes: filteredSlimes.filter(s => s.tier === 'epic').map(s => ({ id: s.id, name: s.name, tier: s.tier }))
    });
  }
  
  return (
    <div className="h-[400px] overflow-y-auto">
      <div className="mb-3">
        <div className="mb-2 text-sm text-emerald-700/80">Tap a slime to equip it as your active skin.</div>
        
        {/* Dev Cheat Button */}
        {import.meta.env.DEV && onUnlockAllShopSlimes && (
          <div className="mb-3">
            <button
              onClick={onUnlockAllShopSlimes}
              className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 transition-colors"
            >
              🎮 Unlock All Shop Slimes (Dev)
            </button>
          </div>
        )}
        
        {/* Rarity Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setRarityFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              rarityFilter === 'all' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            All ({ownedSlimes.length})
          </button>
          {ownedTiers.map((tier) => {
            const count = ownedSlimes.filter((skin) => skin.tier === tier).length;
            return (
              <button
                key={tier}
                onClick={() => setRarityFilter(tier)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  rarityFilter === tier 
                    ? 'bg-emerald-500 text-white' 
                    : getRarityButtonStyle(tier)
                }`}
              >
                {tier} ({count})
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {filteredSlimes.map((skin) => {
          const isActive = profile.settings.activeSkin === skin.id;
          
          return (
            <button
              key={skin.id}
              onClick={() => onEquipSkin(skin.id)}
              className="rounded-xl border p-3 text-center bg-white border-emerald-200 hover:bg-emerald-50 transition-colors relative"
            >
              {/* Rarity pill in top-right corner of the card */}
              <div className="absolute top-2 right-2">
                <RarityPill tier={skin.tier} className="text-[10px] px-1.5 py-0.5" />
              </div>
              
              <div className="aspect-square grid place-items-center">
                <ErrorBoundary label="CollectionItem">
                  <UnifiedSlimeRenderer skinId={skin.id as any} className="w-20" eyeTracking={profile.settings.eyeTracking} />
                </ErrorBoundary>
              </div>
              
              <div className="mt-2 text-sm font-semibold text-emerald-800">{skin.name}</div>
              
              {/* Origin info - not available in old SKINS system */}
              
              {isActive && <div className="mt-1 text-xs text-emerald-700 font-semibold">Equipped</div>}
            </button>
          );
        })}
      </div>
      
      {/* Show count of filtered slimes */}
      <div className="mt-4 text-center text-xs text-emerald-600/80">
        {rarityFilter === 'all' 
          ? `${ownedSlimes.length} slimes in your collection`
          : `${filteredSlimes.length} ${rarityFilter} slimes`
        }
      </div>
    </div>
  );
}



