import type { SkillId } from './types';

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const SKILL_ORDER: SkillId[] = [
  'add_1_10','add_1_20','sub_1_10','sub_1_20','mul_0_5_10','mul_0_10','div_facts','mixed_all'
];

export const SKILLS: Record<SkillId, any> = {
  add_1_10:   { id:'add_1_10', label:'Addition 1–10', op:'add', a:[1,10], b:[1,10], diff:1.00 },
  add_1_20:   { id:'add_1_20', label:'Addition 1–20', op:'add', a:[1,20], b:[1,20], diff:1.10 },
  sub_1_10:   { id:'sub_1_10', label:'Subtraction 1–10', op:'sub', a:[1,10], b:[1,10], diff:1.15 },
  sub_1_20:   { id:'sub_1_20', label:'Subtraction 1–20', op:'sub', a:[1,20], b:[1,20], diff:1.20 },
  mul_0_5_10: { id:'mul_0_5_10', label:'Multiplication basics', op:'mul', a:[0,10], b:[0,10], restrict:(x:number)=>[0,1,2,3,4,5,10].includes(x), diff:1.25 },
  mul_0_10:   { id:'mul_0_10', label:'Multiplication 0–10', op:'mul', a:[0,10], b:[0,10], diff:1.35 },
  div_facts:  { id:'div_facts', label:'Division facts', op:'div', a:[1,10], b:[1,10], diff:1.45 },
  mixed_all:  { id:'mixed_all', label:'Mixed practice', op:'mix', diff:1.50 },
};

export function difficultyMultiplier(skillId: SkillId): number {
  return SKILLS[skillId]?.diff ?? 1;
}

export function makeProblemForSkill(skillId: SkillId) {
  const S = SKILLS[skillId] || SKILLS.add_1_10;
  let a: number, b: number, op: string = S.op;

  if (op === 'mix') {
    const pool: SkillId[] = ['add_1_20','sub_1_20','mul_0_10','div_facts'];
    return makeProblemForSkill(pick(pool));
  }

  const [amin, amax] = S.a || [1,10];
  const [bmin, bmax] = S.b || [1,10];
  const drawA = () => S.restrict ? pick(Array.from({length: amax-amin+1},(_,i)=>i+amin).filter(S.restrict)) : randInt(amin, amax);
  const drawB = () => S.restrict ? pick(Array.from({length: bmax-bmin+1},(_,i)=>i+bmin).filter(S.restrict)) : randInt(bmin, bmax);

  if (op === 'add')      { a = drawA(); b = drawB(); }
  else if (op === 'sub') { a = randInt(bmin, bmax); b = randInt(bmin, Math.min(a, bmax)); }
  else if (op === 'mul') { a = drawA(); b = drawB(); }
  else /* div */         { b = randInt(1,10); const q = randInt(1,10); a = b*q; }

  const answer = op === 'add' ? a + b : op === 'sub' ? a - b : op === 'mul' ? a * b : a / b;

  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const delta = randInt(1,5) * (Math.random() < 0.5 ? -1 : 1);
    if (op === 'div') {
      const candidate = clamp(answer + delta, 0, 100);
      opts.add(candidate);
    } else if (op === 'mul') {
      const slips = [a, b, a + b, a * (b + 1), (a + 1) * b];
      const candidate = clamp(pick(slips) + (Math.random() < 0.5 ? 0 : delta), 0, 200);
      opts.add(candidate);
    } else {
      let candidate = answer + delta;
      // V1: avoid negatives for add/sub
      if (op === 'sub' || op === 'add') candidate = Math.max(0, candidate);
      opts.add(candidate);
    }
  }

  const options = Array.from(opts).slice(0,4).sort(() => Math.random() - 0.5);
  const symbol = op === 'add' ? '+' : op === 'sub' ? '–' : op === 'mul' ? '×' : '÷';
  return { a, b, op, symbol, answer, options };
}



