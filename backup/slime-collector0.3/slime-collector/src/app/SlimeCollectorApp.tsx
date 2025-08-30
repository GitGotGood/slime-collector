// src/app/SlimeCollectorApp.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import { BiomeLayer } from "../assets/biomes";

import Slime from "../ui/components/Slime";
import QuestionCard from "../ui/gameplay/QuestionCard";
import SessionSummary from "../ui/gameplay/SessionSummary";
import ShopModal from "../ui/shop/ShopModal";
import ProgressModal from "../ui/progress/ProgressModal";
import ProfilePicker from "../ui/progress/ProfilePicker";

import { useSounds } from "../assets/sounds";

import { loadState, saveState, mkProfile } from "../core/storage";
import { SKILL_ORDER, SKILLS, makeProblemForSkill, difficultyMultiplier } from "../core/skills";
import type { SkillID } from "../core/types";
import { getMasteryBonus, levelFromTotalXP, applyXP, updateStatsAndCheckMastery, worldIdOf, onWorldMastered, meetsMastery, WORLDS, nextWorld } from "../core/progression";
import DevPanel from "../dev/DevPanel";
import SkinGallery from "../ui/components/SkinGallery";
import Experiments from "../dev/Experiments";
import LayoutPreview from "../dev/LayoutPreview";
import EdgeBlendingExperiments from "../dev/EdgeBlendingExperiments";
import WorldMap from "../dev/WorldMap";
import Starburst, { EmojiBurst } from "../ui/components/Starburst";
import { Volume2, VolumeX, ShoppingBag, UserCircle2, Power } from "lucide-react";
import { motion } from "framer-motion";


