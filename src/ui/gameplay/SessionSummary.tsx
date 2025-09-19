import React, { useState, useEffect, useMemo } from "react";
import Dialog from "../components/Dialog";
import GooPill from "../components/GooPill";
import ProgressBar from "../components/ProgressBar";
import { levelFromTotalXP } from "../../core/progression";

export default function SessionSummary({
  open,
  onClose,
  onPlayAgain,
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
  currentTotalXP,
  sessionCorrect,
  sessionAttempts,
  useAlternativeView = false,
}: {
  open: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
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
  currentTotalXP: number;
  sessionCorrect: number;
  sessionAttempts: number;
  useAlternativeView?: boolean;
}) {
  // Animation state
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedGoo, setAnimatedGoo] = useState(0);
  const [animatedXPProgress, setAnimatedXPProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // Key to force re-animation
  const [showMessage, setShowMessage] = useState(false); // Control when message appears

  // Calculate session accuracy and speed
  const sessionAccuracy = sessionAttempts > 0 ? Math.round((sessionCorrect / sessionAttempts) * 100) : 0;
  const sessionSpeed = sessionAttempts > 0 ? Math.round((gooSpeed / sessionAttempts) * 10) / 10 : 0; // Rough estimate using gooSpeed

  // Memoize motivational message so it only calculates once per session
  const motivationalMessage = useMemo(() => {
    const messages = {
      greatJob: [
        "Great job!",
        `Great job! ${sessionAccuracy}%—sticky-accurate and smooth.`,
        "Bullseye brain—nice work!",
        "Sharp and steady. Your aim's on point."
      ],
      keepPracticing: [
        "Keep practicing!",
        "Keep practicing—every squish grows the skill.",
        "Tough set. Small steps → big wins.",
        "Misses are data! Calm pace next run."
      ],
      niceStreak: [
        "Nice streak!",
        `Nice streak! ${bestStreak} in a row—on a roll.`,
        `Combo maker: ${bestStreak} correct—keep the flow.`,
        `Hot streak unlocked—${bestStreak} sticky hits!`
      ],
      speedDemon: [
        "Speed demon!",
        `Speed demon! Avg ${sessionSpeed}s—zoom-slime engaged.`,
        "Lightning answers—save some ooze for the rest of us!",
        `Turbo brain: you melted the clock (${sessionSpeed}s).`
      ]
    };

    // Determine message category (priority order)
    if (sessionAccuracy >= 80) {
      return messages.greatJob[Math.floor(Math.random() * messages.greatJob.length)];
    } else if (sessionAccuracy < 70) {
      return messages.keepPracticing[Math.floor(Math.random() * messages.keepPracticing.length)];
    } else if (bestStreak >= 10) {
      return messages.niceStreak[Math.floor(Math.random() * messages.niceStreak.length)];
    } else if (sessionSpeed <= 2) {
      return messages.speedDemon[Math.floor(Math.random() * messages.speedDemon.length)];
    }

    // Default message
    return "Keep practicing to raise streaks and speed bonuses ✨";
  }, [sessionAccuracy, sessionSpeed, bestStreak]); // Only recalculate when these values change

  // Start animations when modal opens
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      setAnimatedXP(0);
      setAnimatedGoo(0);
      setShowMessage(false); // Reset message visibility
      
      // Calculate starting XP progress
      const startTotalXP = currentTotalXP - runXP;
      const startLevelData = levelFromTotalXP(startTotalXP);
      setAnimatedXPProgress(startLevelData.xpInto);
      
      // Animate XP over 1.3 seconds
      const xpDuration = 1300;
      const xpSteps = 60; // 60 steps for smooth animation
      const xpStepTime = xpDuration / xpSteps;
      const xpStepSize = runXP / xpSteps;
      
      let xpStep = 0;
      const xpInterval = setInterval(() => {
        xpStep++;
        setAnimatedXP(Math.min(runXP, Math.round(xpStep * xpStepSize)));
        
        if (xpStep >= xpSteps) {
          clearInterval(xpInterval);
          setAnimatedXP(runXP);
        }
      }, xpStepTime);
      
      // Animate XP progress bar over 1.3 seconds (same as XP)
      const xpProgressInterval = setInterval(() => {
        const progress = xpStep / xpSteps;
        const currentTotalXPAnimated = startTotalXP + (runXP * progress);
        const currentLevelData = levelFromTotalXP(currentTotalXPAnimated);
        setAnimatedXPProgress(currentLevelData.xpInto);
        
        if (xpStep >= xpSteps) {
          clearInterval(xpProgressInterval);
          setAnimatedXPProgress(xpInto);
        }
      }, xpStepTime);
      
      // Animate Goo over 1.0 seconds (starts AFTER XP finishes)
      setTimeout(() => {
        const gooDuration = 1000;
        const gooSteps = 50; // 50 steps for smooth animation
        const gooStepTime = gooDuration / gooSteps;
        const gooStepSize = runGoo / gooSteps;
        
        let gooStep = 0;
        const gooInterval = setInterval(() => {
          gooStep++;
          setAnimatedGoo(Math.min(runGoo, Math.round(gooStep * gooStepSize)));
          
          if (gooStep >= gooSteps) {
            clearInterval(gooInterval);
            setAnimatedGoo(runGoo);
            setIsAnimating(false);
            // Show message after Goo animation completes
            setTimeout(() => setShowMessage(true), 100);
          }
        }, gooStepTime);
      }, 1300); // Start goo animation AFTER XP finishes (1300ms)
      
      // Cleanup function
      return () => {
        clearInterval(xpInterval);
        clearInterval(xpProgressInterval);
      };
    }
  }, [open, runXP, runGoo, currentTotalXP, xpInto, animationKey]);
  if (useAlternativeView) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        title={
          <div className="flex items-center justify-between w-full">
            <span>Session Summary</span>
            <button
              onClick={() => setAnimationKey(prev => prev + 1)}
              className="text-sm text-emerald-600 hover:text-emerald-700 underline"
            >
              Replay Animation
            </button>
          </div>
        } 
        maxWidth="max-w-2xl" 
        footer={
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={onPlayAgain} 
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
            >
              Play Again
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">Close</button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* XP and Goo Cards - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* XP Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="text-emerald-800 font-semibold mb-3">XP Earned</div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                +<span className={`transition-all duration-100 ${isAnimating ? 'text-emerald-500' : 'text-emerald-600'}`}>
                  {animatedXP}
                </span>
              </div>
              <div className="text-sm text-emerald-700/80">
                Level {levelBefore} → <span className="font-semibold text-emerald-800">{levelAfter}</span>
              </div>
            </div>

            {/* Goo Card */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
              <div className="text-amber-800 font-semibold mb-3">Goo Collected</div>
              <div className="text-4xl font-bold text-amber-600 mb-2">
                <span className={`transition-all duration-100 ${isAnimating ? 'text-amber-500' : 'text-amber-600'}`}>
                  {animatedGoo}
                </span>
              </div>
              <div className="text-xs text-amber-700/80 space-y-1">
                <div>Base: {gooBase}</div>
                <div>Streak: +{gooStreak}</div>
                <div>Speed: +{gooSpeed}</div>
              </div>
            </div>
          </div>

          {/* Motivational Message - Always reserve space */}
          <div className="text-center h-8 flex items-center justify-center">
            <div className={`text-lg font-semibold text-emerald-700 ${
              showMessage ? 'opacity-100' : 'opacity-0'
            }`} style={{
              transform: showMessage ? 'scale(1)' : 'scale(1.5)',
              animation: showMessage ? 'bounceIn 0.8s ease-out forwards, pulse 2s ease-in-out 0.8s infinite' : 'none'
            }}>
              {motivationalMessage}
            </div>
          </div>
          
          {/* Custom bounce animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes bounceIn {
                0% {
                  transform: scale(1.5);
                  opacity: 0;
                }
                50% {
                  transform: scale(1);
                  opacity: 1;
                }
                75% {
                  transform: scale(1.25);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `
          }} />

          {/* Highlights Section */}
          <div className="text-emerald-800 font-semibold">Highlights</div>
          <ul className="list-disc list-inside text-sm text-emerald-700/90 space-y-1">
            <li>Best streak: <span className="font-semibold text-emerald-800">{bestStreak}</span></li>
            <li>Keep practicing to raise streaks and speed bonuses ✨</li>
          </ul>
        </div>
      </Dialog>
    );
  }

  // Original view
  return (
    <Dialog open={open} onClose={onClose} title="Session Summary" maxWidth="max-w-xl" footer={
      <div className="flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Close</button>
      </div>
    }>
      <div className="space-y-3">
        <div className="text-emerald-800 font-semibold">XP</div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="text-sm text-emerald-800">
            +<span className={`transition-all duration-100 ${isAnimating ? 'text-emerald-600' : 'text-emerald-800'}`}>
              {animatedXP}
            </span> XP this run
          </div>
          <div className="space-y-1">
            <div className="h-3 w-full rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-100" 
                style={{ width: `${Math.max(0, Math.min(100, (animatedXPProgress / Math.max(1, xpNeed)) * 100))}%` }} 
              />
            </div>
            <div className="text-[11px] text-emerald-700/80 text-center">
              Lv {levelAfter} → {levelAfter + 1} • {Math.max(0, xpNeed - animatedXPProgress)} XP to next level
            </div>
          </div>
          <div className="text-xs text-emerald-700/80">
            Level {levelBefore} → <span className="font-semibold text-emerald-800">{levelAfter}</span>
          </div>
        </div>

        <div className="text-emerald-800 font-semibold">Goo</div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center justify-between">
            <GooPill value={animatedGoo} />
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



