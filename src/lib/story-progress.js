/** Where each child stopped in a story, kept on the device for instant resume. */
const KEY = "lawnatq_story_progress";

export function readProgress() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function writeProgress(storyId, sceneId) {
  if (typeof window === "undefined") return;
  try {
    const all = readProgress();
    all[storyId] = sceneId;
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}