import { createFileRoute, redirect } from "@tanstack/react-router";

/** The parent dashboard lives behind the parent account — /parent opens it. */
export const Route = createFileRoute("/_authed/parent")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});