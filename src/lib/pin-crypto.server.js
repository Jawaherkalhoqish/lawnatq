// Server-only helpers for the parent PIN. The four digits are never stored or
// returned: only a salted PBKDF2 hash is kept, and the comparison is constant-time.

const encoder = new TextEncoder();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const isFourDigits = (value) => typeof value === "string" && /^\d{4}$/.test(value);

// The platform runtime refuses PBKDF2 iteration counts above 100000, so this is
// the strongest supported cost. Create, confirm, verify and change all derive
// with this same constant, so one PIN can never be hashed two different ways.
export const PBKDF2_ITERATIONS = 100000;

export function randomHex(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPin(pin, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length || !a.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}