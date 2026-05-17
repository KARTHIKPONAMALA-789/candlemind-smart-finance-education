import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { MousePointerClick, Users, TrendingUp, Trophy, BarChart3 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getBrokerAnalytics } from "@/lib/brokers.functions";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/referrals")({
  head: () => ({ meta: [{ title: "Referral Analytics — Admin · CandleMinds" }] }),
  component: () => (
    <RoleGuard allow={["admin"]}>
      <ReferralAnalytics />
    </RoleGuard>
  ),
});

function ReferralAnalytics() {
  const fetchAnalytics = useServerFn(getBrokerAnalytics);
  const { data, isLoading } = useQuery({
    queryKey: ["broker-analytics"],
    queryFn: () => fetchAnalytics(),
  });

  const a = data;

  return (
    <AppShell title="Referral Analytics" subtitle="Demat partner clicks · conversions · top brokers">
      {isLoading && <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</div>}

      {a && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={MousePointerClick} label="Total clicks (90d)" value={a.totalClicks.toLocaleString("en-IN")} />
            <StatCard icon={Users} label="Unique users" value={a.uniqueUsers.toLocaleString("en-IN")} />
            <StatCard icon={TrendingUp} label="Conversions" value={a.totalConversions.toLocaleString("en-IN")} delta={`${a.conversionRate.toFixed(1)}% CTR`} />
            <StatCard icon={Trophy} label="Top broker" value={a.topBroker?.name ?? "—"} delta={a.topBroker ? `${a.topBroker.clicks} clicks` : undefined} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm">Clicks over time</h3>
                <span className="text-xs text-muted-foreground">Last 90 days</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={a.daily}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                    <XAxis dataKey="date" stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="clicks" stroke="oklch(0.86 0.22 145)" fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm">Clicks per broker</h3>
                <BarChart3 className="size-4 text-muted-foreground" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={a.perBroker.slice(0, 10)}>
                    <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                    <XAxis dataKey="name" stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={60} />
                    <YAxis stroke="oklch(0.7 0.03 250)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="clicks" fill="oklch(0.72 0.2 230)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-4 mt-6">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-sm mb-3">Top performing brokers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[480px]">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="text-left py-2">Broker</th>
                      <th className="text-right">Clicks</th>
                      <th className="text-right">Conversions</th>
                      <th className="text-right">CVR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.perBroker.map((p) => (
                      <tr key={p.slug} className="border-t border-border/40">
                        <td className="py-2 font-medium">{p.name}</td>
                        <td className="text-right font-mono">{p.clicks}</td>
                        <td className="text-right font-mono text-primary">{p.conversions}</td>
                        <td className="text-right font-mono text-muted-foreground">
                          {p.clicks > 0 ? `${((p.conversions / p.clicks) * 100).toFixed(1)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-sm mb-3">Recent clicks</h3>
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {a.recent.map((r, i) => (
                  <li key={i} className="text-xs flex items-center justify-between glass rounded-lg px-3 py-2">
                    <span className="font-medium">{r.broker}</span>
                    <span className="text-muted-foreground">
                      {r.device ?? "—"} · {new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </li>
                ))}
                {a.recent.length === 0 && <li className="text-xs text-muted-foreground">No clicks yet.</li>}
              </ul>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
