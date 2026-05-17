import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, dashboardPath, type Role } from "@/hooks/use-auth";

export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    if (role && !allow.includes(role)) navigate({ to: dashboardPath(role) });
  }, [user, role, loading, allow, navigate]);

  if (loading || !user || (role && !allow.includes(role))) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" /> Verifying access…
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
