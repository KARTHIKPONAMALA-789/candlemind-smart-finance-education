import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  CartesianGrid,
} from "recharts";
import { Search, Loader2, Sparkles, TrendingUp, TrendingDown, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  fetchStockSeries,
  fetchRSI,
  analyzeStockWithAI,
} from "@/lib/alpha-vantage.functions";
import { CompanyNews } from "@/components/site/CompanyNews";

export const Route = createFileRoute("/live-chart")({
  head: () => ({
    meta: [
      { title: "Live Stock Chart & AI Analysis | CandleMinds" },
      {
        name: "description",
        content:
          "Search any stock symbol for live daily price charts, 52-week high/low, RSI and an AI-powered investor-friendly analysis.",
      },
    ],
  }),
  component: LiveChartPage,
});

type Candle = { date: string; open: number; high: number; low: number; close: number; volume: number };
type Meta = {
  symbol: string;
  price: number;
  changePct: number;
  high52: number;
  low52: number;
  volume: number;
  asOf: string;
};

function rsiBand(rsi: number) {
  if (rsi >= 70) return { label: "Overbought", tone: "text-rose-500" };
  if (rsi <= 30) return { label: "Oversold", tone: "text-emerald-500" };
  return { label: "Neutral", tone: "text-muted-foreground" };
}

function rsiBeginnerNote(rsi: number) {
  if (rsi >= 70)
    return "RSI above 70 suggests the stock may be overbought — momentum has been strong, but a short-term cooldown is common. Avoid chasing.";
  if (rsi <= 30)
    return "RSI below 30 suggests the stock may be oversold — selling has been heavy. It can bounce, but a low RSI alone is not a buy signal.";
  return "RSI between 30 and 70 is neutral — neither overbought nor oversold. Use it alongside trend and fundamentals.";
}

