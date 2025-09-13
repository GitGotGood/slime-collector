// V1 Core Curriculum: K→5 Linear Path (25 Skills)
import type { SkillDef, SkillID, Problem } from './types';

// ---- Utilities
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const ri = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(a: T[]) => a.sort(() => Math.random() - 0.5);

function mc4(correct: number, near: number[] = [], lo = 0, hi = 999): number[] {
  const s = new Set<number>([correct]);
  
  // Add the "near" distractors that were suggested
  near.forEach(v => {
    const clamped = clamp(v, lo, hi);
    if (s.size < 4) s.add(clamped);
  });
  
  // Fill remaining slots with random distractors
  while (s.size < 4) {
    const offset = ri(1, 8);
    const distractor = clamp(correct + (Math.random() < 0.5 ? -offset : offset), lo, hi);
    s.add(distractor);
  }
  
  // Convert to array and shuffle, but ensure we don't lose the correct answer
  const result = shuffle(Array.from(s));
  
  // Safety check: ensure correct answer is included
  if (!result.includes(correct)) {
    // Replace a random distractor with the correct answer
    result[ri(0, result.length - 1)] = correct;
  }
  
  return result.slice(0, 4);
}

// ---- Generators (numeric-only answers in V1)
function g_add_1_10(): Problem {
  const a = ri(1, 10), b = ri(1, 10), ans = a + b;
  return {
    a, b, op: '+',
    answer: ans,
    options: mc4(ans, [ans - 1, ans + 1, a, b], 0, 40)
  };
}

function g_add_1_20(): Problem {
  const a = ri(1, 20), b = ri(1, 20), ans = a + b;
  return {
    a, b, op: '+',
    answer: ans,
    options: mc4(ans, [ans - 1, ans + 1, a + b - 2, a + b + 2], 0, 80)
  };
}

function g_sub_1_10(): Problem {
  const c = ri(1, 10), b = ri(0, c), ans = c - b;
  return {
    a: c, b, op: '-',
    answer: ans,
    options: mc4(ans, [ans - 1, ans + 1, c, b], 0, 10)
  };
}

function g_sub_1_20(): Problem {
  const c = ri(1, 20), b = ri(0, c), ans = c - b;
  return {
    a: c, b, op: '-',
    answer: ans,
    options: mc4(ans, [ans - 1, ans + 1, c - 1, b + 1], 0, 20)
  };
}

function g_mixed_20(): Problem {
  return Math.random() < 0.5 ? g_add_1_20() : g_sub_1_20();
}

function g_missing_20(): Problem {
  // a + x = c  OR  c - x = b
  if (Math.random() < 0.5) {
    const a = ri(1, 20), c = ri(a, a + 20), x = c - a;
    return { text: `${a} + ☐ = ${c}`, answer: x, options: mc4(x, [x - 1, x + 1, a, c], 0, 40) };
    } else {
    const c = ri(1, 20), b = ri(0, c), x = c - b;
    return { text: `${c} - ☐ = ${b}`, answer: x, options: mc4(x, [x - 1, x + 1, b, c], 0, 20) };
  }
}

function g_mul_0_5_10(): Problem {
  const allowed = [0, 1, 2, 3, 4, 5, 10];
  const a = pick(allowed), b = pick(allowed), ans = a * b;
  const slips = [a + b, a * (b + 1), (a + 1) * b];
  return { a, b, op: '×', answer: ans, options: mc4(ans, slips, 0, 200) };
}

function g_mul_0_10(): Problem {
  const a = ri(0, 10), b = ri(0, 10), ans = a * b;
  const slips = [a + b, a * (b + 1), (a + 1) * b];
  return { a, b, op: '×', answer: ans, options: mc4(ans, slips, 0, 200) };
}

function g_div_facts(): Problem {
  // Whole-number quotients only in V1
  const b = ri(1, 10), q = ri(0, 10), a = b * q, ans = a / b;
  const slips = [q + 1, q - 1, b + q];
  return { a, b, op: '÷', answer: ans, options: mc4(ans, slips, 0, 100) };
}

function g_add_3digit(): Problem {
  const a = ri(100, 999), b = ri(100, 999), ans = a + b;
  const slips = [ans - 10, ans + 10, a + b - 100, a + b + 100];
  return { a, b, op: '+', answer: ans, options: mc4(ans, slips, 0, 1998) };
}

