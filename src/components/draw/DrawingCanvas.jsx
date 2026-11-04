import { useEffect, useRef, useState } from "react";
import { Download, Eraser, Loader2, Paintbrush, Redo2, Save, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { templateById } from "@/components/draw/templates";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const W = 1200;
const H = 800;
const PALETTE = [
  { hex: "#6FD0C5", name: "turquoise" },
  { hex: "#3E8F86", name: "deep turquoise" },
  { hex: "#FFD068", name: "yellow" },
  { hex: "#FF7E75", name: "coral" },
  { hex: "#C39BD3", name: "lavender" },
  { hex: "#7FB3D5", name: "blue" },
  { hex: "#FF9EAA", name: "pink" },
  { hex: "#35434A", name: "ink" },
  { hex: "#B58B76", name: "brown" },
  { hex: "#FFFFFF", name: "white" },
];
const SIZES = [10, 20, 36];

export function DrawingCanvas({ child, template, onSaved }) {
  const { t, lang } = useI18n();
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);
  const stackRef = useRef([]);
  const cursorRef = useRef(-1);
  const colorsUsed = useRef(new Set());
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState(PALETTE[0].hex);
  const [size, setSize] = useState(SIZES[1]);
  const [stackState, setStackState] = useState({ canUndo: false, canRedo: false });
  const [saving, setSaving] = useState(false);

  const ctxOf = () => canvasRef.current.getContext("2d");

  useEffect(() => {
    const ctx = ctxOf();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const blank = canvasRef.current.toDataURL();
    stackRef.current = [blank];
    cursorRef.current = 0;
    setStackState({ canUndo: false, canRedo: false });
  }, []);

  const syncStackState = () =>
    setStackState({
      canUndo: cursorRef.current > 0,
      canRedo: cursorRef.current < stackRef.current.length - 1,
    });

  function commit() {
    const url = canvasRef.current.toDataURL();
    stackRef.current = [...stackRef.current.slice(0, cursorRef.current + 1), url].slice(-24);
    cursorRef.current = stackRef.current.length - 1;
    syncStackState();
  }

  function restore(url) {
    const img = new Image();
    img.onload = () => {
      const ctx = ctxOf();
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  }

  function undo() {
    if (cursorRef.current <= 0) return;
    cursorRef.current -= 1;
    restore(stackRef.current[cursorRef.current]);
    syncStackState();
  }

  function redo() {
    if (cursorRef.current >= stackRef.current.length - 1) return;
    cursorRef.current += 1;
    restore(stackRef.current[cursorRef.current]);
    syncStackState();
  }

  function pointFromEvent(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
  }

  function strokeStyle() {
    const ctx = ctxOf();
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = tool === "eraser" ? size * 1.8 : size;
  }

  function start(event) {
    event.preventDefault();
    canvasRef.current.setPointerCapture?.(event.pointerId);
    drawing.current = true;
    lastPoint.current = pointFromEvent(event);
    if (tool === "brush") colorsUsed.current.add(color);
    strokeStyle();
    const ctx = ctxOf();
    ctx.beginPath();
    ctx.arc(lastPoint.current.x, lastPoint.current.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(event) {
    if (!drawing.current) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    const ctx = ctxOf();
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    commit();
  }

  function clearCanvas() {
    ctxOf().clearRect(0, 0, W, H);
    commit();
  }

  async function composite() {
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);
    const chosen = template !== "free" ? templateById(template) : null;
    if (chosen) {
      const blob = new Blob([chosen.svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      await img.decode().catch(() => {});
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
    }
    ctx.drawImage(canvasRef.current, 0, 0);
    return out;
  }

  async function save() {
    if (!child) return;
    setSaving(true);
    try {
      const out = await composite();
      const blob = await new Promise((resolve) => out.toBlob(resolve, "image/png"));
      const file = new File([blob], "lawnatq-drawing.png", { type: "image/png" });
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      const chosen = template !== "free" ? templateById(template) : null;
      const title = `${chosen ? (lang === "ar" ? chosen.ar : chosen.en) : t("رسمة حرة", "Free drawing")} · ${new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB")}`;
      await base44.entities.Drawing.create({
        child_id: child.id,
        title,
        file_uri,
        template,
        colors_used: [...colorsUsed.current],
      });
      toast.success(t("حفظنا رسمتك", "Your drawing is saved"), {
        description: t("ستجدها والدتك في مساحتها.", "Your parent will find it in their space."),
      });
      onSaved?.();
    } catch {
      toast.error(t("تعذّر الحفظ، حاول مرة أخرى", "Could not save, please try again"));
    } finally {
      setSaving(false);
    }
  }

  async function download() {
    const out = await composite();
    const link = document.createElement("a");
    link.href = out.toDataURL("image/png");
    link.download = "lawnatq-drawing.png";
    link.click();
  }

  const activeTemplate = template !== "free" ? templateById(template) : null;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-border bg-white shadow-soft">
        {activeTemplate && (
          <div
            className="pointer-events-none absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: activeTemplate.svg }}
          />
        )}
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          className="relative block aspect-[3/2] w-full touch-none"
          aria-label={t("مساحة الرسم", "Drawing area")}
          role="img"
        />
      </div>

      <div className="rounded-[1.5rem] border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-cream p-1">
            <button
              type="button"
              onClick={() => setTool("brush")}
              aria-pressed={tool === "brush"}
              aria-label={t("فرشاة", "Brush")}
              className={cn("grid h-10 w-10 place-items-center rounded-full transition", tool === "brush" ? "bg-card shadow-sm text-ink" : "text-ink-soft")}
            >
              <Paintbrush className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTool("eraser")}
              aria-pressed={tool === "eraser"}
              aria-label={t("ممحاة", "Eraser")}
              className={cn("grid h-10 w-10 place-items-center rounded-full transition", tool === "eraser" ? "bg-card shadow-sm text-ink" : "text-ink-soft")}
            >
              <Eraser className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                aria-label={`${s}px`}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border transition",
                  size === s ? "border-ink/25 bg-ink/5" : "border-transparent hover:bg-cream",
                )}
              >
                <span className="rounded-full bg-ink" style={{ width: s / 2 + 4, height: s / 2 + 4 }} />
              </button>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-1">
            <button type="button" onClick={undo} disabled={!stackState.canUndo} aria-label={t("تراجع", "Undo")} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-cream disabled:opacity-30">
              <Undo2 className="h-5 w-5 rtl:rotate-180" />
            </button>
            <button type="button" onClick={redo} disabled={!stackState.canRedo} aria-label={t("إعادة", "Redo")} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-cream disabled:opacity-30">
              <Redo2 className="h-5 w-5 rtl:rotate-180" />
            </button>
            <button type="button" onClick={clearCanvas} aria-label={t("مسح الكل", "Clear")} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-cream">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {PALETTE.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                setColor(swatch.hex);
                setTool("brush");
              }}
              aria-label={swatch.name}
              aria-pressed={color === swatch.hex}
              className={cn(
                "h-10 w-10 rounded-full border-2 transition",
                color === swatch.hex ? "border-ink scale-110" : "border-white/70 hover:scale-105",
              )}
              style={{ backgroundColor: swatch.hex, boxShadow: "0 1px 3px rgba(53,67,74,0.18)" }}
            />
          ))}

          <div className="ms-auto flex gap-2">
            <button
              type="button"
              onClick={download}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold text-ink transition hover:bg-cream"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("تنزيل", "Download")}</span>
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-background transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {t("احفظ رسمتي", "Save my drawing")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingCanvas;