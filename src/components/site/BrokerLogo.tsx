import { useState } from "react";
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

/**
 * Broker logo with graceful fallback to initial when remote image fails.
 * White background ensures contrast for both light/dark themes; subtle ring + hover glow
 * provide a premium fintech feel without altering card layout.
 */
export function BrokerLogo({ name, logoUrl, size = "md", trusted = false, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const s = SIZE[size];
  const initial = name?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={`relative ${s.box} rounded-xl bg-white grid place-items-center overflow-hidden shrink-0 ring-1 ring-border/60 shadow-sm transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.45)] ${className}`}
      aria-label={`${name} logo`}
    >
      {logoUrl && !failed ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`${s.img} object-contain`}
          onError={() => setFailed(true)}
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
