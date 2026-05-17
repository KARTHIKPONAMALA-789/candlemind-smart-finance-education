import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Shield, ArrowRight, Flame } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Choose your role — CandleMind" }] }),
  component: RoleChooser,
});

const roles = [
  { id: "student", label: "Student", desc: "Learn the markets with AI tutor, courses, XP & quizzes.", icon: GraduationCap, color: "from-emerald-400 to-cyan-400" },
  { id: "tutor", label: "Tutor", desc: "Create courses, track learners and grow your audience.", icon: Briefcase, color: "from-cyan-400 to-blue-500" },
  { id: "admin", label: "Admin", desc: "Manage the platform, revenue, users and analytics.", icon: Shield, color: "from-violet-500 to-fuchsia-500" },
] as const;

function RoleChooser() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 [background:var(--gradient-hero)]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-primary/15 blur-[140px] animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="size-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
            <Flame className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">CandleMind</span>
        </Link>
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
            How will you use <span className="gradient-text">CandleMind</span>?
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Pick the experience that fits you. You'll get a dedicated dashboard & tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {roles.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ y: -4 }}
              className="glass-strong rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className={`absolute -top-10 -right-10 size-40 rounded-full bg-gradient-to-br ${r.color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
              <div className={`size-12 rounded-xl bg-gradient-to-br ${r.color} grid place-items-center mb-4 shadow-lg`}>
                <r.icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{r.label}</h3>
              <p className="text-sm text-muted-foreground mt-1 min-h-[3rem]">{r.desc}</p>
              <div className="mt-5 flex gap-2">
                <Link
                  to="/auth/$role/login" params={{ role: r.id }}
                  className="flex-1 text-center py-2 rounded-lg glass hover:bg-foreground/10 text-sm transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/$role/register" params={{ role: r.id }}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition"
                >
                  Register <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Already signed in? <Link to="/dashboard" className="text-primary hover:underline">Go to your dashboard</Link>
        </p>
      </motion.div>
    </div>
  );
}
