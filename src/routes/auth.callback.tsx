import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPath, type Role } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/callback")({
  component: Callback,
});

function Callback() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) { navigate({ to: "/auth" }); return; }

      const intended = (sessionStorage.getItem("candlemind_intended_role") as Role | null) ?? "student";
      sessionStorage.removeItem("candlemind_intended_role");

      const { data: existing } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      let role: Role = (existing?.role as Role) ?? intended;
      if (!existing) {
        await supabase.from("user_roles").insert({ user_id: user.id, role: intended });
        role = intended;
      }
      navigate({ to: dashboardPath(role) });
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" /> Signing you in…
      </div>
    </div>
  );
}
