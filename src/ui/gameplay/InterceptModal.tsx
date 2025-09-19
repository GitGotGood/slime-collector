import React from "react";
import Dialog from "../components/Dialog";

interface InterceptModalProps {
  open: boolean;
  onTakeBreak: () => void;
  onKeepPlaying: () => void;
}

export default function InterceptModal({ open, onTakeBreak, onKeepPlaying }: InterceptModalProps) {
  return (
    <Dialog
      open={open}
      title="Whoa! Your slime is dizzy!"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-gray-700 text-center">
          Those were super fast answers. Do you want to take a break or keep playing?
        </p>
        
        <div className="text-sm text-gray-500 text-center">
          We won't count those 3 turbo taps.
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            onClick={onTakeBreak}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Take A Break
          </button>
          <button
            onClick={onKeepPlaying}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </Dialog>
  );
}

