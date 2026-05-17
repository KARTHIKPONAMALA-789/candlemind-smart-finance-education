import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, TrendingUp, Calculator, BookOpen, Brain, ShieldAlert, HeartPulse, GraduationCap, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/app/AppShell";
import { mentorChat } from "@/lib/stock-ai.functions";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [
    { title: "AI Mentor — CandleMind" },
    { name: "description", content: "India's AI-powered investing mentor. Learn stocks, strategies, and discipline." },
  ] }),
  component: Tutor,
});

type Mode = "mentor" | "decision" | "psychology";
type Msg = { role: "user" | "assistant"; content: string };

const MODES: { id: Mode; label: string; icon: typeof Bot; desc: string; greet: string }[] = [
  { id: "mentor", label: "AI Mentor", icon: GraduationCap, desc: "Concepts, strategies & markets",
    greet: "Namaste 👋 I'm your **AI Mentor**. Ask me anything about Indian markets — concepts, strategies, or how things work. I'll explain calmly, with examples from NSE/BSE." },
  { id: "decision", label: "Stock Decision", icon: ShieldAlert, desc: "Balanced educational analysis",
    greet: "Ask me about any NSE-listed stock — *\"Is Reliance good for long term?\"*, *\"Why is Infosys falling?\"* — I'll give a **balanced, educational** view with risks and discipline tips. Not financial advice." },
  { id: "psychology", label: "Psychology Coach", icon: HeartPulse, desc: "Master emotions & discipline",
    greet: "I'm here to help you **trade with a calmer mind** 🧘. Share what you're feeling — FOMO, panic, impatience — and I'll coach you through it." },
];

const PROMPTS: Record<Mode, { icon: typeof Bot; label: string }[]> = {
  mentor: [
    { icon: TrendingUp, label: "Explain RSI in simple words" },
    { icon: Calculator, label: "How does P/E ratio work for HDFC Bank?" },
    { icon: BookOpen, label: "Difference between NSE and BSE" },
    { icon: Brain, label: "What is SIP and why does it work?" },
  ],
  decision: [
    { icon: ShieldAlert, label: "Should I buy TCS for long term?" },
    { icon: ShieldAlert, label: "Is Reliance a safe pick?" },
    { icon: ShieldAlert, label: "Why is Infosys falling?" },
    { icon: ShieldAlert, label: "Risks of investing in Adani stocks" },
  ],
  psychology: [
    { icon: HeartPulse, label: "How do I avoid panic selling?" },
    { icon: HeartPulse, label: "I'm feeling FOMO — what should I do?" },
    { icon: HeartPulse, label: "Why do traders fail emotionally?" },
    { icon: HeartPulse, label: "How to build patience as an investor?" },
  ],
};

function Tutor() {
  const [mode, setMode] = useState<Mode>("mentor");
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: MODES[0].greet }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setMessages([{ role: "assistant", content: MODES.find((x) => x.id === m)!.greet }]);
  };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    setMessages((m) => [...m, { role: "user", content: t }]);
    setInput("");
    setLoading(true);
    try {
      const res = await mentorChat({ data: { message: t, mode } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I couldn't reach the mentor right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const active = MODES.find((m) => m.id === mode)!;

  return (
    <AppShell title="AI Mentor" subtitle="India's calm, disciplined investing coach — powered by AI">
      {/* Mode switcher */}
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {MODES.map((m) => {
          const isActive = m.id === mode;
          return (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`text-left rounded-2xl p-4 border transition relative overflow-hidden ${
                isActive ? "border-primary/50 bg-[image:var(--gradient-primary)]/10 glow" : "border-border glass hover:bg-foreground/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-xl grid place-items-center ${isActive ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : "bg-foreground/5"}`}>
                  <m.icon className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 h-[calc(100vh-16rem)]">
        {/* Chat */}
        <div className="glass-strong rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="size-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shrink-0 glow">
                      <Bot className="size-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm
                      ${m.role === "user"
                        ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                        : "glass"}`}
                  >
                    {m.role === "assistant" ? (
                      <div className="ai-md text-sm leading-relaxed space-y-2 [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_h3]:text-sm [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_h3]:font-semibold [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_h3]:mt-3 [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_h3]:mb-1 [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_ul]:list-disc [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_ul]:pl-5 [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_ul]:space-y-1 [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_strong]:font-semibold [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_em]:text-muted-foreground [className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-em:text-muted-foreground"_p]:leading-relaxed">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="size-9 rounded-xl bg-secondary grid place-items-center shrink-0 text-sm font-semibold">A</div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="size-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shrink-0">
                    <Bot className="size-4 text-primary-foreground" />
                  </div>
                  <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin text-primary" /> Thinking like a calm mentor...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => { e.preventDefault(); void send(input); }}
              className="glass rounded-2xl flex items-center gap-2 px-3 py-2 focus-within:ring-2 ring-primary/40"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask the ${active.label.toLowerCase()}...`}
                className="flex-1 bg-transparent outline-none text-sm py-1.5"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="size-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center hover:shadow-[var(--shadow-glow)] transition disabled:opacity-50"
              >
                <Send className="size-4 text-primary-foreground" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-muted-foreground text-center">
              CandleMind AI is educational, not financial advice. Always do your own research.
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4 overflow-y-auto scrollbar-thin pr-1">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" /> Suggested prompts
            </div>
            <div className="mt-3 space-y-2">
              {PROMPTS[mode].map((p) => (
                <button
                  key={p.label}
                  onClick={() => void send(p.label)}
                  className="w-full text-left text-sm glass rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-foreground/10 transition"
                >
                  <p.icon className="size-4 text-primary shrink-0" />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-32 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-2xl" />
            <div className="flex items-center gap-2 text-sm font-medium relative">
              <HeartPulse className="size-4 text-primary" /> Mindset of the day
            </div>
            <p className="mt-2 text-sm text-muted-foreground relative">
              <em>"Consistency beats intensity. One disciplined SIP is worth ten emotional trades."</em>
            </p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium">Market pulse</div>
            <div className="mt-3 space-y-2 text-sm">
              {[
                { s: "NIFTY 50", v: "+0.42%" },
                { s: "SENSEX", v: "+0.38%" },
                { s: "BANK NIFTY", v: "-0.21%" },
              ].map((m) => (
                <div key={m.s} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{m.s}</span>
                  <span className={m.v.startsWith("+") ? "text-primary" : "text-destructive"}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
