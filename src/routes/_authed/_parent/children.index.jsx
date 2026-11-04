import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Pencil, Plus, Sparkles } from "lucide-react";
import ChildForm from "@/components/app/ChildForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChildren } from "@/hooks/useFamily";
import { avatarClasses } from "@/lib/cards";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_parent/children/")({
  head: () => ({ meta: [{ title: "ملفات الأطفال | لونُطق" }] }),
  component: ChildrenPage,
});

function ChildrenPage() {
  const { t } = useI18n();
  const { data: children, isLoading } = useChildren();
  const [open, setOpen] = useState(false);
  const Arrow = ArrowRight;

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{t("ملفات الأطفال", "Children")}</h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            {t(
              "كل ملف مساحة خاصة لطفل واحد: اسمه، اهتماماته، وتفضيلات الوصول التي تهمّه.",
              "Each profile is one child's own space: their name, interests and access preferences.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-12 items-center gap-2 self-start rounded-full bg-ink px-6 text-sm font-bold text-background transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("ملف طفل جديد", "New child profile")}
        </button>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-[2rem] bg-cream" />
          ))}
        </div>
      ) : children?.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <article key={child.id} className="rounded-[2rem] border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span
                  className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl font-display text-2xl font-extrabold ${avatarClasses[child.avatar_color] || avatarClasses.sun}`}
                  aria-hidden="true"
                >
                  {child.name?.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-extrabold text-ink">{child.name}</h2>
                  <p className="text-sm text-ink-soft">
                    {child.age} {t("سنوات", "years")} ·{" "}
                    {child.language === "ar" ? t("العربية", "Arabic") : t("الإنجليزية", "English")}
                  </p>
                  {child.interests?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {child.interests.slice(0, 4).map((interest) => (
                        <span key={interest} className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-ink-soft">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/k/$childId"
                  params={{ childId: child.id }}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:brightness-105"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t("مساحة الطفل", "Child's space")}
                  <Arrow className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </Link>
                <Link
                  to="/children/$childId"
                  params={{ childId: child.id }}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold text-ink transition hover:bg-cream"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  {t("تعديل", "Edit")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-dashed border-border bg-card p-10 text-center">
          <h2 className="font-display text-xl font-extrabold text-ink">{t("لا توجد ملفات بعد", "No profiles yet")}</h2>
          <p className="mx-auto mt-2 max-w-sm text-ink-soft">
            {t("أضيفي أول ملف ليبدأ طفلك أنشطته.", "Add the first profile so your child can begin.")}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-background"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("إضافة ملف", "Add a profile")}
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">{t("ملف طفل جديد", "New child profile")}</DialogTitle>
          </DialogHeader>
          <ChildForm
            onDone={() => setOpen(false)}
            submitLabel={t("إنشاء الملف", "Create profile")}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}