import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, BookOpen, TrendingUp, Wallet, LayoutDashboard, Bot, FileText, GraduationCap } from "lucide-react";
import { courses, stocks } from "@/lib/mock-data";
import { tutorsList } from "@/lib/learning-data";

type Result = {
  id: string;
  title: string;
  subtitle?: string;
  to: string;
  group: "Courses" | "Stocks" | "Tutors" | "Pages";
  icon: any;
};

const PAGES: Result[] = [
  { id: "p-courses", title: "Trading Classes", subtitle: "Browse all courses", to: "/courses", group: "Pages", icon: BookOpen },
  { id: "p-live", title: "Live Chart", subtitle: "Real-time chart", to: "/live-chart", group: "Pages", icon: TrendingUp },
  { id: "p-paper", title: "Paper Trading", subtitle: "Risk-free simulator", to: "/paper-trading", group: "Pages", icon: Wallet },
  { id: "p-screener", title: "Stock Screener", subtitle: "Filter stocks", to: "/screener", group: "Pages", icon: TrendingUp },
  { id: "p-demat", title: "Demat Marketplace", subtitle: "Compare brokers", to: "/demat", group: "Pages", icon: Wallet },
  { id: "p-quiz", title: "Quiz", subtitle: "Test your knowledge", to: "/quiz", group: "Pages", icon: FileText },
  { id: "p-tutor", title: "AI Mentor", subtitle: "Ask the AI tutor", to: "/tutor", group: "Pages", icon: Bot },
  { id: "p-psy", title: "Trading Psychology", subtitle: "Mindset training", to: "/psychology", group: "Pages", icon: GraduationCap },
  { id: "p-broadcasts", title: "Broadcasts", subtitle: "Announcements", to: "/broadcasts", group: "Pages", icon: FileText },
  { id: "p-student", title: "Student Dashboard", to: "/student-dashboard", group: "Pages", icon: LayoutDashboard },
  { id: "p-tutor-d", title: "Tutor Dashboard", to: "/tutor-dashboard", group: "Pages", icon: LayoutDashboard },
  { id: "p-admin-d", title: "Admin Dashboard", to: "/admin-dashboard", group: "Pages", icon: LayoutDashboard },
];

function useDebounced<T>(value: T, delay = 150) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounced = useDebounced(q, 120);

  // Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo<Result[]>(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return [];
    const match = (s?: string) => !!s && s.toLowerCase().includes(term);

    const courseHits: Result[] = courses
      .filter((c) => match(c.title) || match(c.cat) || match(c.level))
      .map((c) => ({
        id: `c-${c.id}`,
        title: c.title,
        subtitle: `${c.cat} · ${c.level} · ${c.lessons} lessons`,
        to: "/courses",
        group: "Courses",
        icon: BookOpen,
      }));

    const stockHits: Result[] = stocks
      .filter((s) => match(s.ticker) || match(s.name) || match(s.sector))
      .slice(0, 8)
      .map((s) => ({
        id: `s-${s.ticker}`,
        title: `${s.ticker} — ${s.name}`,
        subtitle: `${s.sector} · ₹${s.price.toLocaleString("en-IN")}`,
        to: "/live-chart",
        group: "Stocks",
        icon: TrendingUp,
      }));

    const tutorHits: Result[] = tutorsList
      .filter((t: any) => match(t.name) || match(t.email) || match(t.status))
      .map((t: any, i: number) => ({
        id: `t-${i}`,
        title: t.name,
        subtitle: `${t.courses} courses · ${t.students} students`,
        to: "/tutor",
        group: "Tutors",
        icon: GraduationCap,
      }));

    const pageHits = PAGES.filter((p) => match(p.title) || match(p.subtitle));

    return [...courseHits, ...stockHits, ...tutorHits, ...pageHits].slice(0, 20);
  }, [debounced]);

  const grouped = useMemo(() => {
    const g: Record<string, Result[]> = {};
    results.forEach((r) => {
      (g[r.group] ||= []).push(r);
    });
    return g;
  }, [results]);

  const go = (to: string) => {
    setOpen(false);
    setQ("");
    navigate({ to });
  };

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 w-72">
        <Search className="size-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].to);
          }}
          className="bg-transparent outline-none text-sm flex-1"
          placeholder="Search lessons, stocks, tutors..."
          aria-label="Global search"
        />
        {q ? (
          <button onClick={() => { setQ(""); inputRef.current?.focus(); }} aria-label="Clear" className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        ) : (
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        )}
      </div>

      {open && (q.trim().length > 0) && (
        <div className="absolute right-0 mt-2 w-[min(28rem,90vw)] glass-strong rounded-2xl border border-border shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results for "<span className="text-foreground">{q}</span>"
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-1">
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">{group}</div>
                  {items.map((r) => (
                    <Link
                      key={r.id}
                      to={r.to}
                      onClick={() => go(r.to)}
                      className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition"
                    >
                      <r.icon className="size-4 mt-0.5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-foreground truncate">{r.title}</div>
                        {r.subtitle && <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
