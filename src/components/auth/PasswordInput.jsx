import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/preferences";

/**
 * A password field with a show/hide eye toggle inside it.
 * The toggle only changes the input's `type`, so the value, validation and
 * submit behaviour stay exactly as they were.
 */
export function PasswordInput({ id, withLock = true, className, ...props }) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const label = visible ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password");

  return (
    <div className="relative">
      {withLock ? (
        <Lock className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
      ) : null}
      <Input
        id={id}
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pe-12", withLock ? "ps-11" : "ps-4", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={label}
        aria-pressed={visible}
        aria-controls={id}
        title={label}
        className="absolute end-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-muted focus-visible:bg-muted"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

export default PasswordInput;