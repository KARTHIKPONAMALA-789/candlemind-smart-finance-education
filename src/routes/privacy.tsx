import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CandleMinds" },
      { name: "description", content: "How CandleMinds collects, uses and protects your personal data." },
    ],
  }),
  component: () => (
    <InfoPage title="Privacy Policy" tagline="Last updated: May 2026">
      <p>
        We respect your privacy. CandleMinds collects only the information needed to provide our learning, screener and
        referral services.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account details (name, email) you provide at signup</li>
        <li>Learning progress, XP and quiz results</li>
        <li>Anonymous click analytics on demat referral links</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To personalise your learning experience</li>
        <li>To improve product quality and security</li>
        <li>To send important account and product updates</li>
      </ul>
      <h2>Your rights</h2>
      <p>You can request export or deletion of your data anytime at <a href="mailto:privacy@candleminds.app">privacy@candleminds.app</a>.</p>
    </InfoPage>
  ),
});
