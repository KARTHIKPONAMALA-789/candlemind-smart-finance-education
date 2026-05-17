import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Star, Sparkles, X, Loader2, BarChart3, Flame } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { stocks, sectors, type Stock } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, Tooltip, AreaChart, Area } from "recharts";
import { explainStock } from "@/lib/stock-ai.functions";

export const Route = createFileRoute("/screener")({
  head: () => ({
    meta: [
      { title: "Stock Screener — Free Screening Tool | CandleMind" },
      { name: "description", content: "Free public stock screener with sector, P/E, market cap and volume filters. AI-powered beginner explanations for every ticker. No login required." },
      { property: "og:title", content: "Stock Screener — CandleMind" },
      { property: "og:description", content: "Filter 10,000+ tickers, see top gainers and losers, and read AI-generated beginner insights." },
    ],
  }),
  component: PublicScreener,
});

const spark = (seed: number, trend: number) =>
  Array.from({ length: 24 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin((i + seed) * 0.6) * 12 + (trend * i) / 4 + Math.random() * 4,
  }));

type CapBucket = "Mega" | "Large" | "Mid" | "Small";
const capOf = (m: string): CapBucket => {
  if (m.endsWith("T")) return "Mega";
  const n = parseFloat(m);
  if (n >= 200) return "Mega";
  if (n >= 10) return "Large";
  if (n >= 2) return "Mid";
  return "Small";
};
const volOf = (v: string) => parseFloat(v);

