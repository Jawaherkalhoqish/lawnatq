import { Lock, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthError, AuthLink, GoogleButton, OrDivider, SubmitButton } from "@/components/auth/parts";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { continueMfa } from "@/lib/authMfa";
import { isStrongPassword } from "@/lib/password-rules";
import { safeReturnTo } from "@/lib/authReturnTo";
import { useI18n } from "@/lib/preferences";

const isAlreadyVerified = (err) => err?.status === 400 && /already verified/i.test(err?.message ?? "");

/**
 * The /register page: register → OTP → verifyOtp → setToken. Registration alone
 * does not sign the user in (the account is unverified), so the code step is never
 * skipped and loginViaEmailPassword is never called right after register.
 */
export function RegisterPage() {
  const returnTo = safeReturnTo();
  const { t } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function register(e) {
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
    if (!consent) {
      setError(t("نحتاج موافقتك على إدارة بيانات طفلك.", "We need your consent to manage your child's data."));
      return;
    }
    setBusy(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || t("تعذّر إنشاء الحساب", "Registration failed"));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.mfa_required) {
        await continueMfa(result, returnTo).catch(() => {
          setStep("already_verified");
          setBusy(false);
        });
        return;
      }
      if (result?.access_token) base44.auth.setToken(result.access_token);
      // Save the parent's name and consent now that the session exists.
      await base44.auth
        .updateMe({ full_name: fullName.trim(), parental_consent: true })
        .catch(() => {});
      window.location.href = returnTo;
    } catch (err) {
      if (isAlreadyVerified(err)) setStep("already_verified");
      else setError(err.message || t("رمز التحقق غير صحيح", "Invalid verification code"));
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast(t("أرسلنا رمزًا جديدًا", "New code sent"), {
        description: t("تحققي من بريدك الإلكتروني.", "Check your email inbox."),
      });
    } catch (err) {
      if (isAlreadyVerified(err)) setStep("already_verified");
      else setError(err.message || t("تعذّر إعادة الإرسال", "Failed to resend code"));
    }
  }

  if (step === "already_verified") {
    return (
      <AuthLayout title={t("حسابك جاهز", "Your account is ready")} subtitle={t("بريدك مؤكد بالفعل.", "Your email is already verified.")}>
        <p className="mb-5 text-sm text-ink-soft">
          <span className="font-semibold text-ink">{email}</span>{" "}
          {t("مؤكد بالكامل. سجّلي الدخول للمتابعة.", "is verified. Sign in to continue.")}
        </p>
        <AuthLink
          to="/login"
          returnTo={returnTo}
          className="inline-flex h-14 w-full items-center justify-center rounded-full bg-ink text-base font-bold text-background"
        >
          {t("تسجيل الدخول", "Sign in")}
        </AuthLink>
      </AuthLayout>
    );
  }

  if (step === "otp") {
    return (
      <AuthLayout
        title={t("تحققي من بريدك", "Check your email")}
        subtitle={t("أرسلنا رمزًا من ٦ أرقام.", "We sent a 6-digit code.")}
      >
        <form onSubmit={verify}>
          <p className="mb-4 text-sm text-ink-soft">
            {t("أرسلنا الرمز إلى", "We sent the code to")}{" "}
            <span className="font-semibold text-ink">{email}</span>
          </p>
          <AuthError>{error}</AuthError>
          <div className="mb-6 flex justify-center" dir="ltr">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="h-13 w-11 rounded-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <SubmitButton busy={busy} busyLabel={t("جارٍ التحقق...", "Verifying...")} disabled={busy || otpCode.length < 6}>
            {t("تأكيد", "Verify")}
          </SubmitButton>
          <p className="mt-4 text-center text-sm text-ink-soft">
            {t("لم يصلك الرمز؟", "Didn't receive the code?")}{" "}
            <button type="button" onClick={resend} className="font-bold text-turq-deep hover:underline">
              {t("إعادة الإرسال", "Resend")}
            </button>
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t("أنشئي حساب الوالد", "Create a parent account")}
      subtitle={t("أنتِ من يدير ملفات الأطفال وبياناتهم.", "You are the one who manages your children's profiles.")}
    >
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <AuthError>{error}</AuthError>
      <form onSubmit={register} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-name">{t("اسمك", "Your name")}</Label>
          <div className="relative">
            <UserRound className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              id="register-name"
              autoComplete="name"
              autoFocus
              placeholder={t("أم سارة", "Sara's mom")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-13 rounded-2xl ps-11"
              disabled={busy}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">{t("البريد الإلكتروني", "Email")}</Label>
          <div className="relative">
            <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-2xl ps-11"
              disabled={busy}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="register-password">{t("كلمة المرور", "Password")}</Label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
              <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-13 rounded-2xl ps-11"
                disabled={busy}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm">{t("تأكيد كلمة المرور", "Confirm password")}</Label>
            <Input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-13 rounded-2xl px-4"
              disabled={busy}
              required
            />
            {confirm && confirm !== password ? (
              <p className="text-xs font-semibold text-destructive">
                {t("كلمتا المرور غير متطابقتين", "Passwords do not match")}
              </p>
            ) : null}
          </div>
        </div>

        <PasswordChecklist password={password} id="register-password-rules" />

        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream p-4">
          <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
          <span className="text-xs leading-relaxed text-ink-soft">
            {t(
              "أوافق على إنشاء ملفات لأطفالي وإدارة بياناتهم داخل لونُطق، وأفهم أن لونُطق مساحة تعبير وليست أداة تشخيص.",
              "I agree to create profiles for my children and manage their data in LAWNATQ, and I understand it is an expression space, not a diagnostic tool.",
            )}
          </span>
        </label>

        <SubmitButton busy={busy} busyLabel={t("جارٍ الإنشاء...", "Creating account...")}>
          {t("إنشاء الحساب", "Create account")}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        {t("لديك حساب بالفعل؟", "Already have an account?")}{" "}
        <AuthLink to="/login" returnTo={returnTo}>
          {t("تسجيل الدخول", "Log in")}
        </AuthLink>
      </p>
    </AuthLayout>
  );
}