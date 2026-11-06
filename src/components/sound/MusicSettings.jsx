import { Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSound } from "@/lib/sound";
import { useI18n } from "@/lib/preferences";

/** Background-music settings for the side menu: an on/off switch and a volume slider. */
export function MusicSettings() {
  const { t } = useI18n();
  const { muted, volume, setMuted, setVolume } = useSound();
  const on = !muted && volume > 0;

  const toggle = (next) => {
    if (!next) {
      setMuted(true);
      return;
    }
    if (volume === 0) setVolume(0.22);
    else setMuted(false);
  };

  const change = ([value]) => {
    if (value === 0) setMuted(true);
    else {
      setVolume(value / 100);
      setMuted(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
          <Music2 className="h-4 w-4 text-lav-deep" aria-hidden="true" />
          {t("موسيقى الخلفية", "Background music")}
        </span>
        <Switch
          checked={on}
          onCheckedChange={toggle}
          aria-label={t("تشغيل أو إيقاف موسيقى الخلفية", "Turn background music on or off")}
        />
      </div>

      <Slider
        className="mt-3"
        min={0}
        max={100}
        step={5}
        value={[Math.round((muted ? 0 : volume) * 100)]}
        onValueChange={change}
        aria-label={t("مستوى الموسيقى", "Music volume")}
      />

      <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-ink-soft">
        <span>{t("هادئة", "Quiet")}</span>
        <span>{muted ? t("مكتومة", "Muted") : `${Math.round(volume * 100)}%`}</span>
        <span>{t("أعلى", "Louder")}</span>
      </div>
    </div>
  );
}

export default MusicSettings;