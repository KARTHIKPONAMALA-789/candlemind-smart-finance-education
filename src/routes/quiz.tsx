import { RoleGuard } from "@/components/auth/RoleGuard";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trophy, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { quizzes } from "@/lib/mock-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz — CandleMind" }] }),
  component: () => <RoleGuard allow={["student"]}><Quiz /></RoleGuard>,
});

function Quiz() {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = quizzes[i];

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 >= quizzes.length) setDone(true);
      else { setI(i + 1); setSelected(null); }
    }, 900);
  };

  const reset = () => { setI(0); setSelected(null); setScore(0); setDone(false); };

  const progress = ((i + (selected !== null ? 1 : 0)) / quizzes.length) * 100;

  return (
    <AppShell title="Daily Quiz" subtitle="3 questions · 240 XP up for grabs">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="glass rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-[image:var(--gradient-primary)]"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {Math.min(i + 1, quizzes.length)} of {quizzes.length}</span>
          <span className="flex items-center gap-1"><Trophy className="size-3 text-primary" /> {score * 80} XP earned</span>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="mt-8 glass-strong rounded-3xl p-8"
            >
              <div className="text-xs text-primary mb-3 flex items-center gap-1">
                <Sparkles className="size-3" /> Concept check
              </div>
              <h2 className="text-2xl font-display font-semibold">{q.q}</h2>
              <div className="mt-6 grid gap-3">
                {q.a.map((opt, idx) => {
                  const isCorrect = selected !== null && idx === q.correct;
                  const isWrong = selected === idx && idx !== q.correct;
                  return (
                    <motion.button
                      key={opt}
                      whileHover={selected === null ? { x: 4 } : {}}
                      onClick={() => choose(idx)}
                      className={`text-left rounded-2xl px-5 py-4 border transition flex items-center justify-between
                        ${isCorrect ? "border-primary bg-primary/10" :
                          isWrong ? "border-destructive bg-destructive/10" :
                          selected !== null ? "border-border opacity-60" :
                          "border-border glass hover:bg-foreground/10"}`}
                    >
                      <span className="text-sm">{opt}</span>
                      {isCorrect && <CheckCircle2 className="size-5 text-primary" />}
                      {isWrong && <XCircle className="size-5 text-destructive" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-8 glass-strong rounded-3xl p-10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 [background:var(--gradient-hero)] opacity-60" />
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative size-20 mx-auto rounded-full bg-[image:var(--gradient-primary)] grid place-items-center glow"
              >
                <Trophy className="size-10 text-primary-foreground" />
              </motion.div>
              <h2 className="relative mt-6 text-3xl font-display font-semibold">Quiz complete!</h2>
              <p className="relative mt-2 text-muted-foreground">
                You scored <span className="text-foreground font-medium">{score} / {quizzes.length}</span> and earned <span className="gradient-text font-semibold">{score * 80} XP</span>
              </p>
              <button
                onClick={reset}
                className="relative mt-6 px-6 py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
