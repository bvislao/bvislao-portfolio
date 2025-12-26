export const projects = [
  {
    name: "PAYKI",
    tagline: "PWA de pagos de transporte público (Perú)",
    description:
      "PWA para pagos en transporte público: el conductor genera QR, el pasajero paga escaneando. Administración de operadores, flotas, vehículos, choferes, tarifas y notificaciones.",
    highlights: [
      "Supabase: Postgres + RLS, Auth, Edge Functions (Deno)",
      "Next.js (PWA) consumiendo PostgREST/RPC/Edge Functions",
      "Web Push (VAPID) para notificaciones",
    ],
    stack: ["Next.js", "Supabase", "Postgres", "RLS", "Edge Functions", "Web Push"],
    links: {
      repo: "https://github.com/bvislao/payki",
    },
    badge: "Proyecto final (UTP)",
  },
  {
    name: "Anti-Phishing Perú",
    tagline: "Extensión anti-phishing (Bancos & Financieras)",
    description:
      "Detecta señales de phishing en sitios que imitan a bancos/financieras del Perú. Alertas en página, badge y Modo Estricto que bloquea inputs sensibles en dominios no oficiales.",
    highlights: [
      "Heurísticas locales (sin enviar tus datos)",
      "Detección: punycode/homógrafos, look-alike, forms a otro dominio",
      "Modo Estricto: bloqueo temporal de inputs sensibles",
    ],
    stack: ["Browser Extension", "Heurísticas", "Security UX"],
    links: {
      repo: "https://github.com/bvislao/antiphishing-peru-ext",
    },
    badge: "Seguridad",
  },
  {
    name: "Aliases Git",
    tagline: "Guía para productividad con alias en Git",
    description:
      "Guía práctica para configurar alias de Git y mejorar productividad en el día a día.",
    highlights: ["Atajos útiles", "Buenas prácticas", "Setup rápido"],
    stack: ["Git"],
    links: {
      repo: "https://github.com/bvislao/aliases-git",
    },
    badge: "Utilidad",
  },
];