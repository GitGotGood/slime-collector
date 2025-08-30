import { useEffect, useState } from "react";
import { Palette, Eye, Layout, Blend, Map, BarChart3 } from "lucide-react";

export default function DevPanel({ onOpenSkinGallery, onOpenExperiments, onOpenLayoutPreview, onOpenEdgeBlending, onOpenWorldMap, onOpenProgressDashboard }: { onOpenSkinGallery?: () => void; onOpenExperiments?: () => void; onOpenLayoutPreview?: () => void; onOpenEdgeBlending?: () => void; onOpenWorldMap?: () => void; onOpenProgressDashboard?: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey && !e.altKey) setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [skinsInfo, setSkinsInfo] = useState<{count:number; ids:string[]} | null>(null);
  const [biomeOk, setBiomeOk] = useState<string>("?");
  useEffect(() => {
    (async () => {
      try {
        const m = await import("../assets/skins");
        const ids = Object.keys(m.SKINS ?? {});
        setSkinsInfo({ count: ids.length, ids: ids.slice(0, 8) });
      } catch { setSkinsInfo({ count: 0, ids: [] }); }

      try {
        const b = await import("../assets/biomes");
        setBiomeOk(b && typeof b.BiomeLayer === "function" ? "ok" : "missing");
      } catch { setBiomeOk("missing"); }
    })();
  }, []);

  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-4 z-[9999] rounded-xl border border-emerald-300 bg-white/95 backdrop-blur p-3 text-sm shadow-lg">
      <div className="font-semibold text-emerald-800 mb-2">Slime Collector — Dev</div>
      <div className="space-y-1 text-emerald-700">
        <div>Mode: <b>{import.meta.env.MODE}</b></div>
        <div>Path: <code>{location.pathname || "/"}</code></div>
        <div>BiomeLayer: <b>{biomeOk}</b></div>
        <div>SKINS: <b>{skinsInfo?.count ?? "?"}</b> {skinsInfo?.ids?.length ? `(${skinsInfo.ids.join(", ")})` : ""}</div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          className="rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
          onClick={() => {
            try { localStorage.clear(); alert("localStorage cleared. Reload the page."); }
            catch { alert("Could not clear localStorage."); }
          }}
        >Clear Storage</button>
        <button
          className="rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
          onClick={() => location.reload()}
        >Hard Reload</button>
        {onOpenSkinGallery && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenSkinGallery}
          >
            <Palette className="w-3 h-3" />
            Skin Gallery
          </button>
        )}
        {onOpenExperiments && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenExperiments}
          >
            <Eye className="w-3 h-3" />
            Experiments
          </button>
        )}
        {onOpenLayoutPreview && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenLayoutPreview}
          >
            <Layout className="w-3 h-3" />
            UI Layouts
          </button>
        )}
        {onOpenEdgeBlending && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenEdgeBlending}
          >
            <Blend className="w-3 h-3" />
            Edge Blending
          </button>
        )}
        {onOpenWorldMap && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenWorldMap}
          >
            <Map className="w-3 h-3" />
            World Map
          </button>
        )}
        {onOpenProgressDashboard && (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 hover:bg-emerald-50"
            onClick={onOpenProgressDashboard}
          >
            <BarChart3 className="w-3 h-3" />
            Progress Dashboard
          </button>
        )}
      </div>
      <div className="mt-2 text-[11px] text-emerald-600">Press “D” to toggle</div>
    </div>
  );
}
