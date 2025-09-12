// src/app/SlimeCollectorApp.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import { BiomeLayer, getBiomeForSkill } from "../assets/biomes";

import Slime from "../ui/components/Slime";
import QuestionCard from "../ui/gameplay/QuestionCard";
import SessionSummary from "../ui/gameplay/SessionSummary";
import ShopModal from "../ui/shop/ShopModal";
import ProgressModal from "../ui/progress/ProgressModal";
import ProfilePicker from "../ui/progress/ProfilePicker";

import { useSounds } from "../assets/sounds";

import { loadState, saveState, mkProfile } from "../core/storage";
import { SKILL_ORDER, SKILLS, makeProblemForSkill, difficultyMultiplier } from "../core/skills";
import type { SkillID, ShopItem } from "../core/types";
import { getMasteryBonus, levelFromTotalXP, applyXP, updateStatsAndCheckMastery, worldIdOf, onWorldMastered, WORLDS, nextWorld, getStrongAnswerCount } from "../core/progression";
import { priceOf } from "../core/economy";
import { evaluateBadges, getBadgeName } from "../core/badges";
import { useBadgeToasts } from "../ui/components/Toaster";
import DevPanel from "../dev/DevPanel";
import SkinGallery from "../ui/components/SkinGallery";
import Experiments from "../dev/Experiments";
import LayoutPreview from "../dev/LayoutPreview";
import EdgeBlendingExperiments from "../dev/EdgeBlendingExperiments";
import WorldMap from "../dev/WorldMap";
import ProgressDashboard from "../dev/ProgressDashboard";
import Starburst, { EmojiBurst } from "../ui/components/Starburst";
import { Volume2, VolumeX, ShoppingBag, UserCircle2, Power, Users } from "lucide-react";
import { motion } from "framer-motion";

import { AuthProvider, useAuth } from "../ui/auth/AuthProvider";
import { ProfileSelector, CreateProfileModal } from "../ui/auth/ProfileSelector";
import { loadSave, saveGame } from "../lib/saves";
import { saveLogger, gameLogger, authLogger } from "../lib/debug";
import { initAutosave } from "../core/autosave";


