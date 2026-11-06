/**
 * Prototype subscription state. Nothing here talks to a payment provider:
 * choosing a plan only records it in this browser so the subscribed state can
 * be experienced. No card details are ever requested and no charge is made.
 */
const STORAGE_KEY = "lawnatq.subscription";

/** The plan this browser has activated, or null. */
export function readSubscription() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.plan ? parsed : null;
  } catch {
    return null;
  }
}

/** Marks a plan as active for this browser and returns the stored record. */
export function activateSubscription(plan) {
  const record = { plan, activated_at: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* private mode: the session still shows the subscribed state */
  }
  return record;
}