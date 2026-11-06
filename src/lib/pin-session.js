/**
 * The verified-PIN session token for this tab. The token is only a handle: the
 * backend checks it against the parent's PIN record on every protected call.
 */
const KEY = "lawnatq.parentPin";

export function readPinToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(KEY) || null;
  } catch {
    return null;
  }
}

export function savePinToken(token) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, token);
  } catch {
    /* private mode: the next navigation asks for the PIN again */
  }
}

export function clearPinToken() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}