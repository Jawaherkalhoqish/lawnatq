import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeParentPin } from "@/lib/pin-fns";
import { savePinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";

const digits = (value) => value.replace(/\D/g, "").slice(0, 4);

/** Changing the PIN needs the current one, so a child cannot replace it. */
export function ChangePinCard() {
  const { t } = useI18n();
  const changePin = useServerFn(changeParentPin);
  const [currentPin, setCurrentPin] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (pin !== confirm) {
      setError(t("الرمزان الجديدان غير متطابقين.", "The new PINs don't match."));
      return;
    }
    setBusy(true);
    try {
      const res = await changePin({ data: { currentPin, pin, confirm } });
      if (res.ok) {
        savePinToken(res.token);
        setCurrentPin("");
        setPin("");
        setConfirm("");
        toast.success(t("تغيّر رمز مساحة الوالدين", "Your parent PIN has changed"));
        return;
      }
      setError(
        res.error === "wrong"
          ? t(`الرمز الحالي غير صحيح. المحاولات المتبقية: ${res.attemptsLeft}`, `Wrong current PIN. Attempts left: ${res.attemptsLeft}`)
          : res.error === "locked"
            ? t("محاولات كثيرة. حُظر التغيير مؤقتًا.", "Too many attempts. Changing is paused for a while.")
            : t("تعذّر تغيير الرمز.", "Could not change the PIN."),
      );
    } catch (err) {
      setError(err?.message || t("تعذّر تغيير الرمز.", "Could not change the PIN."));
    } finally {
      setBusy(false);
    }
  }

  const field = (id, label, value, setter) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        value={value}
        onChange={(e) => setter(digits(e.target.value))}
        className="h-12 rounded-2xl text-center text-lg font-extrabold tracking-[0.4em]"
        placeholder="••••"
        required
      />
    </div>
  );

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
        <KeyRound className="h-5 w-5 text-lav-deep" aria-hidden="true" />
        {t("رمز مساحة الوالدين", "Parent area PIN")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {t(
          "أربعة أرقام تفتح لوحة الوالدين على هذا الحساب. لا تشاركيها مع طفلك.",
          "Four digits that open the parent dashboard on this account. Keep them from your child.",
        )}
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        {field("pin-current", t("الرمز الحالي", "Current PIN"), currentPin, setCurrentPin)}
        <div className="grid gap-3 sm:grid-cols-2">
          {field("pin-new", t("الرمز الجديد", "New PIN"), pin, setPin)}
          {field("pin-confirm", t("تأكيد الرمز الجديد", "Confirm new PIN"), confirm, setConfirm)}
        </div>
        {error ? (
          <p role="alert" className="rounded-2xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || currentPin.length < 4 || pin.length < 4 || confirm.length < 4}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-bold text-background disabled:opacity-60"
        >
          {busy ? t("جارٍ الحفظ...", "Saving...") : t("تغيير الرمز", "Change PIN")}
        </button>
      </form>
    </section>
  );
}

export default ChangePinCard;