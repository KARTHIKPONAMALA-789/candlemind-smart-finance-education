import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bot, BookOpen, Brain, LineChart, Users, Shield, Flame, Bell, Search, Settings,
} from "lucide-react";
import { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tutor", label: "AI Tutor", icon: Bot },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/quiz", label: "Quizzes", icon: Brain },
  { to: "/screener", label: "Screener", icon: LineChart },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/admin", label: "Admin", icon: Shield },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-white/5">
          <div className="size-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
            <Flame className="size-4 text-background" />
          </div>
          <span className="font-display font-semibold">CandleMind</span>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                  ${active ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-[image:var(--gradient-primary)] opacity-10"
                  />
                )}
                <n.icon className="size-4 relative" />
                <span className="relative">{n.label}</span>
                {active && <span className="absolute right-3 size-1.5 rounded-full bg-primary glow" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="glass rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-background font-semibold">A</div>
              <div>
                <div className="text-foreground font-medium">Alex Rivera</div>
                <div className="text-muted-foreground">Pro plan</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-background/40 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-1.5 w-72">
              <Search className="size-4 text-muted-foreground" />
              <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search lessons, stocks..." />
              <kbd className="text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
            </div>
            <button className="glass size-9 rounded-xl grid place-items-center hover:bg-white/10 transition">
              <Bell className="size-4" />
            </button>
            <button className="glass size-9 rounded-xl grid place-items-center hover:bg-white/10 transition">
              <Settings className="size-4" />
            </button>
          </div>
        </header>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-4 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
