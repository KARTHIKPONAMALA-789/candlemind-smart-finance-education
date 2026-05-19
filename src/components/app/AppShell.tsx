import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Settings, LogOut } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { navForRole } from "@/lib/role-nav";
import { Logo } from "@/components/site/Logo";
import { BackButton } from "@/components/app/BackButton";

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role, user, signOut } = useAuth();
  // MVP: infer role from current route when auth role is unavailable, so
  // admin/tutor dashboards never show the student sidebar.
  const inferredRole: "admin" | "tutor" | "student" | null = pathname.startsWith("/admin-dashboard")
    ? "admin"
    : pathname.startsWith("/tutor-dashboard")
    ? "tutor"
    : role ?? "student";
  const effectiveRole = role ?? inferredRole;
  const nav = navForRole(effectiveRole);
  const showSidebar = role === "student" && !!user;
  const roleLabel = effectiveRole ? effectiveRole.charAt(0).toUpperCase() + effectiveRole.slice(1) : "Guest";
  const displayName = (user?.user_metadata?.full_name as string) ?? user?.email?.split("@")[0] ?? "Learner";

  return (
    <div className="min-h-screen flex">
      {showSidebar && (
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-border" aria-label="CandleMinds home">
          <Logo variant="mark" size={32} />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-semibold">CandleMinds</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{roleLabel} portal</span>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const [base] = n.to.split("?");
            const active = pathname === base;
            return (
              <Link
                key={n.to}
                to={base}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                  ${active ? "text-foreground bg-foreground/5" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"}`}
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
        <div className="p-4 border-t border-border space-y-2">
          <div className="glass rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-foreground font-medium truncate">{displayName}</div>
                <div className="text-muted-foreground">{roleLabel}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 rounded-lg hover:bg-foreground/5 transition"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>
      )}

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border px-4 lg:px-8 flex items-center justify-between bg-background/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <BackButton />
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold truncate">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GlobalSearch />
            <button className="glass size-9 rounded-xl grid place-items-center hover:bg-foreground/10 transition">
              <Bell className="size-4" />
            </button>
            <Link
              to="/"
              aria-label="Settings"
              className="glass size-9 rounded-xl grid place-items-center hover:bg-foreground/10 transition"
            >
              <Settings className="size-4" />
            </Link>
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
