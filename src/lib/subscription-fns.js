import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { assertPinSession } from "@/lib/parent-session.server";

const PLAN_DAYS = { trial: 7, monthly: 30, annual: 365 };

const addDays = (days) => new Date(Date.now() + days * 86400000).toISOString();

/**
 * Prototype activation. No payment provider is connected: the record is saved
 * with payment_status 'prototype' and nothing is charged.
 */
export const activateSubscription = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ plan: z.enum(["trial", "monthly", "annual"]) }))
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    const parentId = context.user.id;

    await sdk.entities.Subscription.updateMany(
      { parent_id: parentId, status: "active" },
      { $set: { status: "expired" } },
    );

    const record = await sdk.entities.Subscription.create({
      parent_id: parentId,
      plan: data.plan,
      status: "active",
      trial: data.plan === "trial",
      start_date: new Date().toISOString(),
      end_date: addDays(PLAN_DAYS[data.plan]),
      auto_renew: data.plan !== "trial",
      payment_status: "prototype",
      notes: "Activated for demonstration purposes only. No payment was taken.",
    });
    return { ok: true, subscription: record };
  });

/** The parent's current subscription — PIN session required. */
export const getMySubscription = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ token: z.string().max(200).optional() }))
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);
    const page = await sdk.entities.Subscription.filter(
      { parent_id: context.user.id },
      { sort: "-created_date", limit: 5 },
    );
    const items = page.items ?? [];
    const active = items.find((s) => s.status === "active") ?? null;
    return { active, history: items };
  });