import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { useI18n } from "@/packages/i18n";
import { Button } from "@/packages/ui";

/** Captures up to 3 compressed JPEG frames (max 1280px) for low-bandwidth upload. */
export function CameraCapture({ onSubmit, busy }: { onSubmit: (images: Blob[]) => void; busy?: boolean | undefined }) {
  const { t } = useI18n();
  const video = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [denied, setDenied] = useState(false);
  const [shots, setShots] = useState<{ blob: Blob; url: string }[]>([]);

  useEffect(() => {
    let s: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } } })
      .then((m) => { s = m; setStream(m); if (video.current) video.current.srcObject = m; })
      .catch(() => setDenied(true));
    return () => s?.getTracks().forEach((tr) => tr.stop());
  }, []);

  const add = (blob: Blob) => setShots((p) => [...p, { blob, url: URL.createObjectURL(blob) }].slice(0, 3));

  const capture = () => {
    const v = video.current; if (!v) return;
    const scale = Math.min(1, 1280 / v.videoWidth);
    const c = document.createElement("canvas");
    c.width = v.videoWidth * scale; c.height = v.videoHeight * scale;
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    c.toBlob((b) => b && add(b), "image/jpeg", 0.75);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("camera.tip")}</p>
      {!denied && stream ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <video ref={video} autoPlay playsInline muted className="aspect-[4/3] w-full object-cover" />
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-dashed border-accent/60" />
        </div>
      ) : denied ? <p className="rounded-xl bg-warning/15 p-3 text-sm text-warning">{t("camera.denied")}</p> : <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />}

      {shots.length > 0 && (
        <div className="flex gap-2">
          {shots.map((s, i) => (
            <div key={s.url} className="relative">
              <img src={s.url} alt={`Angle ${i + 1}`} className="size-20 rounded-lg object-cover" />
              <button aria-label="Remove" onClick={() => setShots((p) => p.filter((_, j) => j !== i))} className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-destructive text-destructive-foreground"><X className="size-3" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {stream && !denied && shots.length < 3 && <Button variant="subtle" onClick={capture}><Camera className="size-5" />{shots.length ? t("camera.addAngle") : t("camera.capture")}</Button>}
        <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border font-semibold hover:bg-secondary">
          <ImagePlus className="size-5" />{t("camera.upload")}
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) add(f); }} />
        </label>
      </div>
      <Button variant="hero" block size="lg" disabled={!shots.length} loading={busy} onClick={() => onSubmit(shots.map((s) => s.blob))}>
        {busy ? t("camera.analyzing") : t("camera.analyze")}
      </Button>
    </div>
  );
}
