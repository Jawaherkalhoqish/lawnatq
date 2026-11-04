import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./GoogleIcon";
import { loginWithGoogle } from "@/lib/authMfa";
import { returnToSearch } from "@/lib/authReturnTo";
import { useI18n } from "@/lib/preferences";

// Small pieces the auth pages share.

export function AuthError({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="mb-4 rounded-2xl bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
      {children}
    </div>
  );
}

export function SubmitButton({ busy, busyLabel, children, ...props }) {
  return (
    <Button
      type="submit"
      className="h-14 w-full rounded-full text-base font-bold shadow-soft"
      disabled={busy}
      {...props}
    >
      {busy ? (
        <>
          <Loader2 className="me-2 h-5 w-5 animate-spin" aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function GoogleButton({ returnTo, onError }) {
  const { t } = useI18n();
  return (
    <Button
      type="button"
      variant="outline"
      className="mb-5 h-13 w-full rounded-full border-2 text-sm font-semibold"
      onClick={() =>
        loginWithGoogle(returnTo).catch((err) => onError(err.message || t("تعذّر الدخول بجوجل", "Unable to sign in with Google")))
      }
    >
      <GoogleIcon className="me-2.5 h-5 w-5" />
      {t("المتابعة باستخدام جوجل", "Continue with Google")}
    </Button>
  );
}

export function OrDivider() {
  const { t } = useI18n();
  return (
    <div className="relative mb-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("أو", "or")}
        </span>
      </div>
    </div>
  );
}

// A link between auth screens that carries the way back (?returnTo=) along.
export function AuthLink({ to, returnTo, className = "font-bold text-turq-deep hover:underline", children }) {
  return (
    <Link to={to} search={returnToSearch(returnTo)} className={className}>
      {children}
    </Link>
  );
}