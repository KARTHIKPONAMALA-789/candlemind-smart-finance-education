import logoFull from "@/assets/candleminds-logo.png";
import logoMark from "@/assets/candleminds-mark.png";

type Props = {
  variant?: "mark" | "full";
  className?: string;
  size?: number;
  alt?: string;
};

export function Logo({ variant = "mark", className = "", size, alt = "CandleMinds" }: Props) {
  const src = variant === "full" ? logoFull : logoMark;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={size ? { height: size, width: variant === "mark" ? size : "auto" } : undefined}
      className={`select-none object-contain transition-transform duration-200 hover:scale-[1.03] ${className}`}
      draggable={false}
    />
  );
}
