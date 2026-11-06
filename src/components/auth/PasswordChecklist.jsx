import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES, checkPassword } from "@/lib/password-rules";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** The live requirements under a password field: each turns green as it is met. */
export function PasswordChecklist({ password, id }) {
  const { t } = useI18n();
  const state = checkPassword(password);

  return (
    <ul id={id} className="grid gap-1.5 pt-1 sm:grid-cols-2" aria-live="polite">
      {PASSWORD_RULES.map((rule, index) => {
        const met = state[index].met;
        return (
          <li
            key={rule.key}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold transition",
              met ? "text-turq-deep" : "text-ink-soft",
            )}
          >
            <span
              className={cn(
                "grid h-4 w-4 shrink-0 place-items-center rounded-full",
                met ? "bg-turq/25" : "bg-cream",
              )}
              aria-hidden="true"
            >
              {met ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : <Circle className="h-1.5 w-1.5 fill-current" />}
            </span>
            {t(rule.ar, rule.en)}
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordChecklist;