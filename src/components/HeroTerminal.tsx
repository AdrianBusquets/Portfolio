// Terminal del hero: primero "despliega" los proyectos y después acepta comandos de verdad.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "motion/react";
import { profile, projects, stack } from "../data";

type Out = { kind: "cmd" | "ok" | "info" | "sum" | "err"; text: string; tail?: string };

const intro: Out[] = [
  { kind: "cmd", text: "deploy --status --env=production" },
  ...projects.map<Out>((p) => ({ kind: "ok", text: p.name, tail: p.urlLabel ?? "" })),
  { kind: "sum", text: `${projects.length}/${projects.length} servicios en producción` },
  { kind: "cmd", text: "whoami" },
  { kind: "info", text: "full-stack junior · madrid · disponible" },
];

const goTo: Record<string, string> = {
  proyectos: "proyectos",
  experiencia: "experiencia",
  stack: "stack",
  ticket: "ticket",
  contacto: "contacto",
};

const suggestions = ["ayuda", "proyectos", "ticket", "sudo contratar"];

function run(raw: string): Out[] | "clear" {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];
  if (cmd === "clear" || cmd === "limpiar") return "clear";
  if (cmd === "ayuda" || cmd === "help" || cmd === "ls") {
    return [
      { kind: "info", text: "proyectos · experiencia · stack · ticket · contacto" },
      { kind: "info", text: "whoami · email · github · clear · sudo contratar" },
    ];
  }
  if (cmd in goTo) {
    document.getElementById(goTo[cmd])?.scrollIntoView({ behavior: "smooth" });
    if (cmd === "stack")
      return stack.slice(0, 3).map<Out>((g) => ({
        kind: "ok",
        text: g.group.toLowerCase(),
        tail: g.items.slice(0, 3).join(", "),
      }));
    return [{ kind: "sum", text: `→ #${goTo[cmd]}` }];
  }
  if (cmd === "whoami") return [{ kind: "info", text: "full-stack junior · madrid · disponible" }];
  if (cmd === "email" || cmd === "correo") return [{ kind: "info", text: profile.email }];
  if (cmd === "github") return [{ kind: "info", text: profile.githubLabel }];
  if (cmd === "sudo contratar" || cmd === "contratar") {
    return [
      { kind: "sum", text: "Permiso concedido." },
      { kind: "info", text: `Escríbeme: ${profile.email}` },
    ];
  }
  return [{ kind: "err", text: `comando no encontrado: ${cmd}. Prueba "ayuda".` }];
}

function Line({ l }: { l: Out }) {
  if (l.kind === "cmd")
    return (
      <p className="term-cmd">
        <span className="term-prompt">❯</span> {l.text}
      </p>
    );
  if (l.kind === "ok")
    return (
      <p className="term-ok">
        <span className="term-check">✓</span>
        <span className="term-name">{l.text}</span>
        <span className="term-tail">{l.tail}</span>
      </p>
    );
  return <p className={`term-${l.kind}`}>{l.text}</p>;
}

export default function HeroTerminal() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? intro.length : 0);
  const [typed, setTyped] = useState(0);
  const [history, setHistory] = useState<Out[]>([]);
  const [value, setValue] = useState("");
  const [cleared, setCleared] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reduce) {
      setShown(intro.length);
      return;
    }
    if (shown >= intro.length) return;
    const cur = intro[shown];
    if (cur.kind === "cmd" && typed < cur.text.length) {
      const id = window.setTimeout(() => setTyped((n) => n + 1), 28);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(
      () => {
        setShown((n) => n + 1);
        setTyped(0);
      },
      cur.kind === "cmd" ? 220 : 160,
    );
    return () => window.clearTimeout(id);
  }, [shown, typed, reduce]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const done = shown >= intro.length;

  const exec = (raw: string) => {
    const res = run(raw);
    if (res === "clear") {
      setHistory([]);
      setShown(intro.length);
      setCleared(true);
    } else {
      setHistory((h) => [...h, { kind: "cmd", text: raw.trim() }, ...res]);
    }
    setValue("");
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    exec(value);
  };

  return (
    <div className="term" onClick={() => done && inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p className="mono">adrian@portfolio: ~</p>
      </div>
      <div className="term-body mono" ref={bodyRef}>
        <ul className="sr-only">
          {projects.map((p) => (
            <li key={p.id}>
              {p.name}: en producción {p.urlLabel ? `en ${p.urlLabel}` : ""}
            </li>
          ))}
        </ul>
        {!cleared && (
          <div aria-hidden="true">
            {intro.slice(0, Math.min(shown + 1, intro.length)).map((l, i) => {
              const active = i === shown && !done;
              if (l.kind === "cmd" && active)
                return (
                  <p key={i} className="term-cmd">
                    <span className="term-prompt">❯</span> {l.text.slice(0, typed)}
                    <span className="caret" />
                  </p>
                );
              if (active) return null;
              return <Line key={i} l={l} />;
            })}
          </div>
        )}
        <div aria-live="polite">
          {history.map((l, i) => (
            <Line key={i} l={l} />
          ))}
        </div>
        {done && (
          <form className="term-form" onSubmit={onSubmit}>
            <label htmlFor="term-input" className="term-prompt">
              ❯<span className="sr-only"> Escribe un comando</span>
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='escribe "ayuda"'
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
            />
          </form>
        )}
      </div>
      {done && (
        <div className="term-hints">
          {suggestions.map((s) => (
            <button key={s} type="button" className="mono" onClick={(e) => {
                e.stopPropagation();
                exec(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
