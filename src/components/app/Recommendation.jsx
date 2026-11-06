import { Link } from "@tanstack/react-router";
import { Lightbulb, MessageCircleQuestion } from "lucide-react";
import { cardByKey } from "@/lib/cards";
import { storyPackById as storyById } from "@/lib/story-pack";
import { useI18n } from "@/lib/preferences";

/**
 * A gentle, non-diagnostic suggestion built only from what the child actually did.
 * Never interprets the artwork or labels the child.
 */
export function Recommendation({ childId, drawings, sequences, progress }) {
  const { t, lang } = useI18n();
  let title = t("ابدأ بخطوة صغيرة", "Start with one small step");
  let body = t(
    "أول نشاط مقترح: بطاقتان فقط («أريد» + «ماء»). لا داعي لشرح طويل.",
    "First suggestion: just two cards (“I want” + “water”). No long explanation needed.",
  );

  const cards = sequences?.flatMap((s) => s.card_keys || []) ?? [];
  if (drawings?.length) {
    const latest = drawings[0];
    title = t("سؤال عن آخر رسمة", "A question about the latest drawing");
    body = t(
      `آخر رسمة${latest.template && latest.template !== "free" ? ` استخدم فيها قالب «${latest.template}»` : ""}. اسألي بهدوء: «ماذا تحب أن تخبرني عن هذه الرسمة؟»`,
      `Their latest drawing${latest.template && latest.template !== "free" ? ` used the “${latest.template}” template` : ""}. Ask gently: “What would you like to tell me about this drawing?”`,
    );
  } else if (cards.length >= 2) {
    const names = [...new Set(cards)].slice(0, 2).map((k) => cardByKey[k]?.[lang]).filter(Boolean);
    title = t("وسّعا البطاقات معًا", "Grow the cards together");
    body = t(
      `استخدم طفلك ${names.join(" و ")}. جرّبا إضافة بطاقة ثالثة في المرة القادمة، واطلبا معًا سماع الجملة بصوت مسموع.`,
      `Your child used ${names.join(" and ")}. Try adding a third card next time, and listen to the sentence aloud together.`,
    );
  } else if (progress?.length) {
    const story = storyById(progress[0].story_id);
    title = t("أكملوا القصة", "Finish the story together");
    body = t(
      `بدأ طفلك قصة «${story?.title.ar ?? ""}». اقرآ المشهد التالي معًا واسأليه: «ماذا تختار؟»`,
      `Your child started “${story?.title.en ?? ""}”. Read the next scene together and ask: “What would you choose?”`,
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-ink p-6 text-background">
      <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-bold">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
        {t("اقتراح اليوم", "Today's suggestion")}
      </span>
      <h2 className="mt-4 font-display text-xl font-extrabold leading-snug">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-background/80">{body}</p>
      <Link
        to="/insights"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-sm font-bold text-ink transition hover:opacity-90"
      >
        <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
        {t("أسئلة أخرى للحوار", "More conversation starters")}
      </Link>
      <p className="mt-4 text-xs leading-relaxed text-background/55">
        {t(
          "لونُطق لا يفسّر مشاعر الطفل من رسمه أو ألوانه.",
          "LAWNATQ never reads feelings from a child's drawing or colors.",
        )}
      </p>
    </div>
  );
}

export default Recommendation;