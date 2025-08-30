import React from "react";
import type { RootState } from "../../core/types";

export default function ProfilePicker({
  open,
  state,
  onPick,
  onNew,
  onClose,
}: {
  open: boolean;
  state: RootState;
  onPick: (id: string) => void;
  onNew: () => void;
  onClose?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-white/90 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-extrabold text-emerald-800">Choose Player</div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Close
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {state.profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className="rounded-xl border border-emerald-200 bg-white p-3 hover:bg-emerald-50 text-center"
            >
              <div className="w-10 h-10 mx-auto rounded-full" style={{ background: p.color }} />
              <div className="mt-1 font-semibold text-emerald-800 text-sm">{p.name}</div>
              <div className="text-[11px] text-emerald-700/80">Lv {p.level} • 🟡 {p.goo}</div>
            </button>
          ))}
          <button
            onClick={onNew}
            className="rounded-xl border border-dashed border-emerald-300 p-3 text-emerald-700 hover:bg-emerald-50"
          >
            + New
          </button>
        </div>
      </div>
    </div>
  );
}



