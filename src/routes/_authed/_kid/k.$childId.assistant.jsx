import { useEffect, useRef, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles, Volume2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { useAssistantMessages, useChild, useDrawings } from "@/hooks/useFamily";
import { askAssistant } from "@/lib/app-fns";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_kid/k/$childId/assistant")({
  head: () => ({ meta: [{ title: "مساعدي | لونُطق" }] }),
  component: AssistantPage,
});

function AssistantPage() {
  const { childId } = useParams({ strict: false });
  const { t, lang } = useI18n();
  const { voice } = usePrefs();
  const { data: child } = useChild(childId);
  const { data: stored } = useAssistantMessages(childId, "child");
  const { data: drawings } = useDrawings(childId, 1);
  const ask = useServerFn(askAssistant);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef(null);

  const history = (stored || []).map((m) => ({ role: m.role, content: m.content }));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [stored?.length, pending]);

  const suggestions = [
    t("ماذا نلعب اليوم؟", "What shall we play today?"),
    t("ساعدني أرسم شيئًا", "Help me draw something"),
    t("أشعر بالملل", "I feel bored"),
  ];

  async function send(text) {
    const content = (text ?? draft).trim();
    if (!content || pending || !child) return;
    setDraft("");
    setPending(true);

    await base44.entities.AssistantMessage.create({
      child_id: childId,
      role: "user",
      content,
      mode: "child",
    }).catch(() => {});
    queryClient.invalidateQueries({ queryKey: ["assistant", childId, "child"] });

    try {
      const conversation = [...history, { role: "user", content }].slice(-10);
      const { reply } = await ask({
        data: {
          mode: "child",
          lang,
          child: { name: child.name, age: Number(child.age) || 6, interests: child.interests ?? [] },
          messages: conversation,
          context: drawings?.[0]?.title ? `${lang === "ar" ? "آخر رسمة" : "Latest drawing"}: ${drawings[0].title}` : undefined,
        },
      });
      await base44.entities.AssistantMessage.create({
        child_id: childId,
        role: "assistant",
        content: reply,
        mode: "child",
      }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["assistant", childId, "child"] });
      if (voice && reply) speak(reply, lang);
    } catch {
      await base44.entities.AssistantMessage.create({
        child_id: childId,
        role: "assistant",
        content: t("لم أستطع الرد الآن. جرّب مرة أخرى بعد قليل.", "I couldn't answer just now. Try again in a moment."),
        mode: "child",
      }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["assistant", childId, "child"] });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="flex items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sun/30 text-2xl" aria-hidden="true">
          ✦
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{t("مساعدي", "My helper")}</h1>
          <p className="text-sm text-ink-soft">
            {t("صديق ودود، يجيب بكلمات بسيطة.", "A friendly friend who answers simply.")}
          </p>
        </div>
      </header>

      <div className="min-h-[22rem] space-y-3 rounded-[2rem] border border-border bg-cream/40 p-4 sm:p-6">
        {!history.length && (
          <div className="rounded-3xl bg-card p-5 shadow-sm">
            <p className="text-base leading-relaxed text-ink">
              {t(
                `أهلًا ${child?.name ?? ""}! أنا هنا معك. هل تحب أن نبدأ بالبطاقات، أم بالألوان، أم بقصة؟`,
                `Hello ${child?.name ?? ""}! I'm here with you. Shall we start with cards, colors, or a story?`,
              )}
            </p>
          </div>
        )}

        {history.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-3xl px-4 py-3 text-base leading-relaxed shadow-sm",
                message.role === "user" ? "bg-ink text-background" : "bg-card text-ink",
              )}
            >
              {message.content}
              {message.role === "assistant" && voice && (
                <button
                  type="button"
                  onClick={() => speak(message.content, lang)}
                  className="ms-2 inline-grid h-7 w-7 place-items-center rounded-full bg-cream text-ink-soft transition hover:text-ink"
                  aria-label={t("اسمع الرد", "Listen to the reply")}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-3xl bg-card px-4 py-3 shadow-sm">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-ink-soft"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => send(suggestion)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("اكتب هنا…", "Write here…")}
          aria-label={t("رسالتك", "Your message")}
          className="h-14 rounded-full bg-card px-5"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-background transition hover:opacity-90 disabled:opacity-40"
          aria-label={t("إرسال", "Send")}
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 rtl:rotate-180" />}
        </button>
      </form>

      <p className="flex items-center gap-2 rounded-2xl bg-cream/70 px-4 py-3 text-xs leading-relaxed text-ink-soft">
        <Sparkles className="h-4 w-4 shrink-0 text-turq-deep" aria-hidden="true" />
        {t(
          "المساعد يشجّع التعبير فقط، ولا يحكم على مشاعرك ولا يشخّصها.",
          "The helper only encourages expression — it never judges or diagnoses how you feel.",
        )}
      </p>
    </div>
  );
}