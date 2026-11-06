/**
 * The account-password rules for a parent account. These never apply to the
 * four-digit parent PIN, which is its own separate secret.
 */
export const PASSWORD_RULES = [
  { key: "length", test: (v) => v.length >= 8, ar: "٨ أحرف على الأقل", en: "At least 8 characters" },
  { key: "upper", test: (v) => /[A-Z]/.test(v), ar: "حرف إنجليزي كبير واحد (A-Z)", en: "One uppercase letter (A-Z)" },
  { key: "lower", test: (v) => /[a-z]/.test(v), ar: "حرف إنجليزي صغير واحد (a-z)", en: "One lowercase letter (a-z)" },
  { key: "number", test: (v) => /\d/.test(v), ar: "رقم واحد على الأقل (0-9)", en: "One number (0-9)" },
  { key: "special", test: (v) => /[^A-Za-z0-9]/.test(v), ar: "رمز خاص مثل @ # ! $", en: "One special character such as @ # ! $" },
];

/** Each rule with a live `met` flag, for the checklist under the field. */
export function checkPassword(value) {
  const password = value || "";
  return PASSWORD_RULES.map((rule) => ({ key: rule.key, met: rule.test(password) }));
}

export const isStrongPassword = (value) => checkPassword(value).every((rule) => rule.met);