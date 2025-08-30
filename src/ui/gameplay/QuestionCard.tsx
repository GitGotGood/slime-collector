import { motion } from "framer-motion";

export interface Problem {
  a?: number;
  b?: number;
  symbol?: string;  // legacy support
  op?: '+'|'-'|'×'|'÷';  // new format
  text?: string;    // for word problems
  answer: number;
  options: number[];
}

export default function QuestionCard({
  problem,
  disabledSet,
  wrongPick,
  onChoose,
}: {
  problem: Problem;
  disabledSet: Set<number>;
  wrongPick: number | null;
  onChoose: (value: number) => void;
}) {
  return (
    <div className="relative rounded-2xl p-6 sm:p-8 pb-8">
      <div className="text-center">
        <div className="text-5xl sm:text-6xl font-black text-emerald-800 drop-shadow-sm select-none">
          {problem.text ? (
            // Word problems or custom text
            <div className="text-3xl sm:text-4xl leading-tight">
              {problem.text}
            </div>
          ) : (
            // Standard arithmetic problems
            <>
              {problem.a} <span className="text-emerald-600">{problem.op || problem.symbol}</span> {problem.b}{" "}
              <span className="text-emerald-600">=</span> ?
            </>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {problem.options.map((opt) => {
            const disabled = disabledSet.has(opt);
            const isWrong = wrongPick === opt;
            return (
              <motion.button
                key={opt}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  if (!disabled) onChoose(opt);
                }}
                className={`rounded-2xl border px-4 py-5 sm:py-6 text-3xl font-extrabold shadow transition select-none ${
                  disabled
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-emerald-200 text-emerald-800 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}



