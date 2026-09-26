/**
 * Skills grouped by domain, as they appear in the CV.
 * `icon` values point at the sprite built by scripts/generate-sprite.mjs.
 */

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  /** Sentence describing how the group is applied, shown under the heading. */
  blurb: string;
  skills: { name: string; icon: string; level?: 1 | 2 | 3 }[];
}

/**
 * level: 3 = daily driver, 2 = solid working knowledge, 1 = familiar.
 * Used only to render a subtle 3-dot indicator, never a percentage.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend & Móvil',
    icon: 'layers',
    blurb: 'Interfaces con foco en componentes reutilizables, tipado estricto y rendimiento.',
    skills: [
      { name: 'React', icon: 'react', level: 3 },
      { name: 'Next.js', icon: 'nextdotjs', level: 3 },
      { name: 'TypeScript', icon: 'typescript', level: 3 },
      { name: 'Angular', icon: 'angular', level: 3 },
      { name: 'Vue', icon: 'vuedotjs', level: 2 },
      { name: 'Tailwind CSS', icon: 'tailwindcss', level: 3 },
      { name: 'MUI', icon: 'mui', level: 2 },
      { name: 'React Native', icon: 'brand-reactnative', level: 1 },
      { name: 'Flutter', icon: 'flutter', level: 1 },
      { name: 'JavaScript', icon: 'javascript', level: 3 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Arquitectura',
    icon: 'code',
    blurb: 'APIs REST, microservicios y dominio financiero con airspace transaccional.',
    skills: [
      { name: 'Node.js', icon: 'nodedotjs', level: 3 },
      { name: 'NestJS', icon: 'nestjs', level: 3 },
      { name: '.NET', icon: 'dotnet', level: 3 },
      { name: 'C#', icon: 'dotnet', level: 3 },
      { name: 'Java', icon: 'brand-java', level: 3 },
      { name: 'Spring Boot', icon: 'spring', level: 3 },
      { name: 'Python', icon: 'python', level: 2 },
      { name: 'Go', icon: 'go', level: 1 },
      { name: 'GraphQL', icon: 'graphql', level: 2 },
      { name: 'Microservicios', icon: 'workflow', level: 3 },
    ],
  },
  {
    id: 'data',
    label: 'Bases de Datos',
    icon: 'database',
    blurb: 'Modelado relacional, optimización de queries y persistencia NoSQL.',
    skills: [
      { name: 'PostgreSQL', icon: 'postgresql', level: 3 },
      { name: 'MySQL', icon: 'mysql', level: 3 },
      { name: 'SQL Server', icon: 'brand-sqlserver', level: 3 },
      { name: 'Oracle DB', icon: 'brand-oracle', level: 2 },
      { name: 'MongoDB', icon: 'mongodb', level: 2 },
      { name: 'Prisma ORM', icon: 'prisma', level: 3 },
      { name: 'Flyway', icon: 'flyway', level: 2 },
      { name: 'Redis', icon: 'redis', level: 2 },
    ],
  },
  {
    id: 'infra',
    label: 'DevOps & Infraestructura',
    icon: 'cloud-cpu',
    blurb: 'Contenedores, CI/CD y despliegue reproducible en cloud.',
    skills: [
      { name: 'Docker', icon: 'docker', level: 3 },
      { name: 'AWS', icon: 'brand-aws', level: 2 },
      { name: 'Kubernetes', icon: 'kubernetes', level: 2 },
      { name: 'CI/CD', icon: 'git-branch', level: 3 },
      { name: 'Git', icon: 'git', level: 3 },
      { name: 'Terraform', icon: 'terraform', level: 1 },
      { name: 'Nginx', icon: 'nginx', level: 2 },
      { name: 'Linux', icon: 'linux', level: 3 },
      { name: 'macOS', icon: 'apple', level: 3 },
    ],
  },
  {
    id: 'practicas',
    label: 'Prácticas & IA',
    icon: 'shield-check',
    blurb: 'Principios de ingeniería y uso de IA con revisión humana obligatoria.',
    skills: [
      { name: 'Clean Architecture', icon: 'layers', level: 3 },
      { name: 'SOLID', icon: 'shield-check', level: 3 },
      { name: 'DRY', icon: 'copy', level: 3 },
      { name: 'TDD', icon: 'check', level: 2 },
      { name: 'Scrum', icon: 'workflow', level: 3 },
      { name: 'Patrones de Diseño', icon: 'scale-3d', level: 3 },
      { name: 'Claude Code', icon: 'claudecode', level: 3 },
      { name: 'Agentes de código', icon: 'brand-ai', level: 3 },
    ],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  href?: string;
}

export const certifications: Certification[] = [
  {
    name: 'Scrum Foundation Professional Certificate',
    issuer: 'CertiProf',
    year: '2020',
  },
  {
    name: 'Cyber Threat Management',
    issuer: 'CertiProf',
    year: '2022',
  },
  {
    name: 'Introduction to Cybersecurity',
    issuer: 'CertiProf',
    year: '2022',
  },
];
