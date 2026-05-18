import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CandleMinds" },
      { name: "description", content: "CandleMinds is an AI-powered fintech learning platform helping Indians master the markets." },
    ],
  }),
  component: () => (
    <InfoPage title="About CandleMinds" tagline="AI-powered fintech education for the next generation of Indian investors.">
      <p>
        CandleMinds combines a personal AI mentor, gamified courses, a real-time stock screener and a trusted demat
        referral network — all in one premium platform built for self-taught investors.
      </p>
      <h2>Our mission</h2>
      <p>
        Make stock-market literacy accessible, gamified and trustworthy for every Indian, from absolute beginners to
        advanced traders.
      </p>
      <h2>What we build</h2>
      <ul>
        <li>AI tutor with live market context</li>
        <li>Interactive courses & quizzes with XP and streaks</li>
        <li>Real-time market news, screener and paper trading</li>
        <li>Vetted demat broker comparisons & referral hub</li>
      </ul>
    </InfoPage>
  ),
});
