import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Newspaper, Loader2 } from "lucide-react";
import { fetchCompanyNews, type NewsArticle } from "@/lib/news.functions";
import { NewsCard } from "./NewsCard";

export function CompanyNews({ symbol }: { symbol: string }) {
  const fn = useServerFn(fetchCompanyNews);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fn({ data: { symbol } });
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
  }, [fn, symbol]);

  return (
    <div className="glass-strong rounded-2xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="size-4 text-primary" />
        <div className="font-display text-lg font-semibold">Latest news on {symbol}</div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <Loader2 className="size-4 animate-spin" /> Fetching company news…
        </div>
      )}

      {!loading && error && articles.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No company news available right now {error ? `(${error})` : ""}.
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
