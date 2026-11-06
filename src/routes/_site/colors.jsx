import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import DrawingCanvas from "@/components/draw/DrawingCanvas";
import TemplatePicker from "@/components/draw/TemplatePicker";
import PageIntro from "@/components/site/PageIntro";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_site/colors")({
  head: () => ({
    meta: [
      { title: "الرسم والتلوين | لونُطق" },
      {
        name: "description",
        content: "مساحة رسم وتلوين للأطفال: فرشاة، ممحاة، أحجام، أشكال، وتراجع — بألوان لونُطق.",
      },
    ],
  }),
  component: ColorsPage,
});

function ColorsPage() {
  const { t } = useI18n();
  const [template, setTemplate] = useState("free");

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow={t("الرسم", "Drawing")}
        title={t("ألوانك، بلا قواعد", "Your colors, no rules")}
        description={t(
          "اختر ورقة تلوين أو ابدأ بورقة بيضاء، ثم ارسم بحرية. لا يوجد رسم خاطئ، ولا نقرأ الرسمة لنحكم على شعورك.",
          "Pick a coloring sheet or start blank, then draw freely. There is no wrong drawing, and we never read your drawing to judge how you feel.",
        )}
        tone="sun"
      />

      <div className="mx-auto mt-8 max-w-5xl space-y-4 px-5 sm:px-8">
        <TemplatePicker value={template} onChange={setTemplate} />
        <h2 className="text-center font-display text-2xl font-extrabold text-lav-deep sm:text-3xl">
          {t("يلا نرسم عالمنا!", "Let's draw our world!")}
        </h2>
        <DrawingCanvas template={template} />
      </div>
    </div>
  );
}