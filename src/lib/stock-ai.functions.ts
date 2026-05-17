import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callGateway(system: string, user: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return { content: "AI mentor is temporarily unavailable. Please try again shortly.", error: "missing_key" as const };
  try {
    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (res.status === 429) return { content: "I'm getting a lot of questions right now. Please retry in a few seconds.", error: "rate_limited" as const };
    if (res.status === 402) return { content: "AI credits are exhausted. Please add credits in workspace settings.", error: "credits" as const };
    if (!res.ok) {
      const txt = await res.text();
      return { content: "I couldn't reach the mentor service.", error: `upstream_${res.status}: ${txt.slice(0, 140)}` };
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "No response.";
    return { content, error: null as null };
  } catch (e) {
    return { content: "Mentor service unreachable.", error: String(e) };
  }
}

/* ============ Stock explainer (existing) ============ */
const StockSchema = z.object({
  ticker: z.string().min(1).max(20).regex(/^[A-Z0-9.]+$/),
  name: z.string().min(1).max(120),
  sector: z.string().min(1).max(60),
  price: z.number(),
  change: z.number(),
  pe: z.number(),
  mcap: z.string().min(1).max(20),
});

export const explainStock = createServerFn({ method: "POST" })
  .inputValidator((input) => StockSchema.parse(input))
  .handler(async ({ data }) => {
    const system = "You are a calm, beginner-friendly Indian stock market educator. You NEVER give buy/sell advice or predict prices. You explain concepts simply, in 4 short sections, with risk awareness and emotional discipline.";
    const user = `Explain the NSE-listed stock ${data.name} (${data.ticker}) in 4 short sections (max 2 sentences each):
1. Company overview
2. Why it might be trending
3. What the P/E (${data.pe}) suggests for ${data.sector}
4. Beginner risk reminder
Context: Price ₹${data.price}, 24h ${data.change}%, Mcap ${data.mcap} L Cr.`;
    const r = await callGateway(system, user);
    return { explanation: r.content, error: r.error };
  });

/* ============ Mentor chat (general Q&A) ============ */
const MentorSchema = z.object({
  message: z.string().min(1).max(2000),
  mode: z.enum(["mentor", "decision", "psychology"]).default("mentor"),
});

const SYSTEMS: Record<"mentor" | "decision" | "psychology", string> = {
  mentor: `You are CandleMind AI — an emotionally intelligent Indian stock market mentor and educator.
Your tone is warm, calm, beginner-friendly, and disciplined. You teach concepts using Indian examples (TCS, Reliance, Infosys, HDFC Bank, SBI, Tata Motors, ITC, NIFTY 50, SENSEX, RBI, SEBI).
RULES:
- Never give direct buy/sell advice. Never predict prices. Never guarantee returns.
- Use markdown with short paragraphs, bullets, and clear headings.
- Always end with one short emotional-discipline or risk-management nudge.
- Currency in ₹. Indices NIFTY/SENSEX. Avoid US examples.`,
  decision: `You are CandleMind AI — a responsible Indian stock decision assistant. The user is asking about a specific stock. Respond using EXACTLY these markdown sections in order:

### Company Overview
### Positive Factors
### Risk Factors
### Market Sentiment
### Beginner-Friendly Explanation
### Emotional Discipline Advice
### Risk Management Tips

Keep each section to 2–4 short bullet points or sentences. Use Indian market context (NSE/BSE, ₹, RBI, SEBI).
Strict rules: Never say "buy" or "sell". Never predict price targets. Never claim guaranteed profits. Frame everything educationally. End with: *"This is educational guidance, not financial advice."*`,
  psychology: `You are CandleMind AI — a Trading Psychology Coach for Indian retail investors.
Your job is to help users control emotions, avoid FOMO, avoid panic selling, build patience, and stay disciplined.
Style: empathetic, calm, like a supportive coach. Use short paragraphs, bullets, and a small action plan.
Always include:
- A reflection on the emotion behind the question
- 2–3 disciplined habits to practise
- One short mantra they can repeat
Never give stock tips or predictions. Indian market context, ₹.`,
};

export const mentorChat = createServerFn({ method: "POST" })
  .inputValidator((input) => MentorSchema.parse(input))
  .handler(async ({ data }) => {
    const r = await callGateway(SYSTEMS[data.mode], data.message);
    return { reply: r.content, error: r.error };
  });

/* ============ Behaviour insights ============ */
const BehaviourSchema = z.object({
  paperTrades: z.number().min(0).max(10000),
  winRate: z.number().min(0).max(100),
  quizScore: z.number().min(0).max(100),
  consistencyScore: z.number().min(0).max(100),
  lessonsCompleted: z.number().min(0).max(10000),
});

export const behaviourInsights = createServerFn({ method: "POST" })
  .inputValidator((input) => BehaviourSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are CandleMind AI — a behavioural finance coach for Indian retail investors.
Analyse the user's activity and return EXACTLY this markdown:

### What you're doing well
- 2 bullets

### Patterns to watch
- 2 bullets (impulsiveness, overtrading, FOMO, panic selling, etc.)

### Next step
- 1 short, actionable habit

Be encouraging, calm, and beginner-friendly. Never give stock tips.`;
    const user = `Stats:
- Paper trades: ${data.paperTrades}
- Win rate: ${data.winRate}%
- Avg quiz score: ${data.quizScore}%
- Consistency score: ${data.consistencyScore}/100
- Lessons completed: ${data.lessonsCompleted}`;
    const r = await callGateway(system, user);
    return { insights: r.content, error: r.error };
  });