function PublicScreener() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [maxPE, setMaxPE] = useState(200);
  const [minVol, setMinVol] = useState(0);
  const [caps, setCaps] = useState<Record<CapBucket, boolean>>({ Mega: true, Large: true, Mid: true, Small: true });
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set(["NVDA", "AAPL"]));
  const [selected, setSelected] = useState<Stock | null>(null);

  const filtered = useMemo(
    () => stocks.filter((s) =>
      (sector === "All" || s.sector === sector) &&
      s.pe <= maxPE &&
      volOf(s.volume) >= minVol &&
      caps[capOf(s.mcap)] &&
      (q === "" || s.ticker.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase()))
    ),
    [q, sector, maxPE, minVol, caps]
  );

  const gainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
  const losers = [...stocks].sort((a, b) => a.change - b.change).slice(0, 4);
  const trending = [...stocks].sort((a, b) => volOf(b.volume) - volOf(a.volume)).slice(0, 4);

  const toggleWatch = (t: string) =>
    setWatchlist((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 lg:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="size-3 text-primary" /> Free · No login required
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight">
            Public Stock <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Screener</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Filter 10,000+ tickers by sector, P/E, market cap and volume. Click any stock for an AI-powered beginner explanation.
          </p>
        </motion.div>

        {/* Top widgets */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <WidgetCard title="Top Gainers" icon={<TrendingUp className="size-4 text-emerald-500" />} items={gainers} onClick={setSelected} />
          <WidgetCard title="Top Losers" icon={<TrendingDown className="size-4 text-rose-500" />} items={losers} onClick={setSelected} />
          <WidgetCard title="Trending (Volume)" icon={<Flame className="size-4 text-amber-500" />} items={trending} onClick={setSelected} />
        </div>

        {/* Search bar */}
        <div className="glass-strong rounded-2xl p-3 mb-6 flex items-center gap-3">
          <Search className="size-4 text-muted-foreground ml-2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ticker or company name (e.g. AAPL, Tesla)…"
            className="bg-transparent outline-none flex-1 text-sm py-1.5"
          />
          <span className="text-xs text-muted-foreground pr-3">{filtered.length} results</span>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          {/* Filter sidebar */}
          <aside className="glass rounded-2xl p-5 space-y-6 h-fit lg:sticky lg:top-24">
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
                className="w-full mt-2 accent-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Min Volume (M)</span>
                <span className="text-foreground font-mono">{minVol}M</span>
              </div>
              <input
                type="range" min={0} max={200} step={5} value={minVol}
                onChange={(e) => setMinVol(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Market cap</div>
              <div className="space-y-1.5 text-xs">
                {(["Mega", "Large", "Mid", "Small"] as CapBucket[]).map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox" className="accent-primary"
                      checked={caps[m]}
                      onChange={(e) => setCaps((c) => ({ ...c, [m]: e.target.checked }))}
                    />
                    <span className="text-muted-foreground">
                      {m === "Mega" && "Mega (>$200B)"}
                      {m === "Large" && "Large ($10–200B)"}
                      {m === "Mid" && "Mid ($2–10B)"}
                      {m === "Small" && "Small (<$2B)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setSector("All"); setMaxPE(200); setMinVol(0); setCaps({ Mega: true, Large: true, Mid: true, Small: true }); }}
              className="w-full text-xs py-2 rounded-lg glass hover:bg-foreground/5 transition"
            >Reset filters</button>
          </aside>

          {/* Results table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-3 px-4">Ticker</th>
                    <th className="text-left font-medium py-3 px-4">Sector</th>
                    <th className="text-right font-medium py-3 px-4">Price</th>
                    <th className="text-right font-medium py-3 px-4">24h</th>
                    <th className="text-right font-medium py-3 px-4 hidden md:table-cell">P/E</th>
                    <th className="text-right font-medium py-3 px-4 hidden md:table-cell">Mkt Cap</th>
                    <th className="text-right font-medium py-3 px-4 hidden lg:table-cell">Vol</th>
                    <th className="text-right font-medium py-3 px-4 hidden lg:table-cell">Trend</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((s, i) => {
                      const watched = watchlist.has(s.ticker);
                      return (
                        <motion.tr
                          key={s.ticker}
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => setSelected(s)}
                          className="border-b border-border last:border-0 hover:bg-foreground/[0.03] cursor-pointer group"
                        >
                          <td className="py-3 px-4">
                            <div className="font-mono font-semibold">{s.ticker}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[160px]">{s.name}</div>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{s.sector}</td>
                          <td className="py-3 px-4 text-right font-mono">${s.price.toFixed(2)}</td>
                          <td className={`py-3 px-4 text-right font-mono ${s.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4 text-right font-mono hidden md:table-cell">{s.pe.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right hidden md:table-cell">{s.mcap}</td>
                          <td className="py-3 px-4 text-right hidden lg:table-cell text-xs text-muted-foreground">{s.volume}</td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <div className="h-8 w-24 ml-auto">
                              <ResponsiveContainer>
                                <LineChart data={spark(s.ticker.charCodeAt(0), s.change)}>
                                  <Line type="monotone" dataKey="y" stroke={s.change >= 0 ? "oklch(0.7 0.17 162)" : "oklch(0.62 0.22 25)"} strokeWidth={1.5} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleWatch(s.ticker); }}
                              className="opacity-60 hover:opacity-100 transition"
                              aria-label="Toggle watchlist"
                            >
                              <Star className={`size-4 ${watched ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  No stocks match your filters. Try resetting.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {selected && <StockModal stock={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function WidgetCard({ title, icon, items, onClick }: { title: string; icon: React.ReactNode; items: Stock[]; onClick: (s: Stock) => void }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">{icon} {title}</div>
        <BarChart3 className="size-3.5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        {items.map((s) => (
          <button
            key={s.ticker} onClick={() => onClick(s)}
            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-foreground/5 transition text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono font-semibold">{s.ticker}</span>
              <span className="text-xs text-muted-foreground truncate">{s.name}</span>
            </div>
            <span className={`font-mono text-xs ${s.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StockModal({ stock, onClose }: { stock: Stock; onClose: () => void }) {
  const explainFn = useServerFn(explainStock);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const data = useMemo(() => spark(stock.ticker.charCodeAt(0), stock.change), [stock]);

  const generate = async () => {
    setLoading(true); setErr(null); setExplanation(null);
    try {
      const res = await explainFn({ data: {
        ticker: stock.ticker, name: stock.name, sector: stock.sector,
        price: stock.price, change: stock.change, pe: stock.pe, mcap: stock.mcap,
      }});
      setExplanation(res.explanation);
      if (res.error) setErr(res.error);
    } catch (e) {
      setErr(String(e));
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 24 }}
        className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-semibold font-mono">{stock.ticker}</span>
              <span className={`text-sm font-mono px-2 py-0.5 rounded-full ${stock.change >= 0 ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{stock.name} · {stock.sector}</div>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-foreground/5 transition">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <Stat label="Price" value={`$${stock.price.toFixed(2)}`} />
            <Stat label="P/E" value={stock.pe.toFixed(1)} />
            <Stat label="Mkt Cap" value={stock.mcap} />
            <Stat label="Volume" value={stock.volume} />
          </div>

          <div className="h-40 glass rounded-xl p-3">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stock.change >= 0 ? "oklch(0.7 0.17 162)" : "oklch(0.62 0.22 25)"} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={stock.change >= 0 ? "oklch(0.7 0.17 162)" : "oklch(0.62 0.22 25)"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="y" stroke={stock.change >= 0 ? "oklch(0.7 0.17 162)" : "oklch(0.62 0.22 25)"} fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-primary" /> AI Beginner Insights
              </div>
              {!explanation && (
                <button
                  onClick={generate} disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {loading ? <><Loader2 className="size-3 animate-spin" /> Generating…</> : <>Explain to me</>}
                </button>
              )}
            </div>
            {!explanation && !loading && (
              <p className="text-xs text-muted-foreground">
                Get a plain-English breakdown: what this company does, why it might be trending, what its P/E means, and beginner risks.
              </p>
            )}
            {loading && (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-foreground/10 rounded w-3/4" />
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-5/6" />
              </div>
            )}
            {explanation && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{explanation}</div>
            )}
            {err && explanation && <div className="text-[10px] text-muted-foreground mt-2">{err}</div>}
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Educational content only. Not financial advice.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold text-sm mt-0.5">{value}</div>
    </div>
  );
}
