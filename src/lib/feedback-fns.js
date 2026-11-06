import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { assertPinSession } from "@/lib/parent-session.server";

const tokenInput = z.object({ token: z.string().max(200).optional() });

/** Saves one parent feedback entry, tied to the signed-in parent account. */
export const submitFeedback = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      token: z.string().max(200),
      rating: z.number().min(1).max(5),
      comment: z.string().trim().min(3).max(1200),
      topic: z.enum(["activities", "website", "specialists", "other"]).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);
    const feedback = await sdk.entities.ParentFeedback.create({
      parent_id: context.user.id,
      rating: data.rating,
      comment: data.comment,
      topic: data.topic ?? "other",
    });
    return { ok: true, feedback };
  });

/** The signed-in parent's own feedback history. */
export const getFeedback = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(tokenInput)
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);
    const page = await sdk.entities.ParentFeedback.filter(
      { parent_id: context.user.id },
      { sort: "-created_date", limit: 20 },
    );
    return { items: page.items ?? [] };
  });