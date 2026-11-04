import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthLink, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeReturnTo } from "@/lib/authReturnTo";
import { useI18n } from "@/lib/preferences";

// The /forgot-password page. Always ends in the generic "if an account exists"
// message: the API does not reveal whether the email is registered, and neither should the UI.
export function ForgotPasswordPage() {
  const returnTo = safeReturnTo();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Same outcome either way.
    } finally {
      setBusy(false);
      setSent(true);
    }
  }

  return (
    <AuthLayout
      title={t("إعادة تعيين كلمة المرور", "Reset password")}
      subtitle={t("سنرسل لكِ رابطًا لإعادة التعيين.", "We'll send you a link to reset it.")}
    >
      {sent ? (
        <p className="text-center text-sm leading-relaxed text-ink">
          {t(
            "إن كان هناك حساب بهذا البريد، سيصلك رابط إعادة التعيين بعد قليل.",
            "If an account exists with that email, you'll receive a password reset link shortly.",
          )}
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">{t("البريد الإلكتروني", "Email address")}</Label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
              <Input
                id="forgot-email"
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
          <SubmitButton busy={busy} busyLabel={t("جارٍ الإرسال...", "Sending...")}>
            {t("إرسال الرابط", "Send reset link")}
          </SubmitButton>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink-soft">
        <AuthLink to="/login" returnTo={returnTo}>
          <ArrowRight className="me-1 inline h-3 w-3 rtl:rotate-180" aria-hidden="true" />
          {t("العودة لتسجيل الدخول", "Back to log in")}
        </AuthLink>
      </p>
    </AuthLayout>
  );
}