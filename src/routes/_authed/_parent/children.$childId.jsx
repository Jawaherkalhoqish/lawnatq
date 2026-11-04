import { useNavigate, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Trash2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import ChildForm from "@/components/app/ChildForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useChild } from "@/hooks/useFamily";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_parent/children/$childId")({
  head: () => ({ meta: [{ title: "تعديل ملف الطفل | لونُطق" }] }),
  component: EditChildPage,
});

function EditChildPage() {
  const { childId } = useParams({ strict: false });
  const { t } = useI18n();
  const { data: child, isLoading } = useChild(childId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function remove() {
    if (!child) return;
    await base44.entities.Child.delete(child.id);
    await queryClient.invalidateQueries({ queryKey: ["children"] });
    navigate({ to: "/children" });
  }

  if (isLoading) return <div className="h-64 animate-pulse rounded-[2rem] bg-cream" />;
  if (!child) return <p className="text-ink-soft">{t("لم نجد هذا الملف.", "Profile not found.")}</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <a
        href="/children"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
      >
        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("كل الملفات", "All profiles")}
      </a>

      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">{t(`ملف ${child.name}`, `${child.name}'s profile`)}</h1>
        <p className="mt-2 text-ink-soft">
          {t("أي تغيير هنا ينعكس مباشرة على مساحة طفلك.", "Any change here applies to your child's space right away.")}
        </p>
      </header>

      <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
        <ChildForm child={child} onDone={() => navigate({ to: "/children" })} submitLabel={t("حفظ التعديلات", "Save changes")} />
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-5 py-3 text-sm font-bold text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {t("حذف ملف الطفل", "Delete this profile")}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-extrabold">
              {t("حذف الملف نهائيًا؟", "Delete this profile?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "سيُحذف ملف الطفل من قائمتك. الرسومات والقصص المرتبطة تبقى في حسابك.",
                "The profile will be removed from your list. Drawings and stories linked to it stay in your account.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">{t("إلغاء", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="rounded-full bg-destructive text-destructive-foreground">
              {t("حذف", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}