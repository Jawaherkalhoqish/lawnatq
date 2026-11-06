import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import FeedbackForm from "@/components/parent/FeedbackForm";
import FeedbackHistory from "@/components/parent/FeedbackHistory";
import { getFeedback } from "@/lib/feedback-fns";
import { readPinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_parent/feedback")({
  head: () => ({ meta: [{ title: "ملاحظاتك | لونُطق" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { t } = useI18n();
  const token = readPinToken();
  const load = useServerFn(getFeedback);
  const { data, refetch } = useQuery({
    queryKey: ["parent-feedback"],
    queryFn: () => load({ data: { token } }),
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {t("ملاحظاتك", "Your feedback")}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          {t(
            "شاركينا رأيك في أنشطة لونُطق والموقع، وما تودين أن نضيفه أو نحسّنه.",
            "Share your thoughts on LAWNATQ activities and the website, and what you would like us to add or improve.",
          )}
        </p>
      </header>

      <FeedbackForm token={token} onSubmitted={refetch} />

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">{t("ملاحظاتك السابقة", "Your previous notes")}</h2>
        <FeedbackHistory items={data?.items} />
      </section>
    </div>
  );
}