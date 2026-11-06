import { useRef, useState } from "react";
import { Palette, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import DrawingCanvas from "@/components/draw/DrawingCanvas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/preferences";

/**
 * «+ إضافة بطاقة» — a parent writes the phrase in their own words, then the
 * child draws it and it is saved into that child's My Feelings cards.
 * The drawing is never interpreted or labelled.
 */
export function AddCustomCardDialog({ child, onSaved }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("phrase");
  const [phrase, setPhrase] = useState("");
  const [phraseEn, setPhraseEn] = useState("");
  const [saving, setSaving] = useState(false);
  const phraseRef = useRef("");

  function reset() {
    setStep("phrase");
    setPhrase("");
    setPhraseEn("");
    setSaving(false);
    phraseRef.current = "";
  }

  function startDrawing() {
    const clean = phrase.trim();
    if (!clean) return;
    phraseRef.current = clean;
    setStep("draw");
  }

  async function handleSave({ file }) {
    if (!child || !file) return;
    setSaving(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await base44.entities.CustomCard.create({
        child_id: child.id,
        phrase_ar: phraseRef.current,
        phrase_en: phraseEn.trim() || undefined,
        file_uri,
      });
      toast.success(t("أُضيفت البطاقة إلى مشاعري", "The card was added to My Feelings"));
      onSaved?.();
      setOpen(false);
      reset();
    } catch {
      toast.error(t("تعذّر الحفظ، حاول مرة أخرى", "Could not save, please try again"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="flex min-h-[9.5rem] flex-col items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-lav/60 bg-lilac/40 p-4 text-center transition hover:-translate-y-0.5 hover:bg-lilac/70"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-card text-lav-deep ring-1 ring-lav/40">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-bold text-ink">{t("+ إضافة بطاقة", "+ Add a card")}</span>
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold text-ink">
              {step === "phrase" ? t("بطاقة جديدة في مشاعري", "A new card in My Feelings") : phraseRef.current}
            </DialogTitle>
            <DialogDescription className="text-ink-soft">
              {step === "phrase"
                ? t(
                    "اكتب العبارة كما تحب أن يقرأها طفلك، ثم يرسمها بطريقته.",
                    "Write the phrase the way you want your child to read it, then they draw it in their own way.",
                  )
                : t("ارسم ما تعنيه العبارة لك — لا يوجد رسم صحيح أو خاطئ.", "Draw what the phrase means to you — no drawing is right or wrong.")}
            </DialogDescription>
          </DialogHeader>

          {step === "phrase" ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-bold text-ink">{t("العبارة بالعربية", "The phrase in Arabic")}</span>
                <Input
                  value={phrase}
                  onChange={(event) => setPhrase(event.target.value)}
                  maxLength={60}
                  placeholder={t("أشعر بألم", "I feel pain")}
                  className="mt-1.5 h-12 rounded-2xl text-base"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-ink">{t("نفس العبارة بالإنجليزية (اختياري)", "The same phrase in English (optional)")}</span>
                <Input
                  value={phraseEn}
                  onChange={(event) => setPhraseEn(event.target.value)}
                  maxLength={60}
                  placeholder="I feel pain"
                  className="mt-1.5 h-12 rounded-2xl text-base"
                />
              </label>
              <Button
                type="button"
                onClick={startDrawing}
                disabled={!phrase.trim()}
                className="h-12 w-full rounded-full bg-lav-deep text-base font-bold text-primary-foreground"
              >
                <Palette className="h-4 w-4" aria-hidden="true" />
                {t("التالي: يرسمها طفلي", "Next: my child draws it")}
              </Button>
            </div>
          ) : (
            <DrawingCanvas
              child={child}
              template="free"
              onSave={handleSave}
              saving={saving}
              saveLabel={t("حفظ", "Save")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddCustomCardDialog;