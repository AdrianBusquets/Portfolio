// Todo el contenido del portfolio vive aquí: edita este archivo para actualizarlo.

export const profile = {
  name: "Adrián Busquets",
  fullName: "Adrián Busquets Bravo",
  role: "Desarrollador Full Stack Junior",
  location: "Madrid, España",
  summary:
    "Construyo aplicaciones web completas, del modelo de datos a la interfaz. Tengo tres productos en producción con usuarios reales y más de un año de experiencia profesional con PHP/Laravel, React, TypeScript y Node.js.",
  email: "adrian.busquets@hotmail.com",
  phone: "+34 617 062 244",
  linkedin: "https://www.linkedin.com/in/adri%C3%A1n-busquets-bravo",
  linkedinLabel: "linkedin.com/in/adrián-busquets-bravo",
  // PDF en /public. Déjalo vacío ("") para ocultar el botón de descarga.
  cv: "cv-adrian-busquets.pdf",
  github: "https://github.com/AdrianBusquets",
  githubLabel: "github.com/AdrianBusquets",
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  url?: string;
  urlLabel?: string;
  status: string;
  meta: string;
  description: string;
  highlights: string[];
  modules?: string[];
  /** Captura o GIF de la app, en /public (p. ej. "capturas/jostelpro.webp") */
  image?: string;
  caseStudy?: { problem: string; decision: string; result: string };
  stack: string[];
  span?: "wide";
};

export const projects: Project[] = [
  {
    id: "jostelpro",
    name: "JostelPro",
    kind: "SaaS de gestión para hostelería",
    url: "https://app.jostelpro.com",
    urlLabel: "app.jostelpro.com",
    status: "En producción",
    meta: "2 locales lo usan · con un compañero",
    description:
      "Software todo en uno para restaurantes, bares y discotecas: TPV multi-vista, plano de mesas, pantalla de cocina, reservas, delivery, caja y pedidos por QR.",
    highlights: [
      "PWA con cola offline para seguir vendiendo sin conexión",
      "Jobs con BullMQ: recordatorios por email/SMS, webhooks y notificaciones push",
      "Pagos y suscripciones con Stripe y control de funcionalidades por plan",
      "API pública con API keys (SHA-256) y rate limiting",
    ],
    modules: ["TPV", "Plano de mesas", "Cocina (KDS)", "Reservas", "Delivery", "Caja", "Pedidos QR", "CRM", "Impresión ESC/POS", "Carta por Excel"],
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "Stripe"],
    caseStudy: {
      problem:
        "Un bar no puede dejar de cobrar porque se caiga el wifi, y quien configura el programa no suele saber de informática.",
      decision:
        "PWA con Service Worker y cola offline para seguir operando sin conexión. La carta se importa desde un Excel, alérgenos incluidos, y los tickets salen por ESC/POS en la impresora térmica que ya tenga el local.",
      result: "En producción, con el frontend en Vercel y el backend en Render. Lo usan 2 locales.",
    },
    span: "wide",
  },
  {
    id: "inverhouse",
    name: "InverHouse",
    kind: "Web y CRM inmobiliario",
    url: "https://inverhouse.es",
    urlLabel: "inverhouse.es",
    status: "En producción",
    meta: "Inmobiliaria en Alcalá de Henares",
    description:
      "Web pública y CRM con chat en directo entre clientes y agencia, filtrado por tipo de solicitud.",
    highlights: [
      "Inbox con filtros: alquilar, vender, comprar, tasación, corta y larga estancia",
      "Importación de expedientes en Excel y gestor de archivos por carpetas",
      "Panel admin instalable como PWA",
    ],
    stack: ["React", "Supabase", "PostgreSQL", "Tailwind"],
    caseStudy: {
      problem:
        "Una inmobiliaria atiende solicitudes muy distintas (alquilar, vender, comprar, tasar) y quería gestionarlas desde un único panel.",
      decision:
        "Chat en directo sin registro: el cliente entra con su nombre y su email. Cada conversación llega a una bandeja filtrada por tipo de solicitud.",
      result: "En producción en inverhouse.es.",
    },
  },
  {
    id: "origen",
    name: "Origen 0°",
    kind: "Web app de fidelización",
    url: "https://origen0.es",
    urlLabel: "origen0.es",
    status: "En producción",
    meta: "Tarjeta de puntos en Google Wallet",
    description:
      "Cualquier persona puede añadir su tarjeta de fidelización al móvil y sumar puntos escaneando un QR.",
    highlights: [
      "Edge Functions (Deno) para puntos y firma de JWT",
      "Row Level Security y OAuth con Supabase",
      "Escaneo QR con la cámara del navegador",
    ],
    stack: ["React 19", "TypeScript", "Supabase", "Deno", "Google Wallet API"],
    caseStudy: {
      problem: "Una tarjeta de puntos que cualquiera pueda llevar en el móvil sin instalar una app.",
      decision:
        "La tarjeta vive en Google Wallet. Las Edge Functions (Deno) gestionan los puntos y firman el JWT de la tarjeta, y Row Level Security protege los datos de cada usuario.",
      result: "En producción en origen0.es.",
    },
  },
];

