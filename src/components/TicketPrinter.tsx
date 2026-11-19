// Tu perfil impreso como la cuenta de un TPV (guiño a la impresión ESC/POS de JostelPro).
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import qrcode from "qrcode-generator";
import { Printer } from "lucide-react";
import { profile } from "../data";

type Line = { qty?: string; label: string; value: string };

const items: Line[] = [
  { qty: "1x", label: "Full Stack Junior", value: "+1 año" },
  { qty: "1x", label: "JostelPro", value: "2 locales" },
  { qty: "1x", label: "InverHouse", value: "CRM+chat" },
  { qty: "1x", label: "Origen 0°", value: "Wallet" },
  { qty: "1x", label: "Grupo Colón IECM", value: "10 meses" },
];

const extras = ["React", "TypeScript", "Laravel", "Node.js", "PostgreSQL", "Redis", "Docker", "Supabase"];

function Qr({ text }: { text: string }) {
  const cells = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const rects: string[] = [];
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) if (qr.isDark(r, c)) rects.push(`M${c} ${r}h1v1h-1z`);
    return { n, d: rects.join("") };
  }, [text]);
  return (
    <svg
      className="ticket-qr"
      viewBox={`-2 -2 ${cells.n + 4} ${cells.n + 4}`}
      role="img"
      aria-label="Código QR a mi LinkedIn"
      shapeRendering="crispEdges"
    >
      <rect x="-2" y="-2" width={cells.n + 4} height={cells.n + 4} fill="var(--paper)" />
      <path d={cells.d} fill="var(--ink)" />
    </svg>
  );
}

function Row({ qty, label, value, strong }: Line & { strong?: boolean }) {
  return (
    <div className={`t-row ${strong ? "t-strong" : ""}`}>
      {qty && <span className="t-qty">{qty}</span>}
      <span className="t-label">{label}</span>
      <span className="t-dots" aria-hidden="true" />
      <span className="t-value">{value}</span>
    </div>
  );
}

export default function TicketPrinter() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0); // cada incremento reinicia la impresión
  const [printed, setPrinted] = useState(false);

  // Imprime solo la primera vez que la impresora entra en pantalla.
  useEffect(() => {
    if (reduce || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !printed) {
          setPrinted(true);
          setRun((n) => n + 1);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce, printed]);

  const now = new Date();
  const fecha = now.toLocaleDateString("es-ES");
  const hora = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="printer-wrap" ref={ref}>
      <div className="printer" aria-hidden="true">
        <span className="printer-led" />
        <span className="printer-brand mono">ESC/POS · 80mm</span>
        <span className="printer-slot" />
      </div>

      <div className="paper-clip">
        <article
          key={run}
          className={`ticket ${run > 0 && !reduce ? "ticket-printing" : ""}`}
          aria-label="Mi perfil en formato ticket"
        >
          <header className="t-center">
            <p className="t-title">ADRIÁN BUSQUETS</p>
            <p>Desarrollo web · Madrid</p>
            <p>{profile.githubLabel}</p>
          </header>

          <hr />
          <div className="t-meta">
            <span>Mesa: Reclutador/a</span>
            <span>Camarero: Adrián</span>
            <span>{fecha}</span>
            <span>{hora}</span>
          </div>
          <hr />

          {items.map((it) => (
            <Row key={it.label} {...it} />
          ))}

          <p className="t-section">EXTRAS INCLUIDOS</p>
          <p className="t-extras">{extras.join(" · ")}</p>

          <p className="t-section">IDIOMAS</p>
          <Row label="Español" value="Nativo" />
          <Row label="Inglés" value="B1" />

          <hr />
          <Row label="SUBTOTAL" value="Ganas" />
          <Row label="Aprendizaje" value="Incluido" />
          <hr className="t-double" />
          <Row label="TOTAL" value="CONTRATAR" strong />
          <hr className="t-double" />

          <div className="t-center t-pay">
            <p>Forma de pago: entrevista</p>
            <Qr text={profile.linkedin} />
            <p>Escanea para ver mi LinkedIn</p>
          </div>

          <div className="t-barcode" aria-hidden="true" />
          <p className="t-center t-thanks">¡GRACIAS POR SU VISITA!</p>
        </article>
      </div>

      <button
        type="button"
        className="btn btn-ghost print-btn"
        onClick={() => setRun((n) => n + 1)}
      >
        <Printer size={16} aria-hidden="true" />
        {run > 0 ? "Imprimir otra vez" : "Imprimir ticket"}
      </button>
    </div>
  );
}
