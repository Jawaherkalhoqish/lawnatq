import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { avatarClasses } from "@/lib/cards";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const AVATARS = ["sun", "turq", "coral", "lav", "sky", "rose"];
const AGES = [5, 6, 7, 8, 9, 10];

function PillGroup({ label, hint, options, value, onChange }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink-soft">{hint}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              value === opt.value
                ? "border-ink/15 bg-ink text-background"
                : "border-border bg-card text-ink-soft hover:border-ink/25 hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Create or edit one child profile. Parent-only; never shown in the child space. */
export function ChildForm({ child, onDone, submitLabel }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: child?.name ?? "",
    age: child?.age ?? 6,
    avatar_color: child?.avatar_color ?? "sun",
    interests_text: (child?.interests ?? []).join("، "),
    language: child?.language ?? "ar",
    communication_preference: child?.communication_preference ?? "mixed",
    support_note: child?.support_note ?? "prefer_not_to_say",
    voice_enabled: child?.voice_enabled ?? true,
    accessibility_notes: child?.accessibility_notes ?? "",
    parent_notes: child?.parent_notes ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError(t("نحتاج اسمًا لطفلك.", "Your child needs a name."));
      return;
    }
    setError("");
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      avatar_color: form.avatar_color,
      interests: form.interests_text
        .split(/[،,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8),
      language: form.language,
      communication_preference: form.communication_preference,
      support_note: form.support_note,
      voice_enabled: form.voice_enabled,
      accessibility_notes: form.accessibility_notes.trim(),
      parent_notes: form.parent_notes.trim(),
      favorite_cards: child?.favorite_cards ?? [],
    };
    try {
      if (child) await base44.entities.Child.update(child.id, payload);
      else await base44.entities.Child.create(payload);
      await queryClient.invalidateQueries({ queryKey: ["children"] });
      if (child) await queryClient.invalidateQueries({ queryKey: ["child", child.id] });
      onDone?.();
    } catch (err) {
      setError(err.message || t("تعذّر الحفظ", "Could not save"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <p className="rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="child-name">{t("الاسم المفضل", "Preferred name")}</Label>
          <Input
            id="child-name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder={t("سارة", "Sara")}
            className="h-12 rounded-2xl"
            maxLength={40}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{t("العمر", "Age")}</Label>
          <div className="flex flex-wrap gap-1.5">
            {AGES.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => set({ age })}
                aria-pressed={form.age === age}
                className={cn(
                  "h-10 w-10 rounded-full text-sm font-bold transition",
                  form.age === age ? "bg-turq text-turq-deep ring-2 ring-turq-deep/30 dark:text-primary-foreground" : "bg-cream text-ink-soft hover:text-ink",
                )}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>{t("لون الأفاتار", "Avatar color")}</Label>
        <div className="mt-2 flex gap-2">
          {AVATARS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => set({ avatar_color: color })}
              aria-label={color}
              aria-pressed={form.avatar_color === color}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full font-display text-base font-extrabold transition",
                avatarClasses[color],
                form.avatar_color === color ? "ring-2 ring-ink/30 ring-offset-2 ring-offset-card" : "opacity-70 hover:opacity-100",
              )}
            >
              {form.name?.charAt(0) || "•"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-interests">{t("الاهتمامات", "Interests")}</Label>
        <Input
          id="child-interests"
          value={form.interests_text}
          onChange={(e) => set({ interests_text: e.target.value })}
          placeholder={t("ديناصورات، موسيقى، سيارات", "Dinosaurs, music, cars")}
          className="h-12 rounded-2xl"
        />
        <p className="text-xs text-ink-soft">{t("افصلي بينها بفاصلة.", "Separate them with a comma.")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PillGroup
          label={t("لغة الطفل", "Child's language")}
          options={[
            { value: "ar", label: t("العربية", "Arabic") },
            { value: "en", label: t("الإنجليزية", "English") },
          ]}
          value={form.language}
          onChange={(language) => set({ language })}
        />
        <PillGroup
          label={t("طريقة التعبير المفضلة", "Preferred expression")}
          options={[
            { value: "cards", label: t("بطاقات", "Cards") },
            { value: "speech", label: t("كلام", "Speech") },
            { value: "mixed", label: t("الاثنان", "Both") },
          ]}
          value={form.communication_preference}
          onChange={(communication_preference) => set({ communication_preference })}
        />
      </div>

      <PillGroup
        label={t("هل تودين مشاركة أي شيء عن دعم طفلك؟", "Would you like to share anything about support needs?")}
        hint={t(
          "اختياري تمامًا، ولا يظهر داخل مساحة الطفل ولا يغيّر المحتوى الذي يراه.",
          "Completely optional. Never shown inside the child's space and does not change what they see.",
        )}
        options={[
          { value: "down_syndrome", label: t("لديه متلازمة داون", "Has Down syndrome") },
          { value: "other_support_needs", label: t("احتياجات دعم أخرى", "Other support needs") },
          { value: "prefer_not_to_say", label: t("أفضل عدم الإجابة", "Prefer not to say") },
        ]}
        value={form.support_note}
        onChange={(support_note) => set({ support_note })}
      />

      <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
        <div>
          <p className="text-sm font-bold text-ink">{t("قراءة الأنشطة بصوت مسموع", "Read activities aloud")}</p>
          <p className="text-xs text-ink-soft">{t("استخدام صوت المتصفح عند الضغط على السماعة.", "Uses the browser voice when the speaker is tapped.")}</p>
        </div>
        <Switch checked={form.voice_enabled} onCheckedChange={(v) => set({ voice_enabled: v })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-access">{t("ملاحظات الوصول", "Accessibility notes")}</Label>
        <Textarea
          id="child-access"
          value={form.accessibility_notes}
          onChange={(e) => set({ accessibility_notes: e.target.value })}
          placeholder={t("مثال: يستجيب أفضل للتعليمات القصيرة والصوت الهادئ.", "e.g. responds best to short instructions and a calm voice.")}
          className="rounded-2xl"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-notes">{t("ملاحظات خاصة بكِ", "Your private notes")}</Label>
        <Textarea
          id="child-notes"
          value={form.parent_notes}
          onChange={(e) => set({ parent_notes: e.target.value })}
          placeholder={t("تبقى ظاهرة لكِ فقط.", "Visible only to you.")}
          className="rounded-2xl"
          rows={2}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="h-14 w-full rounded-full bg-ink text-base font-bold text-background transition hover:opacity-90 disabled:opacity-60"
      >
        {busy ? t("جارٍ الحفظ...", "Saving...") : submitLabel || t("حفظ الملف", "Save profile")}
      </button>
    </form>
  );
}

export default ChildForm;