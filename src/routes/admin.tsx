import { createFileRoute, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, BookOpen, Activity, TrendingUp, Sparkles, MoreHorizontal, GraduationCap, CalendarClock, Megaphone, BarChart3, Shield, CheckCircle2, XCircle, Pin } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { fetchAdminOverview } from "@/lib/dashboard-queries";
import { adminRevenue, adminCoursePerf, adminStudents } from "@/lib/mock-data";
import { tutorsList, attendanceHeatmap, broadcasts as mockBroadcasts } from "@/lib/learning-data";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

type Tab = "overview" | "students" | "tutors" | "attendance" | "broadcasts" | "analytics" | "settings";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Console — CandleMind" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ tab: (s.tab as Tab) ?? "overview" }),
  component: () => <RoleGuard allow={["admin"]}><Admin /></RoleGuard>,
});

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "students", label: "Students", icon: Users },
  { id: "tutors", label: "Tutors", icon: GraduationCap },
  { id: "attendance", label: "Attendance", icon: CalendarClock },
  { id: "broadcasts", label: "Broadcasts", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Shield },
];

function Admin() {
  const { tab } = useSearch({ from: "/admin" });
  return (
    <AppShell title="Admin Console" subtitle="Platform · Operations · Learning analytics">
      <div className="flex gap-1 overflow-x-auto pb-2 mb-5 border-b border-border">
        {tabs.map((t) => (
          <a key={t.id} href={`/admin?tab=${t.id}`}
            className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition relative inline-flex items-center gap-1.5 ${tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="size-3.5" /> {t.label}
            {tab === t.id && <motion.div layoutId="admin-tab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[image:var(--gradient-primary)]" />}
          </a>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "students" && <StudentsTab />}
      {tab === "tutors" && <TutorsTab />}
      {tab === "attendance" && <AttendanceTab />}
      {tab === "broadcasts" && <BroadcastsTab />}
      {tab === "analytics" && <AnalyticsTab />}
      {tab === "settings" && <SettingsTab />}
    </AppShell>
  );
}

function useAdminData() {
  return useQuery({ queryKey: ["admin-dashboard"], queryFn: fetchAdminOverview });
}

function Overview() {
  const { data } = useAdminData();
  const t = data?.totals;
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total students" value={(t?.students ?? 0).toLocaleString()} delta="live" />
        <StatCard icon={GraduationCap} label="Total tutors" value={(t?.tutors ?? 0).toLocaleString()} delta="live" />
        <StatCard icon={BookOpen} label="Courses" value={(t?.courses ?? 0).toLocaleString()} delta={`${t?.enrollments ?? 0} enrollments`} />
        <StatCard icon={CalendarClock} label="Live classes" value={(t?.liveClasses ?? 0).toLocaleString()} delta="scheduled" />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-strong rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 right-10 size-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="size-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center glow shrink-0">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold">AI-generated insights</h3>
            <p className="text-sm text-muted-foreground mt-1">Auto-generated from this week's data</p>
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              {[
                "Revenue up 24% — driven by the Options launch on Tuesday.",
                "Completion rate for 'Fundamentals' dropped 6% — consider shorter lesson splits.",
                "Referral conversions peaked Friday evening. Re-run that campaign Sunday.",
              ].map((t, i) => (<div key={i} className="glass rounded-xl p-3 text-sm">{t}</div>))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5 h-80">
          <div className="flex items-center justify-between mb-2">
            <div><h3 className="font-display font-semibold">Revenue & user growth</h3><p className="text-xs text-muted-foreground">Last 7 months</p></div>
            <span className="text-xs text-primary flex items-center gap-1"><TrendingUp className="size-3" /> +324%</span>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={adminRevenue}>
              <defs>
                <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0} /></linearGradient>
                <linearGradient id="a2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.7 0.17 162)" strokeWidth={2} fill="url(#a1)" />
              <Area type="monotone" dataKey="users" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#a2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5 h-80">
          <h3 className="font-display font-semibold">Course completion</h3>
          <p className="text-xs text-muted-foreground">% finishing</p>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={adminCoursePerf} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Bar dataKey="completion" fill="oklch(0.7 0.17 162)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function StudentsTab() {
  const { data, isLoading } = useAdminData();
  const rows = data?.students.length
    ? data.students.map((s) => ({ name: s.name, email: s.id.slice(0, 8) + "…", joined: new Date(s.joined).toLocaleDateString(), course: "—", status: "Active" }))
    : adminStudents;
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div><h3 className="font-display font-semibold">Student management</h3><p className="text-xs text-muted-foreground">{isLoading ? "Loading…" : `${rows.length} registered`}</p></div>
        <button className="text-xs text-primary hover:underline">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left p-4 font-normal">Name</th><th className="text-left p-4 font-normal">ID</th><th className="text-left p-4 font-normal">Joined</th><th className="text-left p-4 font-normal">Course</th><th className="text-left p-4 font-normal">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={i} className="border-b border-border hover:bg-foreground/5 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-xs font-semibold">{s.name.charAt(0)}</div>
                  {s.name}
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{s.email}</td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{s.joined}</td>
                <td className="p-4">{s.course}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "Active" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"}`}>{s.status}</span>
                </td>
                <td className="p-4 text-right"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TutorsTab() {
  const { data, isLoading } = useAdminData();
  const rows = data?.tutors.length
    ? data.tutors.map((t) => ({ name: t.name, email: t.id.slice(0, 8) + "…", students: t.students, courses: t.courses, rating: 0, status: "Approved" }))
    : tutorsList;
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div><h3 className="font-display font-semibold">Tutor management</h3><p className="text-xs text-muted-foreground">{isLoading ? "Loading…" : `${rows.length} tutors`}</p></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left p-4 font-normal">Tutor</th><th className="text-left p-4 font-normal">ID</th><th className="text-left p-4 font-normal">Students</th><th className="text-left p-4 font-normal">Courses</th><th className="text-left p-4 font-normal">Rating</th><th className="text-left p-4 font-normal">Status</th><th className="text-right p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={i} className="border-b border-border last:border-none hover:bg-foreground/5 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-xs font-semibold">{t.name.split(" ")[1]?.[0] ?? t.name[0]}</div>
                  {t.name}
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{t.email}</td>
                <td className="p-4">{t.students.toLocaleString()}</td>
                <td className="p-4">{t.courses}</td>
                <td className="p-4 text-primary">{t.rating || "—"} {t.rating ? "★" : ""}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Approved" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"}`}>{t.status}</span>
                </td>
                <td className="p-4 text-right text-xs space-x-2">
                  <button onClick={() => toast.message(`${t.name} suspended`)} className="text-muted-foreground hover:text-foreground">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p"];
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 glass rounded-2xl p-5">
        <div className="text-sm font-medium">Live class attendance heatmap</div>
        <p className="text-xs text-muted-foreground mb-4">Darker = higher participation</p>
        <div className="space-y-1.5">
          <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1.5 text-[10px] text-muted-foreground">
            <div />
            {hours.map((h) => <div key={h} className="text-center">{h}</div>)}
          </div>
          {attendanceHeatmap.map((row, di) => (
            <div key={di} className="grid grid-cols-[40px_repeat(12,1fr)] gap-1.5 items-center">
              <div className="text-[10px] text-muted-foreground">{days[di]}</div>
              {row.map((v, hi) => (
                <div key={hi} className="aspect-square rounded" style={{ background: `oklch(0.55 0.22 264 / ${0.05 + (v / 100) * 0.6})` }} title={`${v}%`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="glass-strong rounded-2xl p-5">
        <div className="text-sm font-medium mb-3">Tutor attendance · this week</div>
        {tutorsList.filter((t) => t.status === "Approved").map((t) => (
          <div key={t.email} className="flex items-center justify-between py-2 border-b border-border last:border-none">
            <span className="text-sm">{t.name}</span>
            <span className="text-xs text-primary">{[98, 92, 88][tutorsList.indexOf(t)] ?? 90}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BroadcastsTab() {
  return (
    <div className="space-y-3">
      <div className="glass-strong rounded-2xl p-4 text-sm">
        Moderate tutor-posted broadcasts. Pin important updates so they surface to every student.
      </div>
      {broadcasts.map((b) => (
        <div key={b.id} className="glass rounded-2xl p-4 flex items-start gap-3">
          <div className="size-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-sm font-semibold">{b.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="font-medium text-foreground">{b.tutor}</span><span>·</span><span>{b.type}</span><span>·</span><span>{b.when}</span>
            </div>
            <div className="text-sm font-medium mt-1">{b.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{b.body}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => toast.success("Pinned")} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-border hover:bg-foreground/5 transition"><Pin className="size-3" /> Pin</button>
            <button onClick={() => toast.error("Removed")} className="text-xs px-2 py-1 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition">Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Active learners (DAU)" value="4,820" delta="+12%" />
        <StatCard icon={BookOpen} label="Lessons completed" value="284,120" delta="+8.4%" />
        <StatCard icon={GraduationCap} label="Avg quiz score" value="84%" delta="+2pts" />
        <StatCard icon={DollarSign} label="Referral sales" value="$8.2K" delta="+18%" />
      </div>
      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-2">User growth</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adminRevenue}>
              <defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="users" stroke="oklch(0.7 0.17 162)" strokeWidth={2} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-2">Course performance</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={adminCoursePerf}>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Bar dataKey="completion" fill="oklch(0.55 0.22 264)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function SettingsTab() {
  return (
    <div className="glass rounded-2xl p-6 max-w-2xl space-y-4">
      <div>
        <div className="text-sm font-medium">Platform settings</div>
        <p className="text-xs text-muted-foreground">Branding, billing and security controls</p>
      </div>
      <div className="space-y-3 text-sm">
        {["Enforce 2FA for tutors", "Require admin approval for new tutors", "Auto-suspend low-rated tutors (&lt;3.5)", "Allow student-to-student messaging"].map((s) => (
          <label key={s} className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-primary" />
            <span dangerouslySetInnerHTML={{ __html: s }} />
          </label>
        ))}
      </div>
    </div>
  );
}
