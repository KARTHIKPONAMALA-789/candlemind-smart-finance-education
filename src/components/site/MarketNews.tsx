import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Newspaper, Loader2, Radio, RefreshCw } from "lucide-react";
import { fetchMarketNews, NEWS_CATEGORIES, type NewsArticle } from "@/lib/news.functions";
import { NewsCard } from "./NewsCard";

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

function TickerItem({ a }: { a: NewsArticle }) {
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mx-6 text-sm whitespace-nowrap hover:text-foreground transition"
    >
      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-medium text-foreground/90">{a.source}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{a.headline}</span>
    </a>
  );
}

export function MarketNews() {
  const fn = useServerFn(fetchMarketNews);
  const [category, setCategory] = useState<string>("All");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (cat: string, mode: "initial" | "refresh" | "category") => {
      if (mode === "initial") setLoading(true);
      else if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await fn({ data: { category: cat } });
        setArticles(res.articles);
        if (res.error && res.articles.length === 0) setError(res.error);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    load(category, "initial");
  }, [load, category]);

  useEffect(() => {
    const id = setInterval(() => load(category, "refresh"), REFRESH_MS);
    return () => clearInterval(id);
  }, [load, category]);

  const ticker = articles.slice(0, 8);

  return (
    <section id="news" className="px-6 mt-32">
      <div className="mx-auto max-w-6xl">
        {/* Breaking news ticker */}
        {ticker.length > 0 && (
          <div className="glass-strong rounded-full overflow-hidden flex items-stretch mb-10 border border-border">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-semibold uppercase tracking-wider shrink-0">
              <Radio className="size-3.5" /> Live
            </div>
            <div className="relative overflow-hidden flex-1">
              <div className="flex animate-[ticker_60s_linear_infinite] py-2.5 text-muted-foreground will-change-transform">
                {[...ticker, ...ticker].map((a, i) => (
                  <TickerItem key={`${a.id}-${i}`} a={a} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-primary glass rounded-full px-3 py-1 mb-3">
              <Newspaper className="size-3" /> Live market news
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Markets, <span className="gradient-text">in real time</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-xl">
              Fresh headlines across Indian and global markets. Tap “Explain this news” for a beginner-friendly AI take.
            </p>
          </div>
          <button
            onClick={() => load(category, "refresh")}
            disabled={refreshing || loading}
            className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-foreground/10 transition disabled:opacity-60 flex items-center gap-1.5"
          >
            <RefreshCw className={`size-3 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NEWS_CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition border ${
                  active
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground border-transparent shadow-[var(--shadow-glow)]"
                    : "glass border-border hover:bg-foreground/10 text-muted-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <div className="aspect-[16/9] bg-foreground/5 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-1/3 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-8 w-32 bg-foreground/10 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && articles.length === 0 && (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="size-4" /> Could not load market news right now ({error}). Please try again shortly.
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
