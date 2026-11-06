import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { assertPinSession } from "@/lib/parent-session.server";

const tokenInput = z.object({ token: z.string().max(200).optional() });

/** The four LAWNATQ categories, then every active specialist with open slots. */
export const getSpecialists = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const sdk = context.getBase44().asServiceRole;
    const [categories, specialists, slots] = await Promise.all([
      sdk.entities.SpecialistCategory.list({ sort: "order", limit: 20 }),
      sdk.entities.Specialist.filter({ is_active: true }, { sort: "created_date", limit: 60 }),
      sdk.entities.SpecialistAvailability.list({ sort: "start_at", limit: 200 }),
    ]);
    const now = Date.now();
    const open = (slots.items ?? []).filter((s) => !s.is_booked && new Date(s.start_at).getTime() > now);
    return {
      categories: categories.items ?? [],
      specialists: (specialists.items ?? []).map((s) => ({
        ...s,
        slots: open.filter((slot) => slot.specialist_id === s.id).slice(0, 8),
      })),
    };
  });

/** The signed-in parent's own appointment requests. */
export const getAppointments = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(tokenInput)
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);
    const page = await sdk.entities.Appointment.filter(
      { parent_id: context.user.id },
      { sort: "-created_date", limit: 40 },
    );
    const items = page.items ?? [];
    if (!items.length) return { items: [] };

    const ids = [...new Set(items.map((a) => a.specialist_id).filter(Boolean))];
    const specialists = ids.length
      ? (await sdk.entities.Specialist.filter({ id: { $in: ids } }, { limit: 60 })).items ?? []
      : [];
    const byId = Object.fromEntries(specialists.map((s) => [s.id, s]));
    return {
      items: items.map((a) => ({
        ...a,
        specialist_name: byId[a.specialist_id]?.name ?? "",
        specialist_title: byId[a.specialist_id]?.title_ar ?? byId[a.specialist_id]?.title_en ?? "",
      })),
    };
  });

/**
 * A booking request. Requires the PIN session and an active subscription;
 * the session fee stays separate and is never charged here.
 */
export const requestAppointment = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      token: z.string().max(200),
      specialistId: z.string().min(1).max(80),
      availabilityId: z.string().min(1).max(80),
      childId: z.string().min(1).max(80).optional(),
      note: z.string().max(400).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);

    const subscription = (
      await sdk.entities.Subscription.filter({ parent_id: context.user.id, status: "active" }, { limit: 1 })
    ).items?.[0];
    if (!subscription) return { ok: false, error: "no_subscription" };

    const specialist = await sdk.entities.Specialist.get(data.specialistId).catch(() => null);
    if (!specialist || specialist.is_active === false) return { ok: false, error: "no_specialist" };

    const slot = await sdk.entities.SpecialistAvailability.get(data.availabilityId).catch(() => null);
    if (!slot || slot.specialist_id !== specialist.id) return { ok: false, error: "no_slot" };
    if (slot.is_booked) return { ok: false, error: "slot_taken" };

    const appointment = await sdk.entities.Appointment.create({
      parent_id: context.user.id,
      child_id: data.childId ?? "",
      specialist_id: specialist.id,
      availability_id: slot.id,
      scheduled_at: slot.start_at,
      price: specialist.session_price ?? 0,
      currency: specialist.currency ?? "SAR",
      status: "pending",
      parent_note: data.note ?? "",
      status_note: "",
    });
    await sdk.entities.SpecialistAvailability.update(slot.id, { is_booked: true });
    return { ok: true, appointment };
  });

/** The parent can cancel their own request; the slot opens again. */
export const cancelAppointment = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ token: z.string().max(200), id: z.string().min(1).max(80) }))
  .handler(async ({ data, context }) => {
    const sdk = context.getBase44().asServiceRole;
    await assertPinSession(sdk, context.user.id, data.token);

    const appointment = await sdk.entities.Appointment.get(data.id).catch(() => null);
    if (!appointment || appointment.parent_id !== context.user.id) return { ok: false, error: "not_found" };
    if (appointment.status === "completed" || appointment.status === "cancelled") {
      return { ok: false, error: "not_cancellable" };
    }

    await sdk.entities.Appointment.update(appointment.id, { status: "cancelled" });
    if (appointment.availability_id) {
      await sdk.entities.SpecialistAvailability.update(appointment.availability_id, { is_booked: false }).catch(() => {});
    }
    return { ok: true };
  });