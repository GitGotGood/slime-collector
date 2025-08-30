import React from "react";
import { X } from "lucide-react";

export default function Dialog({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g., "max-w-md", "max-w-xl"
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-[2px] p-3">
      <div className={`w-full ${maxWidth} rounded-2xl border border-emerald-200 bg-white shadow-xl`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-100">
          <div className="text-lg font-extrabold text-emerald-800">{title}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-emerald-100 bg-emerald-50/40">{footer}</div>}
      </div>
    </div>
  );
}