// ------------------------------------------------------------
// Slime Collector – App Orchestrator (Auth-aware)
// ------------------------------------------------------------
function SlimeCollectorAppInner() {
  const { user, activeProfile, profiles, selectProfile, signOut, isOfflineMode, exitOfflineMode, createProfile, refreshOfflineProfiles } = useAuth();

  // persistent store (profiles etc.) - now hybrid localStorage + cloud
  const [store, setStore] = useState<any>(() => loadState());
  const current = activeProfile ? store.profiles.find((p: any) => p.id === activeProfile.id) || mkProfile(activeProfile.id, activeProfile.name, '#22c55e') : store.profiles.find((p: any) => p.id === store.currentId) || null;
  
  // Detect if we're effectively in offline mode (no user OR using offline profile)
  const effectivelyOffline = !user || (current && current.id.startsWith('offline-'));
  
  // Debug logging
  console.log('🎮 CURRENT PROFILE DEBUG:', {
    activeProfile: activeProfile ? { id: activeProfile.id, name: activeProfile.name } : null,
    storeCurrentId: store.currentId,
    storeProfilesCount: store.profiles.length,
    storeProfileNames: store.profiles.map((p: any) => ({ id: p.id, name: p.name })),
    current: current ? { id: current.id, name: current.name } : null,
    isOfflineMode,
    effectivelyOffline,
    hasUser: !!user,
    derivationPath: activeProfile ? 'activeProfile' : 'store.currentId'
  });

  // gameplay state
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready");
  // Use current profile's skill, fallback to add_1_10
  const skill = (current?.settings?.currentSkill as SkillID) || "add_1_10";
  
  // Function to update skill in profile data
  const updateCurrentSkill = (newSkill: SkillID) => {
    if (!current) return;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) => 
        p.id === current.id 
          ? { ...p, settings: { ...p.settings, currentSkill: newSkill } }
          : p
      )
    }));
    markDirty(); // Trigger autosave after skill change
  };
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
  
  // session badge tracking
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [sessionFastUnder1_5, setSessionFastUnder1_5] = useState(0);
  const [sessionFastUnder3, setSessionFastUnder3] = useState(0);

  // modals
  const [openShop, setOpenShop] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [openPicker, setOpenPicker] = useState(false); // Disabled by default - cloud auth is primary
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [openSkinGallery, setOpenSkinGallery] = useState(false);
  const [openExperiments, setOpenExperiments] = useState(false);
  const [openLayoutPreview, setOpenLayoutPreview] = useState(false);
  const [openEdgeBlending, setOpenEdgeBlending] = useState(false);
  const [openWorldMap, setOpenWorldMap] = useState(false);
  const [openProgressDashboard, setOpenProgressDashboard] = useState(false);
  
  // Save status indicator
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Autosave instance
  const [autosaveInstance, setAutosaveInstance] = useState<any>(null);
  
  // Helper to safely mark data as dirty for autosave
  const markDirty = () => {
    if (autosaveInstance) {
      autosaveInstance.markDirty();
    }
  };

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

  // badge toasts
  const { pushBadge } = useBadgeToasts();

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
    WORLD_UNLOCK_DUR_MS: 10000, // Extended duration
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

  // Event-driven autosave system
  useEffect(() => {
    if (current) {
      const autosave = initAutosave({
        getCurrentData: () => current,
        save: async (data) => {
          if (effectivelyOffline) {
            // Save to localStorage in offline mode
            const currentStore = loadState();
            const updatedStore = {
              ...currentStore,
              profiles: currentStore.profiles.map((p: any) => 
                p.id === data.id ? { ...data } : p
              )
            };
            saveState(updatedStore);
            setStore(updatedStore); // Update React state too
          } else if (activeProfile) {
            // Save to cloud in online mode
            await saveGame(data);
          }
        },
        onSaveStart: () => {
          setSaveStatus('saving');
        },
        onSaveSuccess: () => {
          setSaveStatus('saved');
          // Clear save status after 2 seconds
          if (saveTimer) clearTimeout(saveTimer);
          const timer = setTimeout(() => setSaveStatus('idle'), 2000);
          setSaveTimer(timer);
        },
        onSaveError: (error) => {
          setSaveStatus('error');
          // Clear error status after 3 seconds
          if (saveTimer) clearTimeout(saveTimer);
          const timer = setTimeout(() => setSaveStatus('idle'), 3000);
          setSaveTimer(timer);
        }
      });

      setAutosaveInstance(autosave);

      return () => {
        autosave.destroy();
        if (saveTimer) clearTimeout(saveTimer);
      };
    }
  }, [activeProfile, current, isOfflineMode, effectivelyOffline]);

  // Load from cloud when active profile changes (only in online mode)
  useEffect(() => {
    if (activeProfile && !isOfflineMode) {
      console.log('🔄 Loading data for profile:', activeProfile.name, activeProfile.id);
      loadSave().then(async (cloudProfile) => {
        if (cloudProfile) {
          console.log('☁️ Loaded cloud profile:', cloudProfile.name, 'Goo:', cloudProfile.goo, 'XP:', cloudProfile.xp, 'OwnedSkins:', cloudProfile.unlocks?.skins?.length || 0);
          
          // Ensure cloud profile has complete structure with migrateProfile
          const { migrateProfile } = await import('../core/storage');
          const migratedProfile = migrateProfile({
            ...cloudProfile,
            id: activeProfile.id, // Ensure ID matches
            name: activeProfile.name // Sync name from cloud profile
          });
          
          console.log('🔧 Migrated cloud profile with complete structure:', migratedProfile.name);
          
          // Update store with migrated cloud data
          setStore((prev: any) => ({
            ...prev,
            currentId: activeProfile.id,
            profiles: [migratedProfile]
          }));
        } else {
          console.log('📝 Creating new profile for:', activeProfile.name);
          // Create new profile for this cloud account
          const newProfile = mkProfile(activeProfile.id, activeProfile.name, '#22c55e');
          setStore((prev: any) => ({
            ...prev,
            currentId: activeProfile.id,
            profiles: [newProfile]
          }));
        }
      }).catch(error => {
        console.error('Failed to load from cloud:', error);
      });
    } else if (activeProfile && isOfflineMode) {
      console.log('📱 Offline mode: Using local profile data for:', activeProfile.name);
      // In offline mode, sync the activeProfile (which contains full profile data) to store
      setStore((prev: any) => {
        const existingProfileIndex = prev.profiles.findIndex((p: any) => p.id === activeProfile.id);
        
        if (existingProfileIndex >= 0) {
          // Update existing profile
          return {
            ...prev,
            currentId: activeProfile.id,
            profiles: prev.profiles.map((p: any) => 
              p.id === activeProfile.id ? { ...activeProfile } : p
            )
          };
        } else {
          // Add new profile
          return {
            ...prev,
            currentId: activeProfile.id,
            profiles: [...prev.profiles, { ...activeProfile }]
          };
        }
      });
    }
  }, [activeProfile, isOfflineMode]);

  // Only enable old ProfilePicker when cloud auth is completely unavailable
  useEffect(() => {
    if (user) {
      // Cloud auth is active - disable old picker
      setOpenPicker(false);
    } else {
      // Cloud auth not active - only show old picker if no current profile exists
      if (!current) {
        setOpenPicker(true);
      }
    }
  }, [user, current]);

  // persist on store change (localStorage backup)
  useEffect(() => {
    console.log('💾 Saving to localStorage:', {
      profiles: store.profiles.length,
      currentId: store.currentId,
      isOfflineMode,
      user: !!user
    });
    saveState(store);
  }, [store]);

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
    
    // RELEASE FEATURE: Always unlock new math tiers regardless of mastery progression
    const alwaysUnlockedSkills: SkillID[] = ['sub_3digit_triple', 'sub_4digit_quad'];
    for (const alwaysUnlocked of alwaysUnlockedSkills) {
      if (!list.includes(alwaysUnlocked)) {
        list.push(alwaysUnlocked);
      }
    }
    
    // Debug logging for skill unlock logic
    console.log(`🔓 SKILL UNLOCK DEBUG:`, {
      skillOrder: SKILL_ORDER.slice(0, 5), // first 5 for brevity
      mastered: current.mastered,
      unlockedSkills: list,
      currentSkill: skill,
      masteredFlags: Object.entries(current.mastered || {}).filter(([_, v]) => v),
      alwaysUnlocked: alwaysUnlockedSkills
    });
    
    return list;
  }, [store.currentId, current?.mastered, store]); // Include store to trigger re-render on profile updates

  // start / end
  const startGame = () => {
    if (!current) { 
      // If using cloud auth, show cloud profile switcher
      if (user) {
        setShowProfileSwitcher(true);
      } else {
        // No cloud auth and no current profile - show local picker only as fallback
        setOpenPicker(true);
      }
      return; 
    }
    const lf = levelFromTotalXP(current.xp).level;
    setRunStartLevel(lf);

    setRunXP(0); setRunGoo(0); setGooBase(0); setGooStreak(0); setGooSpeed(0);
    setLives(3); setStreak(0); setBestStreak(0);
    setSessionCorrect(0); setSessionAttempts(0); setSessionFastUnder1_5(0); setSessionFastUnder3(0);
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
      profiles: S.profiles.map((p: any) => {
        if (p.id !== current.id) return p;
        const np = { ...p, best: { score: Math.max(p.best.score, Math.round(runXP)), streak: Math.max(p.best.streak, bestStreak) } };
        
        // Evaluate badges on session end
        const sessionBadgeResult = evaluateBadges(np, {
          profile: { ...np, sessionDamageTaken: 3 - lives }, // track damage taken
          event: { 
            type: 'session_end', 
            stats: { 
              correct: sessionCorrect, 
              attempts: sessionAttempts, 
              streakBest: bestStreak,
              fastUnder1_5: sessionFastUnder1_5,
              fastUnder3: sessionFastUnder3
            } 
          },
          now: Date.now()
        });
        Object.assign(np, sessionBadgeResult.profile);
        
        // Show session badge toasts
        sessionBadgeResult.newlyUnlocked.forEach(badge => {
          pushBadge({ 
            name: getBadgeName(badge.id), 
            tier: badge.tier, 
            rewardGoo: badge.rewardGoo 
          });
          np.goo += badge.rewardGoo;
        });
        
        return np;
      }),
    }));
    markDirty(); // Trigger autosave after session end
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
    
    // Update session counters for badges
    setSessionAttempts(prev => prev + 1);
    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
      if (answerTime < 1500) setSessionFastUnder1_5(prev => prev + 1);
      if (answerTime < 3000) setSessionFastUnder3(prev => prev + 1);
    }
    
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
        
        // Evaluate badges on answer event
        const badgeResult = evaluateBadges(np, {
          profile: np,
          event: { type: 'answer', correct: isCorrect, ms: answerTime, skillId: skill, streak },
          now: Date.now()
        });
        Object.assign(np, badgeResult.profile);
        
        // Show badge toasts
        badgeResult.newlyUnlocked.forEach(badge => {
          pushBadge({ 
            name: getBadgeName(badge.id), 
            tier: badge.tier, 
            rewardGoo: badge.rewardGoo 
          });
          // Add Goo reward
          np.goo += badge.rewardGoo;
        });
        
        // Check if skill just became mastered (first time)
        const isNowMastered = np.mastered?.[skill] || false;
        if (!wasMastered && isNowMastered) {
          // Find the world where this skill is the primary skill
          const worldId = worldIdOf(skill);
          if (worldId) {
            const world = WORLDS.find(w => w.id === worldId);
            if (world) {
              // Check if this world wasn't already unlocked
              const biomeAlreadyUnlocked = np.unlocks?.biomes?.includes(world.rewards.biomeId);
              if (!biomeAlreadyUnlocked) {
                // World mastered! Unlock biome and set shop bias
                const updatedProfile = onWorldMastered(np, world.id);
                Object.assign(np, updatedProfile);
              
              // Evaluate badges on mastery event
              const masteryBadgeResult = evaluateBadges(np, {
                profile: np,
                event: { type: 'mastery', skillId: skill, worldId: world.id },
                now: Date.now()
              });
              Object.assign(np, masteryBadgeResult.profile);
              
              // Show mastery badge toasts
              masteryBadgeResult.newlyUnlocked.forEach(badge => {
                pushBadge({ 
                  name: getBadgeName(badge.id), 
                  tier: badge.tier, 
                  rewardGoo: badge.rewardGoo 
                });
                np.goo += badge.rewardGoo;
              });
              
              // Evaluate badges on biome unlock event
              const biomeBadgeResult = evaluateBadges(np, {
                profile: np,
                event: { type: 'biome_unlock', biomeId: world.rewards.biomeId },
                now: Date.now()
              });
              Object.assign(np, biomeBadgeResult.profile);
              
              // Show biome badge toasts
              biomeBadgeResult.newlyUnlocked.forEach(badge => {
                pushBadge({ 
                  name: getBadgeName(badge.id), 
                  tier: badge.tier, 
                  rewardGoo: badge.rewardGoo 
                });
                np.goo += badge.rewardGoo;
              });
              
              // Trigger world unlock celebration
              setUnlockedWorldName(world.title);
              setUnlockedBiomeName(world.rewards.biomeId.charAt(0).toUpperCase() + world.rewards.biomeId.slice(1));
              setShowWorldUnlockFX(true);
              setBurstId(prev => prev + 1); // Trigger big emoji burst
              levelUp(); // Play level-up sound
              
              // No auto-hide - let player choose via buttons
              // setTimeout(() => setShowWorldUnlockFX(false), 10000);
              
              console.log(`🎉 World unlocked: ${world.title}! Unlocked ${world.rewards.biomeId} biome!`);
              }
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
      // quick "speed" cue (placeholder timing)
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
      
      // Reset slime mood after feedback duration
      setTimeout(() => {
        setSlimeMood('idle');
      }, FEEDBACK_MS);
      
      // keep the same question but disable that option
      setWrongPick(value);
      setDisabledSet(new Set([...Array.from(disabledSet), value]));
      setStreak(0);
      fail();
      
      setLives((lv) => {
        const left = lv - 1;
        if (left <= 0) setTimeout(endSession, 300);
        return left;
      });
    }
    markDirty(); // Trigger autosave after any answer (correct/incorrect)
  };

  // shop + profile helpers
  const handleBuy = (item: ShopItem) => {
    if (!current) return;
    const price = priceOf(item);
    
    // Check if already owned or can't afford
    if (current.unlocks.skins.includes(item.skin) || current.goo < price) {
      return;
    }
    
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) => {
        if (p.id !== current.id) return p;
        const np = { ...p, goo: p.goo - price, unlocks: { ...p.unlocks, skins: [...p.unlocks.skins, item.skin] } };
        
        // Evaluate badges on shop purchase
        const shopBadgeResult = evaluateBadges(np, {
          profile: np,
          event: { type: 'shop_buy', item: { type: 'skin', skin: item.skin, tier: item.tier } },
          now: Date.now()
        });
        Object.assign(np, shopBadgeResult.profile);
        
        // Show shop badge toasts
        shopBadgeResult.newlyUnlocked.forEach(badge => {
          pushBadge({ 
            name: getBadgeName(badge.id), 
            tier: badge.tier, 
            rewardGoo: badge.rewardGoo 
          });
          np.goo += badge.rewardGoo;
        });
        
        return np;
      }),
    }));
    markDirty(); // Trigger autosave after purchase
  };

  const handleEquip = (skinId: string) => {
    if (!current) return;
    setStore((S: any) => ({
      ...S,
      profiles: S.profiles.map((p: any) =>
        p.id !== current.id ? p : { ...p, settings: { ...p.settings, activeSkin: skinId } }
      ),
    }));
    markDirty(); // Trigger autosave after equipping skin
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

// Determine current biome - use skill-based biome for dynamic visual experience
const currentBiome = getBiomeForSkill(skill);

return (
  <div className="min-h-screen relative overflow-hidden">
    {/* Full-screen biome behind everything */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <BiomeLayer biome={currentBiome} />
    </div>

    {/* Foreground app layer */}
    <div className="relative z-10 w-full max-w-5xl mx-auto p-4">
      {/* profile picker - ONLY for pure local storage mode (no auth system) */}
      {openPicker && !user && !activeProfile && !isOfflineMode && (
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
        
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Save Status Indicator */}
          {current && saveStatus !== 'idle' && (
            <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
              saveStatus === 'saving' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              saveStatus === 'saved' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {saveStatus === 'saving' && (
                <>
                  <div className="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Save Failed</span>
                </>
              )}
            </div>
          )}
          
          {/* Sign Out Button */}
          {user && (
            <button
              onClick={signOut}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white/70 backdrop-blur-sm border border-gray-200"
              title="Sign out of family account"
            >
              <Power className="w-3 h-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
        
        {/* Game Title */}
        <div className="text-center pt-6 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700">Slime Collector</h1>
        </div>

        {/* Stats Bar */}
        {current && (
          <div className="mx-6 mb-6 p-4">
            <div className="flex items-center justify-between">
              {/* Player indicator - only show if not using cloud auth */}
              {!user && !activeProfile && (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setOpenPicker(true)}
                    className="text-emerald-700 font-semibold hover:text-emerald-800 cursor-pointer text-sm"
                    title="Switch Player"
                  >
                    {current.name} - switch
                  </button>
                </div>
              )}

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

                {/* Logout Button moved to top right corner */}

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
                    // V1: Simple linear progression - always show primary skill progress
                    const strongAnswers = getStrongAnswerCount(current, next.primarySkill);
                    
                    return (
                      <div className="text-xs text-emerald-700/80 text-center">
                        <div className="font-medium">{next.title} Math Progress</div>
                        <div 
                          className="text-[10px] text-emerald-600/60 cursor-help" 
                          title={`Strong answers are correct AND answered in under ${next.gate.maxAvgMs/1000}s. You need ${next.gate.attempts} strong answers with ${(next.gate.minAcc*100).toFixed(0)}% overall accuracy to master this skill.`}
                        >
                          {strongAnswers}/{next.gate.attempts} strong answers
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
                <BiomeLayer biome={currentBiome} />
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
                          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto w-full max-w-md"
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <motion.div 
                            className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white rounded-2xl px-8 py-6 shadow-2xl border-2 border-white/30 backdrop-blur-sm w-full"
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
                              
                              {/* Next Skill Button */}
                              <div className="mt-4 space-y-2">
                                <button
                                  onClick={() => {
                                    // Find the next skill in order
                                    const nextSkillIndex = SKILL_ORDER.findIndex(s => s === skill) + 1;
                                    if (nextSkillIndex < SKILL_ORDER.length && nextSkillIndex > 0) {
                                      const nextSkill = SKILL_ORDER[nextSkillIndex];
                                      updateCurrentSkill(nextSkill);
                                      console.log(`🚀 AUTO-ADVANCE: Moving to next skill ${nextSkill}`);
                                    }
                                    
                                    // Hide celebration
                                    setShowWorldUnlockFX(false);
                                    resetCelebrations();
                                  }}
                                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 transition-colors"
                                >
                                  Continue to Next Skill →
                                </button>
                                <button
                                  onClick={() => {
                                    setShowWorldUnlockFX(false);
                                    resetCelebrations();
                                  }}
                                  className="block mx-auto bg-transparent text-white/70 hover:text-white text-xs underline"
                                >
                                  Stay on current skill
                                </button>
                              </div>
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
              onChange={(e) => updateCurrentSkill(e.target.value as SkillID)}
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

            {/* Profile Switcher Button - for both online and offline modes */}
            {(user || isOfflineMode) && activeProfile && (
              <button
                onClick={() => {
                  // Refresh profile data if in offline mode to show latest progress
                  if (isOfflineMode && refreshOfflineProfiles) {
                    refreshOfflineProfiles();
                  }
                  setShowProfileSwitcher(true);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm border ${
                  isOfflineMode
                    ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title={isOfflineMode ? "Switch Player (Offline)" : "Switch Player"}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {activeProfile.name}
                  {isOfflineMode && <span className="ml-1 text-xs">📵</span>}
                </span>
              </button>
            )}

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

      {/* Profile Switcher Modal - for both online and offline modes */}
      {showProfileSwitcher && (user || isOfflineMode) && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) {
              setShowProfileSwitcher(false);
            }
          }}
        >
          <ProfileSelector
            profiles={profiles}
            activeProfileId={activeProfile?.id || null}
            onSelectProfile={async (profileId) => {
              await selectProfile(profileId);
              setShowProfileSwitcher(false);
            }}
            onCreateProfile={() => {
              setShowCreateProfile(true);
            }}
            onClose={() => setShowProfileSwitcher(false)}
            onExitOfflineMode={exitOfflineMode}
            parentEmail={user?.email}
            isOfflineMode={isOfflineMode}
          />
    </div>
      )}

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        onCreateProfile={async (name: string) => {
          await createProfile(name);
          setShowCreateProfile(false);
        }}
      />
    </div>

    {import.meta.env.DEV && (
              <DevPanel 
          onOpenSkinGallery={() => setOpenSkinGallery(true)} 
          onOpenExperiments={() => setOpenExperiments(true)}
          onOpenLayoutPreview={() => setOpenLayoutPreview(true)}
          onOpenEdgeBlending={() => setOpenEdgeBlending(true)}
          onOpenWorldMap={() => setOpenWorldMap(true)}
          onOpenProgressDashboard={() => setOpenProgressDashboard(true)}
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
        {openProgressDashboard && current && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full h-full bg-white overflow-auto">
              <ProgressDashboard 
                profile={current}
                onStartSkill={(skillId) => {
                  updateCurrentSkill(skillId);
                  setOpenProgressDashboard(false);
                  if (gameState !== "playing") {
                    setGameState("playing");
                  }
                }}
                onClose={() => setOpenProgressDashboard(false)} 
              />
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
}

// Main export with Auth wrapper
export default function SlimeCollectorApp() {
  return (
    <AuthProvider>
      <SlimeCollectorAppInner />
    </AuthProvider>
  );
}