import { memo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { explainNewsAI, type NewsArticle } from "@/lib/news.functions";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function sourceLogo(source: string) {
  try {
    // Use a generic favicon service keyed off the source name domain guess
    const host = source.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return null;
  }
}

const sentimentStyles: Record<string, string> = {
  Positive: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  Negative: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  Neutral: "bg-muted/40 text-muted-foreground border-border",
};

function NewsCardImpl({ article, compact = false }: { article: NewsArticle; compact?: boolean }) {
  const explainFn = useServerFn(explainNewsAI);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<"Positive" | "Negative" | "Neutral" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onExplain = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await explainFn({
        data: { headline: article.headline, summary: article.summary, source: article.source },
      });
      if (res.error && !res.explanation) setError(res.error);
      setExplanation(res.explanation || null);
      setSentiment(res.sentiment);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const logo = sourceLogo(article.source);

  return (
    <article
      className={`glass rounded-2xl overflow-hidden flex flex-col ${
        compact ? "min-w-[300px] max-w-[300px]" : ""
      }`}
    >
      {article.image && (
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={article.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {logo && (
            <img
              src={logo}
              alt=""
              className="size-4 rounded"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="font-medium text-foreground/80 truncate">{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          {sentiment && (
            <span
              className={`ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${sentimentStyles[sentiment]}`}
            >
              {sentiment}
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold leading-snug line-clamp-3">{article.headline}</h3>
        {article.summary && !compact && (
          <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
        )}

        {explanation && (
          <div className="text-xs leading-relaxed bg-foreground/[0.03] rounded-lg p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1 text-primary font-medium">
              <Sparkles className="size-3" /> AI explanation
            </div>
            {explanation}
          </div>
        )}
        {error && <div className="text-xs text-rose-500">{error}</div>}

        <div className="flex items-center gap-2 mt-auto pt-1">
          <button
            type="button"
            onClick={onExplain}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg glass-strong hover:bg-foreground/10 transition disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-primary" />}
            Explain this news
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition flex items-center gap-1.5 ml-auto text-muted-foreground hover:text-foreground"
          >
            Read more <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

export const NewsCard = memo(NewsCardImpl);