export type Job = {
  hash: string;
  role: string;
  company: string;
  from: string;
  to: string;
  points: string[];
};

export const jobs: Job[] = [
  {
    hash: "a3f9c21",
    role: "Cofundador y Desarrollador Full Stack",
    company: "JostelPro",
    from: "06/2026",
    to: "10/2026",
    points: [
      "SaaS de hostelería desarrollado junto a otro desarrollador y desplegado en producción.",
      "Frontend en React 18 + Vite; backend en Node.js (ESM), Express, PostgreSQL y Redis.",
      "Stripe, suscripciones con tres planes, impresión ESC/POS y CRM con segmentación RFM.",
    ],
  },
  {
    hash: "7be04d8",
    role: "Desarrollador Web Full Stack",
    company: "Grupo Colón IECM",
    from: "05/2025",
    to: "02/2026",
    points: [
      "Pipelines de importación y exportación de archivos para almacén (Laravel Excel, PhpSpreadsheet, SheetJS).",
      "PHP 8 y Laravel 11 con colas, jobs y batches; frontend con React 18, Inertia y TypeScript.",
      "Tiempo real con Pusher y Laravel Echo, OAuth con Google y sincronización con ERP y CRM.",
      "Docker, CI/CD, PHPUnit y trabajo en equipo con pull requests y code reviews.",
    ],
  },
  {
    hash: "1c58e6f",
    role: "Desarrollador Web (prácticas)",
    company: "Grupo Colón IECM",
    from: "02/2025",
    to: "03/2025",
    points: [
      "Funcionalidades CRUD con PHP, Laravel y Bootstrap, integradas con React e Inertia.",
      "Sprints Scrum, revisión de código y bases de datos MySQL y PostgreSQL.",
    ],
  },
];

export const stack: { group: string; items: string[] }[] = [
  { group: "Lenguajes", items: ["JavaScript", "TypeScript", "PHP 8", "SQL", "HTML", "CSS"] },
  { group: "Frontend", items: ["React 18/19", "Inertia.js", "React Router", "Vite", "Tailwind CSS", "PWA"] },
  { group: "Backend", items: ["Laravel 11", "Node.js", "Express", "APIs REST", "OAuth 2.0", "JWT", "WebSockets", "BullMQ"] },
  { group: "Datos", items: ["PostgreSQL", "MySQL", "MariaDB", "SQLite", "Redis", "Supabase"] },
  { group: "DevOps", items: ["Git", "GitHub", "Docker", "CI/CD", "Vercel", "Render", "Netlify", "AWS S3"] },
  { group: "Integraciones", items: ["Stripe", "Pusher", "Twilio", "Resend", "Firebase", "Google Wallet"] },
];

export const education = [
  { title: "Certificado de Profesionalidad Nivel 3 — Desarrollo de Aplicaciones con Tecnologías Web", school: "Grupo Colón IECM" },
  { title: "Full Stack Developer", school: "Aulab", hours: "430 h" },
  { title: "Software Craftsmanship", school: "CEISA", hours: "400 h" },
  { title: "Laravel, React, Inertia y despliegue en la nube", school: "Academia Lagasca", hours: "30 h" },
];

export const languages = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "B1 · documentación técnica" },
];