function LiveChartPage() {
  const seriesFn = useServerFn(fetchStockSeries);
  const rsiFn = useServerFn(fetchRSI);
  const aiFn = useServerFn(analyzeStockWithAI);

  const [symbol, setSymbol] = useState("AAPL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [rsi, setRsi] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const search = async (sym?: string) => {
    const s = (sym ?? symbol).trim().toUpperCase();
    if (!s) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setAiError(null);
    try {
      const [series, rsiRes] = await Promise.all([
        seriesFn({ data: { symbol: s } }),
        rsiFn({ data: { symbol: s } }),
      ]);
      if (series.error) setError(humanError(series.error));
      setCandles(series.candles);
      setMeta(series.meta);
      setRsi(rsiRes.rsi);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const analyze = async () => {
    if (!meta || candles.length === 0) return;
    setAiLoading(true);
    setAiError(null);
    setAnalysis(null);
    try {
      const recent = candles.slice(-30).map((c) => ({ date: c.date, close: c.close, volume: c.volume }));
      const res = await aiFn({ data: { symbol: meta.symbol, recent, rsi } });
      setAnalysis(res.analysis);
      if (res.error) setAiError(humanError(res.error));
    } catch (e) {
      setAiError(String(e));
    } finally {
      setAiLoading(false);
    }
  };

  const positive = meta ? meta.changePct >= 0 : true;
  const stroke = positive ? "oklch(0.7 0.17 162)" : "oklch(0.62 0.22 25)";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 max-w-6xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="size-3 text-primary" /> Live daily data · Alpha Vantage · AI analysis
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight">
            Live Stock <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Chart</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Search any symbol (e.g. AAPL, MSFT, RELIANCE.BSE, TCS.BSE) for daily prices, 52-week range, RSI and a beginner-friendly AI analysis.
          </p>
        </motion.div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="glass-strong rounded-2xl p-3 mb-6 flex items-center gap-2"
        >
          <Search className="size-4 text-muted-foreground ml-2" />
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter symbol (AAPL, TCS.BSE, RELIANCE.BSE)…"
            className="bg-transparent outline-none flex-1 text-sm py-1.5 uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-sm px-4 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          <span className="text-muted-foreground">Try:</span>
          {["AAPL", "MSFT", "GOOGL", "TSLA", "RELIANCE.BSE", "TCS.BSE", "INFY.BSE"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSymbol(s);
                search(s);
              }}
              className="px-2.5 py-1 rounded-full glass hover:bg-foreground/10 transition font-mono"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="glass rounded-xl p-4 text-sm text-rose-500 mb-6">{error}</div>
        )}

        {meta && candles.length > 0 && (
          <>
            <div className="glass-strong rounded-2xl p-5 mb-4">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="font-display text-2xl font-semibold font-mono">{meta.symbol}</div>
                  <div className="text-xs text-muted-foreground">As of {meta.asOf} · Daily</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-semibold">
                    {meta.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-mono flex items-center gap-1 justify-end ${positive ? "text-emerald-500" : "text-rose-500"}`}>
                    {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {positive ? "+" : ""}
                    {meta.changePct.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="h-80 -mx-2">
                <ResponsiveContainer>
                  <ComposedChart data={candles}>
                    <defs>
                      <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.5 0 0 / 0.15)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                      tickFormatter={(d) => String(d).slice(5)}
                      minTickGap={32}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                      width={56}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.15 0 0 / 0.9)",
                        border: "1px solid oklch(0.3 0 0)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "oklch(0.8 0 0)" }}
                    />
                    <Area type="monotone" dataKey="close" stroke="none" fill="url(#priceFill)" />
                    <Line type="monotone" dataKey="close" stroke={stroke} strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Stat label="Current price" value={meta.price.toFixed(2)} />
              <Stat label="52-week high" value={meta.high52.toFixed(2)} accent="text-emerald-500" />
              <Stat label="52-week low" value={meta.low52.toFixed(2)} accent="text-rose-500" />
              <Stat label="Volume" value={meta.volume.toLocaleString()} />
            </div>

            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="size-4 text-primary" /> RSI (14-day)
                </div>
                {rsi !== null ? (
                  <div className="font-mono text-2xl font-semibold">
                    {rsi.toFixed(2)}
                    <span className={`ml-2 text-xs ${rsiBand(rsi).tone}`}>{rsiBand(rsi).label}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">RSI unavailable (rate-limited or no data)</span>
                )}
              </div>
              {rsi !== null && (
                <p className="text-sm text-muted-foreground leading-relaxed">{rsiBeginnerNote(rsi)}</p>
              )}
            </div>

            <div className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="font-display text-lg font-semibold">AI investor analysis</div>
                  <div className="text-xs text-muted-foreground">Last 30 trading days · Educational only</div>
                </div>
                <button
                  onClick={analyze}
                  disabled={aiLoading}
                  className="text-sm px-4 py-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition disabled:opacity-60 flex items-center gap-2"
                >
                  {aiLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Analyze this stock with AI
                </button>
              </div>
              {aiError && <div className="text-sm text-rose-500 mb-3">{aiError}</div>}
              {analysis ? (
                <div className="prose prose-sm prose-invert max-w-none [&_h3]:font-display [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:my-1 [&_ul]:my-2">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              ) : !aiLoading ? (
                <p className="text-sm text-muted-foreground">
                  Click the button above to generate a trend, support/resistance and long-term outlook summary from the last 30 days.
                </p>
              ) : null}
            </div>

            <CompanyNews symbol={meta.symbol} />
          </>
        )}

        {!meta && !loading && !error && (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
            Search a symbol above to see its live daily chart and AI analysis.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono font-semibold text-base ${accent ?? ""}`}>{value}</div>
    </div>
  );
}

function humanError(code: string): string {
  if (code === "rate_limited")
    return "Alpha Vantage rate limit reached (free tier is 5 requests/min, 25/day). Please wait a moment and try again.";
  if (code === "missing_key") return "ALPHA_VANTAGE_API_KEY is not configured.";
  if (code === "missing_gemini_key") return "GEMINI_API_KEY is not configured.";
  if (code === "no_data") return "No data found for this symbol. Check the ticker (try suffix .BSE for Indian stocks).";
  return code;
}
