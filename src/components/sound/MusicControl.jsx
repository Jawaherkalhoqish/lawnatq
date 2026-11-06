import { useState } from "react";
import { Music2, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** Mute toggle plus a small volume panel — available in every header. */
export function MusicControl({ className }) {
  const { t } = useI18n();
  const { muted, volume, setMuted, setVolume } = useSound();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative flex items-center", className)}>
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        aria-pressed={!muted}
        aria-label={muted ? t("تشغيل موسيقى الخلفية", "Play background music") : t("إيقاف موسيقى الخلفية", "Mute background music")}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
          muted ? "border-border bg-card text-ink-soft hover:text-ink" : "border-lav/50 bg-lav/25 text-lav-deep",
        )}
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t("مستوى الموسيقى", "Music volume")}
        className="inline-flex h-9 w-6 items-center justify-center rounded-full text-ink-soft transition hover:text-ink"
      >
        <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute end-0 top-11 z-[70] w-52 rounded-2xl border border-border bg-card p-3 shadow-lift">
          <p className="text-xs font-bold text-ink">{t("موسيقى الخلفية", "Background music")}</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label={t("مستوى الموسيقى", "Music volume")}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[hsl(var(--lav-deep))]"
          />
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="mt-2 w-full rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink"
          >
            {muted ? t("تشغيل", "Turn on") : t("إيقاف", "Turn off")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MusicControl;