export type Project = {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: {
    repo?: string;
    demo?: string;
    [key: string]: string | undefined;
  };
  status: 'active' | 'archived' | 'draft';
  featured: boolean;
  sort_order: number;
};

const projects: Project[] = [
  {
    id: "1",
    name: "Vivela.lat",
    badge: "En producción",
    tagline: "Plataforma inmobiliaria — core financiero y de producto",
    description: "Plataforma de real estate donde construyo el core financiero y de producto usando Java/Spring Boot en el backend y React/TypeScript/Next.js en el frontend.",
    highlights: [
      "Core financiero con precisión contable",
      "Domain-Driven Design aplicado a dominios complejos",
      "Arquitectura mantenible en todo el stack"
    ],
    stack: ["Java", "Spring Boot", "React", "TypeScript", "Next.js", "PostgreSQL"],
    links: { website: "https://vivela.lat" },
    status: "active",
    featured: true,
    sort_order: 1,
  },
  {
    id: "2",
    name: "bvislaoch.dev",
    badge: "Open Source",
    tagline: "Portafolio personal con Astro + Tailwind",
    description: "Portafolio moderno construido con Astro, Tailwind CSS y TypeScript. Diseño minimalista con modo oscuro, animaciones GSAP y despliegue en Vercel.",
    highlights: [
      "Arquitectura Astro Islands",
      "GSAP animations + ScrollTrigger",
      "Tailwind CSS con modo oscuro"
    ],
    stack: ["Astro", "TypeScript", "Tailwind CSS", "GSAP"],
    links: { repo: "https://github.com/bvislao/bvislao-portfolio" },
    status: "active",
    featured: true,
    sort_order: 2,
  },
  {
    id: "3",
    name: "YouTube — @thejavizho",
    badge: "Contenido",
    tagline: "Enseñando backend y desarrollo web",
    description: "Canal de YouTube donde comparto conocimientos sobre desarrollo backend, Java, Spring Boot, y tecnologías web modernas.",
    highlights: [
      "Tutoriales de Java/Spring Boot",
      "Arquitectura limpia y DDD",
      "Desarrollo web full-stack"
    ],
    stack: ["Java", "Spring Boot", "TypeScript", "Node.js"],
    links: { demo: "https://youtube.com/@thejavizho" },
    status: "active",
    featured: true,
    sort_order: 3,
  },
];

export function getProjects(): Project[] {
  return projects.filter(p => p.status === 'active').sort((a, b) => a.sort_order - b.sort_order);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.status === 'active' && p.featured).sort((a, b) => a.sort_order - b.sort_order);
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.sort_order - b.sort_order);
}