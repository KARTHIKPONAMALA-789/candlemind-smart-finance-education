import { RoleGuard } from "@/components/auth/RoleGuard";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Play, Clock, Trophy } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { courses } from "@/lib/mock-data";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses — CandleMind" }] }),
  component: () => <RoleGuard allow={["student"]}><Courses /></RoleGuard>,
});

const cats = ["All", "Technical", "Fundamental", "Strategy", "Advanced"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

function Courses() {
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");

  const filtered = courses.filter(
    (c) => (cat === "All" || c.cat === cat) && (lvl === "All" || c.level === lvl)
  );

  return (
    <AppShell title="Courses" subtitle="Learn in bite-sized lessons. Earn XP. Master finance.">
      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs transition ${
                cat === c ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : "glass hover:bg-foreground/10"
              }`}
            >{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l} onClick={() => setLvl(l)}
              className={`px-3 py-1.5 rounded-full text-xs transition ${
                lvl === l ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl overflow-hidden group"
          >
            <div className={`h-36 bg-gradient-to-br ${c.color} relative`}>
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute top-3 left-3 text-xs glass-strong rounded-md px-2 py-0.5 text-primary-foreground">{c.cat}</div>
              <div className="absolute top-3 right-3 text-xs glass-strong rounded-md px-2 py-0.5 text-primary-foreground">{c.level}</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-primary-foreground/90 text-xs">
                <span className="flex items-center gap-1"><Clock className="size-3" /> {c.lessons * 6} min</span>
                <span className="flex items-center gap-1"><Trophy className="size-3" /> {c.lessons * 50} XP</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.lessons} lessons · Self-paced</p>
              <div className="mt-4 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${c.progress}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.progress}% complete</span>
              </div>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">
                <Play className="size-4" /> {c.progress > 0 ? "Continue" : "Start"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
