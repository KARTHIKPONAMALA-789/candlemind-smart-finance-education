import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Megaphone, Pin, Radio, CalendarClock, TrendingUp, Bell } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { broadcasts, liveClasses } from "@/lib/learning-data";

const iconFor = (t: string) => t === "live" ? Radio : t === "deadline" ? CalendarClock : t === "market" ? TrendingUp : Megaphone;

export const Route = createFileRoute("/broadcasts")({
  head: () => ({ meta: [{ title: "Broadcasts — CandleMind" }] }),
  component: () => <RoleGuard allow={["student"]}><BroadcastsPage /></RoleGuard>,
});

function BroadcastsPage() {
  const pinned = broadcasts.filter((b) => b.pinned);
  const feed = broadcasts.filter((b) => !b.pinned);

  return (
    <AppShell title="Broadcast Center" subtitle="Announcements, deadlines and live updates from your tutors">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Pin className="size-3" /> Pinned</div>
              {pinned.map((b) => {
                const Icon = iconFor(b.type);
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-5 border-l-4 border-accent relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/20 blur-3xl" />
                    <div className="relative flex gap-3">
                      <div className="size-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground shrink-0"><Icon className="size-5" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{b.tutor}</span>
                          <span>·</span>
                          <span className="uppercase tracking-wider">{b.type}</span>
                          <span>·</span>
                          <span>{b.when}</span>
                        </div>
                        <h3 className="font-display font-semibold mt-1">{b.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{b.body}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Latest updates</div>
            <div className="space-y-3">
              {feed.map((b, i) => {
                const Icon = iconFor(b.type);
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass rounded-2xl p-4 hover:bg-foreground/5 transition">
                    <div className="flex gap-3">
                      <div className="size-9 rounded-xl bg-secondary grid place-items-center text-primary shrink-0"><Icon className="size-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{b.tutor}</span>
                          <span>·</span>
                          <span className="uppercase tracking-wider text-[10px]">{b.type}</span>
                          <span className="ml-auto">{b.when}</span>
                        </div>
                        <div className="text-sm font-medium mt-0.5">{b.title}</div>
                        <p className="text-xs text-muted-foreground mt-1">{b.body}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium"><CalendarClock className="size-4 text-primary" /> Upcoming live</div>
            <div className="mt-3 space-y-2">
              {liveClasses.map((l) => (
                <div key={l.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                    <span className={l.status === "live" ? "text-destructive" : "text-muted-foreground"}>{l.status === "live" ? "● LIVE" : l.status}</span>
                    <span className="text-muted-foreground">{l.duration}</span>
                  </div>
                  <div className="text-sm font-medium mt-1">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.tutor} · {l.when}</div>
                  {l.status !== "scheduled" && (
                    <button className="mt-2 w-full text-xs py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">
                      {l.status === "live" ? "Join now" : "Set reminder"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium"><Bell className="size-4 text-accent" /> Notifications</div>
            <p className="text-xs text-muted-foreground mt-2">Enable push to never miss live sessions or deadlines.</p>
            <button className="mt-3 w-full text-sm py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">Enable</button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
