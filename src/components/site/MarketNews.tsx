import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Newspaper, Loader2 } from "lucide-react";
import { fetchMarketNews, type NewsArticle } from "@/lib/news.functions";
import { NewsCard } from "./NewsCard";

export function MarketNews() {
  const fn = useServerFn(fetchMarketNews);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fn();
        if (cancelled) return;
        setArticles(res.articles);
        if (res.error && res.articles.length === 0) setError(res.error);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fn]);

  return (
    <section className="px-6 mt-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-primary glass rounded-full px-3 py-1 mb-3">
              <Newspaper className="size-3" /> Live market news
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Markets, <span className="gradient-text">in real time</span>
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-xl">
              Fresh headlines from across the Indian markets — tap “Explain this news” for an AI-powered take.
            </p>
          </div>
        </div>

        {loading && (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Loading latest market news…
          </div>
        )}

        {!loading && error && articles.length === 0 && (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            Could not load market news right now ({error}). Please try again shortly.
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:thin]">
              {articles.map((a) => (
                <div key={a.id} className="snap-start">
                  <NewsCard article={a} compact />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