// ------------------------------------------------------------
// Slime Collector – App Orchestrator
// ------------------------------------------------------------
export default function SlimeCollectorApp() {
  // persistent store (profiles etc.)
  const [store, setStore] = useState<any>(() => loadState());
  const current = store.profiles.find((p: any) => p.id === store.currentId) || null;

  // gameplay state
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready");
  const [skill, setSkill] = useState<SkillID>("add_1_10");
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [problem, setProblem] = useState<any>(makeProblemForSkill("add_1_10"));
  const [disabledSet, setDisabledSet] = useState<Set<number>>(new Set());
  const [wrongPick, setWrongPick] = useState<number | null>(null);

  // per-run tallies (session summary)
  const [runXP, setRunXP] = useState(0);
  const [runGoo, setRunGoo] = useState(0);
  const [gooBase, setGooBase] = useState(0);
  const [gooStreak, setGooStreak] = useState(0);
  const [gooSpeed, setGooSpeed] = useState(0);
  const [runStartLevel, setRunStartLevel] = useState(1);

  // modals
  const [openShop, setOpenShop] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [openPicker, setOpenPicker] = useState(true); // Always show ProfilePicker on start
  const [openSkinGallery, setOpenSkinGallery] = useState(false);
  const [openExperiments, setOpenExperiments] = useState(false);
  const [openLayoutPreview, setOpenLayoutPreview] = useState(false);
  const [openEdgeBlending, setOpenEdgeBlending] = useState(false);
  const [openWorldMap, setOpenWorldMap] = useState(false);

  // Slime visual feedback (squish & grow)
  const [slimeMood, setSlimeMood] = useState<'idle'|'happy'|'sad'>('idle');
  const [slimeScale, setSlimeScale] = useState(1);
  
  // Celebration effects
  const [burstId, setBurstId] = useState(0);
  const [showLevelUpFX, setShowLevelUpFX] = useState(false);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  
  // World unlock celebrations
  const [showWorldUnlockFX, setShowWorldUnlockFX] = useState(false);
  const [unlockedWorldName, setUnlockedWorldName] = useState<string>("");
  const [unlockedBiomeName, setUnlockedBiomeName] = useState<string>("");
  
  // timing for skill progression
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  // Track processed attempts to avoid double counting in Strict Mode
  const processedAttemptsRef = useRef<Set<string>>(new Set());
  
  // Helper function to get world name for a skill
  const getWorldNameForSkill = (skillId: SkillID): string => {
    const worldId = worldIdOf(skillId);
    if (!worldId) return "";
    const world = WORLDS.find(w => w.id === worldId);
    return world ? world.title : "";
  };

  // sounds
  const [soundOn, setSoundOn] = useState(true);
  const { success, fail, pop, speed1, speed2, streakChime, levelUp, ensureCtx } = useSounds(soundOn);

  // Constants for slime feedback and celebrations
  const GROW_PER_CORRECT = 0.06;
  const SHRINK_PER_WRONG = 0.03;
  const SCALE_MIN = 1.0;
  const SCALE_MAX = 1.6;
  const FEEDBACK_MS = 700;
  
  const CELEBRATION = {
    FEEDBACK_MS: 700,
    BURST_SMALL_COUNT: 12,
    BURST_BIG_COUNT: 20,
    BURST_DUR_S: 1.3,
    LEVELUP_DUR_MS: 1400,
    WORLD_UNLOCK_DUR_MS: 2500,
    STREAK_MILESTONE: 5,
  };

  // Helper functions
  const resetSlime = () => {
    setSlimeMood('idle');
    setSlimeScale(1);
  };

  const resetCelebrations = () => {
    setShowLevelUpFX(false);
    setShowWorldUnlockFX(false);
    setBurstId(0);
  };

  // persist on store change
  useEffect(() => saveState(store), [store]);

  // hydrate local sound from profile
  useEffect(() => {
    if (current) setSoundOn(current.settings?.soundOn ?? true);
  }, [store.currentId]);

  // reset slime state when skill changes
  useEffect(() => {
    resetSlime();
    setQuestionStartTime(Date.now());
  }, [skill]);

  // unlocked skills list in order, gated by mastery
  const unlockedSkills = useMemo(() => {
    if (!current) return ["add_1_10" as SkillID];
    const list: SkillID[] = [];
    for (const id of SKILL_ORDER) {
      list.push(id);
      if (!current.mastered?.[id]) break;
    }
    // Auto-unlock advanced skills based on mastery count
    // Note: In V1, skills unlock linearly - no special mixed_all skill needed
    return list;
  }, [store.currentId, current?.mastered]);

  // start / end
  const startGame = () => {
    if (!current) { setOpenPicker(true); return; }
    const lf = levelFromTotalXP(current.xp).level;
    setRunStartLevel(lf);

    setRunXP(0); setRunGoo(0); setGooBase(0); setGooStreak(0); setGooSpeed(0);
    setLives(3); setStreak(0); setBestStreak(0);
    setProblem(makeProblemForSkill(skill));
    setQuestionStartTime(Date.now());
    setDisabledSet(new Set()); setWrongPick(null);
    resetSlime();
    resetCelebrations();
    setGameState("playing");
  };

  const endSession = () => {
    resetSlime();
    resetCelebrations();
    setGameState("over");
    setOpenSummary(true);
    if (!current) return;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) =>
        p.id !== current.id
          ? p
          : { ...p, best: { score: Math.max(p.best.score, Math.round(runXP)), streak: Math.max(p.best.streak, bestStreak) } }
      ),
    }));
  };

  // choosing an answer
  const onChoose = (value: number) => {
    if (gameState !== "playing" || !current) return;
    if (disabledSet.has(value)) return;
    ensureCtx();
    pop();

    const isCorrect = value === problem.answer;
    const answerTime = Date.now() - questionStartTime;
    const attemptId = `${skill}-${Date.now()}-${Math.random()}`; // Unique ID for this attempt
    
    // Track skill progression and check for world mastery
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) => {
        if (p.id !== current.id) return p;
        const np = { ...p };
        
        // Check if skill was previously mastered
        const wasMastered = np.mastered?.[skill] || false;
        
        // Avoid double processing in React Strict Mode
        if (processedAttemptsRef.current.has(attemptId)) {
          return np; // Already processed this attempt
        }
        processedAttemptsRef.current.add(attemptId);
        
        // Clean up old attempt IDs (keep only last 100)
        if (processedAttemptsRef.current.size > 100) {
          const oldIds = Array.from(processedAttemptsRef.current).slice(0, -50);
          oldIds.forEach(id => processedAttemptsRef.current.delete(id));
        }
        
        // Update skill stats
        updateStatsAndCheckMastery(np, skill, isCorrect, answerTime);
        
        // Check if skill just became mastered (first time)
        const isNowMastered = np.mastered?.[skill] || false;
        if (!wasMastered && isNowMastered) {
          // Find the world that this skill unlocks
          const worldId = worldIdOf(skill);
          if (worldId) {
            const world = WORLDS.find(w => w.id === worldId);
            if (world && meetsMastery(np, skill, world.gate)) {
              // World mastered! Unlock biome and set shop bias
              const updatedProfile = onWorldMastered(np, worldId);
              Object.assign(np, updatedProfile);
              
              // Trigger world unlock celebration
              setUnlockedWorldName(world.title);
              setUnlockedBiomeName(world.rewards.biomeId.charAt(0).toUpperCase() + world.rewards.biomeId.slice(1));
              setShowWorldUnlockFX(true);
              setBurstId(prev => prev + 1); // Trigger big emoji burst
              levelUp(); // Play level-up sound
              
              // Auto-hide after duration
              setTimeout(() => setShowWorldUnlockFX(false), CELEBRATION.WORLD_UNLOCK_DUR_MS);
              
              console.log(`🎉 World unlocked: ${world.title}! Unlocked ${world.rewards.biomeId} biome!`);
            }
          }
        }
        
        return np;
      }),
    }));
    
    const diffMul = difficultyMultiplier(skill);
    const masteryMul = getMasteryBonus(current); // 1.00..1.25
    const base = 10;
    const streakBonus = Math.min(50, streak * 2);

    if (isCorrect) {
      // quick “speed” cue (placeholder timing)
      const speedBonusGoo = Math.random() < 0.33 ? 5 : Math.random() < 0.5 ? 3 : 0;
      if (speedBonusGoo === 5) speed2(); else if (speedBonusGoo === 3) speed1();

      const addXP = (base + streakBonus) * diffMul * masteryMul;
      const basePart = base * diffMul * masteryMul;
      const streakPart = streakBonus * diffMul * masteryMul;

      // predict level up
      const before = levelFromTotalXP(current.xp).level;
      const after = levelFromTotalXP(current.xp + Math.round(addXP)).level;
      const leveled = after > before;

      setStore((S: any) => ({
        ...S,
        profiles: S.profiles.map((p: any) => {
          if (p.id !== current.id) return p;
          const np = { ...p };
          applyXP(np, addXP);
          if (leveled) {
            const bonus = 20 + 5 * after;
            np.goo += bonus;
            levelUp();
          }
          np.goo += Math.round(basePart + streakPart + speedBonusGoo);
          return np;
        }),
      }));

      setRunXP((v) => v + Math.round(addXP));
      setRunGoo((v) => v + Math.round(basePart + streakPart + speedBonusGoo));
      setGooBase((v) => v + Math.round(basePart));
      setGooStreak((v) => v + Math.round(streakPart));
      setGooSpeed((v) => v + speedBonusGoo);
      success();

      // Slime visual feedback - happy and grow
      setSlimeMood('happy');
      setSlimeScale(s => Math.min(SCALE_MAX, +(s.toFixed(3)) + GROW_PER_CORRECT));

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((bs) => Math.max(bs, nextStreak));
      if (nextStreak % 5 === 0) streakChime();

      // Celebration effects
      setBurstId(id => id + 1);

      // Level up celebration
      if (leveled) {
        setLevelUpTo(after);
        setShowLevelUpFX(true);
        setTimeout(() => setShowLevelUpFX(false), CELEBRATION.LEVELUP_DUR_MS);
      }

      // Delay to show celebration before advancing question
      setTimeout(() => {
        setProblem(makeProblemForSkill(skill));
        setQuestionStartTime(Date.now());
        setDisabledSet(new Set());
        setWrongPick(null);
        setSlimeMood('idle');
      }, FEEDBACK_MS);
    } else {
      // Slime visual feedback - sad and shrink
      setSlimeMood('sad');
      setSlimeScale(s => Math.max(SCALE_MIN, +(s.toFixed(3)) - SHRINK_PER_WRONG));
      
      // keep the same question but disable that option
      setWrongPick(value);
      setDisabledSet(new Set([...Array.from(disabledSet), value]));
      setStreak(0);
      fail();
      
      setTimeout(() => setSlimeMood('idle'), FEEDBACK_MS);
      
      setLives((lv) => {
        const left = lv - 1;
        if (left <= 0) setTimeout(endSession, 300);
        return left;
      });
    }
  };

  // shop + profile helpers
  const handleBuy = (item: { skin: string; price?: number }) => {
    if (!current) return;
    const price = item.price ?? 0;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) =>
        p.id !== current.id
          ? p
          : p.unlocks.skins.includes(item.skin) || p.goo < price
          ? p
          : { ...p, goo: p.goo - price, unlocks: { ...p.unlocks, skins: [...p.unlocks.skins, item.skin] } }
      ),
    }));
  };

  const handleEquip = (skinId: string) => {
    if (!current) return;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) =>
        p.id !== current.id ? p : { ...p, settings: { ...p.settings, activeSkin: skinId } }
      ),
    }));
  };

  const spendAndRefresh = (updated: any) => {
    setStore((S: any) => ({ ...S, profiles: S.profiles.map((p: any) => (p.id === updated.id ? updated : p)) }));
  };

  const rename = (name: string) => {
    if (!current) return;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) => (p.id === current.id ? { ...p, name } : p)),
    }));
  };

