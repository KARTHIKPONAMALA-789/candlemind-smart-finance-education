import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CandleMinds" },
      { name: "description", content: "Get in touch with the CandleMinds team for support, partnerships or media." },
    ],
  }),
  component: () => (
    <InfoPage title="Contact us" tagline="We typically respond within 24 hours.">
      <p>
        General queries: <a href="mailto:hello@candleminds.app">hello@candleminds.app</a><br />
        Support: <a href="mailto:support@candleminds.app">support@candleminds.app</a><br />
        Partnerships: <a href="mailto:partners@candleminds.app">partners@candleminds.app</a>
      </p>
      <h2>Office</h2>
      <p>Bengaluru, Karnataka, India</p>
    </InfoPage>
  ),
});
