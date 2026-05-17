import { createFileRoute, redirect } from "@tanstack/react-router";
import { dashboardPath, type Role } from "@/hooks/use-auth";

const VALID: Role[] = ["student", "tutor", "admin"];

export const Route = createFileRoute("/auth/$role/register")({
  beforeLoad: ({ params }) => {
    const role = VALID.includes(params.role as Role) ? (params.role as Role) : "student";
    throw redirect({ to: dashboardPath(role) });
  },
  component: () => null,
});
