import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { hashPin, isFourDigits, randomHex, safeEqual } from "@/lib/pin-crypto.server";
import {
  LOCK_MINUTES,
  MAX_ATTEMPTS,
  SESSION_MINUTES,
  findPinRecord,
  isLocked,
  isSessionValid,
  minutesLeft,
} from "@/lib/parent-session.server";

const pinSchema = z.object({ pin: z.string().min(4).max(4), confirm: z.string().min(4).max(4) });
const tokenSchema = z.object({ token: z.string().max(200) });

const serviceRole = (context) => context.getBase44().asServiceRole;

const expiresAt = (minutes) => new Date(Date.now() + minutes * 60000).toISOString();

/** Does this parent already have a PIN, and is the account currently locked? */
export const getPinState = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const record = await findPinRecord(serviceRole(context), context.user.id);
    return {
      hasPin: Boolean(record?.pin_hash),
      lockedUntil: isLocked(record) ? record.locked_until : null,
      minutesLeft: isLocked(record) ? minutesLeft(record) : 0,
    };
  });

/** First-time PIN creation: four digits, entered twice, stored only as a hash. */
export const createParentPin = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(pinSchema)
  .handler(async ({ data, context }) => {
    if (!isFourDigits(data.pin)) return { ok: false, error: "invalid_format" };
    if (data.pin !== data.confirm) return { ok: false, error: "mismatch" };

    const sdk = serviceRole(context);
    const existing = await findPinRecord(sdk, context.user.id);
    if (existing?.pin_hash) return { ok: false, error: "already_set" };

    const salt = randomHex(16);
    const pin_hash = await hashPin(data.pin, salt);
    const token = randomHex(24);
    const session_expires = expiresAt(SESSION_MINUTES);

    if (existing) {
      await sdk.entities.ParentPin.update(existing.id, {
        pin_hash,
        pin_salt: salt,
        failed_attempts: 0,
        locked_until: null,
        session_token: token,
        session_expires,
      });
    } else {
      await sdk.entities.ParentPin.create({
        user_id: context.user.id,
        pin_hash,
        pin_salt: salt,
        failed_attempts: 0,
        session_token: token,
        session_expires,
      });
    }
    return { ok: true, token };
  });

/** Checks the PIN, applies the lockout after repeated failures, opens a short session. */
export const verifyParentPin = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ pin: z.string().min(4).max(4) }))
  .handler(async ({ data, context }) => {
    const sdk = serviceRole(context);
    const record = await findPinRecord(sdk, context.user.id);
    if (!record?.pin_hash) return { ok: false, error: "no_pin" };
    if (isLocked(record)) {
      return { ok: false, error: "locked", minutesLeft: minutesLeft(record), lockedUntil: record.locked_until };
    }
    if (!isFourDigits(data.pin)) return { ok: false, error: "invalid", attemptsLeft: MAX_ATTEMPTS - (record.failed_attempts || 0) };

    const candidate = await hashPin(data.pin, record.pin_salt);
    if (!safeEqual(candidate, record.pin_hash)) {
      const failed = (record.failed_attempts || 0) + 1;
      if (failed >= MAX_ATTEMPTS) {
        const locked_until = expiresAt(LOCK_MINUTES);
        await sdk.entities.ParentPin.update(record.id, { failed_attempts: failed, locked_until, session_token: null, session_expires: null });
        return { ok: false, error: "locked", minutesLeft: LOCK_MINUTES, lockedUntil: locked_until };
      }
      await sdk.entities.ParentPin.update(record.id, { failed_attempts: failed });
      return { ok: false, error: "invalid", attemptsLeft: MAX_ATTEMPTS - failed };
    }

    const token = randomHex(24);
    const session_expires = expiresAt(SESSION_MINUTES);
    await sdk.entities.ParentPin.update(record.id, {
      failed_attempts: 0,
      locked_until: null,
      session_token: token,
      session_expires,
    });
    return { ok: true, token, expiresAt: session_expires };
  });

/** Used by the parent layout on every navigation: no valid token, no parent area. */
export const checkPinSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(tokenSchema)
  .handler(async ({ data, context }) => {
    const record = await findPinRecord(serviceRole(context), context.user.id);
    return {
      valid: isSessionValid(record, data.token),
      hasPin: Boolean(record?.pin_hash),
      lockedUntil: isLocked(record) ? record.locked_until : null,
    };
  });

/** Locks the parent area again on this device. */
export const clearPinSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const sdk = serviceRole(context);
    const record = await findPinRecord(sdk, context.user.id);
    if (record) await sdk.entities.ParentPin.update(record.id, { session_token: null, session_expires: null });
    return { ok: true };
  });

/** Changing the PIN requires the current one, so a child cannot replace it. */
export const changeParentPin = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ currentPin: z.string().min(4).max(4), pin: z.string().min(4).max(4), confirm: z.string().min(4).max(4) }))
  .handler(async ({ data, context }) => {
    if (!isFourDigits(data.pin)) return { ok: false, error: "invalid_format" };
    if (data.pin !== data.confirm) return { ok: false, error: "mismatch" };

    const sdk = serviceRole(context);
    const record = await findPinRecord(sdk, context.user.id);
    if (!record?.pin_hash) return { ok: false, error: "no_pin" };
    if (isLocked(record)) return { ok: false, error: "locked", minutesLeft: minutesLeft(record) };

    const candidate = await hashPin(data.currentPin, record.pin_salt);
    if (!safeEqual(candidate, record.pin_hash)) {
      const failed = (record.failed_attempts || 0) + 1;
      if (failed >= MAX_ATTEMPTS) {
        const locked_until = expiresAt(LOCK_MINUTES);
        await sdk.entities.ParentPin.update(record.id, { failed_attempts: failed, locked_until, session_token: null, session_expires: null });
        return { ok: false, error: "locked", minutesLeft: LOCK_MINUTES };
      }
      await sdk.entities.ParentPin.update(record.id, { failed_attempts: failed });
      return { ok: false, error: "wrong", attemptsLeft: MAX_ATTEMPTS - failed };
    }

    const salt = randomHex(16);
    const pin_hash = await hashPin(data.pin, salt);
    const token = randomHex(24);
    const session_expires = expiresAt(SESSION_MINUTES);
    await sdk.entities.ParentPin.update(record.id, {
      pin_hash,
      pin_salt: salt,
      failed_attempts: 0,
      locked_until: null,
      session_token: token,
      session_expires,
    });
    return { ok: true, token };
  });

/**
 * Resetting a forgotten PIN requires the account password, and the password is
 * checked here on the server: only the parent who owns the password can drop
 * the PIN, so a child holding an open session cannot replace it. The returned
 * login token is discarded, never handed back to the browser.
 */
export const resetParentPin = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ email: z.string().min(3).max(200), password: z.string().min(1).max(200) }))
  .handler(async ({ data, context }) => {
    const verified = await context
      .getBase44()
      .auth.loginViaEmailPassword(data.email.trim(), data.password)
      .then((result) => result?.user ?? null)
      .catch(() => null);

    if (!verified || verified.id !== context.user.id) return { ok: false, error: "bad_credentials" };

    const sdk = serviceRole(context);
    const record = await findPinRecord(sdk, context.user.id);
    if (record) await sdk.entities.ParentPin.delete(record.id);
    return { ok: true };
  });