import { Logo } from "@/components/site/Logo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size={36} />
            <span className="font-display font-semibold text-base">CandleMinds</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-powered fintech education. Learn the markets like you play a game — backed by data,
            guided by AI.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Dashboard", "Pricing", "Changelog"] },
          { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
        ].map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-medium mb-3">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.links.map((l) => <li key={l}><a className="hover:text-foreground" href="#">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CandleMinds — Learn. Trade. Grow.
      </div>
    </footer>
  );
}
