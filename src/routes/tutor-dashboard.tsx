import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useMemo, useRef, type DragEvent, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Star, Eye, Upload, Radio, CalendarClock, BarChart3, Send, Check, X, FileText, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { useAuth } from "@/hooks/use-auth";
import { fetchTutorOverview, postBroadcast } from "@/lib/dashboard-queries";
import { supabase } from "@/integrations/supabase/client";
import { adminCoursePerf, adminRevenue, courses } from "@/lib/mock-data";
import { liveClasses as mockLiveClasses, broadcasts as initialBroadcasts, type Broadcast } from "@/lib/learning-data";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

type Tab = "overview" | "courses" | "upload" | "live" | "students" | "broadcast" | "analytics";

export const Route = createFileRoute("/tutor-dashboard")({
  head: () => ({ meta: [{ title: "Tutor Studio — CandleMind" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ tab: (s.tab as Tab) ?? "overview" }),
  component: TutorDashboard,
});

const myCourses = courses.slice(0, 4).map((c, i) => ({
  ...c, students: [482, 318, 204, 156][i], rating: [4.9, 4.8, 4.7, 4.6][i], revenue: [12400, 8100, 5200, 3800][i],
}));

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "My Courses" },
  { id: "upload", label: "Upload Class" },
  { id: "live", label: "Live Classes" },
  { id: "students", label: "Students" },
  { id: "broadcast", label: "Broadcast" },
  { id: "analytics", label: "Analytics" },
];

function TutorDashboard() {
  const { tab } = useSearch({ from: "/tutor-dashboard" });

  return (
    <AppShell title="Tutor Studio" subtitle="Manage your courses, students and live sessions">
      <div className="flex gap-1 overflow-x-auto pb-2 mb-5 border-b border-border">
        {tabs.map((t) => (
          <a key={t.id} href={`/tutor-dashboard?tab=${t.id}`}
            className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition relative ${tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
            {tab === t.id && <motion.div layoutId="tutor-tab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[image:var(--gradient-primary)]" />}
          </a>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "courses" && <CoursesTab />}
      {tab === "upload" && <UploadTab />}
      {tab === "live" && <LiveTab />}
      {tab === "students" && <StudentsTab />}
      {tab === "broadcast" && <BroadcastTab />}
      {tab === "analytics" && <AnalyticsTab />}
    </AppShell>
  );
}

function useTutorData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tutor-dashboard", user?.id],
    queryFn: () => fetchTutorOverview(user!.id),
    enabled: !!user,
  });
}

