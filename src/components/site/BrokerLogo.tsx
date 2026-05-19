import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

type Props = {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  trusted?: boolean;
  className?: string;
};

const SIZE = {
  sm: { box: "size-10", img: "size-8", text: "text-sm" },
  md: { box: "size-12", img: "size-10", text: "text-base" },
  lg: { box: "size-16", img: "size-14", text: "text-xl" },
};

/** Extract the host from a URL or domain-like string. */
function extractDomain(input?: string | null): string | null {
  if (!input) return null;
  try {
    // If it's already a Google favicon URL, pull domain= param
    const u = new URL(input);
    const dom = u.searchParams.get("domain");
    if (dom) return dom;
    return u.hostname.replace(/^www\./, "");
  } catch {
    // Assume it's a bare domain
    return input.includes(".") ? input.replace(/^www\./, "") : null;
  }
}

/**
 * Broker logo with multi-source fallback: provided URL -> Google s2 favicons
 * -> DuckDuckGo icons -> initial letter. Ensures an authentic, official
 * brand mark is shown whenever possible without any layout shift.
 */
export function BrokerLogo({ name, logoUrl, size = "md", trusted = false, className = "" }: Props) {
  const s = SIZE[size];
  const initial = name?.[0]?.toUpperCase() ?? "?";

  const sources = useMemo(() => {
    const list: string[] = [];
    if (logoUrl) list.push(logoUrl);
    const domain = extractDomain(logoUrl) ?? null;
    if (domain) {
      const google = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const ddg = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      if (!list.includes(google)) list.push(google);
      list.push(ddg);
    }
    return list;
  }, [logoUrl]);

  const [idx, setIdx] = useState(0);
  const currentSrc = sources[idx];

  return (
    <div
      className={`relative ${s.box} rounded-xl bg-white grid place-items-center overflow-hidden shrink-0 ring-1 ring-border/60 shadow-sm transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.45)] ${className}`}
      aria-label={`${name} logo`}
    >
      {currentSrc ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`${name} official logo`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          width={128}
          height={128}
          className={`${s.img} object-contain`}
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <span className={`font-display font-semibold text-foreground/80 ${s.text}`}>{initial}</span>
      )}
      {trusted && (
        <span
          className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background grid place-items-center ring-1 ring-primary/40"
          title="Verified partner"
        >
          <ShieldCheck className="size-2.5 text-primary" />
        </span>
      )}
    </div>
  );
}
