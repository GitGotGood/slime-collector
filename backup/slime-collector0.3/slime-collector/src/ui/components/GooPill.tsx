import React from "react";

export default function GooPill({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xl px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 ${className}`}
      title="Goo"
    >
      <span aria-hidden>🟡</span>
      <span className="text-sm font-semibold">{value} Goo</span>
    </span>
  );
}