function Overview() {
  const { data } = useTutorData();
  const totalStudents = data?.totalStudents ?? 0;
  const totalCourses = data?.courses.length ?? 0;
  const upcoming = (data?.liveClasses ?? []).filter((l: any) => new Date(l.scheduled_date) > new Date()).length;

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Students" value={totalStudents.toLocaleString()} delta="+8.4%" icon={Users} />
        <StatCard label="My Courses" value={String(totalCourses)} delta={`${data?.courses.filter((c: any) => c.published).length ?? 0} published`} icon={BookOpen} />
        <StatCard label="Avg. Rating" value="4.8 ★" delta="+0.2" icon={Star} />
        <StatCard label="Upcoming Live" value={String(upcoming)} delta={`${data?.liveClasses.length ?? 0} total`} icon={CalendarClock} />
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
                  <stop offset="0%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#tr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Course completion</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={adminCoursePerf}>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Bar dataKey="completion" fill="oklch(0.7 0.17 162)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function CoursesTab() {
  const { data, isLoading } = useTutorData();
  const dbCourses = data?.courses ?? [];
  const rows = dbCourses.length
    ? dbCourses.map((c: any) => ({
        id: c.id, title: c.title, lessons: 0, level: c.difficulty,
        color: "from-blue-500 to-violet-500", students: c.students, rating: 0,
        revenue: 0, progress: c.progress, published: c.published,
      }))
    : [];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium">Your courses</div>
          <div className="text-xs text-muted-foreground">{isLoading ? "Loading…" : `${rows.length} course${rows.length === 1 ? "" : "s"}`}</div>
        </div>
        <a href="/tutor-dashboard?tab=upload" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition">
          <Plus className="size-3.5" /> New course
        </a>
      </div>
      {rows.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          You haven't created any courses yet. Click <span className="text-primary">New course</span> to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2 font-medium">Course</th><th className="text-left font-medium">Students</th><th className="text-left font-medium">Status</th><th className="text-left font-medium">Progress</th><th className="text-right font-medium">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border">
                  <td className="py-3 flex items-center gap-3">
                    <div className={`size-9 rounded-lg bg-gradient-to-br ${c.color} grid place-items-center text-primary-foreground font-semibold text-xs`}>
                      <BookOpen className="size-4" />
                    </div>
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.level}</div>
                    </div>
                  </td>
                  <td>{c.students.toLocaleString()}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.published ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"}`}>{c.published ? "Published" : "Draft"}</span>
                  </td>
                  <td className="w-40">
                    <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                      <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${c.progress}%` }} />
                    </div>
                  </td>
                  <td className="text-right text-xs">
                    <button className="text-primary hover:underline">Edit</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UploadTab() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Course saved as draft"); }} className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium"><Upload className="size-4 text-primary" /> New course</div>
        <Field label="Course title" placeholder="e.g. Mastering Candlestick Patterns" />
        <Field label="Short description" placeholder="One-line summary" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Level" placeholder="Beginner / Intermediate / Advanced" />
          <Field label="Estimated duration" placeholder="e.g. 4h" />
        </div>
        <Field label="Cover video link (YouTube / Vimeo)" placeholder="https://..." />
        <div>
          <div className="text-xs font-medium mb-1.5">Lesson plan</div>
          <textarea rows={5} placeholder="1. Intro to candles&#10;2. Doji & spinning tops&#10;3. Engulfing patterns..." className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">Save draft</button>
          <button type="button" onClick={() => toast.success("Course published")} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-foreground/5 transition">Publish</button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="glass-strong rounded-2xl p-5">
          <div className="text-sm font-medium">Upload resources</div>
          <p className="text-xs text-muted-foreground mt-1">PDFs, slides, datasets — drag & drop or browse.</p>
          <div className="mt-3 border-2 border-dashed border-border rounded-xl py-8 grid place-items-center text-xs text-muted-foreground">
            <Upload className="size-5 text-primary mb-2" />
            Drop files here
          </div>
        </div>
        <div className="glass rounded-2xl p-5 text-xs text-muted-foreground">
          <div className="text-sm font-medium text-foreground mb-1">Publishing checklist</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Cover video uploaded</li>
            <li>≥ 5 lessons</li>
            <li>1 quiz per module</li>
            <li>Resources attached</li>
          </ul>
        </div>
      </div>
    </form>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <div className="text-xs font-medium mb-1.5">{label}</div>
      <input placeholder={placeholder} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
    </div>
  );
}

function LiveTab() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useTutorData();
  const dbClasses = data?.liveClasses ?? [];
  const items = dbClasses.length
    ? dbClasses.map((l: any) => {
        const date = new Date(l.scheduled_date);
        const status = date < new Date(Date.now() - l.duration_min * 60_000) ? "past" : date < new Date() ? "live" : "upcoming";
        return { id: l.id, title: l.class_title, when: date.toLocaleString(), duration: `${l.duration_min}m`, attendees: 0, status };
      })
    : mockLiveClasses;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("60");
  const [link, setLink] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !date) return;
    const { error } = await supabase.from("live_classes").insert({
      tutor_id: user.id, class_title: title, scheduled_date: new Date(date).toISOString(),
      duration_min: Number(duration) || 60, meeting_link: link || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Live class scheduled");
    setTitle(""); setDate(""); setLink("");
    qc.invalidateQueries({ queryKey: ["tutor-dashboard"] });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        {items.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">No live classes yet — schedule one →</div>}
        {items.map((l: any) => (
          <div key={l.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className={`size-12 rounded-xl grid place-items-center ${l.status === "live" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
              <CalendarClock className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                <span className={l.status === "live" ? "text-destructive" : "text-muted-foreground"}>{l.status}</span>
                <span className="text-muted-foreground">· {l.duration}</span>
              </div>
              <div className="font-medium text-sm">{l.title}</div>
              <div className="text-xs text-muted-foreground">{l.when}</div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-foreground/5 transition">Manage</button>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="glass-strong rounded-2xl p-5 space-y-3">
        <div className="text-sm font-medium">Schedule live class</div>
        <div>
          <div className="text-xs font-medium mb-1.5">Title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Earnings season recap" className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        </div>
        <div>
          <div className="text-xs font-medium mb-1.5">Date & time</div>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        </div>
        <div>
          <div className="text-xs font-medium mb-1.5">Duration (min)</div>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        </div>
        <div>
          <div className="text-xs font-medium mb-1.5">Meeting link</div>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet..." className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        </div>
        <button type="submit" className="w-full px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">Schedule</button>
      </form>
    </div>
  );
}

function StudentsTab() {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    name: ["Aarav", "Priya", "Daniel", "Sara", "Ravi", "Maya", "Liam", "Zoe"][i],
    course: ["Candlesticks", "Fundamentals", "Options", "Risk", "Swing", "Tech. Analysis", "Portfolio", "Candlesticks"][i],
    progress: [88, 72, 54, 41, 67, 92, 33, 78][i],
    quiz: [94, 78, 65, 88, 71, 96, 52, 84][i],
    consistency: [92, 84, 70, 88, 76, 95, 60, 81][i],
    attendance: [98, 88, 72, 92, 80, 100, 65, 90][i],
  }));
  return (
    <div className="glass rounded-2xl p-5 overflow-x-auto">
      <div className="text-sm font-medium mb-3">Student learning tracker</div>
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground border-b border-border">
          <tr><th className="text-left py-2 font-medium">Student</th><th className="text-left font-medium">Course</th><th className="text-left font-medium">Progress</th><th className="text-left font-medium">Avg quiz</th><th className="text-left font-medium">Consistency</th><th className="text-left font-medium">Attendance</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border last:border-none hover:bg-foreground/5 transition">
              <td className="py-3 flex items-center gap-2">
                <div className="size-7 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-xs font-semibold">{r.name[0]}</div>
                {r.name}
              </td>
              <td className="text-muted-foreground">{r.course}</td>
              <td className="w-40"><Progress value={r.progress} /></td>
              <td><span className="text-primary">{r.quiz}%</span></td>
              <td>{r.consistency}%</td>
              <td>{r.attendance}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
        <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8">{value}%</span>
    </div>
  );
}

