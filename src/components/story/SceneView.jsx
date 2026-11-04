import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

/** Illustration + optional caption, never stretched and never cropped. */
export function SceneView({ src, alt, className, children }) {
  return (
    <figure className={cn("overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft", className)}>
      <Image
        src={src}
        alt={alt}
        className="h-auto w-full object-contain"
        fittingType="fit"
      />
      {children ? (
        <figcaption className="border-t border-border bg-card px-6 py-5">
          {children}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default SceneView;