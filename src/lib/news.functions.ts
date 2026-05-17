import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
      return { articles, error: null };
    } catch (e) {
      return { articles: [], error: String(e) };
    }
  });

export const fetchMarketNews = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.NEWS_API_KEY;
  if (!key) return { articles: [] as NewsArticle[], error: "missing_key" };
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      "indian stock market OR sensex OR nifty"
    )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`;
    const res = await fetch(url, { headers: { "User-Agent": "CandleMinds/1.0" } });
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
      .slice(0, 12)
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
