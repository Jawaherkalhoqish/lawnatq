import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Loader2, MessageCircleHeart, Palette, Plus, Sparkles, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ChildPicker from "@/components/app/ChildPicker";
import DrawingThumb from "@/components/app/DrawingThumb";
import { Textarea } from "@/components/ui/textarea";
import {
  useCardSequences,
  useChildren,
  useDrawings,
  useNotes,
  useStoryProgress,
} from "@/hooks/useFamily";
import { suggestIdeas } from "@/lib/app-fns";
import { cardByKey, cardImage } from "@/lib/cards";
import { timeAgo } from "@/lib/dates";
import { useI18n } from "@/lib/preferences";
import { storyPackById as storyById } from "@/lib/story-pack";

export const Route = createFileRoute("/_authed/_parent/insights")({
  head: () => ({ meta: [{ title: "الأسئلة والرؤى | لونُطق" }] }),
  component: InsightsPage,
});

function InsightsPage() {
  const { t, lang } = useI18n();
  const { data: children } = useChildren();
  const [activeId, setActiveId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [ideas, setIdeas] = useState(null);
  const queryClient = useQueryClient();
  const requestIdeas = useServerFn(suggestIdeas);

  useEffect(() => {
    if (!activeId && children?.length) setActiveId(children[0].id);
  }, [children, activeId]);

  const child = children?.find((c) => c.id === activeId);
  const { data: drawings } = useDrawings(activeId, 24);
  const { data: sequences } = useCardSequences(activeId, 20);
  const { data: progress } = useStoryProgress(activeId);
  const { data: notes } = useNotes(activeId);

  const generate = useMutation({
    mutationFn: async () => {
      const log = [
        drawings?.length ? `Drawings: ${drawings.slice(0, 5).map((d) => d.title).filter(Boolean).join(" | ")}` : null,
        sequences?.length
          ? `Card sequences: ${sequences
              .slice(0, 4)
              .map((s) => (s.card_keys || []).map((k) => cardByKey[k]?.en).filter(Boolean).join(" + "))
              .join(" | ")}`
          : null,
        progress?.length ? `Stories: ${progress.map((p) => storyById(p.story_id)?.title.en).filter(Boolean).join(" | ")}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      return requestIdeas({
        data: {
          lang,
          child: { name: child.name, age: Number(child.age) || 6, interests: child.interests ?? [] },
          log,
        },
      });
    },
    onSuccess: setIdeas,
  });

  const addNote = useMutation({
    mutationFn: (body) => base44.entities.ParentNote.create({ child_id: activeId, body, kind: "note" }),
    onSuccess: () => {
      setNoteDraft("");
      queryClient.invalidateQueries({ queryKey: ["notes", activeId] });
    },
  });

  const removeNote = useMutation({
    mutationFn: (id) => base44.entities.ParentNote.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", activeId] }),
  });

  const savedStarters = notes?.filter((n) => n.kind === "starter") ?? [];
  const plainNotes = notes?.filter((n) => n.kind === "note") ?? [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {t("الأسئلة والرؤى", "Questions & insights")}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          {t(
            "ما فعله طفلك فعلًا — بدون تفسير للمشاعر أو أحكام على الرسومات.",
            "What your child actually did — with no interpretation of feelings or judgments about the artwork.",
          )}
        </p>
      </header>

      {!children?.length ? (
        <p className="rounded-[2rem] border border-dashed border-border p-8 text-center text-ink-soft">
          {t("أضيفي ملف طفل أولًا.", "Add a child profile first.")}
        </p>
      ) : (
        <>
          <ChildPicker children={children} activeId={activeId} onSelect={setActiveId} />

          <section className="overflow-hidden rounded-[2.5rem] bg-lav/12 p-6 ring-1 ring-lav/25 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ink">
                  {t("أسئلة لطيفة تفتح الحوار", "Gentle questions to open a conversation")}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {t(
                    "مبنية على نشاط طفلك المسجّل فقط، مع أنشطة مشتركة مقترحة.",
                    "Built only from your child's logged activity, plus ideas to do together.",
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => generate.mutate()}
                disabled={generate.isPending}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-background transition hover:opacity-90 disabled:opacity-60"
              >
                {generate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {ideas ? t("اقتراحات جديدة", "New ideas") : t("اقترح أسئلة", "Suggest questions")}
              </button>
            </div>

            {generate.isError && (
              <p className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">
                {t("تعذّر إعداد الاقتراحات الآن.", "Could not prepare suggestions right now.")}
              </p>
            )}

            {ideas ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <ul className="space-y-2">
                  {ideas.starters.map((starter) => (
                    <li key={starter} className="flex items-start gap-3 rounded-2xl bg-card p-4">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-turq/25 text-turq-deep">
                        <MessageCircleHeart className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm leading-relaxed text-ink">«{starter}»</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {ideas.activities.map((activity) => (
                    <li key={activity.title} className="rounded-2xl bg-card p-4">
                      <p className="text-sm font-bold text-ink">{activity.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{activity.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-card/70 p-4 text-sm leading-relaxed text-ink-soft">
                {t(
                  "اضغطي «اقترح أسئلة» وسنجهّز ثلاثة أسئلة ونشاطين مبنيين على آخر ما فعله طفلك.",
                  "Tap “Suggest questions” and we'll prepare three questions and two activities from your child's latest work.",
                )}
              </p>
            )}
            {ideas?.starters?.length ? (
              <button
                type="button"
                onClick={() =>
                  base44.entities.ParentNote
                    .bulkCreate(ideas.starters.map((body) => ({ child_id: activeId, body, kind: "starter" })))
                    .then(() => queryClient.invalidateQueries({ queryKey: ["notes", activeId] }))
                }
                className="mt-4 text-sm font-bold text-lav-deep hover:underline"
              >
                {t("احفظيها في ملاحظاتي", "Save these to my notes")}
              </button>
            ) : null}
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
              <Palette className="h-5 w-5 text-sun-deep" aria-hidden="true" />
              {t("الرسومات المحفوظة", "Saved drawings")}
              <span className="text-sm font-semibold text-ink-soft">({drawings?.length ?? 0})</span>
            </h2>
            {drawings?.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {drawings.map((drawing) => (
                  <div key={drawing.id}>
                    <DrawingThumb drawing={drawing} className="aspect-[3/2]" />
                    <p className="mt-1.5 text-xs text-ink-soft">{timeAgo(drawing.created_date, lang)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
                {t("لا رسومات بعد.", "No drawings yet.")}
              </p>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
                <BookOpen className="h-5 w-5 text-lav-deep" aria-hidden="true" />
                {t("القصص", "Stories")}
              </h2>
              {progress?.length ? (
                <ul className="mt-3 space-y-2">
                  {progress.slice(0, 6).map((entry) => {
                    const story = storyById(entry.story_id);
                    if (!story) return null;
                    return (
                      <li key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                        <span className="text-sm font-bold text-ink">{story.title[lang]}</span>
                        <span className="text-xs text-ink-soft">
                          {entry.status === "saved"
                            ? t("محفوظة", "Saved")
                            : entry.status === "completed"
                              ? t("مكتملة", "Completed")
                              : t("قيد القراءة", "In progress")}
                          {" · "}
                          {timeAgo(entry.created_date, lang)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
                  {t("لا قصص بعد.", "No stories yet.")}
                </p>
              )}
            </section>

            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
                <MessageCircleHeart className="h-5 w-5 text-turq-deep" aria-hidden="true" />
                {t("سجل البطاقات", "Card history")}
              </h2>
              {sequences?.length ? (
                <ul className="mt-3 space-y-2">
                  {sequences.slice(0, 6).map((seq) => (
                    <li key={seq.id} className="rounded-2xl border border-border bg-card px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {(seq.card_keys || []).map((key, i) => {
                          const card = cardByKey[key];
                          if (!card) return null;
                          return (
                            <span key={`${key}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1 text-[0.7rem] font-semibold text-ink">
                              <img src={cardImage(card)} alt="" className="h-5 w-5 object-contain" />
                              {lang === "ar" ? card.ar : card.en}
                            </span>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-[0.7rem] text-ink-soft">{timeAgo(seq.created_date, lang)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
                  {t("لا بطاقات بعد.", "No cards yet.")}
                </p>
              )}
            </section>
          </div>

          <section className="rounded-[2.5rem] bg-cream/70 p-6 sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-ink">{t("ملاحظاتي", "My notes")}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {t("تبقى في حسابك فقط ولا تظهر في مساحة طفلك.", "Kept in your account only — never in your child's space.")}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (noteDraft.trim()) addNote.mutate(noteDraft.trim());
              }}
              className="mt-4 space-y-2"
            >
              <Textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={t("مثال: أحب أن يبدأ بالبطاقات بعد المدرسة.", "e.g. prefers to start with cards after school.")}
                className="rounded-2xl bg-card"
                rows={2}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!noteDraft.trim() || addNote.isPending}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-background disabled:opacity-50"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("أضيفي ملاحظة", "Add note")}
              </button>
            </form>

            {(plainNotes.length > 0 || savedStarters.length > 0) && (
              <ul className="mt-5 space-y-2">
                {[...plainNotes, ...savedStarters].slice(0, 12).map((note) => (
                  <li key={note.id} className="flex items-start gap-3 rounded-2xl bg-card p-3.5">
                    <span className="flex-1 text-sm leading-relaxed text-ink">
                      {note.kind === "starter" ? `«${note.body}»` : note.body}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNote.mutate(note.id)}
                      className="rounded-full p-1.5 text-ink-soft transition hover:bg-cream hover:text-ink"
                      aria-label={t("حذف الملاحظة", "Delete note")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-ink-soft">
            {t(
              "تنبيه: لونُطق لا تشخّص ولا تقيس النمو، ولا تفسّر الألوان أو الأشكال. إن كان لديك قلق على طفلك، تحدثي مع مختص مؤهل.",
              "Note: LAWNATQ does not diagnose or measure development, and never interprets colors or shapes. If you have a concern about your child, speak with a qualified specialist.",
            )}
          </p>
        </>
      )}
    </div>
  );
}