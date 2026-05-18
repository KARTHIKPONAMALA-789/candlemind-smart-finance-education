import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — CandleMinds" },
      { name: "description", content: "Get help with your CandleMinds account, courses or demat referrals." },
    ],
  }),
  component: () => (
    <InfoPage title="Support" tagline="We're here to help.">
      <p>
        For any account, billing or course access issue, email <a href="mailto:support@candleminds.app">support@candleminds.app</a>.
        Our support team typically replies within one business day.
      </p>
      <h2>Common topics</h2>
      <ul>
        <li>Account login & password reset</li>
        <li>Course enrolments and certificates</li>
        <li>Demat referral status</li>
        <li>Bug reports and feature requests</li>
      </ul>
    </InfoPage>
  ),
});
