import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Reset password — CandleMind" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Reset link sent. Check your inbox.");
  };

  return (
    <div className="min-h-screen relative overflow-hidden grid place-items-center p-6">
      <div className="absolute inset-0 [background:var(--gradient-hero)]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass-strong rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="size-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
            <Flame className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">CandleMind</span>
        </Link>
        <h1 className="text-2xl font-display font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll send a magic reset link.</p>

        {sent ? (
          <div className="mt-6 glass rounded-xl p-4 text-sm">
            Check <span className="text-primary">{email}</span> for the reset link.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Email</span>
              <div className="mt-1 glass rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-2 ring-primary/40">
                <Mail className="size-4" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none text-sm flex-1" />
              </div>
            </label>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 className="size-4 animate-spin" />} Send reset link
            </button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered? <Link to="/auth" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
