// src/app/SlimeCollectorApp.tsx
import { useEffect, useMemo, useState } from "react";
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
import type { SkillId } from "../core/types";
import { getMasteryBonus, levelFromTotalXP, applyXP } from "../core/progression";
import DevPanel from "../dev/DevPanel";
import SkinGallery from "../ui/components/SkinGallery";
import Experiments from "../dev/Experiments";
import LayoutPreview from "../dev/LayoutPreview";


// ------------------------------------------------------------
// Slime Collector – App Orchestrator
// ------------------------------------------------------------
export default function SlimeCollectorApp() {
  // persistent store (profiles etc.)
  const [store, setStore] = useState<any>(() => loadState());
  const current = store.profiles.find((p: any) => p.id === store.currentId) || null;

  // gameplay state
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready");
  const [skill, setSkill] = useState<SkillId>("add_1_10");
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
  const [openSkinGallery, setOpenSkinGallery] = useState(false);
  const [openExperiments, setOpenExperiments] = useState(false);
  const [openLayoutPreview, setOpenLayoutPreview] = useState(false);

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
    if (!current) return ["add_1_10" as SkillId];
    const list: SkillId[] = [];
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
        <div className="mx-6 mb-6 bg-white/90 rounded-lg p-4 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-center gap-6">
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
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700"
              title="Goo"
            >
              <span className="text-lg">🟡</span>
              <span className="text-lg font-bold">{current?.goo ?? 0}</span>
              <span className="text-sm font-medium">Goo</span>
            </div>

            {/* XP Bar */}
            <div className="flex-1 max-w-48">
              <div className="h-4 w-full rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, (xpInto / Math.max(1, xpNeed)) * 100))}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-emerald-700 text-center">
                Lv {level} → {level + 1} • {Math.max(0, xpNeed - xpInto)} XP to next level
              </div>
            </div>
          </div>
        </div>

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
          <div className="relative space-y-4 rounded-2xl border border-emerald-200 overflow-hidden">
            {/* Local biome just for the playfield (behind slime + question) */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
              <BiomeLayer biome="meadow" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-emerald-700 font-semibold">Streak: {streak}</div>
              <div className="text-emerald-700/80 text-sm">Best: {bestStreak}</div>
            </div>

            <div className="flex items-center justify-center">
              {/* active skin */}
              <Slime skinId={current.settings.activeSkin as any} />
            </div>

            {/* NOTE: QuestionCard has its own gradient background.
               If you want the biome to show through more, make that gradient semi-transparent
               (e.g., from-emerald-100/70 to-lime-100/70) inside QuestionCard. */}
            <QuestionCard
              problem={problem as any}
              disabledSet={disabledSet}
              wrongPick={wrongPick}
              onChoose={onChoose}
            />
          </div>
        )}

        {/* Bottom Controls */}
        <div className="mx-6 mb-6 bg-white/90 rounded-lg p-4 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* Skill Selector */}
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value as SkillId)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-800 text-sm"
              title="Select skill"
            >
              {unlockedSkills.map((id) => (
                <option key={id} value={id}>
                  {SKILLS[id as SkillId]?.label ?? id}
                </option>
              ))}
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
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm"
              title={soundOn ? "Sound on" : "Sound off"}
            >
              {soundOn ? "🔊" : "🔇"}
              <span className="hidden sm:inline">Sound</span>
            </button>

            {/* Shop Button */}
            <button
              onClick={() => setOpenShop(true)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-sm"
              title="Shop"
            >
              🛒
              <span className="hidden sm:inline">Shop</span>
            </button>

            {/* Progress Button */}
            <button
              onClick={() => setOpenProgress(true)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm"
              title="Progress"
            >
              👤
              <span className="hidden sm:inline">Progress</span>
            </button>

            {/* End Session Button */}
            <button
              onClick={() => {
                if (gameState === "playing") endSession();
              }}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm"
              title="End session"
            >
              ⏻
              <span className="hidden sm:inline">End</span>
            </button>
          </div>
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
      />
    )}
    
    {/* Skin Gallery (dev-only feature) */}
    {import.meta.env.DEV && (
      <SkinGallery 
        open={openSkinGallery} 
        onClose={() => setOpenSkinGallery(false)} 
      />
    )}
    
    {/* Experiments (dev-only feature) */}
    {import.meta.env.DEV && (
      <Experiments 
        open={openExperiments} 
        onClose={() => setOpenExperiments(false)} 
      />
    )}
    
    {/* Layout Preview (dev-only feature) */}
    {import.meta.env.DEV && (
      <LayoutPreview 
        open={openLayoutPreview} 
        onClose={() => setOpenLayoutPreview(false)} 
      />
    )}
  </div>
);
}

