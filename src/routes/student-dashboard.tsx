import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Flame, Trophy, Zap, BookOpen, Bot, ArrowRight, Sparkles, Activity, Wallet, Megaphone } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { useAuth } from "@/hooks/use-auth";
import { fetchStudentOverview } from "@/lib/dashboard-queries";
import { learningSeries } from "@/lib/mock-data";
import { learningModules, consistencyWeek, paperHoldings as mockHoldings, broadcasts as mockBroadcasts } from "@/lib/learning-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, BarChart, Bar,
} from "recharts";

export const Route = createFileRoute("/student-dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — CandleMind" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["student-dashboard", user?.id],
    queryFn: () => fetchStudentOverview(user!.id),
    enabled: !!user,
  });

  const paperTrades = data?.paperTrades ?? [];
  const holdings = paperTrades.length
    ? paperTrades.map((t: any) => ({ ticker: t.ticker, qty: Number(t.quantity), avg: Number(t.buy_price), last: Number(t.current_price) }))
    : mockHoldings;
  const broadcasts = data?.broadcasts.length
    ? data.broadcasts.map((b: any) => ({
        id: b.id, type: "announcement" as const, title: b.title, body: b.message,
        when: new Date(b.created_at).toLocaleDateString(), pinned: b.priority === "high",
      }))
    : mockBroadcasts;

  const pnl = holdings.reduce((s, h) => s + (h.last - h.avg) * h.qty, 0);
  const portfolio = holdings.reduce((s, h) => s + h.last * h.qty, 0);
  const consistency = data?.profile?.consistency_score || Math.round(consistencyWeek.reduce((s, d) => s + d.score, 0) / consistencyWeek.length);
  const xp = data?.profile?.xp ?? 2840;
  const streak = data?.profile?.streak ?? 42;
  const mastery = data?.avgQuiz ?? 87;
  const firstName = data?.profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <AppShell title={`Good morning, ${firstName} 👋`} subtitle={`You're on a ${streak}-day streak. Let's keep it going.`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="XP this week" value={<span className="gradient-text">{xp.toLocaleString()}</span>} delta="+18% vs last" />
        <StatCard icon={Flame} label="Learning streak" value={`${streak} days`} delta="Top 3%" />
        <StatCard icon={Trophy} label="Mastery score" value={`${mastery}%`} delta="+4 pts" />
        <StatCard icon={Wallet} label="Paper P/L" value={<span className={pnl >= 0 ? "text-primary" : "text-destructive"}>{pnl >= 0 ? "+" : ""}₹{Math.round(pnl).toLocaleString("en-IN")}</span>} delta={`Port. ₹${Math.round(portfolio).toLocaleString("en-IN")}`} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Daily XP chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-2xl p-5 h-80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold">Daily XP earned</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="text-xs text-primary flex items-center gap-1">
              <Sparkles className="size-3" /> AI: keep your streak alive tonight
            </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={learningSeries}>
              <defs>
                <linearGradient id="dash" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="xp" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#dash)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Consistency Score */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-strong rounded-2xl p-5 h-80 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold flex items-center gap-2"><Activity className="size-4 text-accent" /> Consistency Score</h3>
              <p className="text-xs text-muted-foreground">Weekly engagement</p>
            </div>
            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">🔥 42d streak</span>
          </div>
          <div className="relative grid grid-cols-[120px_1fr] gap-3 items-center mt-2">
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "score", value: consistency, fill: "oklch(0.7 0.17 162)" }]} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-ml-24 text-center pointer-events-none">
              <div className="text-3xl font-display font-bold gradient-text">{consistency}%</div>
              <div className="text-[10px] text-muted-foreground">consistent</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={consistencyWeek}>
              <XAxis dataKey="d" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <Bar dataKey="score" fill="oklch(0.55 0.22 264)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Modules */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Trading classes</h3>
          <Link to="/courses" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningModules.slice(0, 6).map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }} className="glass rounded-2xl overflow-hidden group">
              <div className={`h-24 bg-gradient-to-br ${m.color} relative`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute bottom-2 left-3 text-[10px] text-primary-foreground/90 bg-foreground/20 backdrop-blur rounded-md px-2 py-0.5 uppercase tracking-wider">{m.level}</div>
                <div className="absolute bottom-2 right-3 text-[10px] text-primary-foreground bg-foreground/20 backdrop-blur rounded-md px-2 py-0.5">{m.duration}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{m.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{m.lessons} lessons</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.04 }} className="h-full bg-[image:var(--gradient-primary)]" />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{m.progress}% complete</span>
                  <Link to="/courses" className="text-primary hover:underline">{m.progress === 100 ? "Review" : m.progress === 0 ? "Start" : "Continue"} →</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Paper Trading widget */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold flex items-center gap-2"><Wallet className="size-4 text-primary" /> Paper trading</h3>
              <p className="text-xs text-muted-foreground">Risk-free practice portfolio</p>
            </div>
            <Link to="/paper-trading" className="text-xs px-3 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition">Open simulator</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2 font-medium">Stock</th><th className="text-left font-medium">Qty</th><th className="text-left font-medium">Avg</th><th className="text-left font-medium">Last</th><th className="text-right font-medium">P/L</th></tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const pl = (h.last - h.avg) * h.qty;
                  return (
                    <tr key={h.ticker} className="border-b border-border last:border-none">
                      <td className="py-2 font-mono font-medium">{h.ticker}</td>
                      <td>{h.qty}</td>
                      <td className="text-muted-foreground">₹{h.avg.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>₹{h.last.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={`text-right font-medium ${pl >= 0 ? "text-primary" : "text-destructive"}`}>{pl >= 0 ? "+" : ""}₹{pl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Broadcasts preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold flex items-center gap-2"><Megaphone className="size-4 text-primary" /> Broadcasts</h3>
            <Link to="/broadcasts" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {broadcasts.slice(0, 3).map((b) => (
              <div key={b.id} className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {b.pinned && <span className="text-accent">📌</span>}
                  <span>{b.type}</span>
                  <span>•</span>
                  <span>{b.when}</span>
                </div>
                <div className="text-sm font-medium">{b.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.body}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Tutor */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 glass-strong rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="size-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center glow shrink-0">
            <Bot className="size-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold">Ask your AI Tutor</h3>
            <p className="text-sm text-muted-foreground">Stuck on a concept? Get instant explanations with live market examples.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Explain RSI", "What is a P/E ratio?", "Best swing setups today", "Should I hedge with puts?"].map((p) => (
                <Link key={p} to="/tutor" className="text-xs px-3 py-1.5 rounded-full glass hover:bg-foreground/10 transition">{p}</Link>
              ))}
            </div>
            <Link to="/tutor" className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">
              Open AI Tutor <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
