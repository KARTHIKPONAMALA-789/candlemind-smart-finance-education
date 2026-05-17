import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Trophy, Zap, BookOpen, Bot, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { courses, lessons, activity, learningSeries, completionSeries } from "@/lib/mock-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CandleMind" }] }),
  component: Dashboard,
});

const PIE_COLORS = ["oklch(0.86 0.22 145)", "oklch(0.72 0.2 230)", "oklch(0.78 0.18 290)", "oklch(0.82 0.18 75)"];

function Dashboard() {
  return (
    <AppShell title="Good morning, Alex 👋" subtitle="You're on a 42-day streak. Let's keep it going.">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="XP this week" value={<span className="gradient-text">2,840</span>} delta="+18% vs last" />
        <StatCard icon={Flame} label="Learning streak" value="42 days" delta="Top 3%" />
        <StatCard icon={Trophy} label="Mastery score" value="87%" delta="+4 pts" />
        <StatCard icon={BookOpen} label="Lessons left" value="14" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Daily XP chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass rounded-2xl p-5 h-80"
        >
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
                  <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="xp" stroke="oklch(0.86 0.22 145)" strokeWidth={2} fill="url(#dash)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Completion pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-5 h-80"
        >
          <h3 className="font-display font-semibold">Completion by category</h3>
          <p className="text-xs text-muted-foreground">Across all enrolled courses</p>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={completionSeries} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {completionSeries.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Course cards */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Continue learning</h3>
          <Link to="/courses" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <div className={`h-28 bg-gradient-to-br ${c.color} relative`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute bottom-3 left-3 text-xs text-primary-foreground/80 bg-background/30 backdrop-blur rounded-md px-2 py-0.5">
                  {c.level}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium">{c.title}</h4>
                <div className="mt-3 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                  <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${c.progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.progress}% complete</span>
                  <span>{c.lessons} lessons</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* AI Tutor quick access */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-strong rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 size-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center glow shrink-0">
              <Bot className="size-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">Ask your AI Tutor</h3>
              <p className="text-sm text-muted-foreground">
                Stuck on a concept? Get instant explanations with live market examples.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Explain RSI", "What is a P/E ratio?", "Why did NVDA jump?"].map((p) => (
                  <Link
                    key={p} to="/tutor"
                    className="text-xs px-3 py-1.5 rounded-full glass hover:bg-foreground/10 transition"
                  >
                    {p}
                  </Link>
                ))}
              </div>
              <Link
                to="/tutor"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition"
              >
                Open AI Tutor <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Recommended */}
          <div className="mt-6">
            <div className="text-xs text-muted-foreground mb-2">Recommended lessons</div>
            <div className="space-y-2">
              {lessons.map((l) => (
                <div key={l.id} className="flex items-center justify-between glass rounded-xl px-4 py-2.5 hover:bg-foreground/10 transition">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg glass-strong grid place-items-center">
                      <BookOpen className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.duration}</div>
                    </div>
                  </div>
                  <div className="text-xs text-primary">+{l.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-display font-semibold">Recent activity</h3>
          <div className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative">
                  <div className="size-2 rounded-full bg-primary mt-1.5" />
                  {i < activity.length - 1 && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-full bg-foreground/10" />}
                </div>
                <div>
                  <div className="text-sm"><span className="font-medium">{a.who}</span> {a.what}</div>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
