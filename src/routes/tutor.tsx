import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, BookOpen, TrendingUp, Calculator, Brain } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [{ title: "AI Tutor — CandleMind" }] }),
  component: Tutor,
});

type Msg = { role: "user" | "assistant"; content: string };

const initial: Msg[] = [
  { role: "assistant", content: "Hi Alex 👋 I'm your AI Tutor. Ask me anything about stocks, strategies, or concepts — I'll explain with live market examples." },
];

const prompts = [
  { icon: TrendingUp, label: "Explain how RSI works" },
  { icon: Calculator, label: "Walk me through P/E ratios" },
  { icon: BookOpen, label: "Compare growth vs value investing" },
  { icon: Brain, label: "Why did NVDA rally this week?" },
];

function Tutor() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, {
        role: "assistant",
        content: `Great question. Here's the short version:\n\n${text.includes("RSI")
          ? "RSI (Relative Strength Index) measures momentum on a 0–100 scale. Above 70 = overbought, below 30 = oversold. It's a contrarian signal — use it with trend confirmation, not in isolation."
          : text.includes("P/E")
          ? "P/E = Price ÷ Earnings per share. It tells you how many years of current earnings you're paying for one share. Compare within the same sector — a 50 P/E for a SaaS company can be normal, but unusual for a bank."
          : "Markets reward narrative + numbers. I can break this down further — want a 3-step framework, or a live example using AAPL?"}\n\nWant me to turn this into a quick quiz? 🧠`
      }]);
    }, 1200);
  };

  return (
    <AppShell title="AI Tutor" subtitle="Your personal market mentor — powered by AI">
      <div className="grid lg:grid-cols-[1fr_320px] gap-4 h-[calc(100vh-9rem)]">
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
                      <Bot className="size-4 text-background" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap
                      ${m.role === "user"
                        ? "bg-[image:var(--gradient-primary)] text-background"
                        : "glass"}`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="size-9 rounded-xl bg-secondary grid place-items-center shrink-0 text-sm font-semibold">A</div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="size-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shrink-0">
                    <Bot className="size-4 text-background" />
                  </div>
                  <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-white/5 p-4">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="glass rounded-2xl flex items-center gap-2 px-3 py-2 focus-within:ring-2 ring-primary/40"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about the markets..."
                className="flex-1 bg-transparent outline-none text-sm py-1.5"
              />
              <button
                type="submit"
                className="size-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center hover:shadow-[var(--shadow-glow)] transition"
              >
                <Send className="size-4 text-background" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-muted-foreground text-center">
              CandleMind AI can be wrong. Always verify before trading.
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" /> Suggested prompts
            </div>
            <div className="mt-3 space-y-2">
              {prompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => send(p.label)}
                  className="w-full text-left text-sm glass rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-white/10 transition"
                >
                  <p.icon className="size-4 text-primary" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <div className="text-sm font-medium">Today's focus</div>
            <div className="mt-2 text-xs text-muted-foreground">Technical analysis · Volume</div>
            <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-3/5 bg-[image:var(--gradient-primary)]" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">3 of 5 lessons</div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium">Market pulse</div>
            <div className="mt-3 space-y-2 text-sm">
              {[
                { s: "S&P 500", v: "+0.42%" },
                { s: "NASDAQ", v: "+0.81%" },
                { s: "BTC", v: "-1.24%" },
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
