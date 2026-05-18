import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Lock, Bell, Palette, LogOut, Check, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CandleMinds" },
      { name: "description", content: "Manage your CandleMinds profile, security, notifications and preferences." },
    ],
  }),
  component: SettingsPage,
});

type Status = { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string };

function Banner({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  const ok = status.kind === "ok";
  return (
    <div
      className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
        ok ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-destructive/30 text-destructive bg-destructive/5"
      }`}
    >
      {ok ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
      {status.msg}
    </div>
  );
}

function Section({ icon: Icon, title, desc, children }: { icon: typeof UserIcon; title: string; desc: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="size-9 rounded-xl glass-strong grid place-items-center shrink-0">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

const inputCls =
  "w-full bg-background/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60 transition";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass text-sm hover:bg-foreground/10 transition disabled:opacity-60";

function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  // Profile
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileStatus, setProfileStatus] = useState<Status>({ kind: "idle" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Email
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<Status>({ kind: "idle" });
  const [savingEmail, setSavingEmail] = useState(false);

  // Password
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdStatus, setPwdStatus] = useState<Status>({ kind: "idle" });
  const [savingPwd, setSavingPwd] = useState(false);

  // Theme
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Notifications
  const [notif, setNotif] = useState({ market: true, courses: true, referrals: false, weekly: true });

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    setUsername((user.user_metadata?.username as string) ?? user.email?.split("@")[0] ?? "");
    (async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      setFullName(data?.full_name ?? (user.user_metadata?.full_name as string) ?? "");
    })();
  }, [user]);

  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem("cm-theme")) as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("light", stored === "light");
    }
    const n = typeof localStorage !== "undefined" && localStorage.getItem("cm-notif");
    if (n) try { setNotif(JSON.parse(n)); } catch { /* noop */ }
  }, []);

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileStatus({ kind: "idle" });
    const trimmedName = fullName.trim();
    const trimmedUser = username.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setSavingProfile(false);
      return setProfileStatus({ kind: "err", msg: "Full name must be 2–80 characters." });
    }
    if (trimmedUser && !/^[a-zA-Z0-9_]{3,24}$/.test(trimmedUser)) {
      setSavingProfile(false);
      return setProfileStatus({ kind: "err", msg: "Username: 3–24 chars, letters/numbers/underscore only." });
    }
    const { error: pErr } = await supabase.from("profiles").update({ full_name: trimmedName }).eq("id", user.id);
    const { error: uErr } = await supabase.auth.updateUser({ data: { full_name: trimmedName, username: trimmedUser } });
    setSavingProfile(false);
    if (pErr || uErr) setProfileStatus({ kind: "err", msg: (pErr ?? uErr)!.message });
    else setProfileStatus({ kind: "ok", msg: "Profile updated successfully." });
  }

  async function saveEmail() {
    setSavingEmail(true);
    setEmailStatus({ kind: "idle" });
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSavingEmail(false);
      return setEmailStatus({ kind: "err", msg: "Enter a valid email address." });
    }
    const { error } = await supabase.auth.updateUser({ email: trimmed });
    setSavingEmail(false);
    if (error) setEmailStatus({ kind: "err", msg: error.message });
    else setEmailStatus({ kind: "ok", msg: "Confirmation link sent. Check your inbox to confirm the new email." });
  }

  async function savePassword() {
    setSavingPwd(true);
    setPwdStatus({ kind: "idle" });
    if (newPwd.length < 8) {
      setSavingPwd(false);
      return setPwdStatus({ kind: "err", msg: "Password must be at least 8 characters." });
    }
    if (newPwd !== confirmPwd) {
      setSavingPwd(false);
      return setPwdStatus({ kind: "err", msg: "Passwords do not match." });
    }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) setPwdStatus({ kind: "err", msg: error.message });
    else {
      setPwdStatus({ kind: "ok", msg: "Password updated." });
      setNewPwd("");
      setConfirmPwd("");
    }
  }

  function applyTheme(next: "dark" | "light") {
    setTheme(next);
    localStorage.setItem("cm-theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  function toggleNotif(key: keyof typeof notif) {
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    localStorage.setItem("cm-notif", JSON.stringify(next));
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <div className="text-xs text-muted-foreground mb-2">
              <Link to="/" className="hover:text-foreground">Home</Link> · Settings
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Account <span className="gradient-text">settings</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              Manage your profile, security, notifications and theme preferences.
            </p>
          </div>

          <div className="space-y-5">
            <Section icon={UserIcon} title="Profile" desc="How your name appears across CandleMinds.">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Full name</label>
                  <input className={inputCls + " mt-1"} value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Username</label>
                  <input className={inputCls + " mt-1"} value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={saveProfile} disabled={savingProfile} className={btnPrimary}>
                  {savingProfile ? "Saving…" : "Save profile"}
                </button>
              </div>
              <Banner status={profileStatus} />
            </Section>

            <Section icon={Mail} title="Email" desc="Update the email used for login and notifications.">
              <label className="text-xs text-muted-foreground">Email address</label>
              <input type="email" className={inputCls + " mt-1"} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
              <div className="mt-4 flex items-center gap-2">
                <button onClick={saveEmail} disabled={savingEmail} className={btnPrimary}>
                  {savingEmail ? "Sending…" : "Update email"}
                </button>
              </div>
              <Banner status={emailStatus} />
            </Section>

            <Section icon={Lock} title="Password" desc="Choose a strong password (min 8 characters).">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">New password</label>
                  <input type="password" className={inputCls + " mt-1"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} maxLength={128} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Confirm password</label>
                  <input type="password" className={inputCls + " mt-1"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} maxLength={128} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={savePassword} disabled={savingPwd} className={btnPrimary}>
                  {savingPwd ? "Updating…" : "Update password"}
                </button>
                <Link to="/auth/forgot" className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot current password?
                </Link>
              </div>
              <Banner status={pwdStatus} />
            </Section>

            <Section icon={Palette} title="Theme" desc="Switch between dark (default) and light appearance.">
              <div className="flex gap-2">
                {(["dark", "light"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => applyTheme(t)}
                    className={`px-4 py-2 text-sm rounded-lg border transition capitalize ${
                      theme === t
                        ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent shadow-[var(--shadow-glow)]"
                        : "glass border-border hover:bg-foreground/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={Bell} title="Notifications" desc="Choose what we email you about.">
              {(
                [
                  ["market", "Market news digest"],
                  ["courses", "New courses & lessons"],
                  ["referrals", "Demat referral updates"],
                  ["weekly", "Weekly performance summary"],
                ] as Array<[keyof typeof notif, string]>
              ).map(([k, label]) => (
                <label key={k} className="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
                  <span className="text-sm">{label}</span>
                  <button
                    type="button"
                    onClick={() => toggleNotif(k)}
                    className={`relative w-10 h-6 rounded-full transition ${notif[k] ? "bg-[image:var(--gradient-primary)]" : "bg-foreground/10"}`}
                    aria-pressed={notif[k]}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-background transition ${
                        notif[k] ? "left-[1.125rem]" : "left-0.5"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </Section>

            <Section icon={LogOut} title="Account" desc="Sign out of your CandleMinds account on this device.">
              <button onClick={handleSignOut} className={btnGhost}>
                <LogOut className="size-3.5" /> Sign out
              </button>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
