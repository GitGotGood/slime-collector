import React from "react";
import UnifiedSlimeRenderer from "../ui/components/UnifiedSlimeRenderer";
import { SKINS } from "../assets/skins";

function getParam(name: string, def?: string) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) ?? def ?? "";
}

export default function GoldensRoute() {
  const id = getParam("id", "moss");
  const size = parseInt(getParam("size", "128"), 10) || 128;
  const scale = Math.max(0.5, Math.min(3, parseFloat(getParam("scale", "1")) || 1));

  // disable bobbing/motion for stable snapshots
  const bobDuration = 0; // renderer treats 0 as still
  const bobDelay = 0;

  const exists = !!SKINS[id];

  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
      {exists ? (
        <UnifiedSlimeRenderer skinId={id} scale={scale} bobDuration={bobDuration} bobDelay={bobDelay} />
      ) : (
        <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#ef4444" }}>Unknown id: {id}</div>
      )}
    </div>
  );
}


