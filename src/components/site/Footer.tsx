import { Link } from "@tanstack/react-router";
import { Twitter, Linkedin, Youtube, Instagram, Github } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const productLinks: Array<{ label: string; to: string; hash?: string }> = [
  { label: "Features", to: "/", hash: "features" },
  { label: "Live Chart", to: "/live-chart" },
  { label: "Screener", to: "/screener" },
  { label: "Courses", to: "/courses" },
  { label: "Demat", to: "/demat" },
  { label: "Pricing", to: "/", hash: "pricing" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const supportLinks = [
  { label: "Support", to: "/support" },
  { label: "FAQ", to: "/faq" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

const socials = [
  { Icon: Twitter, href: "https://twitter.com/candleminds", label: "Twitter" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/candleminds", label: "LinkedIn" },
  { Icon: Youtube, href: "https://youtube.com/@candleminds", label: "YouTube" },
  { Icon: Instagram, href: "https://instagram.com/candleminds", label: "Instagram" },
  { Icon: Github, href: "https://github.com/candleminds", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size={36} />
            <span className="font-display font-semibold text-base">CandleMinds</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-powered fintech education. Learn the markets like you play a game — backed by data,
            guided by AI.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="size-9 grid place-items-center rounded-lg glass hover:bg-foreground/10 transition"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Product">
          {productLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} hash={l.hash} className="hover:text-foreground transition">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          {companyLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-foreground transition">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Support">
          {supportLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-foreground transition">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground px-6">
        © {new Date().getFullYear()} CandleMinds — Learn. Trade. Grow. · Educational content only, not investment advice.
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