function BroadcastTab() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useTutorData();
  const dbPosts = data?.broadcasts ?? [];
  const posts: Broadcast[] = dbPosts.length
    ? dbPosts.map((b: any) => ({
        id: b.id, tutor: "You", avatar: "Y",
        type: (b.priority === "high" ? "deadline" : "announcement") as Broadcast["type"],
        title: b.title, body: b.message, when: new Date(b.created_at).toLocaleString(),
      }))
    : initialBroadcasts;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    try {
      await postBroadcast({ tutor_id: user.id, title, message: body, priority });
      setTitle(""); setBody("");
      toast.success("Broadcast sent to your students");
      qc.invalidateQueries({ queryKey: ["tutor-dashboard"] });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send");
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4">
      <div className="space-y-3">
        {posts.length === 0 && <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">No broadcasts yet.</div>}
        {posts.map((b) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              <span className="font-medium text-foreground">{b.tutor}</span>
              <span>·</span><span>{b.type}</span><span>·</span><span>{b.when}</span>
            </div>
            <div className="text-sm font-medium">{b.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{b.body}</p>
          </motion.div>
        ))}
      </div>
      <form onSubmit={post} className="glass-strong rounded-2xl p-5 space-y-3 h-fit sticky top-20">
        <div className="flex items-center gap-2 text-sm font-medium"><Radio className="size-4 text-accent" /> New broadcast</div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none">
          <option value="normal">Normal</option>
          <option value="high">High priority</option>
          <option value="low">Low</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write your message..." className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary/30" />
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">
          <Send className="size-4" /> Post broadcast
        </button>
      </form>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total students" value="1,160" delta="+8%" />
        <StatCard icon={BarChart3} label="Engagement" value="78%" delta="+4%" />
        <StatCard icon={Star} label="Quiz pass rate" value="84%" delta="+2%" />
        <StatCard icon={Eye} label="Attendance" value="91%" delta="+6%" />
      </div>
      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-2">Engagement over time</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adminRevenue}>
              <defs><linearGradient id="ta" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="users" stroke="oklch(0.7 0.17 162)" strokeWidth={2} fill="url(#ta)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-2">Quiz scores by course</div>
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
