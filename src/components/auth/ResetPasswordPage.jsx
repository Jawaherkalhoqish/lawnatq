import { Link } from "@tanstack/react-router";
import { AlertTriangle, Lock } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isStrongPassword } from "@/lib/password-rules";
import { useI18n } from "@/lib/preferences";

// The /reset-password page; the reset email links here with ?token=.
export function ResetPasswordPage() {
  const { t } = useI18n();
  // Read raw: the router's search parser would turn an all-digit token into a number.
  const token = new URLSearchParams(window.location.search).get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!isStrongPassword(password)) {
      setError(
        t(
          "كلمة المرور ضعيفة. أكمل الشروط الظاهرة تحت الحقل.",
          "That password is too weak. Complete the requirements under the field.",
        ),
      );
      return;
    }
    if (password !== confirm) {
      setError(t("كلمتا المرور غير متطابقتين", "Passwords do not match"));
      return;
    }
    setBusy(true);
    try {
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || t("تعذّر تغيير كلمة المرور", "Failed to reset password"));
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout
        title={t("رابط غير صالح", "Invalid reset link")}
        subtitle={t("هذا الرابط ناقص أو منتهي.", "This password reset link is missing or invalid.")}
        footer={
          <Link to="/forgot-password" className="font-bold text-turq-deep hover:underline">
            {t("اطلبي رابطًا جديدًا", "Request a new link")}
          </Link>
        }
      >
        <p className="text-center text-sm leading-relaxed text-ink">
          {t(
            "الرابط الذي استخدمته غير مكتمل. اطلبي رسالة إعادة تعيين جديدة.",
            "The link you used appears to be incomplete. Please request a new password reset email.",
          )}
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("كلمة مرور جديدة", "New password")} subtitle={t("اكتبي كلمة المرور الجديدة.", "Enter your new password.")}>
      <AuthError>{error}</AuthError>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-password">{t("كلمة المرور الجديدة", "New password")}</Label>
          <div className="relative">
            <Lock className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-13 rounded-2xl ps-11"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reset-confirm">{t("تأكيد كلمة المرور", "Confirm password")}</Label>
          <div className="relative">
            <Lock className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-13 rounded-2xl ps-11"
              required
            />
          </div>
          {confirm && confirm !== password ? (
            <p className="text-xs font-semibold text-destructive">
              {t("كلمتا المرور غير متطابقتين", "Passwords do not match")}
            </p>
          ) : null}
        </div>

        <PasswordChecklist password={password} id="reset-password-rules" />

        <SubmitButton busy={busy} busyLabel={t("جارٍ التغيير...", "Resetting...")}>
          {t("حفظ كلمة المرور", "Reset password")}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}