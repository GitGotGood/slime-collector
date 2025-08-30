import { useRef } from 'react';

export function useSounds(enabled = true) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = () => {
    if (!enabled) return null;
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  };

  const blip = (freq = 600, duration = 0.12, type: OscillatorType = 'sine', when = 0, gainStart = 0.2) => {
    const ctx = ensureCtx(); if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainStart, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + duration + 0.02);
  };

  // Distinct cues
  const success = () => { blip(660, 0.09, 'triangle', 0, 0.15); blip(880, 0.09, 'triangle', 0.08, 0.13); blip(1320, 0.12, 'triangle', 0.16, 0.12); };
  const fail    = () => { blip(300, 0.12, 'sawtooth', 0, 0.12); blip(220, 0.12, 'sawtooth', 0.1, 0.1); blip(180, 0.14, 'sawtooth', 0.2, 0.08); };
  const pop     = () => { blip(500, 0.06, 'square',   0, 0.08); };
  const speed1  = () => { blip(880, 0.07, 'sine',     0, 0.12); };
  const speed2  = () => { blip(1175, 0.07, 'sine',    0, 0.12); blip(1760, 0.07, 'sine', 0.08, 0.12); };
  const streakChime = () => { blip(520, 0.08, 'triangle', 0, 0.14); blip(780, 0.08, 'triangle', 0.07, 0.14); blip(1040, 0.10, 'triangle', 0.14, 0.14); };
  const levelUp = () => { blip(523.25, 0.08, 'sawtooth', 0, 0.18); blip(659.25, 0.08, 'triangle', 0.08, 0.18); blip(783.99, 0.10, 'sine', 0.16, 0.18); blip(1046.5, 0.12, 'sine', 0.28, 0.18); };

  return { success, fail, pop, speed1, speed2, streakChime, levelUp, ensureCtx };
}



