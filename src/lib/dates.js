/** Human time labels without pulling in a locale package. */
export function timeAgo(value, lang = "ar") {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const rtf = new Intl.RelativeTimeFormat(lang === "ar" ? "ar" : "en", { numeric: "auto" });
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return lang === "ar" ? "الآن" : "just now";
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, "day");
  const months = Math.round(days / 30);
  return rtf.format(-months, "month");
}

export function shortDate(value, lang = "ar") {
  if (!value) return "";
  return new Date(value).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}