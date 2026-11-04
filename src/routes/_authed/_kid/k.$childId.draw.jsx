import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import DrawingCanvas from "@/components/draw/DrawingCanvas";
import TemplatePicker from "@/components/draw/TemplatePicker";
import { useChild } from "@/hooks/useFamily";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_kid/k/$childId/draw")({
  head: () => ({ meta: [{ title: "ألواني | لونُطق" }] }),
  component: DrawPage,
});

function DrawPage() {
  const { childId } = useParams({ strict: false });
  const { data: child } = useChild(childId);
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [template, setTemplate] = useState("free");

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">{t("ألواني", "My colors")}</h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          {t(
            "اختر ورقة، ثم ارسم. لا شيء هنا خطأ — كل الألوان لك.",
            "Pick a sheet, then draw. Nothing here is wrong — all the colors are yours.",
          )}
        </p>
      </header>

      <TemplatePicker value={template} onChange={setTemplate} />

      <DrawingCanvas
        child={child}
        template={template}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["drawings", childId] })}
      />
    </div>
  );
}