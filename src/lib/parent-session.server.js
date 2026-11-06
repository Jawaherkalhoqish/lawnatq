// Shared server-side rules for the parent PIN: lookup, lockout window and the
// short-lived PIN session token. Imported only by server functions.

export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 10;
export const SESSION_MINUTES = 60;

export async function findPinRecord(sdk, userId) {
  const page = await sdk.entities.ParentPin.filter({ user_id: userId }, { limit: 1 });
  return page.items?.[0] ?? null;
}

export const isLocked = (record) =>
  Boolean(record?.locked_until) && new Date(record.locked_until).getTime() > Date.now();

export const isSessionValid = (record, token) => {
  if (!record?.session_token || !token) return false;
  if (record.session_token !== token) return false;
  return Boolean(record.session_expires) && new Date(record.session_expires).getTime() > Date.now();
};

export const minutesLeft = (record) =>
  Math.max(1, Math.ceil((new Date(record.locked_until).getTime() - Date.now()) / 60000));

/** A parent session token is required for every protected parent read/write. */
export async function assertPinSession(sdk, userId, token) {
  const record = await findPinRecord(sdk, userId);
  if (!isSessionValid(record, token)) {
    const error = new Error("PIN session required");
    error.status = 403;
    throw error;
  }
}