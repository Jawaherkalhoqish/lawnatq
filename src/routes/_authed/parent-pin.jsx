import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { PinPad, PinDots } from "@/components/parent/PinPad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createParentPin, getPinState, resetParentPin, verifyParentPin } from "@/lib/pin-fns";
import { clearPinToken, savePinToken } from "@/lib/pin-session";
import { loginWithMfa } from "@/lib/authMfa";
import { sanitizeReturnTo } from "@/lib/authReturnTo";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/parent-pin")({
  head: () => ({ meta: [{ title: "رمز مساحة الوالدين | لونُطق" }] }),
  validateSearch: (search) => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  component: ParentPinPage,
});

/**
 * The PIN gate for the parent area. New parents create a four-digit PIN here
 * (twice); returning parents type it. A forgotten PIN is reset only after the
 * account password is entered again, so a child holding the open session cannot
 * replace it.
 */
function ParentPinPage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const returnTo = sanitizeReturnTo(search.returnTo) || "/dashboard";

  const [mode, setMode] = useState("loading"); // loading | setup | verify | reset
  const [step, setStep] = useState("new"); // new | confirm
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lockedMinutes, setLockedMinutes] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getPinState({ data: {} })
      .then((state) => {
        setMode(state.hasPin ? "verify" : "setup");
        setLockedMinutes(state.minutesLeft || 0);
      })
      .catch(() => setMode("verify"));
  }, []);

  useEffect(() => {
    if (user?.email) setEmail((current) => current || user.email);
  }, [user]);

  function done(token) {
    savePinToken(token);
    toast.success(t("تم التحقق", "Verified"), {
      description: t("أهلًا بكِ في مساحة الوالدين.", "Welcome to the parent space."),
    });
    navigate({ to: returnTo, replace: true });
  }

  async function submit(value) {
    if (value.length < 4 || busy) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "setup") {
        if (step === "new") {
          setFirstPin(value);
          setPin("");
          setStep("confirm");
          return;
        }
        const res = await createParentPin({ data: { pin: firstPin, confirm: value } });
        if (res.ok) return done(res.token);
        if (res.error === "mismatch") {
          setError(t("الرمزان غير متطابقين. لنبدأ من جديد.", "The two PINs don't match. Let's start again."));
          setStep("new");
          setFirstPin("");
          setPin("");
        } else if (res.error === "already_set") {
          setMode("verify");
          setPin("");
        } else {
          setError(t("أدخلي أربعة أرقام فقط.", "Enter four digits only."));
          setPin("");
        }
        return;
      }

      if (mode === "verify") {
        const res = await verifyParentPin({ data: { pin: value } });
        if (res.ok) return done(res.token);
        setPin("");
        if (res.error === "locked") {
          setLockedMinutes(res.minutesLeft || 10);
          setError(
            t(
              `محاولات كثيرة. حُظر الإدخال مؤقتًا لمدة ${res.minutesLeft || 10} دقيقة.`,
              `Too many attempts. Entry is paused for ${res.minutesLeft || 10} minutes.`,
            ),
          );
        } else if (res.error === "no_pin") {
          setMode("setup");
          setStep("new");
        } else if (typeof res.attemptsLeft === "number") {
          setError(
            t(
              `الرمز غير صحيح. المحاولات المتبقية: ${res.attemptsLeft}`,
              `Wrong PIN. Attempts left: ${res.attemptsLeft}`,
            ),
          );
        } else {
          setError(t("الرمز غير صحيح.", "That PIN is not correct."));
        }
      }
    } catch (err) {
      setError(err?.message || t("تعذّر إكمال الطلب. حاولي مرة أخرى.", "Something went wrong. Please try again."));
      setPin("");
    } finally {
      setBusy(false);
    }
  }

  // A full four digits submits on its own.
  useEffect(() => {
    if (pin.length === 4 && !busy) submit(pin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  async function resetWithPassword(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await loginWithMfa(email.trim(), password);
      if (result?.mfa_required) {
        setError(
          t(
            "حسابك محمي بخطوة تحقق ثانية. أكمليها من صفحة الدخول ثم عودي هنا.",
            "Your account needs a second verification step. Finish it on the login page, then come back.",
          ),
        );
        return;
      }
      await resetParentPin({ data: {} });
      clearPinToken();
      setPassword("");
      setMode("setup");
      setStep("new");
      setFirstPin("");
      setPin("");
      toast.success(t("يمكنك إنشاء رمز جديد الآن", "You can create a new PIN now"));
    } catch (err) {
      setError(err?.message || t("البريد أو كلمة المرور غير صحيحة", "Invalid email or password"));
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === "setup"
      ? step === "new"
        ? t("أنشئي رمز والديكم", "Create your parent PIN")
        : t("أعيدي إدخال الرمز", "Enter the PIN again")
      : mode === "reset"
        ? t("تأكيد الحساب", "Confirm your account")
        : t("مساحة الوالدين", "Parent space");

  const subtitle =
    mode === "setup"
      ? step === "new"
        ? t(
            "أربعة أرقام يحمي بها والدك أو والدتك هذه المساحة. لا تشاركيها.",
            "Four digits that keep this space for your parent. Don't share them.",
          )
        : t("اكتبي الأرقام نفسها مرة أخرى للتأكيد.", "Type the same four digits once more to confirm.")
      : mode === "reset"
        ? t("أدخلي بريد الحساب وكلمة المرور لإنشاء رمز جديد.", "Enter the account email and password to create a new PIN.")
        : t("أدخلي رمز الأربعة أرقام للمتابعة.", "Enter the four-digit PIN to continue.");

  return (
    <div className="min-h-screen bg-gradient-to-b from-card via-background to-cream/60">
      <div className="mx-auto flex max-w-md flex-col px-5 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-cream hover:text-ink">
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t("الرئيسية", "Home")}
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Logo className="h-14" wordmark />
        </div>

        <div className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-lilac/70 px-3 py-1 text-xs font-bold text-lav-deep">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {t("محمية برمز", "PIN protected")}
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>

          {mode === "loading" ? (
            <div className="mt-8 h-40 animate-pulse rounded-3xl bg-cream" />
          ) : mode === "reset" ? (
            <form onSubmit={resetWithPassword} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin-reset-email">{t("البريد الإلكتروني", "Email")}</Label>
                <Input
                  id="pin-reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin-reset-password">{t("كلمة المرور", "Password")}</Label>
                <Input
                  id="pin-reset-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>
              {error ? (
                <p role="alert" className="rounded-2xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="h-13 w-full rounded-full bg-ink text-base font-bold text-background disabled:opacity-60"
              >
                {busy ? t("جارٍ التحقق...", "Checking...") : t("متابعة", "Continue")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("verify");
                  setError("");
                }}
                className="w-full text-center text-sm font-semibold text-ink-soft hover:text-ink"
              >
                {t("رجوع", "Back")}
              </button>
            </form>
          ) : (
            <>
              <div className="mt-7">
                <PinDots value={pin} tone={mode === "setup" ? "turq" : "lav"} />
              </div>

              {error ? (
                <p role="alert" className="mt-5 rounded-2xl bg-destructive/10 p-3 text-center text-sm font-semibold text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="mt-6">
                <PinPad value={pin} onChange={setPin} disabled={busy || lockedMinutes > 0} />
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                {t(
                  "لا نعرض أي بيانات للوالدين قبل إدخال الرمز الصحيح.",
                  "No parent information is shown before the correct PIN.",
                )}
              </p>

              {mode === "verify" ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setError("");
                    setPin("");
                  }}
                  className="mt-4 w-full text-center text-sm font-semibold text-ink-soft hover:text-ink"
                >
                  {t("نسيتِ الرمز؟", "Forgot the PIN?")}
                </button>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            clearPinToken();
            logout();
          }}
          className="mx-auto mt-6 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          {t("تسجيل الخروج من هذا الجهاز", "Sign out of this device")}
        </button>
      </div>
    </div>
  );
}