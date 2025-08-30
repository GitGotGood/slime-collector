import React from "react";
import Dialog from "../components/Dialog";
import GooPill from "../components/GooPill";
import ProgressBar from "../components/ProgressBar";

export default function SessionSummary({
  open,
  onClose,
  levelBefore,
  levelAfter,
  xpInto,
  xpNeed,
  runXP,
  runGoo,
  gooBase,
  gooStreak,
  gooSpeed,
  bestStreak,
}: {
  open: boolean;
  onClose: () => void;
  levelBefore: number;
  levelAfter: number;
  xpInto: number;
  xpNeed: number;
  runXP: number;
  runGoo: number;
  gooBase: number;
  gooStreak: number;
  gooSpeed: number;
  bestStreak: number;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Session Summary" maxWidth="max-w-xl" footer={
      <div className="flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Close</button>
      </div>
    }>
      <div className="space-y-3">
        <div className="text-emerald-800 font-semibold">XP</div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="text-sm text-emerald-800">+{runXP} XP this run</div>
          <ProgressBar level={levelAfter} xpInto={xpInto} xpNeed={xpNeed} showHint={false} />
          <div className="text-xs text-emerald-700/80">
            Level {levelBefore} → <span className="font-semibold text-emerald-800">{levelAfter}</span>
          </div>
        </div>

        <div className="text-emerald-800 font-semibold">Goo</div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center justify-between">
            <GooPill value={runGoo} />
            <div className="text-xs text-amber-700/80">Base {gooBase} • Streak {gooStreak} • Speed {gooSpeed}</div>
          </div>
        </div>

        <div className="text-emerald-800 font-semibold">Highlights</div>
        <ul className="list-disc list-inside text-sm text-emerald-700/90">
          <li>Best streak: <span className="font-semibold text-emerald-800">{bestStreak}</span></li>
          <li>Keep practicing to raise streaks and speed bonuses ✨</li>
        </ul>
      </div>
    </Dialog>
  );
}



