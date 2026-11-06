import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

/**
 * Language + accessibility preferences (language, text size, motion, voice).
 * Applied to <html> so the whole document — dir, fonts, rem scale — follows.
 * Stored in localStorage for instant load, and mirrored onto the parent's
 * account (pref_* fields) so the choices follow them to another device.
 */
const DEFAULTS = { lang: "ar", textSize: "normal", motion: "full", voice: true };

const PrefsContext = createContext(null);

const readStored = () => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem("lawnatq_prefs");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

const applyToDocument = (prefs) => {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.lang = prefs.lang;
  el.dir = prefs.lang === "ar" ? "rtl" : "ltr";
  el.dataset.textsize = prefs.textSize;
  el.dataset.motion = prefs.motion;
};

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(readStored);

  useEffect(() => {
    applyToDocument(prefs);
    try {
      window.localStorage.setItem("lawnatq_prefs", JSON.stringify(prefs));
    } catch {
      /* storage unavailable */
    }
  }, [prefs]);

  const update = useCallback((patch, { persist = false } = {}) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      if (persist) {
        base44.auth
          .updateMe({
            pref_language: next.lang,
            pref_text_size: next.textSize,
            pref_motion: next.motion,
            pref_voice: next.voice,
          })
          .catch(() => {});
      }
      return next;
    });
  }, []);

  // Hydrate from the signed-in parent's saved preferences.
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.pref_language) return;
    setPrefs((prev) => ({
      ...prev,
      lang: user.pref_language || prev.lang,
      textSize: user.pref_text_size || prev.textSize,
      motion: user.pref_motion || prev.motion,
      voice: typeof user.pref_voice === "boolean" ? user.pref_voice : prev.voice,
    }));
  }, [user]);

  const value = useMemo(() => ({ ...prefs, update }), [prefs, update]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within <PreferencesProvider>");
  return ctx;
}

/** Language helper: `t(ar, en)` picks the active language, `lang`/`isAr`/`dir` for layout. */
export function useI18n() {
  const { lang, update } = usePrefs();
  return useMemo(
    () => ({
      lang,
      isAr: lang === "ar",
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang: (next) => update({ lang: next, persist: true }, { persist: true }),
      toggleLang: () => update({ lang: lang === "ar" ? "en" : "ar", persist: true }, { persist: true }),
      t: (ar, en) => (lang === "ar" ? ar : en),
      pick: (obj) => (obj && (obj[lang] ?? obj.en)) || "",
    }),
    [lang, update],
  );
}

/** Speaks text through the browser's speech engine, in the child's preferred language. */
export function speak(text, lang = "ar") {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "ar" ? "ar-SA" : "en-US";
  utter.rate = 0.92;
  utter.pitch = 1.08;
  // Lets the background music duck while something is being read aloud.
  const signal = (on) => window.dispatchEvent(new CustomEvent("lawnatq:speaking", { detail: on }));
  utter.onend = () => signal(false);
  utter.onerror = () => signal(false);
  signal(true);
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}