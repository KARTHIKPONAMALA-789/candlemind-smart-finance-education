import { useRouter, useRouterState, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallback = "/", className = "" }: { fallback?: string; className?: string }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/" || pathname === fallback) return null;

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const canGoBack = typeof window !== "undefined" && window.history.length > 1;
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: fallback });
    }
  };

  return (
    <Link
      to={fallback}
      onClick={handleBack}
      aria-label="Go back"
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-foreground/5 ${className}`}
    >
      <ArrowLeft className="size-4" />
      <span className="hidden sm:inline">Back</span>
    </Link>
  );
}
