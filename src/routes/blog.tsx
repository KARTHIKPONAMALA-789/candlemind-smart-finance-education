import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — CandleMinds" },
      { name: "description", content: "Insights on Indian markets, options, technical analysis and personal finance." },
    ],
  }),
  component: () => (
    <InfoPage title="Blog" tagline="Long-form essays on markets, AI and learning.">
      <p>Our blog is launching soon. In the meantime, check out our live market news feed on the homepage.</p>
    </InfoPage>
  ),
});
