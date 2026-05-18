import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — CandleMinds" },
      { name: "description", content: "Terms of use for the CandleMinds learning and referral platform." },
    ],
  }),
  component: () => (
    <InfoPage title="Terms & Conditions" tagline="Last updated: May 2026">
      <h2>Educational only</h2>
      <p>
        All content on CandleMinds is for educational purposes only and does not constitute investment advice. Always
        do your own research or consult a SEBI-registered advisor before making investment decisions.
      </p>
      <h2>Demat referrals</h2>
      <p>
        CandleMinds may earn a referral fee when you open an account with one of our partner brokers. This does not
        change the price or onboarding experience for you.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Don't share your account credentials</li>
        <li>Don't scrape or resell content</li>
        <li>Respect other learners in community features</li>
      </ul>
    </InfoPage>
  ),
});
