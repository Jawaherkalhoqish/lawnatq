import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { requestAppointment } from "@/lib/appointment-fns";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const formatSlot = (iso) =>
  new Date(iso).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" });

/** Pick a child, pick a slot, see the fee, send the request. */
export function BookingDialog({ specialist, children, token, open, onOpenChange, onBooked }) {
  const { t } = useI18n();
  const book = useServerFn(requestAppointment);
  const [slotId, setSlotId] = useState(specialist?.slots?.[0]?.id ?? "");
  const [childId, setChildId] = useState(children?.[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!slotId) return;
    setBusy(true);
    setError("");
    try {
      const res = await book({ data: { token, specialistId: specialist.id, availabilityId: slotId, childId } });
      if (!res.ok) {
        setError(
          res.error === "no_subscription"
            ? t("طلب المختص متاح للمشتركين. فعّلي اشتراكك أولًا.", "Specialist requests need an active subscription. Activate yours first.")
            : res.error === "slot_taken"
              ? t("هذا الوقت لم يعد متاحًا. اختاري وقتًا آخر.", "That slot is taken. Please choose another.")
              : t("تعذّر إرسال الطلب. حاولي مرة أخرى.", "Could not send the request. Please try again."),
        );
        return;
      }
      toast.success(t("أُرسل طلب الموعد", "Request sent"), {
        description: t("سيظهر الطلب في لوحة الوالدين بحالة «بانتظار التأكيد».",
          "It appears in your dashboard as “Pending”."),
      });
      onBooked?.();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || t("تعذّر إرسال الطلب.", "Could not send the request."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">
            {t("طلب موعد", "Request an appointment")}
          </DialogTitle>
          <DialogDescription>
            {specialist?.name} — {t("قيمة الجلسة", "Session fee")}: {specialist?.session_price ?? 0}{" "}
            {specialist?.currency || "SAR"}
          </DialogDescription>
        </DialogHeader>

        {children?.length ? (
          <div>
            <p className="mb-2 text-sm font-bold text-ink">{t("لمن الموعد؟", "Who is it for?")}</p>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setChildId(child.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    childId === child.id ? "border-transparent bg-ink text-background" : "border-border bg-card text-ink",
                  )}
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-sm font-bold text-ink">{t("الوقت المتاح", "Available time")}</p>
          {specialist?.slots?.length ? (
            <div className="space-y-2">
              {specialist.slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSlotId(slot.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl border px-4 py-3 text-start text-sm font-semibold transition",
                    slotId === slot.id ? "border-transparent bg-lilac/70 text-ink" : "border-border bg-card text-ink-soft",
                  )}
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {formatSlot(slot.start_at)}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-cream p-4 text-sm text-ink-soft">
              {t("لا توجد أوقات متاحة لهذا المختص حاليًا.", "No open times for this specialist right now.")}
            </p>
          )}
        </div>

        <p className="rounded-2xl bg-cream p-3 text-xs leading-relaxed text-ink-soft">
          {t(
            "قيمة الجلسة منفصلة عن اشتراك لونُطق، وتُدفع لاحقًا عبر وسيلة دفع معتمدة عند تفعيلها.",
            "The session fee is separate from the LAWNATQ subscription and is paid later through an approved payment method once enabled.",
          )}
        </p>

        {error ? (
          <p role="alert" className="rounded-2xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <button
            type="button"
            onClick={submit}
            disabled={busy || !slotId || !specialist?.slots?.length}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-background disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {t("إرسال الطلب", "Send request")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDialog;