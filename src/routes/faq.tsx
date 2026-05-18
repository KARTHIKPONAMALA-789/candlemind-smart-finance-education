import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — CandleMinds" },
      { name: "description", content: "Frequently asked questions about CandleMinds, demat accounts and learning." },
    ],
  }),
  component: () => (
    <InfoPage title="Frequently asked questions">
      <h2>Is CandleMinds free?</h2>
      <p>Yes, you can start learning for free. Premium plans unlock advanced courses, the full screener and AI tutor.</p>
      <h2>Do you provide investment advice?</h2>
      <p>No. All content is educational. Always do your own research or consult a SEBI-registered advisor.</p>
      <h2>How do demat referrals work?</h2>
      <p>We list trusted Indian brokers. When you open an account through our link, the broker may share a referral fee with CandleMinds at no extra cost to you.</p>
      <h2>Is my data secure?</h2>
      <p>We use industry-standard encryption and never sell your data. See our <a href="/privacy">Privacy Policy</a> for details.</p>
    </InfoPage>
  ),
});
