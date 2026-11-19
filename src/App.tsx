import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Moon,
  Sun,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import PathDrawingName from "./components/PathDrawingName";
import TicketPrinter from "./components/TicketPrinter";
import DotField from "./components/DotField";
import HeroTerminal from "./components/HeroTerminal";
import {
  education,
  jobs,
  languages,
  profile,
  projects,
  stack,
  type Project,
} from "./data";

const ease = [0.22, 1, 0.36, 1] as const;
// El PDF solo existe en el build desplegable; en el HTML único no hay archivo que servir.
const hasCv = Boolean(profile.cv) && import.meta.env.MODE !== "single";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Estado de reposo visible: solo un ligero desplazamiento, nunca opacidad 0.
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 22 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const sections = [
  { id: "proyectos", label: "Proyectos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "stack", label: "Stack" },
  { id: "ticket", label: "Ticket" },
  { id: "contacto", label: "Contacto" },
];

type Theme = "dark" | "light";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "dark" || set === "light") return set;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tema");
      if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
    } catch {
      /* sin almacenamiento: se usa el tema del sistema */
    }
    setTheme(currentTheme());
  }, []);
  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("tema", next);
    } catch {
      /* no pasa nada si no se puede guardar */
    }
  };
  return (
    <button
      type="button"
      id="theme-toggle"
      className="icon-btn"
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...sections.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="monogram" aria-label="Inicio">
          AB<span>.</span>
        </a>
        <nav aria-label="Secciones">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        <span className="pill pill-live">
          <span className="dot" aria-hidden="true" />
          Disponible
        </span>
        <ThemeToggle />
      </div>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </header>
  );
}

