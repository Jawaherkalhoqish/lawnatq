import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MUSIC_URL } from "@/lib/brand-asset";

/**
 * One background-music element for the whole platform, created once and kept
 * across page navigation. On by default, started by the first interaction when
 * the browser blocks autoplay, and ducked while a story or card is read aloud.
 */
const KEY = "lawnatq_sound";
const DEFAULT_VOLUME = 0.22;

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState({ muted: false, volume: DEFAULT_VOLUME });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setPrefs({ muted: false, volume: DEFAULT_VOLUME, ...JSON.parse(raw) });
    } catch {
      /* storage unavailable */
    }
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;
    setReady(true);
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable */
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (prefs.muted) {
      audio.pause();
      return;
    }
    audio.volume = prefs.volume;
    audio.play().catch(() => {
      // Autoplay blocked: start on the visitor's first interaction.
      const start = () => {
        audio.play().catch(() => {});
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
      };
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
    });
  }, [prefs, ready]);

  useEffect(() => {
    if (!ready) return;
    const onSpeaking = (event) => {
      const audio = audioRef.current;
      if (!audio || prefs.muted) return;
      audio.volume = event.detail ? prefs.volume * 0.25 : prefs.volume;
    };
    window.addEventListener("lawnatq:speaking", onSpeaking);
    return () => window.removeEventListener("lawnatq:speaking", onSpeaking);
  }, [prefs, ready]);

  const value = useMemo(
    () => ({
      muted: prefs.muted,
      volume: prefs.volume,
      setMuted: (muted) => setPrefs((prev) => ({ ...prev, muted })),
      setVolume: (volume) => setPrefs((prev) => ({ ...prev, volume, muted: volume === 0 })),
    }),
    [prefs],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundProvider>");
  return ctx;
}