function g_sub_3digit(): Problem {
  const a = ri(200, 999), b = ri(100, a), ans = a - b;
  const slips = [ans - 10, ans + 10, a - (b - 10)];
  return { a, b, op: '-', answer: ans, options: mc4(ans, slips, 0, 999) };
}

function g_sub_3digit_triple(): Problem {
  // Triple digit subtraction with larger ranges
  const a = ri(300, 999), b = ri(150, a), ans = a - b;
  const slips = [ans - 100, ans + 100, a - (b - 100), a - (b + 100)];
  return { a, b, op: '-', answer: ans, options: mc4(ans, slips, 0, 999) };
}

function g_sub_4digit_quad(): Problem {
  // Quadruple digit subtraction
  const a = ri(2000, 9999), b = ri(1000, a), ans = a - b;
  const slips = [ans - 1000, ans + 1000, a - (b - 1000), a - (b + 1000)];
  return { a, b, op: '-', answer: ans, options: mc4(ans, slips, 0, 9999) };
}

function g_mul_1d_x_2_3d(): Problem {
  const a = ri(2, 9), b = ri(12, 999), ans = a * b;
  const slips = [(a + 1) * b, a * (b + 1), a * (b - 1)];
  return { a, b, op: '×', answer: ans, options: mc4(ans, slips, 0, 9999) };
}

function g_mul_2d_intro(): Problem {
  // Friendly numbers only (ends with 0/5; small products)
  const pool = [12, 15, 20, 25, 30, 40, 45, 50, 60];
  const a = pick(pool), b = pick(pool), ans = a * b;
  const slips = [(a + 5) * b, a * (b + 5), a * b - 10];
  return { a, b, op: '×', answer: ans, options: mc4(ans, slips, 0, 5000) };
}

function g_longdiv_1d(): Problem {
  // V1: exact division ONLY (no remainders; remainder version in V1.1)
  const d = ri(2, 9), q = ri(10, 499), a = d * q, ans = q;
  const slips = [q + 1, q - 1, q + 10];
  return { a, b: d, op: '÷', answer: ans, options: mc4(ans, slips, 0, 9999) };
}

function g_frac_basic(): Problem {
  // Identify numerator/denominator from text (numeric answer = correct numerator for a / denominator, simplified)
  const den = pick([2, 3, 4, 5, 6, 8, 10, 12]);
  const num = ri(1, Math.min(den - 1, 5));
  // Ask: "How many parts are shaded if we take num/den?" -> returns num
  const ans = num;
  return { text: `Shade count in ${num}/${den}`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, den - ans], 0, den) };
}

function g_frac_equiv(): Problem {
  const den = pick([2, 3, 4, 5, 6, 8, 10, 12]);
  const num = ri(1, den - 1);
  const k = pick([2, 3, 4]);
  const ans = num * k; // correct numerator for / (den*k)
  return { text: `x/${den * k} equivalent to ${num}/${den}`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, num], 0, den * k) };
}

function g_frac_add_like(): Problem {
  const den = pick([2, 3, 4, 5, 6, 8, 10, 12]);
  const a = ri(1, den - 1), b = ri(1, den - 1);
  const ans = a + b;
  return { text: `${a}/${den} + ${b}/${den}`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, den], 0, 2 * den) };
}

function g_frac_sub_like(): Problem {
  const den = pick([2, 3, 4, 5, 6, 8, 10, 12]);
  const a = ri(1, den - 1), b = ri(0, a);
  const ans = a - b;
  return { text: `${a}/${den} - ${b}/${den}`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, b], 0, den) };
}

function g_frac_whole_mult(): Problem {
  const den = pick([2, 3, 4, 5, 8, 10]);
  const num = ri(1, den - 1);
  const n = ri(2, 9);
  const ans = num * n; // numerator of (num/den)*n with same den
  return { text: `(${num}/${den}) × ${n}`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, den], 0, den * 9) };
}

function g_dec_place(): Problem {
  // Identify place value; numeric answer: the digit at place (0-9)
  const digits = [ri(1, 9), ri(0, 9), ri(0, 9)];
  const val = parseFloat(`${digits[0]}.${digits[1]}${digits[2]}`);
  const pickPlace = pick(['tenths', 'hundredths']);
  const ans = pickPlace === 'tenths' ? digits[1] : digits[2];
  return { text: `In ${val.toFixed(2)}, what is the ${pickPlace} digit?`, answer: ans, options: mc4(ans, [ans - 1, ans + 1, 0], 0, 9) };
}

