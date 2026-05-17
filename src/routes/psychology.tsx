import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { HeartPulse, Wind, Shield, Sparkles, Loader2, TrendingUp, Activity, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/app/AppShell";
import { mentorChat, behaviourInsights } from "@/lib/stock-ai.functions";

export const Route = createFileRoute("/psychology")({
  head: () => ({ meta: [
    { title: "Trading Psychology Coach — CandleMind" },
    { name: "description", content: "Master your trading emotions. Avoid FOMO, panic selling, and build disciplined investing habits." },
  ] }),
  component: PsychologyCoach,
});

const SCENARIOS = [
  { icon: Wind, title: "I'm panicking", q: "The market is crashing and I want to sell everything. How do I stay calm?" },
  { icon: TrendingUp, title: "Strong FOMO", q: "Everyone is buying a hot stock. I feel I'm missing out — what should I do?" },
  { icon: Shield, title: "Lost money", q: "I just took a big loss in paper trading. How do I recover mentally?" },
  { icon: Brain, title: "Overtrading", q: "I keep making impulsive trades. How do I build patience?" },
];

const PRINCIPLES = [
  { title: "Pause before you act", body: "Wait 10 minutes before any non-planned trade. Emotion fades, logic returns." },
  { title: "Plan beats prediction", body: "Trade your plan, not the news. Define entry, exit, and risk before you click." },
  { title: "Process > Profit", body: "Judge yourself on discipline, not on a single day's P&L." },
  { title: "Size the risk, not the dream", body: "Never risk more than 1–2% of your capital on a single idea." },
];

function PsychologyCoach() {
  const [reflection, setReflection] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [insights, setInsights] = useState<string | null>(null);
  const [iLoading, setILoading] = useState(false);

  const askCoach = async (q: string) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setAdvice(null);
    try {
      const res = await mentorChat({ data: { message: q, mode: "psychology" } });
      setAdvice(res.reply);
    } catch {
      setAdvice("I couldn't reach the coach right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyseMe = async () => {
    setILoading(true);
    setInsights(null);
    try {
      const res = await behaviourInsights({ data: {
        paperTrades: 47, winRate: 58, quizScore: 72, consistencyScore: 64, lessonsCompleted: 12,
      }});
      setInsights(res.insights);
    } catch {
      setInsights("Could not analyse your behaviour right now.");
    } finally {
      setILoading(false);
    }
  };

  return (
    <AppShell title="Trading Psychology Coach" subtitle="Calm mind. Disciplined trades. Long-term wins.">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        {/* Coach */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 size-56 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-3xl" />
            <div className="flex items-center gap-3 relative">
              <div className="size-11 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center glow">
                <HeartPulse className="size-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display text-lg">How are you feeling about the market today?</div>
                <div className="text-xs text-muted-foreground">Share an emotion or scenario — I'll coach you through it.</div>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => { setReflection(s.q); void askCoach(s.q); }}
                  className="text-left glass rounded-xl px-3 py-2.5 flex items-start gap-3 hover:bg-foreground/10 transition"
                >
                  <s.icon className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-[11px] text-muted-foreground">{s.q}</div>
                  </div>
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); void askCoach(reflection); }}
              className="mt-4 glass rounded-2xl p-3 focus-within:ring-2 ring-primary/40"
            >
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="e.g. I keep buying after a stock has already gone up 10%..."
                className="w-full bg-transparent outline-none text-sm resize-none"
                disabled={loading}
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Your reflections stay in this session.</span>
                <button
                  type="submit"
                  disabled={loading || !reflection.trim()}
                  className="text-xs rounded-xl px-4 py-2 bg-[image:var(--gradient-primary)] text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Get coaching
                </button>
              </div>
            </form>
          </motion.div>

          {(loading || advice) && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HeartPulse className="size-4 text-primary" /> Coach response
              </div>
              <div className="mt-3 text-sm">
                {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-3.5 animate-spin text-primary" /> Listening calmly...</div>}
                {advice && (
                  <div className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4 text-primary" /> AI behaviour insights
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on your paper trading, quiz scores, and consistency — get a personal coaching summary.
            </p>
            <button
              onClick={() => void analyseMe()}
              disabled={iLoading}
              className="mt-3 w-full text-xs rounded-xl px-3 py-2.5 bg-[image:var(--gradient-primary)] text-primary-foreground inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {iLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              Analyse my behaviour
            </button>
            {insights && (
              <div className="mt-3 prose prose-sm prose-invert max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1 prose-ul:my-1">
                <ReactMarkdown>{insights}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">Core principles</div>
            <div className="space-y-3">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="rounded-xl border border-border/60 p-3">
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium">Today's mantra</div>
            <div className="mt-2 text-sm text-muted-foreground italic">
              "I trade my plan, not my emotions. The market will be here tomorrow."
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
