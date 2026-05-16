import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Github, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — CandleMind" }] }),
  component: Login,
});

function Login() {
  return <AuthCard mode="login" />;
}

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 [background:var(--gradient-hero)]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="size-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
              <Flame className="size-4 text-background" />
            </div>
            <span className="font-display text-lg font-semibold">CandleMind</span>
          </Link>
          <h2 className="text-4xl font-display font-semibold leading-tight">
            Trade smarter with your <span className="gradient-text">AI mentor</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick up where 128,000 learners left off — courses, screeners, and an AI tutor
            that actually understands markets.
          </p>
          <div className="mt-10 glass-strong rounded-2xl p-5">
            <div className="text-xs text-muted-foreground">Today's lesson</div>
            <div className="mt-1 font-display font-semibold">Reading volume confirmation</div>
            <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-2/3 bg-[image:var(--gradient-primary)]" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">8 of 12 lessons · 320 XP earned</div>
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-3xl p-8"
        >
          <h1 className="text-2xl font-display font-semibold">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Sign in to continue learning." : "Start your free CandleMind account."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="glass rounded-xl py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
              <Github className="size-4" /> GitHub
            </button>
            <button className="glass rounded-xl py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
              <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".7"/></svg>
              Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-white/10" /> or with email <div className="flex-1 h-px bg-white/10" />
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <Field label="Full name" type="text" placeholder="Alex Rivera" />
            )}
            <Field label="Email" type="email" placeholder="you@candlemind.app" icon={<Mail className="size-4" />} />
            <Field label="Password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-background font-medium hover:shadow-[var(--shadow-glow)] transition"
            >
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "New here? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-primary hover:underline">
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, icon }: { label: string; type: string; placeholder: string; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 glass rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-2 ring-primary/40 transition">
        {icon}
        <input type={type} placeholder={placeholder} className="bg-transparent outline-none text-sm flex-1" />
      </div>
    </label>
  );
}
