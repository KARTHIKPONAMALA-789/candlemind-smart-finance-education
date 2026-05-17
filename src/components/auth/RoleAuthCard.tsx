import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Mail, GraduationCap, Briefcase, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { dashboardPath, type Role } from "@/hooks/use-auth";

const ROLE_META: Record<Role, { label: string; desc: string; icon: typeof GraduationCap; color: string }> = {
  student: { label: "Student", desc: "Master the markets with your AI mentor.", icon: GraduationCap, color: "from-emerald-400 to-cyan-400" },
  tutor:   { label: "Tutor",   desc: "Teach, upload courses, grow your audience.", icon: Briefcase, color: "from-cyan-400 to-blue-500" },
  admin:   { label: "Admin",   desc: "Run the platform. Revenue, users, insights.", icon: Shield, color: "from-violet-500 to-fuchsia-500" },
};

export function RoleAuthCard({ role, mode }: { role: Role; mode: "login" | "register" }) {
  const meta = ROLE_META[role];
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        // verify role
        const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
        if (r?.role && r.role !== role) {
          toast.error(`This account is registered as ${r.role}. Redirecting…`);
          navigate({ to: dashboardPath(r.role as Role) });
          return;
        }
        toast.success(`Welcome back, ${meta.label}!`);
        navigate({ to: dashboardPath(role) });
      } else {
        const redirectUrl = `${window.location.origin}${dashboardPath(role)}`;
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { full_name: form.fullName }, emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        if (data.user) {
          // assign role
          const { error: rErr } = await supabase.from("user_roles").insert({ user_id: data.user.id, role });
          if (rErr && !rErr.message.includes("duplicate")) console.error(rErr);
        }
        toast.success("Account created! Check your email to verify.");
        if (data.session) navigate({ to: dashboardPath(role) });
        else navigate({ to: "/auth/$role/login", params: { role } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // persist intended role so callback can assign it
      sessionStorage.setItem("candlemind_intended_role", role);
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth/callback` });
      if (res.error) throw res.error;
      if (!res.redirected) navigate({ to: dashboardPath(role) });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign in failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 [background:var(--gradient-hero)]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-gradient-to-br ${meta.color} opacity-20 blur-3xl animate-pulse-glow`} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="size-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
              <Flame className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">CandleMind</span>
          </Link>
          <div className={`inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs mb-4 bg-gradient-to-br ${meta.color} text-primary-foreground`}>
            <meta.icon className="size-3" /> {meta.label} portal
          </div>
          <h2 className="text-4xl font-display font-semibold leading-tight">
            {isLogin ? "Welcome back to" : "Join CandleMind as a"} <span className="gradient-text">{meta.label.toLowerCase()}</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">{meta.desc}</p>
        </motion.div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 relative">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-strong rounded-3xl p-8">
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">← Change role</Link>
          <h1 className="mt-4 text-2xl font-display font-semibold">
            {isLogin ? `Sign in as ${meta.label}` : `Create your ${meta.label.toLowerCase()} account`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Use your email and password." : "Start in under a minute."}
          </p>

          <button
            onClick={handleGoogle} disabled={loading}
            className="mt-6 w-full glass rounded-xl py-2.5 text-sm hover:bg-foreground/10 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".7"/></svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-foreground/10" /> or email <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <Field label="Full name" type="text" value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })} placeholder="Alex Rivera" required />
            )}
            <Field label="Email" type="email" value={form.email} icon={<Mail className="size-4" />}
              onChange={(v) => setForm({ ...form, email: v })} placeholder="you@candlemind.app" required />
            <Field label="Password" type="password" value={form.password}
              onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" required minLength={6} />

            {isLogin && (
              <div className="text-right">
                <Link to="/auth/forgot" className="text-xs text-muted-foreground hover:text-primary">Forgot password?</Link>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "New here? " : "Already have an account? "}
            <Link
              to={isLogin ? "/auth/$role/register" : "/auth/$role/login"}
              params={{ role }} className="text-primary hover:underline"
            >
              {isLogin ? `Register as ${meta.label.toLowerCase()}` : "Sign in"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, icon, required, minLength }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ReactNode; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 glass rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-2 ring-primary/40 transition">
        {icon}
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required} minLength={minLength}
          className="bg-transparent outline-none text-sm flex-1"
        />
      </div>
    </label>
  );
}
