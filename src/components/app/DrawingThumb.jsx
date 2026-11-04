import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { signedUrlFor } from "@/hooks/useFamily";
import { cn } from "@/lib/utils";

/** A saved drawing, loaded through a short-lived signed URL (files are private). */
export function DrawingThumb({ drawing, className, onClick }) {
  const [url, setUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    if (!drawing?.file_uri) return;
    signedUrlFor(drawing.file_uri)
      .then((signed) => live && setUrl(signed))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [drawing?.file_uri]);

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-border bg-white",
        onClick && "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {url ? (
        <Image src={url} alt={drawing?.title || ""} className="h-full w-full object-contain" fittingType="fit" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-cream">
          <span className="text-xs text-ink-soft">{failed ? "—" : "…"}</span>
        </div>
      )}
      {drawing?.title && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 to-transparent px-3 pb-2 pt-6 text-start text-xs font-bold text-ink">
          {drawing.title}
        </span>
      )}
    </Wrapper>
  );
}

export default DrawingThumb;