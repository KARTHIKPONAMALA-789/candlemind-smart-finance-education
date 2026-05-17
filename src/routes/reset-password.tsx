import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — CandleMind" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated. Please sign in.");
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 [background:var(--gradient-hero)]" />
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 space-y-4"
      >
        <h1 className="text-2xl font-display font-semibold">Set a new password</h1>
        <input
          type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="New password"
          className="w-full glass rounded-xl px-3 py-2.5 bg-transparent outline-none text-sm focus:ring-2 ring-primary/40"
        />
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-background font-medium flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="size-4 animate-spin" />} Update password
        </button>
      </motion.form>
    </div>
  );
}
