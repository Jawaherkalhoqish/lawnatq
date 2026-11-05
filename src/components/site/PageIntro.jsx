import { cn } from "@/lib/utils";

const tones = {
  turq: "bg-turq/12 text-turq-deep border-turq/30",
  sun: "bg-sun/20 text-sun-deep border-sun/40",
  coral: "bg-coral/15 text-coral-deep border-coral/30",
  lav: "bg-lav/15 text-lav-deep border-lav/30",
  sky: "bg-lilac/80 text-lav-deep border-lav/30",
};

/** Shared page opening: eyebrow, heading and one short description. */
export function PageIntro({ eyebrow, title, description, tone = "turq" }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:pt-14">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
          tones[tone],
        )}
      >
        {eyebrow}
      </span>
      <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{description}</p>
    </section>
  );
}

export default PageIntro;