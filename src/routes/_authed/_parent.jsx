import { createFileRoute } from "@tanstack/react-router";
import ParentShell from "@/components/app/ParentShell";

export const Route = createFileRoute("/_authed/_parent")({
  component: ParentShell,
});