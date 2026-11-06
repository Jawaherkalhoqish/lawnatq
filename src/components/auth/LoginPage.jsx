import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthError, AuthLink, GoogleButton, OrDivider, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { continueMfa, loginWithMfa } from "@/lib/authMfa";
import { safeReturnTo } from "@/lib/authReturnTo";
import { useI18n } from "@/lib/preferences";

// The /login page. ?returnTo= (or the platform's ?from_url=) is where the visitor
// goes after signing in — the login gate and the MCP consent page send people here with it.
export function LoginPage() {
  const returnTo = safeReturnTo();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await loginWithMfa(email, password);
      if (result.mfa_required) {
        await continueMfa(result, returnTo);
        return;
      }
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || t("البريد أو كلمة المرور غير صحيحة", "Invalid email or password"));
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title={t("أهلًا بعودتك", "Welcome back")}
      subtitle={t("سجّلي الدخول لمتابعة رحلة طفلك.", "Sign in to follow your child's journey.")}
    >
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <AuthError>{error}</AuthError>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">{t("البريد الإلكتروني", "Email")}</Label>
          <div className="relative">
            <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-2xl ps-11"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">{t("كلمة المرور", "Password")}</Label>
            <AuthLink to="/forgot-password" returnTo={returnTo} className="text-xs font-semibold text-ink-soft hover:text-ink">
              {t("نسيتِ كلمة المرور؟", "Forgot password?")}
            </AuthLink>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-13 rounded-2xl"
            required
          />
        </div>
        <SubmitButton busy={busy} busyLabel={t("جارٍ الدخول...", "Signing in...")}>
          {t("تسجيل الدخول", "Log in")}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
        <AuthLink to="/register" returnTo={returnTo}>
          {t("أنشئي حسابًا", "Create one")}
        </AuthLink>
      </p>
    </AuthLayout>
  );
}