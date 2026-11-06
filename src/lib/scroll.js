/** Smooth, header-aware scrolling shared by the site navigation. */
const HEADER_SELECTOR = "[data-site-header]";
const GAP = 8;

/** Height of the sticky header, so a section is never hidden underneath it. */
export function headerOffset() {
  const header = document.querySelector(HEADER_SELECTOR);
  const height = header ? header.getBoundingClientRect().height : 0;
  return (height > 0 ? height : 64) + GAP;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (document.documentElement.getAttribute("data-motion") === "reduced") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Scrolls the window so the section's own beginning sits just below the header. */
export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return false;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset());
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  return true;
}

// A newer request replaces any scroll still waiting for its section to mount.
let pendingRun = 0;

/**
 * Scrolls to a section once it exists, for clicks that arrive on another page.
 * Gives up quietly after ~2s so a slow render can never leave a loop running.
 */
export function scrollToSectionWhenReady(id, frames = 120) {
  const run = ++pendingRun;
  const step = (left) => {
    if (run !== pendingRun) return;
    if (scrollToSection(id)) return;
    if (left > 0) window.requestAnimationFrame(() => step(left - 1));
  };
  window.requestAnimationFrame(() => step(frames));
}