function g_dec_addsub(): Problem {
  const a = parseFloat((ri(10, 999) / 10).toFixed(1));
  const b = parseFloat((ri(10, 999) / 10).toFixed(1));
  const add = Math.random() < 0.5;
  const ans = parseFloat((add ? a + b : a - b).toFixed(1));
  const near = [parseFloat((ans + 0.1).toFixed(1)), parseFloat((ans - 0.1).toFixed(1))];
  return { text: `${a.toFixed(1)} ${add ? '+' : '-'} ${b.toFixed(1)}`, answer: ans, options: mc4(ans, near, -999, 999) };
}

function g_order_ops(): Problem {
  // (a + b) × c vs a + (b × c)
  const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
  const ans = (a + b) * c;
  const lure = a + (b * c);
  return { text: `(${a} + ${b}) × ${c}`, answer: ans, options: mc4(ans, [lure, ans - 1, ans + 1], 0, 999) };
}

function g_powers10(): Problem {
  const base = parseFloat((ri(10, 999) / 10).toFixed(1));
  const pow = pick([10, 100, 1000]);
  const mult = Math.random() < 0.5;
  const ans = parseFloat((mult ? base * pow : base / pow).toFixed(1));
  const near = [parseFloat((ans + 1).toFixed(1)), parseFloat((ans - 1).toFixed(1))];
  return { text: `${mult ? '×' : '÷'} ${pow} → ${base.toFixed(1)}`, answer: ans, options: mc4(ans, near, -9999, 9999) };
}

function g_volume_rect(): Problem {
  const L = ri(2, 9), W = ri(2, 9), H = ri(2, 9), ans = L * W * H;
  const lure = L * W; // area trap
  return { text: `Volume of ${L}×${W}×${H}`, answer: ans, options: mc4(ans, [lure, ans + 1, ans - 1], 0, 999) };
}

function g_coord_plane(): Problem {
  const x = ri(0, 9), y = ri(0, 9);
  const ans = x * 10 + y; // encode as 10x+y for numeric option
  // UI decodes `Math.floor(opt/10), opt%10` for preview (optional), but V1 just shows text
  return { text: `Point at (${x}, ${y}) → encode 10x+y`, answer: ans, options: mc4(ans, [(x + 1) * 10 + y, x * 10 + (y + 1)], 0, 99) };
}

function g_word_multi(): Problem {
  // simple two-step: (a×b)+c or (a×b)-c
  const a = ri(2, 9), b = ri(2, 9), c = ri(1, 20);
  const add = Math.random() < 0.5;
  const ans = add ? a * b + c : a * b - c;
  return { text: `Story: ${a} groups of ${b} ${add ? '+' : '-'} ${c}`, answer: ans, options: mc4(ans, [a + b + c, a * b, ans + 2]) };
}

