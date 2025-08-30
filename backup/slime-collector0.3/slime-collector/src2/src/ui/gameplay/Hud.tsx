import React from "react";
import { Volume2, VolumeX, ShoppingBag, UserCircle2, Power } from "lucide-react";

type Props = {
  lives: number;
  goo: number;
  level: number;
  xpInto: number;
  xpNeed: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenProgress: () => void;
  onEndSession: () => void;
  skill: string;
  onChangeSkill: (id: string) => void;
  unlockedSkills: string[];
  skillLabel: (id: string) => string;
};

const HeartIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 21s-7-4.6-9.5-8.2C.6 9.8 1.7 6.6 4.4 5.6c1.7-.6 3.5-.1 4.7 1.2L12 9.9l2.9-3.1c1.2-1.3 3-1.8 4.7-1.2 2.7 1 3.8 4.2 1.9 7.2C19 16.4 12 21 12 21z"
      strokeWidth="1.2"
      className="stroke-red-600"
    />
  </svg>
);

export default function Hud({
  lives,
  goo,
  level,
  xpInto,
  xpNeed,
  soundOn,
  onToggleSound,
  onOpenShop,
  onOpenProgress,
  onEndSession,
  skill,
  onChangeSkill,
  unlockedSkills,
  skillLabel,
}: Props) {
  const pct = Math.max(0, Math.min(100, (xpInto / Math.max(1, xpNeed)) * 100));
  const xpLeft = Math.max(0, xpNeed - xpInto);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
      {/* Left: lives + goo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" title="Lives">
          {Array.from({ length: 3 }).map((_, i) => (
            <HeartIcon
              key={i}
              className={`w-6 h-6 ${
                i < lives ? "fill-red-500" : "fill-red-200"
              }`}
            />
          ))}
        </div>

        <div
          className="inline-flex items-center gap-1 rounded-xl px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700"
          title="Goo"
        >
          <span className="text-base">🟡</span>
          <span className="text-sm font-semibold">{goo}</span>
          <span className="ml-1 hidden sm:inline text-xs">Goo</span>
        </div>
      </div>

      {/* Middle: XP bar */}
      <div className="px-1 sm:px-2">
        <div className="h-3 w-full rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-[11px] text-emerald-700/80 text-center hidden sm:block">
          Lv {level} → {level + 1} • {xpLeft} XP to next level
          {xpLeft <= 30 ? " • Almost there!" : ""}
        </div>
        <div className="mt-1 text-xs text-emerald-700/80 text-center sm:hidden">
          Lv {level}
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <select
          value={skill}
          onChange={(e) => onChangeSkill(e.target.value)}
          className="h-9 rounded-lg border border-emerald-200 bg-white px-2 text-emerald-800"
          title="Select skill"
        >
          {unlockedSkills.map((id) => (
            <option key={id} value={id}>
              {skillLabel(id)}
            </option>
          ))}
        </select>

        <button
          onClick={onToggleSound}
          className="h-9 inline-flex items-center justify-center rounded-lg px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
          aria-label={soundOn ? "Sound on" : "Sound off"}
          title={soundOn ? "Sound on" : "Sound off"}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenShop}
          className="h-9 inline-flex items-center gap-2 rounded-lg px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
          title="Shop"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="hidden sm:inline">Shop</span>
        </button>

        <button
          onClick={onOpenProgress}
          className="h-9 inline-flex items-center gap-2 rounded-lg px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
          title="Progress"
        >
          <UserCircle2 className="w-5 h-5" />
          <span className="hidden sm:inline">Progress</span>
        </button>

        <button
          onClick={onEndSession}
          className="h-9 inline-flex items-center gap-2 rounded-lg px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
          title="End session"
        >
          <Power className="w-5 h-5" />
          <span className="hidden sm:inline">End</span>
        </button>
      </div>
    </div>
  );
}
