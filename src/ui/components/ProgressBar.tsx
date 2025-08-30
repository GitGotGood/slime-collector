import React from "react";

export default function ProgressBar({
  level,
  xpInto,
  xpNeed,
  showHint = true,
  className = "",
}: {
  level: number;
  xpInto: number;
  xpNeed: number;
  showHint?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (xpInto / xpNeed) * 100));
  const left = Math.max(0, xpNeed - xpInto);
  const hint = showHint && left <= 30 ? " • Almost there!" : "";

  return (
    <div className={className}>
      <div className="h-3 w-full rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-emerald-700/80 text-center">
        Lv {level} → {level + 1} • {left} XP to next level{hint}
      </div>
    </div>
  );
}



