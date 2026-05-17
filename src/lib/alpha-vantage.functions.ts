import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AV_BASE = "https://www.alphavantage.co/query";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SymbolSchema = z.object({
  symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.\-]+$/),
});

type Candle = { date: string; open: number; high: number; low: number; close: number; volume: number };

export const fetchStockSeries = createServerFn({ method: "POST" })
  .inputValidator((input) => SymbolSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.ALPHA_VANTAGE_API_KEY;
    if (!key) return { candles: [] as Candle[], meta: null, error: "missing_key" };
    const symbol = data.symbol.toUpperCase();
    try {
      const res = await fetch(
        `${AV_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${key}`
      );
      if (!res.ok) return { candles: [], meta: null, error: `http_${res.status}` };
      const json = await res.json();
      if (json?.Note || json?.Information) {
        return { candles: [], meta: null, error: "rate_limited" };
      }
      const series = json?.["Time Series (Daily)"];
      if (!series) return { candles: [], meta: null, error: json?.["Error Message"] ?? "no_data" };

      const candles: Candle[] = Object.entries(series)
        .map(([date, v]: [string, any]) => ({
          date,
          open: parseFloat(v["1. open"]),
          high: parseFloat(v["2. high"]),
          low: parseFloat(v["3. low"]),
          close: parseFloat(v["4. close"]),
          volume: parseFloat(v["5. volume"]),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const last = candles[candles.length - 1];
      const window52 = candles.slice(-252);
      const high52 = Math.max(...window52.map((c) => c.high));
      const low52 = Math.min(...window52.map((c) => c.low));
      const prev = candles[candles.length - 2] ?? last;
      const changePct = prev ? ((last.close - prev.close) / prev.close) * 100 : 0;

      return {
        candles: candles.slice(-180),
        meta: {
          symbol,
          price: last.close,
          changePct,
          high52,
          low52,
          volume: last.volume,
          asOf: last.date,
        },
        error: null,
      };
    } catch (e) {
      return { candles: [], meta: null, error: String(e) };
    }
  });

export const fetchRSI = createServerFn({ method: "POST" })
  .inputValidator((input) => SymbolSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.ALPHA_VANTAGE_API_KEY;
    if (!key) return { rsi: null as number | null, error: "missing_key" };
    try {
      const res = await fetch(
        `${AV_BASE}?function=RSI&symbol=${encodeURIComponent(data.symbol.toUpperCase())}&interval=daily&time_period=14&series_type=close&apikey=${key}`
      );
      if (!res.ok) return { rsi: null, error: `http_${res.status}` };
      const json = await res.json();
      if (json?.Note || json?.Information) return { rsi: null, error: "rate_limited" };
      const series = json?.["Technical Analysis: RSI"];
      if (!series) return { rsi: null, error: json?.["Error Message"] ?? "no_data" };
      const latestDate = Object.keys(series).sort().pop()!;
      const rsi = parseFloat(series[latestDate]["RSI"]);
      return { rsi, error: null };
    } catch (e) {
      return { rsi: null, error: String(e) };
    }
  });

const AnalysisSchema = z.object({
  symbol: z.string().min(1).max(20),
  recent: z
    .array(z.object({ date: z.string(), close: z.number(), volume: z.number() }))
    .min(5)
    .max(60),
  rsi: z.number().nullable(),
});

export const analyzeStockWithAI = createServerFn({ method: "POST" })
  .inputValidator((input) => AnalysisSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return { analysis: "", error: "missing_gemini_key" };

    const prices = data.recent.map((d) => `${d.date}: close ${d.close.toFixed(2)}, vol ${Math.round(d.volume)}`).join("\n");
    const system = `You are CandleMind AI — a calm, beginner-friendly investor educator.
Never give buy/sell calls. Never predict exact prices. Use markdown with these headings:

### Trend
### Support & Resistance
### RSI Interpretation
### Long-Term Outlook
### Beginner Risk Note

Keep each section 2–4 short bullets. End with: *Educational guidance, not financial advice.*`;
    const user = `Analyse ${data.symbol} using the last ${data.recent.length} trading days.
Latest RSI: ${data.rsi !== null ? data.rsi.toFixed(2) : "unavailable"}.
Daily closes:
${prices}`;

    try {
      const res = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { role: "system", parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
        }),
      });
      if (res.status === 429) return { analysis: "", error: "rate_limited" };
      if (!res.ok) {
        const txt = await res.text();
        return { analysis: "", error: `gemini_${res.status}: ${txt.slice(0, 140)}` };
      }
      const json = await res.json();
      const analysis =
        json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ||
        "No analysis returned.";
      return { analysis, error: null };
    } catch (e) {
      return { analysis: "", error: String(e) };
    }
  });
