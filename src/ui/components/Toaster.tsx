import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ToastItem = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  duration?: number; // ms
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToasts() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToasts must be used inside <ToastProvider />");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback((t: Omit<ToastItem, "id"> & { id?: string }) => {
    const id = t.id || `t_${Math.random().toString(36).slice(2, 9)}`;
    const item: ToastItem = { id, duration: 2500, ...t };
    setToasts((list) => [...list, item]);

    if (item.duration && item.duration > 0) {
      timers.current[id] = window.setTimeout(() => dismiss(id), item.duration);
    }
    return id;
  }, [dismiss]);

  const dismissAll = useCallback(() => {
    Object.values(timers.current).forEach((tid) => window.clearTimeout(tid));
    timers.current = {};
    setToasts([]);
  }, []);

  const value = useMemo(() => ({ push, dismiss, dismissAll }), [push, dismiss, dismissAll]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-2 z-[100] flex flex-col items-center gap-2 px-2">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ y: -20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="pointer-events-auto w-full max-w-md rounded-xl border border-emerald-200 bg-white/95 shadow-lg backdrop-blur p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl select-none">{t.icon ?? "🎉"}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-emerald-900">{t.title}</div>
                    {t.desc && <div className="text-xs text-emerald-700/80">{t.desc}</div>}
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="ml-2 rounded-lg px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

/** Optional helper to show stacked badge toasts */
export function useBadgeToasts() {
  const { push } = useToasts();
  return {
    pushBadge: (opts: { name: string; tier?: "bronze"|"silver"|"gold"|"diamond"; rewardGoo?: number; icon?: React.ReactNode }) => {
      const tierEmoji = opts.tier === "diamond" ? "💎" : opts.tier === "gold" ? "🥇" : opts.tier === "silver" ? "🥈" : opts.tier === "bronze" ? "🥉" : "🎖️";
      const icon = opts.icon ?? tierEmoji;
      const rewardText = opts.rewardGoo ? ` +${opts.rewardGoo} Goo` : "";
      push({
        icon,
        title: `Badge Unlocked: ${opts.name}`,
        desc: [opts.tier ? `Tier: ${capitalize(opts.tier)}` : null, rewardText].filter(Boolean).join(" • "),
        duration: 2600,
      });
    }
  };
}

function capitalize(s: string) { return s.slice(0,1).toUpperCase() + s.slice(1); }


