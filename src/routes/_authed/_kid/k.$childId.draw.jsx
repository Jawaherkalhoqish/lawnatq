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
      </header>

      <TemplatePicker value={template} onChange={setTemplate} />

      <h2 className="text-center font-display text-2xl font-extrabold text-lav-deep sm:text-3xl">
        {t("يلا نرسم عالمنا!", "Let's draw our world!")}
      </h2>

      <DrawingCanvas
        child={child}
        template={template}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["drawings", childId] })}
      />
    </div>
  );
}