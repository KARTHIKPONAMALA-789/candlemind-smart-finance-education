import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Star, Eye } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { adminCoursePerf, adminRevenue, courses } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/tutor-dashboard")({
  head: () => ({ meta: [{ title: "Tutor Dashboard — CandleMind" }] }),
  component: TutorDashboard,
});

const myCourses = courses.slice(0, 4).map((c, i) => ({
  ...c, students: [482, 318, 204, 156][i], rating: [4.9, 4.8, 4.7, 4.6][i], revenue: [12400, 8100, 5200, 3800][i],
}));

function TutorDashboard() {
  return (
    <AppShell title="Tutor Studio" subtitle="Manage your courses, students and earnings">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Students" value="1,160" delta="+8.4%" icon={Users} />
        <StatCard label="Course Revenue" value="$29,500" delta="+12.1%" icon={DollarSign} />
        <StatCard label="Avg. Rating" value="4.8 ★" delta="+0.2" icon={Star} />
        <StatCard label="Course Views" value="48,212" delta="+18%" icon={Eye} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Revenue & students</div>
              <div className="text-xs text-muted-foreground">Last 7 months</div>
            </div>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={adminRevenue}>
              <defs>
                <linearGradient id="tr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.86 0.22 145)" strokeWidth={2} fill="url(#tr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Course completion</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={adminCoursePerf}>
              <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Bar dataKey="completion" fill="oklch(0.72 0.2 230)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Your courses</div>
            <div className="text-xs text-muted-foreground">Performance overview</div>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-background font-medium hover:shadow-[var(--shadow-glow)] transition">
            <Plus className="size-3.5" /> New course
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-white/5">
              <tr><th className="text-left py-2 font-medium">Course</th><th className="text-left font-medium">Students</th><th className="text-left font-medium">Rating</th><th className="text-left font-medium">Revenue</th><th className="text-left font-medium">Progress</th></tr>
            </thead>
            <tbody>
              {myCourses.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5">
                  <td className="py-3 flex items-center gap-3">
                    <div className={`size-9 rounded-lg bg-gradient-to-br ${c.color} grid place-items-center text-background font-semibold text-xs`}>
                      <BookOpen className="size-4" />
                    </div>
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.lessons} lessons · {c.level}</div>
                    </div>
                  </td>
                  <td>{c.students.toLocaleString()}</td>
                  <td className="text-primary">{c.rating} ★</td>
                  <td>${c.revenue.toLocaleString()}</td>
                  <td className="w-40">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${c.progress}%` }} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
