import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Users, DollarSign, MousePointerClick, Crown, Share2, Mail } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { referralLeaders, referralChart } from "@/lib/mock-data";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/referrals")({
  head: () => ({ meta: [{ title: "Referrals — CandleMind" }] }),
  component: Referrals,
});

function Referrals() {
  const [copied, setCopied] = useState(false);
  const code = "ALEX-CM-2024";
  const link = `candlemind.app/r/${code}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell title="Referrals" subtitle="Earn $20 for every friend who upgrades to Pro">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MousePointerClick} label="Total clicks" value="1,842" delta="+12.4%" />
        <StatCard icon={Users} label="Sign-ups" value="284" delta="+8.2%" />
        <StatCard icon={DollarSign} label="Earned" value={<span className="gradient-text">$560</span>} delta="+$80 this week" />
        <StatCard icon={Crown} label="Rank" value="#4" delta="Top 1%" />
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_400px] gap-4">
        {/* Referral code card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 size-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="text-xs text-primary">Your unique link</div>
            <div className="mt-2 font-display text-2xl font-semibold gradient-text">{code}</div>

            <div className="mt-5 glass rounded-xl p-3 flex items-center gap-2">
              <code className="flex-1 text-sm font-mono truncate text-muted-foreground">{link}</code>
              <button
                onClick={copy}
                className="px-3 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:shadow-[var(--shadow-glow)] transition"
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex-1 glass rounded-xl py-2.5 text-sm hover:bg-foreground/10 transition flex items-center justify-center gap-2">
                <Share2 className="size-4" /> Share
              </button>
              <button className="flex-1 glass rounded-xl py-2.5 text-sm hover:bg-foreground/10 transition flex items-center justify-center gap-2">
                <Mail className="size-4" /> Invite via email
              </button>
            </div>

            {/* Chart */}
            <div className="mt-8 h-56">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Conversion analytics</h4>
                <span className="text-xs text-muted-foreground">Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={referralChart}>
                  <defs>
                    <linearGradient id="r1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.86 0.22 145)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="r2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.72 0.2 230)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                  <XAxis dataKey="m" stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.21 0.025 250)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="clicks" stroke="oklch(0.72 0.2 230)" fill="url(#r2)" />
                  <Area type="monotone" dataKey="signups" stroke="oklch(0.86 0.22 145)" fill="url(#r1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Crown className="size-4 text-primary" />
            <h3 className="font-display font-semibold">Leaderboard</h3>
          </div>
          <div className="space-y-2">
            {referralLeaders.map((l) => (
              <div
                key={l.rank}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  l.name === "You" ? "glass-strong gradient-border" : "glass hover:bg-foreground/10"
                }`}
              >
                <div className={`size-7 rounded-lg grid place-items-center text-xs font-semibold ${
                  l.rank === 1 ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : "bg-foreground/5"
                }`}>{l.rank}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.refs} referrals</div>
                </div>
                <div className="text-sm font-mono text-primary">${l.earned}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