// ------------------------------------------------------------
// Render
// ------------------------------------------------------------
const level = current ? levelFromTotalXP(current.xp).level : 1;
const { xpInto, xpNeed } = current ? levelFromTotalXP(current.xp) : { xpInto: 0, xpNeed: 100 };

return (
  <div className="min-h-screen relative overflow-hidden">
    {/* Full-screen biome behind everything */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <BiomeLayer biome="meadow" />
    </div>

    {/* Foreground app layer */}
    <div className="relative z-10 w-full max-w-5xl mx-auto p-4">
      {/* profile picker on boot if no current */}
      {openPicker && (
        <ProfilePicker
          open={openPicker}
          state={store}
          onPick={(id) => {
            setStore((S: any) => ({ ...S, currentId: id }));
            setOpenPicker(false);
          }}
          onNew={() =>
            setStore((S: any) => ({
              ...S,
              profiles: [
                ...S.profiles,
                mkProfile(`kid-${S.profiles.length + 1}`, `Player ${S.profiles.length + 1}`, "#60a5fa"),
              ],
            }))
          }
          onClose={() => setOpenPicker(false)}
        />
      )}

      {/* Main card (slightly translucent so global biome softly shines through) */}
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-emerald-100">
        {/* Game Title */}
        <div className="text-center pt-6 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700">Slime Collector</h1>
        </div>

        {/* Stats Bar */}
        {current && (
          <div className="mx-6 mb-6 p-4">
            <div className="flex items-center justify-between">
              {/* Player indicator */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setOpenPicker(true)}
                  className="text-emerald-700 font-semibold hover:text-emerald-800 cursor-pointer text-sm"
                  title="Switch Player"
                >
                  {current.name} - switch
                </button>
              </div>

              <div className="flex items-center gap-6">
                {/* Hearts */}
                <div className="flex items-center gap-1" title="Lives">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" className={`w-6 h-6 ${i < lives ? "fill-red-500" : "fill-red-200"}`}>
                      <path
                        d="M12 21s-7-4.6-9.5-8.2C.6 9.8 1.7 6.6 4.4 5.6c1.7-.6 3.5-.1 4.7 1.2L12 9.9l2.9-3.1c1.2-1.3 3-1.8 4.7-1.2 2.7 1 3.8 4.2 1.9 7.2C19 16.4 12 21 12 21z"
                        strokeWidth="1.2"
                        className="stroke-red-600"
                      />
                    </svg>
                  ))}
                </div>

                {/* Goo Counter */}
                <div
                  className="inline-flex items-center gap-2 text-amber-700"
                  title="Goo"
                >
                  <span className="text-lg">🟡</span>
                  <span className="text-lg font-bold">{current.goo}</span>
                  <span className="text-sm font-medium">Goo</span>
                </div>

                {/* XP Bar */}
                <div className="flex-1 max-w-48">
                  <div className="h-4 w-full rounded-full bg-emerald-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, (xpInto / Math.max(1, xpNeed)) * 100))}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-emerald-700 text-center">
                    Lv {level} → {level + 1} • {Math.max(0, xpNeed - xpInto)} XP to next level
                  </div>
                </div>

                {/* Next World Indicator / Recent Unlock */}
                {showWorldUnlockFX ? (
                  <div className="text-xs text-purple-700 text-center animate-pulse">
                    <div className="font-bold">🌟 {unlockedBiomeName} Unlocked!</div>
                    <div className="text-[10px] text-purple-600/80">
                      Check Progress tab!
                    </div>
                  </div>
                ) : (() => {
                  const next = nextWorld(current);
                  if (next) {
                    const progress = current.skillStats[next.primarySkill];
                    const attempts = progress?.attempts || 0;
                    
                    return (
                      <div className="text-xs text-emerald-700/80 text-center">
                        <div className="font-medium">Next: {next.title}</div>
                        <div className="text-[10px] text-emerald-600/60">
                          {attempts}/{next.gate.attempts} attempts
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="text-xs text-green-700 text-center">
                      <div className="font-medium">🎉 All Complete!</div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="px-5 sm:px-8 pb-5 sm:pb-8">
          {/* Ready overlay */}
          {gameState === "ready" && current && (
            <div className="text-center p-8">
              <div className="text-emerald-700/80 mb-6 text-lg">
                Tap the correct answer to feed the friendly slime! 🟢
              </div>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xl shadow-lg font-semibold"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Game area */}
          {current && gameState !== "ready" && (
            <div className="relative rounded-2xl border border-emerald-200 overflow-hidden">
              {/* Local biome just for the playfield (behind slime + question) */}
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
                <BiomeLayer biome="meadow" />
              </div>

              <div className="flex items-center justify-between px-4 pt-4">
                <div className="text-emerald-700 font-semibold">Streak: {streak}</div>
                <div className="text-emerald-700/80 text-sm">Best: {bestStreak}</div>
              </div>
              
              {/* Current Skill/World Indicator */}
              <div className="px-4 pb-2">
                <div className="text-center text-xs text-emerald-600/70">
                  {(() => {
                    const skillLabel = SKILLS[skill]?.label ?? skill;
                    const worldName = getWorldNameForSkill(skill);
                    const mastered = current?.mastered?.[skill] || false;
                    
                    return worldName 
                      ? `${skillLabel} • ${worldName}${mastered ? ' ✓' : ''}`
                      : skillLabel;
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                {/* active skin with celebrations */}
                <div className="relative">
                  <Slime 
                    skinId={current.settings.activeSkin as any} 
                    mood={slimeMood} 
                    scale={slimeScale}
                    eyeTracking={current.settings.eyeTracking}
                  />
                  
                  {/* Celebrations overlay */}
                  <div className="pointer-events-none absolute inset-0 z-20">
                    {/* EmojiBurst remounts on burstId */}
                    {burstId > 0 && <EmojiBurst key={`burst-${burstId}`} count={showWorldUnlockFX ? 24 : (streak % 5 === 0 ? 20 : 12)} />}
                    
                    {/* Level-up sparkle + label */}
                    {showLevelUpFX && (
                      <>
                        <Starburst />
                        <div className="absolute left-1/2 -translate-x-1/2 top-2">
                          <span className="rounded-full bg-emerald-600 text-white px-4 py-1.5 text-sm font-bold shadow">
                            Level {levelUpTo}!
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* World unlock celebration */}
                    {showWorldUnlockFX && (
                      <>
                        <Starburst count={24} />
                        <motion.div 
                          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <motion.div 
                            className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white rounded-2xl px-6 py-4 shadow-2xl border-2 border-white/30 backdrop-blur-sm"
                            animate={{ 
                              boxShadow: [
                                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
                                "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <div className="text-center">
                              <motion.div 
                                className="text-2xl font-bold mb-1"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              >
                                🌟 {unlockedWorldName} Complete! 🌟
                              </motion.div>
                              <div className="text-lg text-white/90">{unlockedBiomeName} Biome Unlocked!</div>
                              <div className="text-sm text-white/80 mt-1">New adventures await!</div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pb-8">
                <QuestionCard
                  problem={problem as any}
                  disabledSet={disabledSet}
                  wrongPick={wrongPick}
                  onChoose={onChoose}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="mx-6 mb-6 p-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* Skill Selector */}
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value as SkillID)}
              className="rounded-xl bg-white px-4 py-2 text-emerald-800 text-sm border border-emerald-200"
              title="Select math skill and world progression"
            >
              {unlockedSkills.map((id) => {
                const skillLabel = SKILLS[id as SkillID]?.label ?? id;
                const worldName = getWorldNameForSkill(id);
                const mastered = current?.mastered?.[id] || false;
                
                // Format: "Addition 1–10 • Meadow World" or "Addition 1–10 • Meadow ✓" if mastered
                const displayLabel = worldName 
                  ? `${skillLabel} • ${worldName}${mastered ? ' ✓' : ''}`
                  : skillLabel;
                
                return (
                  <option key={id} value={id}>
                    {displayLabel}
                  </option>
                );
              })}
            </select>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundOn((s) => !s);
                if (current) {
                  setStore((S: any) => ({
                    ...S,
                    profiles: S.profiles.map((p: any) =>
                      p.id === current.id ? { ...p, settings: { ...p.settings, soundOn: !soundOn } } : p
                    ),
                  }));
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm border border-emerald-200"
              title={soundOn ? "Sound on" : "Sound off"}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Sound</span>
            </button>

            {/* Shop Button */}
            <button
              onClick={() => setOpenShop(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm border border-amber-200"
              title="Shop"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </button>

            {/* Progress Button */}
            <button
              onClick={() => setOpenProgress(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm border border-emerald-200"
              title="Progress"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </button>

            {/* End Session - Only during play */}
            {gameState === "playing" && (
              <button
                onClick={endSession}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm border border-red-200"
                title="End Session"
              >
                <Power className="w-4 h-4" />
                <span className="hidden sm:inline">End</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shop */}
      {current && (
        <ShopModal
          open={openShop}
          profile={current}
          onClose={() => setOpenShop(false)}
          onBuy={handleBuy}
          onEquip={handleEquip}
          onSpendAndRefresh={spendAndRefresh}
        />
      )}

      {/* Progress */}
      {current && (
        <ProgressModal
          open={openProgress}
          profile={current}
          onClose={() => setOpenProgress(false)}
          onRename={rename}
          onEquipSkin={handleEquip}
          onUpdateSettings={(settings) => {
            setStore((S: any) => ({
              ...S,
              profiles: S.profiles.map((p: any) =>
                p.id === current.id ? { ...p, settings: { ...p.settings, ...settings } } : p
              ),
            }));
          }}
        />
      )}

      {/* Summary */}
      {current && (
        <SessionSummary
          open={openSummary}
          onClose={() => {
            setOpenSummary(false);
            setGameState("ready");
          }}
          levelBefore={runStartLevel}
          levelAfter={level}
          xpInto={xpInto}
          xpNeed={xpNeed}
          runXP={runXP}
          runGoo={runGoo}
          gooBase={gooBase}
          gooStreak={gooStreak}
          gooSpeed={gooSpeed}
          bestStreak={bestStreak}
        />
      )}
    </div>

    {import.meta.env.DEV && (
              <DevPanel 
          onOpenSkinGallery={() => setOpenSkinGallery(true)} 
          onOpenExperiments={() => setOpenExperiments(true)}
          onOpenLayoutPreview={() => setOpenLayoutPreview(true)}
          onOpenEdgeBlending={() => setOpenEdgeBlending(true)}
          onOpenWorldMap={() => setOpenWorldMap(true)}
        />
    )}
    
    {/* Dev Modals */}
    {import.meta.env.DEV && (
      <>
        <SkinGallery 
          open={openSkinGallery} 
          onClose={() => setOpenSkinGallery(false)} 
        />
        <Experiments 
          open={openExperiments} 
          onClose={() => setOpenExperiments(false)} 
        />
        <LayoutPreview 
          open={openLayoutPreview} 
          onClose={() => setOpenLayoutPreview(false)} 
        />
        {openEdgeBlending && (
          <EdgeBlendingExperiments onClose={() => setOpenEdgeBlending(false)} />
        )}
        {openWorldMap && (
          <WorldMap onClose={() => setOpenWorldMap(false)} />
        )}
      </>
    )}
  </div>
);
}

