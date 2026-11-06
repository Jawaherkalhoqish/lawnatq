import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, MessageCircleHeart, Palette, Plus, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ChildPicker from "@/components/app/ChildPicker";
import RecentWork from "@/components/app/RecentWork";
import Recommendation from "@/components/app/Recommendation";
import AppointmentsSummary from "@/components/parent/AppointmentsSummary";
import SubscriptionCard from "@/components/parent/SubscriptionCard";
import { useAuth } from "@/lib/AuthContext";
import { useCardSequences, useChildren, useDrawings, useStoryProgress } from "@/hooks/useFamily";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_parent/dashboard")({
  head: () => ({ meta: [{ title: "لوحة الوالد | لونُطق" }] }),
  component: DashboardPage,
});

function useCounts(childId) {
  return useQuery({
    queryKey: ["counts", childId],
    enabled: Boolean(childId),
    queryFn: async () => {
      const [drawings, stories, cards] = await Promise.all([
        base44.entities.Drawing.count({ child_id: childId }),
        base44.entities.StoryProgress.count({ child_id: childId }),
        base44.entities.CardSequence.count({ child_id: childId }),
      ]);
      return { drawings, stories, cards };
    },
  });
}

function DashboardPage() {
  const { t, isAr } = useI18n();
  const { user } = useAuth();
  const { data: children, isLoading } = useChildren();
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!activeId && children?.length) setActiveId(children[0].id);
  }, [children, activeId]);

  const child = children?.find((c) => c.id === activeId);
  const { data: drawings = [] } = useDrawings(activeId, 6);
  const { data: sequences = [] } = useCardSequences(activeId, 6);
  const { data: progress = [] } = useStoryProgress(activeId);
  const { data: counts, isLoading: countsLoading } = useCounts(activeId);

  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const firstName = (user?.full_name || "").split(" ")[0];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-soft">
            {t("أهلًا بكِ من جديد", "Welcome back")}{firstName ? `، ${firstName}` : ""}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {t("مساحة الوالد", "Parent space")}
          </h1>
        </div>
        {child && (
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/k/$childId"
              params={{ childId: child.id }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t(`مساحة ${child.name}`, `${child.name}'s space`)}
            </Link>
            <Link
              to="/children"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold text-ink transition hover:bg-cream"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("ملف جديد", "New profile")}
            </Link>
          </div>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <SubscriptionCard />
        <AppointmentsSummary />
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-[2rem] bg-cream" />
      ) : !children?.length ? (
        <div className="rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-soft sm:p-14">
          <span className="inline-grid h-20 w-20 place-items-center rounded-3xl bg-sun/25">
            <Sparkles className="h-9 w-9 text-sun-deep" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-extrabold text-ink">
            {t("لنبدأ بملف طفلك الأول", "Let's start with your child's first profile")}
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
            {t(
              "الاسم والعمر والاهتمامات — دقيقة واحدة، ثم تفتح لطفلك مساحة الأنشطة.",
              "Name, age and interests — one minute, then your child's activity space opens.",
            )}
          </p>
          <Link
            to="/children"
            className="mt-7 inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 text-base font-bold text-background"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            {t("إنشاء ملف طفل", "Create a child profile")}
          </Link>
        </div>
      ) : (
        <>
          <ChildPicker children={children} activeId={activeId} onSelect={setActiveId} />

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Palette, label: t("رسمة محفوظة", "Saved drawings"), value: counts?.drawings ?? 0, tone: "bg-sun/12 text-sun-deep" },
              { icon: BookOpen, label: t("قصة", "Stories"), value: counts?.stories ?? 0, tone: "bg-lav/12 text-lav-deep" },
              { icon: MessageCircleHeart, label: t("سلسلة بطاقات", "Card sequences"), value: counts?.cards ?? 0, tone: "bg-turq/12 text-turq-deep" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-[1.75rem] border border-border bg-card p-5">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.tone}`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  {countsLoading ? (
                    <span className="mb-1 block h-7 w-10 animate-pulse rounded-lg bg-cream" aria-hidden="true" />
                  ) : (
                    <p className="font-display text-2xl font-extrabold text-ink">{stat.value}</p>
                  )}
                  <p className="text-xs font-semibold text-ink-soft">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <RecentWork childId={activeId} drawings={drawings} sequences={sequences} progress={progress} />
            <div className="space-y-4">
              <Recommendation childId={activeId} drawings={drawings} sequences={sequences} progress={progress} />

              <div className="rounded-[2rem] border border-border bg-card p-5">
                <h2 className="text-base font-bold text-ink">{t("وصول سريع", "Quick access")}</h2>
                <ul className="mt-3 space-y-1">
                  {[
                    { to: "/k/$childId/cards", params: { childId: activeId }, icon: MessageCircleHeart, ar: "بطاقات التواصل", en: "Communication cards" },
                    { to: "/k/$childId/draw", params: { childId: activeId }, icon: Palette, ar: "استوديو الألوان", en: "Color studio" },
                    { to: "/k/$childId/stories", params: { childId: activeId }, icon: BookOpen, ar: "مكتبة القصص", en: "Story library" },
                    { to: "/k/$childId/assistant", params: { childId: activeId }, icon: Sparkles, ar: "المساعد الودود", en: "The helper" },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        params={item.params}
                        className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream"
                      >
                        <item.icon className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                        <span className="flex-1">{t(item.ar, item.en)}</span>
                        <Arrow className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}