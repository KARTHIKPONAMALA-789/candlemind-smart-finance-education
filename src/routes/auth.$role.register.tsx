import { createFileRoute, notFound } from "@tanstack/react-router";
import { RoleAuthCard } from "@/components/auth/RoleAuthCard";
import type { Role } from "@/hooks/use-auth";

const VALID: Role[] = ["student", "tutor", "admin"];

export const Route = createFileRoute("/auth/$role/register")({
  head: ({ params }) => ({ meta: [{ title: `Register as ${params.role} — CandleMind` }] }),
  beforeLoad: ({ params }) => {
    if (!VALID.includes(params.role as Role)) throw notFound();
  },
  component: () => {
    const { role } = Route.useParams();
    return <RoleAuthCard role={role as Role} mode="register" />;
  },
});
