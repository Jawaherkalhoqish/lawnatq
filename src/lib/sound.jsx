import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MUSIC_URL } from "@/lib/brand-asset";

/**
 * One background-music element for the whole platform, created once and kept
 * outside React so navigation, re-renders and provider re-mounts can never
 * produce a second track playing on top of the first. OFF and volume 0 both
 * pause the element and zero its output, and autoplay retries never run while
 * the music is off.
 */
const KEY = "lawnatq_sound";
const DEFAULT_VOLUME = 0.22;

let sharedAudio = null;

function getSharedAudio() {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(MUSIC_URL);
    sharedAudio.loop = true;
    sharedAudio.preload = "auto";
    sharedAudio.volume = 0;
  }
  return sharedAudio;
}

const clamp01 = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
};

function readSaved() {
  const fallback = { muted: false, volume: DEFAULT_VOLUME };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    const volume = typeof saved.volume === "number" ? clamp01(saved.volume) : DEFAULT_VOLUME;
    const muted = typeof saved.muted === "boolean" ? saved.muted : volume === 0;
    return { muted: muted || volume === 0, volume };
  } catch {
    return fallback;
  }
}

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const audioRef = useRef(null);
  const prefsRef = useRef({ muted: false, volume: DEFAULT_VOLUME });
  const releaseRetryRef = useRef(null);
  const [prefs, setPrefs] = useState({ muted: false, volume: DEFAULT_VOLUME });
  const [ready, setReady] = useState(false);

  const stopWaitingForGesture = useCallback(() => {
    if (releaseRetryRef.current) releaseRetryRef.current();
    releaseRetryRef.current = null;
  }, []);

  /** Drives the real element: off means paused AND silent, on means the exact slider volume. */
  const applyToAudio = useCallback(
    (next) => {
      const audio = audioRef.current;
      if (!audio) return;

      const audible = !next.muted && next.volume > 0;
      if (!audible) {
        stopWaitingForGesture();
        audio.pause();
        audio.volume = 0;
        return;
      }

      // Real-time volume: mute/unmute, slider drags and restored preferences all land here.
      audio.volume = next.volume;
      if (!audio.paused) return;

      audio.play().catch(() => {
        // Autoplay blocked: start on the visitor's first gesture, but re-check the
        // preference at that moment so a retry can never start muted music.
        if (releaseRetryRef.current) return;
        const start = () => {
          stopWaitingForGesture();
          const current = prefsRef.current;
          if (current.muted || current.volume <= 0) return;
          audio.volume = current.volume;
          audio.play().catch(() => {});
        };
        window.addEventListener("pointerdown", start);
        window.addEventListener("keydown", start);
        window.addEventListener("touchstart", start);
        releaseRetryRef.current = () => {
          window.removeEventListener("pointerdown", start);
          window.removeEventListener("keydown", start);
          window.removeEventListener("touchstart", start);
        };
      });
    },
    [stopWaitingForGesture],
  );

  /** Single entry point for every preference change: state, storage and audio stay in step. */
  const commit = useCallback(
    (next) => {
      prefsRef.current = next;
      setPrefs(next);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      // Applied in the same tick as the click, not on a later render.
      applyToAudio(next);
    },
    [applyToAudio],
  );

  // Attach the shared element once and restore the saved preference before any play attempt.
  useEffect(() => {
    audioRef.current = getSharedAudio();
    const saved = readSaved();
    prefsRef.current = saved;
    setPrefs(saved);
    setReady(true);
    // The element is never torn down: it carries the playback position across pages.
    return () => stopWaitingForGesture();
  }, [stopWaitingForGesture]);

  useEffect(() => {
    if (!ready) return;
    applyToAudio(prefs);
  }, [ready, prefs, applyToAudio]);

  // Duck while something is read aloud, then return to the user's own volume.
  useEffect(() => {
    const onSpeaking = (event) => {
      const audio = audioRef.current;
      const current = prefsRef.current;
      if (!audio || current.muted || current.volume <= 0) return;
      audio.volume = event.detail ? current.volume * 0.25 : current.volume;
    };
    window.addEventListener("lawnatq:speaking", onSpeaking);
    return () => window.removeEventListener("lawnatq:speaking", onSpeaking);
  }, []);

  const value = useMemo(() => {
    const setMuted = (muted) => {
      const current = prefsRef.current;
      if (muted) {
        commit({ ...current, muted: true });
        return;
      }
      commit({ muted: false, volume: current.volume > 0 ? current.volume : DEFAULT_VOLUME });
    };

    const setVolume = (volume) => {
      const next = clamp01(volume);
      const current = prefsRef.current;
      // Zero is the same as off, but the last audible level is remembered for the switch.
      if (next === 0) {
        commit({ ...current, muted: true });
        return;
      }
      commit({ volume: next, muted: false });
    };

    return { muted: prefs.muted, volume: prefs.volume, setMuted, setVolume };
  }, [prefs, commit]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundProvider>");
  return ctx;
}