function Hero() {
  const stats = [
    { value: "3", label: "apps en producción" },
    { value: "2", label: "locales usan JostelPro" },
    { value: "+1 año", label: "de experiencia profesional" },
    { value: "Madrid", label: "presencial o remoto" },
  ];
  return (
    <section className="hero" id="top">
      <DotField />
      <div className="wrap hero-inner">
        <div className="hero-top">
          <p className="eyebrow">
            {profile.role} · <MapPin size={13} aria-hidden="true" /> {profile.location}
          </p>
          <p className="eyebrow eyebrow-stack mono">React · TypeScript · Laravel · Node.js</p>
        </div>

        <h1 className="sr-only">{profile.fullName}</h1>
        <PathDrawingName
          lines={["Adrián", "Busquets"]}
          offsets={[0, 230]}
          viewBoxWidth={1000}
        />

        <div className="hero-bottom">
          <div className="hero-copy">
            <p className="lede">{profile.summary}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#proyectos">
                Ver proyectos
              </a>
              <a className="btn btn-ghost" href="#ticket">
                Pedir la cuenta
              </a>
            </div>
          </div>
          <HeroTerminal />
        </div>

        <dl className="hero-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const wide = p.span === "wide";
  return (
    <Reveal delay={index * 0.08} className={wide ? "cell-wide" : "cell"}>
      <article className={`project ${wide ? "project-wide" : ""}`}>
        <div className="project-top">
          <span className="pill pill-live">
            <span className="dot" aria-hidden="true" />
            {p.status}
          </span>
          {p.url && (
            <a className="project-link mono" href={p.url} target="_blank" rel="noreferrer">
              {p.urlLabel} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
        {p.image && (
          <img
            className="project-shot"
            src={p.image}
            alt={`Captura de ${p.name}`}
            loading="lazy"
          />
        )}
        <div className="project-body">
          <p className="project-kind">{p.kind}</p>
          <h3>{p.name}</h3>
          <p className="project-meta mono">{p.meta}</p>
          <p className="project-desc">{p.description}</p>
          {p.modules && (
            <ul className="modules" aria-label="Módulos">
              {p.modules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          <ul className="project-highlights">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          {p.caseStudy && (
            <details className="case" open={wide}>
              <summary>Cómo lo resolví</summary>
              <dl>
                <div>
                  <dt>Problema</dt>
                  <dd>{p.caseStudy.problem}</dd>
                </div>
                <div>
                  <dt>Decisión</dt>
                  <dd>{p.caseStudy.decision}</dd>
                </div>
                <div>
                  <dt>Resultado</dt>
                  <dd>{p.caseStudy.result}</dd>
                </div>
              </dl>
            </details>
          )}
        </div>
        <ul className="tags" aria-label="Tecnologías">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function Projects() {
  return (
    <section className="section" id="proyectos">
      <div className="wrap">
        <div className="section-head">
          <h2>Proyectos en producción</h2>
          <p>Productos que usa gente real, no ejercicios de curso.</p>
        </div>
        <div className="bento">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section" id="experiencia">
      <div className="wrap">
        <div className="section-head">
          <h2>Experiencia</h2>
          <p className="mono muted">git log --career</p>
        </div>
        <ol className="log">
          {jobs.map((j, i) => (
            <li key={j.hash}>
              <Reveal delay={i * 0.06}>
                <div className="log-entry">
                  <div className="log-rail" aria-hidden="true">
                    <span className="log-node" />
                  </div>
                  <div className="log-content">
                    <p className="log-meta mono">
                      <span className="hash">{j.hash}</span>
                      <span className="muted">
                        {j.from} → {j.to}
                      </span>
                    </p>
                    <h3>
                      {j.role} <span className="at">@ {j.company}</span>
                    </h3>
                    <ul>
                      {j.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <div className="section-head">
          <h2>Stack</h2>
          <p>Lo que uso a diario y lo que he puesto en producción.</p>
        </div>
        <div className="stack-grid">
          {stack.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.05}>
              <div className="stack-group">
                <h3 className="mono">{g.group}</h3>
                <ul className="tags">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="edu-grid">
          <div>
            <h3 className="sub">Formación</h3>
            <ul className="edu">
              {education.map((e) => (
                <li key={e.title}>
                  <span className="edu-title">{e.title}</span>
                  <span className="muted">
                    {e.school}
                    {e.hours ? ` · ${e.hours}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="sub">Idiomas</h3>
            <ul className="edu">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="edu-title">{l.name}</span>
                  <span className="muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById(`v-${label}`);
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
    }
  };
  return (
    <li className="contact-row">
      <span className="contact-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="contact-label mono">{label}</span>
      {href ? (
        <a id={`v-${label}`} className="contact-value" href={href} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <span id={`v-${label}`} className="contact-value">
          {value}
        </span>
      )}
      <button type="button" className="copy" onClick={copy} aria-label={`Copiar ${label}`}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? "Copiado" : "Copiar"}</span>
      </button>
    </li>
  );
}

function Ticket() {
  return (
    <section className="section" id="ticket">
      <div className="wrap ticket-grid">
        <div className="ticket-intro">
          <h2>¿Te traigo la cuenta?</h2>
          <p>
            En JostelPro programé la impresión de tickets por ESC/POS para las impresoras térmicas de
            los bares. Así que aquí va mi perfil en el formato que mejor conozco.
          </p>
          <p className="mono muted">80 mm · térmica · sin tinta</p>
        </div>
        <TicketPrinter />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact" id="contacto">
      <div className="wrap">
        <div className="contact-card">
          <div className="contact-intro">
            <h2>Hablemos</h2>
            <p>
              Busco un puesto de desarrollador junior (Full Stack, Backend o Frontend) en Madrid o en
              remoto. Puedo empezar ya.
            </p>
            {hasCv && (
              <a className="btn btn-primary cv-btn" href={profile.cv} download>
                <Download size={16} aria-hidden="true" />
                Descargar CV (PDF)
              </a>
            )}
          </div>
          <ul className="contact-list">
            <CopyRow icon={<Mail size={18} />} label="Email" value={profile.email} />
            <CopyRow icon={<Phone size={18} />} label="Teléfono" value={profile.phone} />
            <CopyRow
              icon={<Linkedin size={18} />}
              label="LinkedIn"
              value={profile.linkedinLabel}
              href={profile.linkedin}
            />
            <CopyRow
              icon={<Github size={18} />}
              label="GitHub"
              value={profile.githubLabel}
              href={profile.github}
            />
          </ul>
        </div>
        <footer className="foot mono muted">
          © {new Date().getFullYear()} {profile.fullName} · Hecho con React, TypeScript y Motion
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#proyectos">
        Saltar al contenido
      </a>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Stack />
        <Ticket />
        <Contact />
      </main>
    </>
  );
}
