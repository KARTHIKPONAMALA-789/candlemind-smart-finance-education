import { motion } from "framer-motion";
import { LucideIcon, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

export function StatCard({
  icon: Icon, label, value, delta, children,
}: { icon: LucideIcon; label: string; value: ReactNode; delta?: string; children?: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 size-40 rounded-full bg-[image:var(--gradient-primary)] opacity-0 group-hover:opacity-20 blur-3xl transition" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-display font-semibold">{value}</div>
      {delta && (
        <div className="mt-1 text-xs text-primary flex items-center gap-1">
          <TrendingUp className="size-3" /> {delta}
        </div>
      )}
      {children}
    </motion.div>
  );
}
