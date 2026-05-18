import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — CandleMinds" },
      { name: "description", content: "Join CandleMinds and help build the future of fintech education in India." },
    ],
  }),
  component: () => (
    <InfoPage title="Careers" tagline="Help us build the most loved learning platform for Indian investors.">
      <p>
        We're a small, design-led team based in Bengaluru with a remote-friendly culture. We hire across engineering,
        design, content and growth.
      </p>
      <h2>Open roles</h2>
      <ul>
        <li>Senior Frontend Engineer (React / TanStack Start)</li>
        <li>AI/ML Engineer — Personalised learning</li>
        <li>Content Lead — Stock market & options</li>
      </ul>
      <p>Send your CV to <a href="mailto:careers@candleminds.app">careers@candleminds.app</a>.</p>
    </InfoPage>
  ),
});
