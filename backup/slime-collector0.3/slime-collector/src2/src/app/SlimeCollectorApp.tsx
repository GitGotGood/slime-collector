import React, { useEffect, useMemo, useState } from "react";

import Slime from "../ui/components/Slime";
import Hud from "../ui/gameplay/Hud";
import QuestionCard from "../ui/gameplay/QuestionCard";
import SessionSummary from "../ui/gameplay/SessionSummary";
import ShopModal from "../ui/shop/ShopModal";
import ProgressModal from "../ui/progress/ProgressModal";
import ProfilePicker from "../ui/progress/ProfilePicker";

import { BiomeLayer } from "../assets/biomes";
import { useSounds } from "../assets/sounds";

import { loadState, saveState, mkProfile } from "../core/storage";
import { SKILL_ORDER, SKILLS, makeProblemForSkill, difficultyMultiplier } from "../core/skills";
import { getMasteryBonus, levelFromTotalXP, applyXP } from "../core/progression";

// ------------------------------------------------------------
// Slime Collector – App Orchestrator
// ------------------------------------------------------------
export default function SlimeCollectorApp() {
  // persistent store (profiles etc.)
  const [store, setStore] = useState<any>(() => loadState());
  const current = store.profiles.find((p: any) => p.id === store.currentId) || null;

  // gameplay state
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready");
  const [skill, setSkill] = useState<string>("add_1_10");
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
  const [openPicker, setOpenPicker] = useState(!current);

  // sounds
  const [soundOn, setSoundOn] = useState(true);
  const { success, fail, pop, speed1, speed2, streakChime, levelUp, ensureCtx } = useSounds(soundOn);

  // persist on store change
  useEffect(() => saveState(store), [store]);

  // hydrate local sound from profile
  useEffect(() => {
    if (current) setSoundOn(current.settings?.soundOn ?? true);
  }, [store.currentId]);

  // unlocked skills list in order, gated by mastery
  const unlockedSkills = useMemo(() => {
    if (!current) return ["add_1_10"];
    const list: string[] = [];
    for (const id of SKILL_ORDER) {
      list.push(id);
      if (!current.mastered?.[id]) break;
    }
    const masteredCount = Object.values(current.mastered ?? {}).filter(Boolean).length;
    if (masteredCount >= 3 && !list.includes("mixed_all")) list.push("mixed_all");
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
    setDisabledSet(new Set()); setWrongPick(null);
    setGameState("playing");
  };

  const endSession = () => {
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
    const diffMul = difficultyMultiplier(skill);
    const masteryMul = getMasteryBonus(current); // 1.00..1.25
    const base = 10;
    const streakBonus = Math.min(50, streak * 2);

    if (isCorrect) {
      // quick “speed” cue (we’ll wire to real timing if desired)
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

      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((bs) => Math.max(bs, ns));
        if (ns % 5 === 0) streakChime();
        return ns;
      });

      // next problem
      setProblem(makeProblemForSkill(skill));
      setDisabledSet(new Set());
      setWrongPick(null);
    } else {
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
    <div className="min-h-[100vh] w-full flex items-center justify-center relative p-4">
      {/* biome background */}
      <BiomeLayer biome={(current?.settings as any)?.biome || "meadow"} />

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
              profiles: [...S.profiles, mkProfile(`kid-${S.profiles.length + 1}`, `Player ${S.profiles.length + 1}`, "#60a5fa")],
            }))
          }
          onClose={() => setOpenPicker(false)}
        />
      )}

      <div className="relative w-full max-w-3xl rounded-2xl shadow-xl bg-white p-5 sm:p-8 border border-emerald-100">
        {/* HUD */}
        <Hud
          lives={lives}
          goo={current?.goo ?? 0}
          level={level}
          xpInto={xpInto}
          xpNeed={xpNeed}
          soundOn={soundOn}
          onToggleSound={() => {
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
          onOpenShop={() => setOpenShop(true)}
          onOpenProgress={() => setOpenProgress(true)}
          onEndSession={() => {
            if (gameState === "playing") endSession();
          }}
          skill={skill}
          onChangeSkill={setSkill}
          unlockedSkills={unlockedSkills}
          skillLabel={(id) => SKILLS[id as any]?.label ?? id}
        />

        {/* Ready overlay */}
        {gameState === "ready" && current && (
          <div className="mt-6 grid place-items-center">
            <div className="text-center p-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mb-2">Slime Collector</div>
              <div className="text-emerald-700/80 mb-6">Tap the correct answer to feed the friendly slime! 🟢</div>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-lg shadow"
              >
                Start
              </button>
            </div>
          </div>
        )}

        {/* Game area */}
        {current && gameState !== "ready" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-emerald-700 font-semibold">Streak: {streak}</div>
              <div className="text-emerald-700/80 text-sm">Best: {bestStreak}</div>
            </div>

            <div className="flex items-center justify-center">
              {/* use real skin id */}
              <Slime skinId={current.settings.activeSkin as any} />
            </div>

            <QuestionCard
              problem={problem as any}
              disabledSet={disabledSet}
              wrongPick={wrongPick}
              onChoose={onChoose}
            />
          </div>
        )}
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
  );
}
