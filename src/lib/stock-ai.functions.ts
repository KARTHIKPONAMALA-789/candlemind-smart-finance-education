import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  ticker: z.string().min(1).max(10).regex(/^[A-Z0-9.]+$/),
  name: z.string().min(1).max(120),
  sector: z.string().min(1).max(60),
  price: z.number(),
  change: z.number(),
  pe: z.number(),
  mcap: z.string().min(1).max(20),
});

export const explainStock = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { explanation: "AI explanations are temporarily unavailable.", error: "missing_key" };

    const prompt = `Give a beginner-friendly explanation of the Indian-listed stock ${data.name} (NSE: ${data.ticker}). Sector: ${data.sector}. Price: ₹${data.price}, 24h change: ${data.change}%, P/E: ${data.pe}, Market Cap: ${data.mcap} (lakh-crore).

Return 4 short sections (max 2 sentences each), plain language, no jargon:
1. Company overview
2. Why it might be trending
3. What the P/E ratio means here
4. Risk overview for beginners`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a friendly fintech tutor explaining stocks to absolute beginners. Be concise, warm, and never give financial advice." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        return { explanation: "Couldn't generate explanation right now.", error: `upstream_${res.status}: ${txt.slice(0, 120)}` };
      }
      const json = await res.json();
      const explanation = json?.choices?.[0]?.message?.content ?? "No explanation returned.";
      return { explanation, error: null as string | null };
    } catch (e) {
      return { explanation: "AI service is currently unreachable.", error: String(e) };
    }
  });