// ---- Registry
export const SKILLS: Record<SkillID, SkillDef> = {
  add_1_10: { id: 'add_1_10', label: 'Addition 1–10', diff: 1.00, kind: 'add', gen: g_add_1_10 },
  add_1_20: { id: 'add_1_20', label: 'Addition 1–20', diff: 1.10, kind: 'add', gen: g_add_1_20 },
  sub_1_10: { id: 'sub_1_10', label: 'Subtraction 1–10', diff: 1.15, kind: 'sub', gen: g_sub_1_10 },
  sub_1_20: { id: 'sub_1_20', label: 'Subtraction 1–20', diff: 1.20, kind: 'sub', gen: g_sub_1_20 },
  mixed_20: { id: 'mixed_20', label: 'Mixed +/− to 20', diff: 1.20, kind: 'mixed', gen: g_mixed_20 },
  missing_20: { id: 'missing_20', label: 'Find the Missing', diff: 1.25, kind: 'missing', gen: g_missing_20 },
  mul_0_5_10: { id: 'mul_0_5_10', label: 'Multiplication Basics', diff: 1.25, kind: 'mul', gen: g_mul_0_5_10 },
  mul_0_10: { id: 'mul_0_10', label: 'Multiplication Facts', diff: 1.35, kind: 'mul', gen: g_mul_0_10 },
  div_facts: { id: 'div_facts', label: 'Division Facts', diff: 1.45, kind: 'div', gen: g_div_facts },
  add_3digit: { id: 'add_3digit', label: 'Add 3-Digit', diff: 1.55, kind: 'multi-digit', gen: g_add_3digit },
  sub_3digit: { id: 'sub_3digit', label: 'Subtract 3-Digit', diff: 1.55, kind: 'multi-digit', gen: g_sub_3digit },
  sub_3digit_triple: { id: 'sub_3digit_triple', label: 'Triple Digit Subtraction', diff: 1.60, kind: 'multi-digit', gen: g_sub_3digit_triple },
  sub_4digit_quad: { id: 'sub_4digit_quad', label: 'Quadruple Digit Subtraction', diff: 1.65, kind: 'multi-digit', gen: g_sub_4digit_quad },
  mul_1d_x_2_3d: { id: 'mul_1d_x_2_3d', label: '1-digit × Multi', diff: 1.65, kind: 'mul', gen: g_mul_1d_x_2_3d },
  mul_2d_intro: { id: 'mul_2d_intro', label: '2-digit × 2-digit (Intro)', diff: 1.75, kind: 'mul', gen: g_mul_2d_intro },
  longdiv_1d: { id: 'longdiv_1d', label: 'Long Division (÷1-digit, exact)', diff: 1.85, kind: 'div', gen: g_longdiv_1d },
  frac_basic: { id: 'frac_basic', label: 'Fractions: Basics', diff: 1.70, kind: 'fractions', gen: g_frac_basic },
  frac_equiv: { id: 'frac_equiv', label: 'Fractions: Equivalence', diff: 1.80, kind: 'fractions', gen: g_frac_equiv },
  frac_add_like: { id: 'frac_add_like', label: 'Add Like Denominators', diff: 1.85, kind: 'fractions', gen: g_frac_add_like },
  frac_sub_like: { id: 'frac_sub_like', label: 'Subtract Like Denominators', diff: 1.85, kind: 'fractions', gen: g_frac_sub_like },
  frac_whole_mult: { id: 'frac_whole_mult', label: 'Fraction × Whole', diff: 1.95, kind: 'fractions', gen: g_frac_whole_mult },
  dec_place: { id: 'dec_place', label: 'Decimal Place Value', diff: 1.75, kind: 'decimals', gen: g_dec_place },
  dec_addsub: { id: 'dec_addsub', label: 'Add/Sub Decimals', diff: 1.90, kind: 'decimals', gen: g_dec_addsub },
  order_ops: { id: 'order_ops', label: 'Order of Operations', diff: 2.00, kind: 'order', gen: g_order_ops },
  powers10: { id: 'powers10', label: '×/÷ by 10,100,1000', diff: 1.95, kind: 'powers', gen: g_powers10 },
  volume_rect: { id: 'volume_rect', label: 'Volume (Rect Prisms)', diff: 1.90, kind: 'geom', gen: g_volume_rect },
  coord_plane: { id: 'coord_plane', label: 'Coordinate Plane (Q1)', diff: 1.80, kind: 'coord', gen: g_coord_plane },
  word_multi: { id: 'word_multi', label: 'Multi-step Word Ops', diff: 2.05, kind: 'word', gen: g_word_multi },
};

export function makeProblemForSkill(id: SkillID): Problem {
  return SKILLS[id]?.gen() ?? SKILLS.add_1_10.gen();
}

export function difficultyMultiplier(id: SkillID): number {
  return SKILLS[id]?.diff ?? 1;
}

export const SKILL_ORDER: SkillID[] = [
  'add_1_10', 'add_1_20',
  'sub_1_10', 'sub_1_20',
  'mixed_20',
  'mul_0_5_10', 'mul_0_10', 'div_facts',
  'add_3digit', 'sub_3digit',
  'sub_3digit_triple', 'sub_4digit_quad', // NEW: Enable by default for release
  'mul_1d_x_2_3d', 'mul_2d_intro', 'longdiv_1d',
  'frac_basic', 'frac_equiv', 'frac_add_like', 'frac_sub_like', 'frac_whole_mult',
  'dec_place', 'dec_addsub',
  'order_ops', 'powers10',
  'volume_rect', 'coord_plane', 'word_multi'
];
