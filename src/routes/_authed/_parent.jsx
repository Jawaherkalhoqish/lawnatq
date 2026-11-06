import { createFileRoute, redirect } from "@tanstack/react-router";
import ParentShell from "@/components/app/ParentShell";
import { checkPinSession } from "@/lib/pin-fns";
import { readPinToken } from "@/lib/pin-session";

/**
 * The parent area is only reachable with a verified PIN. The check runs on the
 * server for every navigation in here, so a direct URL cannot skip the gate.
 */
export const Route = createFileRoute("/_authed/_parent")({
  beforeLoad: async ({ location }) => {
    const token = readPinToken();
    if (!token) {
      throw redirect({ to: "/parent-pin", search: { returnTo: location.href } });
    }
    const result = await checkPinSession({ data: { token } }).catch(() => ({ valid: false }));
    if (!result?.valid) {
      throw redirect({ to: "/parent-pin", search: { returnTo: location.href } });
    }
  },
  component: ParentShell,
});