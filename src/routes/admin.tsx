import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, DollarSign, BookOpen, Activity, TrendingUp, Sparkles, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { adminRevenue, adminCoursePerf, adminStudents } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — CandleMind" }] }),
  component: Admin,
});

function Admin() {
  return (
    <AppShell title="Admin overview" subtitle="Operations · Revenue · Learners">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active users (30d)" value="12,482" delta="+14.2%" />
        <StatCard icon={DollarSign} label="Monthly revenue" value={<span className="gradient-text">$64.9K</span>} delta="+24.8%" />
        <StatCard icon={BookOpen} label="Lessons completed" value="284,120" delta="+8.4%" />
        <StatCard icon={Activity} label="Referral sales" value="$8.2K" delta="+18.0%" />
      </div>

      {/* AI insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 right-10 size-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="size-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center glow shrink-0">
            <Sparkles className="size-5 text-background" />
          </div>
          <div>
            <h3 className="font-display font-semibold">AI-generated insights</h3>
            <p className="text-sm text-muted-foreground mt-1">Auto-generated from this week's data</p>
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              {[
                "Revenue up 24% — driven by the Options launch on Tuesday.",
                "Completion rate for 'Fundamentals' dropped 6% — consider shorter lesson splits.",
                "Referral conversions peaked Friday evening. Re-run that campaign Sunday.",
              ].map((t, i) => (
                <div key={i} className="glass rounded-xl p-3 text-sm">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass rounded-2xl p-5 h-80"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display font-semibold">Revenue & user growth</h3>
              <p className="text-xs text-muted-foreground">Last 7 months</p>
            </div>
            <span className="text-xs text-primary flex items-center gap-1"><TrendingUp className="size-3" /> +324%</span>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={adminRevenue}>
              <defs>
                <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="a2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.86 0.22 145)" strokeWidth={2} fill="url(#a1)" />
              <Area type="monotone" dataKey="users" stroke="oklch(0.72 0.2 230)" strokeWidth={2} fill="url(#a2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-5 h-80"
        >
          <h3 className="font-display font-semibold">Course completion</h3>
          <p className="text-xs text-muted-foreground">% of enrolled finishing</p>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={adminCoursePerf} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 5%)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Bar dataKey="completion" fill="oklch(0.86 0.22 145)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Students table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mt-6 glass rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Recent students</h3>
            <p className="text-xs text-muted-foreground">Joining date & active course</p>
          </div>
          <button className="text-xs text-primary hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-white/5">
                <th className="text-left p-4 font-normal">Name</th>
                <th className="text-left p-4 font-normal">Email</th>
                <th className="text-left p-4 font-normal">Joined</th>
                <th className="text-left p-4 font-normal">Course</th>
                <th className="text-left p-4 font-normal">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {adminStudents.map((s) => (
                <tr key={s.email} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-background text-xs font-semibold">
                      {s.name.charAt(0)}
                    </div>
                    {s.name}
                  </td>
                  <td className="p-4 text-muted-foreground">{s.email}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{s.joined}</td>
                  <td className="p-4">{s.course}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === "Active" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"
                    }`}>{s.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppShell>
  );
}
