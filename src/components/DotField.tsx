// Fondo de puntos que se iluminan alrededor del cursor (inspirado en "Animated Hero" de 21st.dev).
import { useEffect, useRef } from "react";

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = 26;
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let t = 0;

    const color = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#999";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const base = color("--muted");
      const hot = color("--accent");
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / 170);
          // ola lenta para que el fondo respire aunque no haya cursor
          const wave = reduce ? 0 : (Math.sin(x * 0.012 + y * 0.018 + t) + 1) / 2;
          const fade = Math.min(1, y / (h * 0.25)) * Math.min(1, (h - y) / (h * 0.35));
          ctx.globalAlpha = (0.1 + wave * 0.08 + near * 0.75) * fade;
          ctx.fillStyle = near > 0.05 ? hot : base;
          const s = 1.1 + near * 1.8;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="dot-field" aria-hidden="true" />;
}
