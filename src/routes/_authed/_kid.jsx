import { createFileRoute } from "@tanstack/react-router";
import KidShell from "@/components/app/KidShell";

export const Route = createFileRoute("/_authed/_kid")({
  component: KidShell,
});