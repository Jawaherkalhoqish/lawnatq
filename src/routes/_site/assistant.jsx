import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, Send, Volume2 } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { base44 } from "@/api/base44Client";
import { askAssistant } from "@/lib/app-fns";
import { useAuth } from "@/lib/AuthContext";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/assistant")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "المرافق | لونُطق" },
      {
        name: "description",
        content: "مرافق ودود يجيب بكلمات بسيطة، يشجّع الطفل ولا يشخّص ولا يحكم على مشاعره.",
      },
    ],
  }),
  component: CompanionPage,
});

const starters = [
  { ar: "أريد أن أحكي لك عن يومي", en: "I want to tell you about my day" },
  { ar: "ماذا نرسم اليوم؟", en: "What shall we draw today?" },
  { ar: "أشعر أن شيئًا صعبًا حدث", en: "Something difficult happened" },
];

function CompanionPage() {
  const { t, lang } = useI18n();
  const { voice } = usePrefs();
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [child, setChild] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    base44.entities.Child.list("-created_date", 1)
      .then((list) => setChild(Array.isArray(list) ? list[0] ?? null : null))
      .catch(() => setChild(null));
  }, [isAuthenticated]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const send = useMutation({
    mutationFn: async (text) => {
      const next = [...messages, { role: "user", content: text }];
      setMessages(next);
      const res = await ask({
        data: {
          mode: "child",
          lang,
          child: {
            name: child?.name || (lang === "ar" ? "صديق لونا" : "Lona's friend"),
            age: child?.age || 7,
            interests: child?.interests || [],
          },
          messages: next.slice(-12),
        },
      });
      return res.reply;
    },
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (voice) speak(reply, lang);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t(
            "تعذّر الوصول إلى المرافق الآن. جرّب مرة أخرى بعد قليل، أو اذهب إلى البطاقات والألوان.",
            "The companion could not be reached right now. Try again shortly, or go to the cards and colors.",
          ),
        },
      ]);
    },
  });

  function submit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || send.isPending) return;
    setDraft("");
    send.mutate(text);
  }

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow={t("المرافق", "Companion")}
        title={t("مرافق يسمعك بكلمات بسيطة", "A companion who listens in simple words")}
        description={t(
          "يمكنك أن تحكي له عن يومك أو تسأله ماذا نرسم. لا يشخّص، ولا يدّعي أنه يعرف شعورك بالتحديد.",
          "You can tell it about your day or ask what to draw. It never diagnoses, and never claims to know exactly how you feel.",
        )}
        tone="sky"
      />

      <div className="mx-auto mt-8 max-w-3xl px-5 sm:px-8">
        {isLoadingAuth ? (
          <div className="grid place-items-center rounded-[2rem] border border-border bg-card p-16">
            <Loader2 className="h-6 w-6 animate-spin text-ink-soft" aria-hidden="true" />
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-soft sm:p-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky/20 text-sky-deep">
              <Lock className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">
              {t("المرافق يحتاج حساب والد", "The companion needs a parent account")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">
              {t(
                "المحادثة هنا حقيقية ومتصلة بخدمة ذكاء اصطناعي، لذلك نطلب حساب والد/والدة لضمان بيئة آمنة. البطاقات والقصص والرسم متاحة بدون حساب.",
                "The conversation here is a real AI service, so we ask for a parent account to keep the space safe. Cards, stories and drawing work without an account.",
              )}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Link
                to="/login"
                className="inline-flex h-13 items-center rounded-full bg-ink px-6 text-base font-bold text-background transition hover:opacity-90"
              >
                {t("تسجيل الدخول", "Login")}
              </Link>
              <Link
                to="/register"
                className="inline-flex h-13 items-center rounded-full border border-border px-6 text-base font-bold text-ink transition hover:bg-cream"
              >
                {t("إنشاء حساب", "Create account")}
              </Link>
              <Link
                to="/cards"
                className="inline-flex h-13 items-center rounded-full px-5 text-base font-bold text-ink-soft transition hover:text-ink"
              >
                {t("تصفّح البطاقات", "Browse the cards")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
            <div className="flex items-center gap-3 border-b border-border bg-cream/60 px-5 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-turq/30 text-lg font-extrabold text-turq-deep">
                ل
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-ink">{t("لونا", "Lona")}</p>
                <p className="text-xs text-ink-soft">
                  {child?.name
                    ? t(`تتحدث مع ${child.name}`, `Talking with ${child.name}`)
                    : t("مرافقة لونُطق", "The LAWNATQ companion")}
                </p>
              </div>
              {messages.length ? (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="ms-auto text-xs font-bold text-ink-soft transition hover:text-ink"
                >
                  {t("محادثة جديدة", "New chat")}
                </button>
              ) : null}
            </div>

            <div className="max-h-[26rem] min-h-[18rem] space-y-3 overflow-y-auto px-5 py-6">
              {!messages.length ? (
                <div className="rounded-[1.5rem] bg-cream/70 p-5">
                  <p className="font-bold text-ink">
                    {t("مرحبًا! أنا لونا. بماذا تحب أن نبدأ؟", "Hello! I'm Lona. What shall we start with?")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {starters.map((s) => (
                      <button
                        key={s.en}
                        type="button"
                        onClick={() => send.mutate(s[lang])}
                        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:border-turq"
                      >
                        {s[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-[1.4rem] px-4 py-3 text-base leading-relaxed",
                        m.role === "user"
                          ? "bg-turq/25 text-ink"
                          : "bg-cream text-ink ring-1 ring-border",
                      )}
                    >
                      {m.content}
                      {m.role === "assistant" ? (
                        <button
                          type="button"
                          onClick={() => speak(m.content, lang)}
                          aria-label={t("اسمع الرد", "Listen to the reply")}
                          className="mt-2 flex items-center gap-1.5 text-xs font-bold text-ink-soft transition hover:text-ink"
                        >
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {t("اسمع", "Listen")}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
              {send.isPending ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-[1.4rem] bg-cream px-4 py-3 text-sm text-ink-soft ring-1 ring-border">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t("لونا تكتب…", "Lona is writing…")}
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-border px-4 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={600}
                placeholder={t("اكتب هنا…", "Type here…")}
                aria-label={t("رسالتك إلى لونا", "Your message to Lona")}
                className="h-13 flex-1 rounded-full border border-input bg-background px-5 text-base text-ink outline-none focus:border-turq"
              />
              <button
                type="submit"
                disabled={!draft.trim() || send.isPending}
                aria-label={t("إرسال", "Send")}
                className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-turq text-turq-deep transition hover:brightness-105 disabled:opacity-40"
              >
                <Send className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
              </button>
            </form>
          </div>
        )}

        <p className="mt-4 rounded-2xl bg-cream/70 px-5 py-4 text-sm leading-relaxed text-ink-soft">
          {t(
            "المرافق ليس أداة تشخيص أو تقييم، ولا يعرف مشاعر الطفل على وجه اليقين. عند أي قلق صحي أو تطوري، تحدث مع مختص.",
            "The companion is not a diagnostic or assessment tool and cannot know a child's feelings with certainty. For any health or developmental concern, speak with a specialist.",
          )}
        </p>
        {user?.full_name ? <span className="sr-only">{user.full_name}</span> : null}
      </div>
    </div>
  );
}