import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Simple in-memory cache (per worker isolate). Dramatically reduces
// upstream API calls (Finnhub, NewsAPI, Gemini) and speeds up responses.
type CacheEntry<T> = { value: T; expires: number };
const _cache = new Map<string, CacheEntry<unknown>>();
function cacheGet<T>(key: string): T | null {
  const hit = _cache.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    _cache.delete(key);
    return null;
  }
  return hit.value as T;
}
function cacheSet<T>(key: string, value: T, ttlMs: number) {
  _cache.set(key, { value, expires: Date.now() + ttlMs });
  // Soft cap to avoid unbounded growth in a long-lived isolate
  if (_cache.size > 200) {
    const firstKey = _cache.keys().next().value;
    if (firstKey) _cache.delete(firstKey);
  }
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export type NewsArticle = {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string | null;
  publishedAt: string; // ISO
};

const SymbolSchema = z.object({
  symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.\-]+$/),
});

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function isoDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const fetchCompanyNews = createServerFn({ method: "POST" })
  .inputValidator((input) => SymbolSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.FINNHUB_API_KEY;
    if (!key) return { articles: [] as NewsArticle[], error: "missing_key" };
    const cacheKey = `company:${data.symbol.toUpperCase()}`;
    const cached = cacheGet<{ articles: NewsArticle[]; error: string | null }>(cacheKey);
    if (cached) return cached;
    const to = new Date();
    const from = new Date();
    from.setUTCDate(from.getUTCDate() - 30);
    try {
      const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
        data.symbol.toUpperCase()
      )}&from=${isoDate(from)}&to=${isoDate(to)}&token=${key}`;
      const res = await fetch(url);
      if (res.status === 429) return { articles: [], error: "rate_limited" };
      if (!res.ok) return { articles: [], error: `http_${res.status}` };
      const json = (await res.json()) as Array<{
        id?: number;
        headline?: string;
        summary?: string;
        source?: string;
        url?: string;
        image?: string;
        datetime?: number;
      }>;
      const articles: NewsArticle[] = (Array.isArray(json) ? json : [])
        .filter((a) => a.headline && a.url)
        .slice(0, 5)
        .map((a, i) => ({
          id: String(a.id ?? `${data.symbol}-${i}`),
          headline: a.headline!,
          summary: a.summary ?? "",
          source: a.source ?? "Finnhub",
          url: a.url!,
          image: a.image || null,
          publishedAt: a.datetime ? new Date(a.datetime * 1000).toISOString() : new Date().toISOString(),
        }));
      const result = { articles, error: null };
      cacheSet(cacheKey, result, 5 * 60 * 1000); // 5 min
      return result;
    } catch (e) {
      return { articles: [], error: String(e) };
    }
  });

const CATEGORY_QUERIES: Record<string, string> = {
  All: "indian stock market OR sensex OR nifty OR trading",
  "Nifty/Sensex": "nifty OR sensex OR nse OR bse",
  IPO: "IPO India OR initial public offering",
  "Stock Market": "stock market India",
  Trading: "intraday trading OR derivatives OR options trading",
  "Global Markets": "global stock markets OR wall street OR nasdaq OR dow jones",
  "AI & Fintech": "fintech OR AI stocks OR artificial intelligence finance",
  Economy: "indian economy OR rbi OR inflation OR gdp",
  Crypto: "cryptocurrency OR bitcoin OR ethereum",
};

const MarketNewsSchema = z.object({
  category: z.string().max(40).optional().default("All"),
});

export const fetchMarketNews = createServerFn({ method: "POST" })
  .inputValidator((input) => MarketNewsSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const key = process.env.NEWS_API_KEY;
    if (!key) return { articles: [] as NewsArticle[], error: "missing_key" };
    const q = CATEGORY_QUERIES[data.category] ?? CATEGORY_QUERIES.All;
    // Only return articles from the last 2 days so the feed always reflects today's news.
    const from = new Date();
    from.setUTCDate(from.getUTCDate() - 2);
    const fromIso = `${from.getUTCFullYear()}-${pad(from.getUTCMonth() + 1)}-${pad(from.getUTCDate())}`;
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        q
      )}&language=en&sortBy=publishedAt&pageSize=24&from=${fromIso}&apiKey=${key}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "CandleMinds/1.0", "Cache-Control": "no-cache" },
      });
      if (res.status === 429) return { articles: [], error: "rate_limited" };
      if (!res.ok) return { articles: [], error: `http_${res.status}` };
      const json = (await res.json()) as {
        status?: string;
        articles?: Array<{
          title?: string;
          description?: string;
          source?: { name?: string };
          url?: string;
          urlToImage?: string;
          publishedAt?: string;
        }>;
      };
      if (json.status && json.status !== "ok") return { articles: [], error: "api_error" };
      const articles: NewsArticle[] = (json.articles ?? [])
        .filter((a) => a.title && a.url && a.title !== "[Removed]")
        .slice(0, 18)
        .map((a, i) => ({
          id: `${a.url}-${i}`,
          headline: a.title!,
          summary: a.description ?? "",
          source: a.source?.name ?? "News",
          url: a.url!,
          image: a.urlToImage || null,
          publishedAt: a.publishedAt ?? new Date().toISOString(),
        }));
      return { articles, error: null };
    } catch (e) {
      return { articles: [], error: String(e) };
    }
  });

export const NEWS_CATEGORIES = Object.keys(CATEGORY_QUERIES);


const ExplainSchema = z.object({
  headline: z.string().min(1).max(500),
  summary: z.string().max(2000).optional().default(""),
  source: z.string().max(120).optional().default(""),
});

export const explainNewsAI = createServerFn({ method: "POST" })
  .inputValidator((input) => ExplainSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key)
      return {
        explanation: "",
        sentiment: "Neutral" as "Positive" | "Negative" | "Neutral",
        error: "missing_gemini_key",
      };
    const prompt = `News headline: "${data.headline}"
Summary: "${data.summary || "(no summary provided)"}"
Source: ${data.source || "Unknown"}

Respond ONLY with a valid JSON object (no markdown, no code fences) of this exact shape:
{
  "sentiment": "Positive" | "Negative" | "Neutral",
  "explanation": "<3-5 short sentences in plain English explaining how this news might affect long-term investors. Be balanced, avoid hype, no buy/sell calls. End with: Educational only, not financial advice.>"
}`;
    try {
      const res = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 600,
            responseMimeType: "application/json",
          },
        }),
      });
      if (res.status === 429)
        return { explanation: "", sentiment: "Neutral" as const, error: "rate_limited" };
      if (!res.ok) {
        const txt = await res.text();
        return {
          explanation: "",
          sentiment: "Neutral" as const,
          error: `gemini_${res.status}: ${txt.slice(0, 140)}`,
        };
      }
      const json = await res.json();
      const text: string =
        json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
        "";
      let sentiment: "Positive" | "Negative" | "Neutral" = "Neutral";
      let explanation = text;
      try {
        const parsed = JSON.parse(text);
        if (parsed.sentiment === "Positive" || parsed.sentiment === "Negative" || parsed.sentiment === "Neutral") {
          sentiment = parsed.sentiment;
        }
        if (typeof parsed.explanation === "string") explanation = parsed.explanation;
      } catch {
        // fall back to plain text
      }
      return { explanation, sentiment, error: null };
    } catch (e) {
      return { explanation: "", sentiment: "Neutral" as const, error: String(e) };
    }
  });
