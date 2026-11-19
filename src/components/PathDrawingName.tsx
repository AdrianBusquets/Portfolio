// Adaptado de "Path Drawing Portfolio Hero" (21st.dev, design-layer).
// El nombre se dibuja como un trazo con degradado y, al terminar, se rellena.
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  lines: string[];
  /** Sangría horizontal de cada línea (unidades del viewBox) */
  offsets?: number[];
  viewBoxWidth?: number;
  durationSec?: number;
};

export default function PathDrawingName({
  lines,
  offsets = [],
  viewBoxWidth = 1000,
  durationSec = 2.6,
}: Props) {
  const gid = `name-grad-${useId().replace(/:/g, "")}`;
  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(false);
  const [measured, setMeasured] = useState(false);

  // Longitud de trazo aproximada: perímetro de los glifos ≈ ancho × factor.
  useLayoutEffect(() => {
    if (reduce) {
      setFilled(true);
      setMeasured(true);
      return;
    }
    textRefs.current.forEach((el) => {
      if (!el) return;
      const len = Math.ceil(el.getComputedTextLength() * 6.5);
      el.style.setProperty("--dash", String(len));
    });
    setMeasured(true);
  }, [reduce, lines.join("|")]);

  useEffect(() => {
    if (reduce || !measured) return;
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      textRefs.current.forEach((el) => {
        if (!el) return;
        const len = Math.ceil(el.getComputedTextLength() * 6.5);
        el.style.setProperty("--dash", String(len));
      });
    });
    const t = window.setTimeout(() => setFilled(true), durationSec * 1000 * 0.85);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [measured, reduce, durationSec]);

  return (
    <svg
      className="drawn-name"
      viewBox={`0 0 ${viewBoxWidth} 300`}
      role="img"
      aria-label={lines.join(" ")}
      data-filled={filled ? "true" : "false"}
      data-animate={reduce ? "false" : "true"}
      style={{ ["--draw" as string]: `${durationSec}s` }}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="40%">
          <stop offset="0%" stopColor="var(--grad-a)" />
          <stop offset="100%" stopColor="var(--grad-b)" />
        </linearGradient>
      </defs>
      {lines.map((line, i) => (
        <text
          key={line}
          ref={(el) => (textRefs.current[i] = el)}
          x={offsets[i] ?? 0}
          y={128 + i * 140}
          stroke={`url(#${gid})`}
          fill={`url(#${gid})`}
          style={{ animationDelay: `${i * 0.35}s` }}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}
