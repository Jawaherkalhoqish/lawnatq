import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { submitFeedback } from "@/lib/feedback-fns";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const TOPICS = [
  { key: "activities", ar: "الأنشطة", en: "Activities" },
  { key: "website", ar: "الموقع", en: "The website" },
  { key: "specialists", ar: "المواعيد والمختصون", en: "Appointments" },
  { key: "other", ar: "اقتراح آخر", en: "Something else" },
];

/** Rating, topic, comment, then a clear confirmation. */
export function FeedbackForm({ token, onSubmitted }) {
  const { t } = useI18n();
  const send = useServerFn(submitFeedback);
  const [rating, setRating] = useState(0);
  const [topic, setTopic] = useState("activities");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!rating || comment.trim().length < 3) {
      setError(t("اختاري تقييمًا واكتبي ملاحظتك أولًا.", "Pick a rating and write your comment first."));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await send({ data: { token, rating, topic, comment: comment.trim() } });
      if (!res?.ok) throw new Error();
      setDone(true);
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch {
      setError(t("تعذّر إرسال الملاحظة. حاولي مرة أخرى.", "Could not send your feedback. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-soft">
        <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-turq/20 text-turq-deep">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-extrabold text-ink">
          {t("وصلتنا ملاحظتك، شكرًا لك", "Your feedback is saved, thank you")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {t(
            "نقرأ كل ملاحظة بعناية، وتساعدنا على تحسين أنشطة لونُطق وتجربة الموقع.",
            "We read every note carefully. It helps us improve LAWNATQ activities and the website.",
          )}
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-bold text-ink transition hover:bg-cream"
        >
          {t("إرسال ملاحظة أخرى", "Send another note")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl font-extrabold text-ink">{t("كيف كانت تجربتك؟", "How was your experience?")}</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {t("تقييمك وملاحظاتك تساعدنا على التحسين.", "Your rating and comments help us improve.")}
      </p>

      <div className="mt-4 flex items-center gap-1.5" role="group" aria-label={t("التقييم", "Rating")}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={t(`${value} من 5`, `${value} of 5`)}
            aria-pressed={rating >= value}
            className="rounded-full p-1 transition hover:scale-110"
          >
            <Star
              className={cn("h-8 w-8", rating >= value ? "fill-sun text-sun-deep" : "text-ink-soft/50")}
              aria-hidden="true"
            />
          </button>
        ))}
        <span className="ms-2 text-sm font-bold text-ink-soft">{rating ? `${rating}/5` : ""}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TOPICS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTopic(item.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold transition",
              topic === item.key ? "border-transparent bg-lilac text-ink" : "border-border bg-card text-ink-soft",
            )}
          >
            {t(item.ar, item.en)}
          </button>
        ))}
      </div>

      <label htmlFor="feedback-comment" className="mt-4 block text-sm font-bold text-ink">
        {t("ملاحظتك أو اقتراحك", "Your comment or suggestion")}
      </label>
      <textarea
        id="feedback-comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        maxLength={1200}
        placeholder={t("اكتبي ما أعجب طفلك، وما تودين تحسينه…", "Tell us what your child enjoyed, and what you would improve…")}
        className="mt-2 w-full rounded-2xl border border-input bg-background p-3 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {error ? (
        <p role="alert" className="mt-3 rounded-2xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {t("إرسال الملاحظة", "Send feedback")}
      </button>
    </form>
  );
}

export default FeedbackForm;