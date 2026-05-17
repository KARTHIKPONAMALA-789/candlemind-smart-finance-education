import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Star } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { stocks, sectors } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

export const Route = createFileRoute("/screener")({
  head: () => ({ meta: [{ title: "Screener — CandleMind" }] }),
  component: Screener,
});

const spark = (seed: number) =>
  Array.from({ length: 20 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin((i + seed) * 0.6) * 15 + Math.random() * 8,
  }));

function Screener() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [maxPE, setMaxPE] = useState(200);

  const filtered = useMemo(
    () => stocks.filter(
      (s) =>
        (sector === "All" || s.sector === sector) &&
        s.pe <= maxPE &&
        (q === "" || s.ticker.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase()))
    ),
    [q, sector, maxPE]
  );

  return (
    <AppShell title="Stock Screener" subtitle="10,000+ tickers · Live filters · AI ranked">
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Filter sidebar */}
        <aside className="glass rounded-2xl p-5 space-y-6 h-fit">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="size-4 text-primary" /> Filters
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Sector</div>
            <div className="flex flex-wrap gap-1.5">
              {sectors.map((s) => (
                <button
                  key={s} onClick={() => setSector(s)}
                  className={`text-xs px-2.5 py-1 rounded-full transition ${
                    sector === s ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : "glass hover:bg-foreground/10"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Max P/E</span>
              <span className="text-foreground font-mono">{maxPE}</span>
            </div>
            <input
              type="range" min={10} max={200} value={maxPE}
              onChange={(e) => setMaxPE(Number(e.target.value))}
              className="w-full mt-2 accent-[oklch(0.86_0.22_145)]"
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Market cap</div>
            <div className="space-y-1.5 text-xs">
              {["Mega (>$200B)", "Large ($10–200B)", "Mid ($2–10B)", "Small (<$2B)"].map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[oklch(0.86_0.22_145)]" defaultChecked={m.startsWith("Mega") || m.startsWith("Large")} />
                  <span className="text-muted-foreground">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Performance</div>
            <div className="space-y-1.5 text-xs">
              {["Gainers", "Losers", "Most active", "New highs"].map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[oklch(0.86_0.22_145)]" />
                  <span className="text-muted-foreground">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="glass rounded-2xl p-3 flex items-center gap-2">
            <Search className="size-4 text-muted-foreground ml-2" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by ticker or company..."
              className="flex-1 bg-transparent outline-none text-sm py-1"
            />
            <span className="text-xs text-muted-foreground">{filtered.length} results</span>
          </div>

          <div className="mt-4 glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_100px_120px_140px_100px] gap-3 px-5 py-3 text-xs text-muted-foreground border-b border-border">
              <div>Company</div><div>Price</div><div>Change</div><div className="hidden md:block">Sector</div><div>Chart</div><div className="text-right">P/E</div>
            </div>
            {filtered.map((s, i) => {
              const up = s.change >= 0;
              return (
                <motion.div
                  key={s.ticker}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_100px_100px_120px_140px_100px] gap-3 px-5 py-4 items-center border-b border-border hover:bg-foreground/5 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button className="text-muted-foreground hover:text-primary"><Star className="size-4" /></button>
                    <div className="min-w-0">
                      <div className="font-medium">{s.ticker}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.name}</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm">${s.price.toFixed(2)}</div>
                  <div className={`text-sm flex items-center gap-1 ${up ? "text-primary" : "text-destructive"}`}>
                    {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {up ? "+" : ""}{s.change.toFixed(2)}%
                  </div>
                  <div className="hidden md:block text-xs text-muted-foreground">{s.sector}</div>
                  <div className="h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={spark(i)}>
                        <Line type="monotone" dataKey="y" stroke={up ? "oklch(0.86 0.22 145)" : "oklch(0.65 0.24 25)"} strokeWidth={1.5} dot={false} />
                        <Tooltip cursor={false} contentStyle={{ display: "none" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-right font-mono text-sm">{s.pe.toFixed(1)}</div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">No matches. Loosen your filters.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
