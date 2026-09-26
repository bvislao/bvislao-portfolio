/**
 * Identity, contact channels and site-wide metadata.
 * Single source of truth for anything that appears in <head>, JSON-LD or the
 * footer. Domain comes from PUBLIC_SITE_URL so Netlify previews never emit
 * canonicals pointing at production.
 */

const rawSite = import.meta.env.PUBLIC_SITE_URL ?? 'https://bvislaoch.dev';

/** Normalised origin without a trailing slash. */
export const SITE_URL = rawSite.replace(/\/+$/, '');

export const site = {
  url: SITE_URL,
  firstName: 'Bryan',
  lastName: 'Chavez',
  fullName: 'Bryan Vislao Chavez',
  /** Used in <title>, og:title and the hero. */
  role: 'FullStack Software Engineer',
  /** Comma-separated stack line under the role. */
  tagline: 'React · Next.js · Node.js · NestJS · .NET · Java',
  location: {
    city: 'Lima',
    region: 'Perú',
    country: 'PE',
    countryName: 'Perú',
  },
  summary:
    'Software Engineer con más de 8 años de experiencia en el diseño, desarrollo e integración de sistemas críticos empresariales y plataformas SaaS escalables. Stack principal en React, Next.js, Angular, Vue y .NET para frontend, junto con Node.js, NestJS, .NET y Java/Spring Boot en backend, gestionando bases de datos SQL y NoSQL. Enfoque en código limpio, modular y fuertemente tipado con TypeScript, aplicando principios SOLID y DRY, y evitando deuda técnica. Integra IA en el ciclo de vida del software para entregar soluciones de alta disponibilidad y seguridad estricta.',
  /**
   * Separate from `summary` because a meta description is truncated by search
   * engines at roughly 160 characters. Keep this one under that budget.
   */
  metaDescription:
    'FullStack Software Engineer en Lima, Perú. 8+ años con React, Next.js, Node.js, NestJS, .NET y Java/Spring Boot. Arquitectura limpia, TypeScript y SOLID.',
  email: 'bvislao95@gmail.com',
  /** Raw digits, used to build the tel: and wa.me links. */
  phone: '+51 930 712 645',
  phoneRaw: '+51930712645',
  photo: {
    src: '/profile.jpg',
    alt: 'Retrato de Bryan Vislao Chavez',
    width: 512,
    height: 512,
  },
  socials: [
    { label: 'GitHub', handle: '@bvislao', href: 'https://github.com/bvislao', icon: 'github' },
    { label: 'LinkedIn', handle: 'in/bvislao', href: 'https://www.linkedin.com/in/bvislao', icon: 'brand-linkedin' },
    { label: 'WhatsApp', handle: '+51 930 712 645', href: 'https://wa.me/51930712645', icon: 'whatsapp' },
  ],
  /** Primary call to action in the hero. */
  resume: {
    label: 'Descargar CV',
    href: '/cv-bryan-vislao.pdf',
  },
} as const;

/** Nav entries. `href` starting with # maps to a section id on this page. */
export const nav = [
  { label: 'Experiencia', href: '#experiencia' },
  // 'Proyectos' vuelve cuando haya repos y demos reales que enlazar.
  { label: 'Stack', href: '#stack' },
  { label: 'Educación', href: '#educacion' },
  { label: 'Contacto', href: '#contacto' },
] as const;
