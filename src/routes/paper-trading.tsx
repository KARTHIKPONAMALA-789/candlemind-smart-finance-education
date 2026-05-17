import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Plus, Minus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { paperHoldings, paperEquityCurve } from "@/lib/learning-data";
import { stocks } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/paper-trading")({
  head: () => ({ meta: [{ title: "Paper Trading — CandleMind" }] }),
  component: PaperTrading,
});

const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const inr2 = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function PaperTrading() {
  const [holdings, setHoldings] = useState(paperHoldings);
  const [cash, setCash] = useState(100000);
  const [selected, setSelected] = useState(stocks[0].ticker);

  const portfolioValue = useMemo(() => holdings.reduce((s, h) => s + h.last * h.qty, 0), [holdings]);
  const totalPL = useMemo(() => holdings.reduce((s, h) => s + (h.last - h.avg) * h.qty, 0), [holdings]);
  const stock = stocks.find((s) => s.ticker === selected)!;

  const trade = (side: "buy" | "sell") => {
    setHoldings((curr) => {
      const existing = curr.find((h) => h.ticker === selected);
      if (side === "buy") {
        if (cash < stock.price) return curr;
        setCash((c) => c - stock.price);
        if (existing) {
          const newQty = existing.qty + 1;
          const newAvg = (existing.avg * existing.qty + stock.price) / newQty;
          return curr.map((h) => h.ticker === selected ? { ...h, qty: newQty, avg: newAvg, last: stock.price } : h);
        }
        return [...curr, { ticker: stock.ticker, qty: 1, avg: stock.price, last: stock.price }];
      }
      if (!existing || existing.qty === 0) return curr;
      setCash((c) => c + stock.price);
      return curr.map((h) => h.ticker === selected ? { ...h, qty: h.qty - 1, last: stock.price } : h).filter((h) => h.qty > 0);
    });
  };

  return (
    <AppShell title="Paper Trading Simulator" subtitle="Practice on NSE stocks with ₹1,00,000 virtual capital — zero risk, real prices">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Portfolio value" value={<span className="gradient-text">{inr(portfolioValue)}</span>} delta="+8.4% all-time" />
        <StatCard icon={TrendingUp} label="Total P/L" value={<span className={totalPL >= 0 ? "text-primary" : "text-destructive"}>{totalPL >= 0 ? "+" : ""}{inr2(totalPL)}</span>} />
        <StatCard icon={TrendingDown} label="Cash balance" value={inr(cash)} />
        <StatCard icon={Wallet} label="Open positions" value={String(holdings.length)} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-display font-semibold">Equity curve</h3>
          <p className="text-xs text-muted-foreground">7-day portfolio performance</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={paperEquityCurve}>
              <defs>
                <linearGradient id="pt" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.17 162)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.21 0.04 260 / 6%)" vertical={false} />
              <XAxis dataKey="d" stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.92 0.01 260)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#pt)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-strong rounded-2xl p-5">
          <h3 className="font-display font-semibold">Place order</h3>
          <p className="text-xs text-muted-foreground">Simulated · real prices</p>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-3 w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none">
            {stocks.map((s) => <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>)}
          </select>
          <div className="mt-3 glass rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium">{stock.ticker}</span>
              <span className={`text-sm font-medium ${stock.change >= 0 ? "text-primary" : "text-destructive"}`}>{stock.change >= 0 ? "+" : ""}{stock.change}%</span>
            </div>
            <div className="text-2xl font-display font-bold mt-1">{inr2(stock.price)}</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => trade("buy")} className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-medium hover:shadow-[var(--shadow-glow)] transition">
              <Plus className="size-4" /> Buy
            </button>
            <button onClick={() => trade("sell")} className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-secondary hover:bg-foreground/5 text-sm font-medium transition">
              <Minus className="size-4" /> Sell
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 glass rounded-2xl p-5">
        <h3 className="font-display font-semibold mb-3">Open positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2 font-medium">Ticker</th><th className="text-left font-medium">Qty</th><th className="text-left font-medium">Avg cost</th><th className="text-left font-medium">Last</th><th className="text-left font-medium">Market value</th><th className="text-right font-medium">Unrealized P/L</th></tr>
            </thead>
            <tbody>
              {holdings.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No positions yet — place your first paper trade above.</td></tr>
              )}
              {holdings.map((h) => {
                const pl = (h.last - h.avg) * h.qty;
                return (
                  <tr key={h.ticker} className="border-b border-border last:border-none hover:bg-foreground/5 transition">
                    <td className="py-3 font-mono font-medium">{h.ticker}</td>
                    <td>{h.qty}</td>
                    <td className="text-muted-foreground">${h.avg.toFixed(2)}</td>
                    <td>${h.last.toFixed(2)}</td>
                    <td>${(h.last * h.qty).toFixed(2)}</td>
                    <td className={`text-right font-medium ${pl >= 0 ? "text-primary" : "text-destructive"}`}>{pl >= 0 ? "+" : ""}${pl.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppShell>
  );
}
