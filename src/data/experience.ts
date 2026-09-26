/**
 * Work history, newest first. Sourced from the CV PDF.
 *
 * Dates are ISO `yyyy-mm` so they can be fed straight into <time datetime> and
 * into the duration helper below. `end: null` means "current role".
 *
 * `stack` holds sprite icon names (see scripts/generate-sprite.mjs) rather than
 * free text, which keeps the markup free of inline SVG and makes the tech
 * filter in Experience.astro a simple set intersection.
 */

export type WorkMode = 'Presencial' | 'Híbrido' | 'Remoto';

export interface Role {
  /** Stable slug, used for anchor links and the filter. */
  id: string;
  company: string;
  /** End client when the employer was a consultancy/staffing firm. */
  client?: string;
  position: string;
  location: string;
  mode: WorkMode;
  start: string;
  end: string | null;
  /** One line shown when the entry is collapsed. */
  summary: string;
  responsibilities: string[];
  achievements: string[];
  stack: string[];
  /** Rendered expanded and first in the list. */
  current?: boolean;
}

export const experience: Role[] = [
  {
    id: 'vivela',
    company: 'Vívela',
    position: 'Software Developer',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2023-03',
    end: null,
    current: true,
    summary:
      'Desarrollo full stack de aplicaciones y APIs REST sobre React, Next.js y Java/Spring Boot, con foco en arquitectura limpia y eliminación de deuda técnica.',
    responsibilities: [
      'Desarrollo de aplicaciones web full stack, implementando funcionalidades frontend y backend orientadas a requerimientos de negocio.',
      'Diseño, desarrollo e integración de APIs REST, aplicando principios de arquitectura limpia, SOLID, Clean Code y buenas prácticas.',
      'Desarrollo de interfaces con React, Next.js y TypeScript, priorizando componentes reutilizables, mantenibles y escalables.',
      'Desarrollo de servicios backend con Java y Spring Boot: lógica de negocio, validaciones, integración entre sistemas y persistencia.',
      'Diseño, consulta y optimización de bases de datos relacionales, principalmente MySQL: modelado, queries y procesos de integración.',
      'Integración de aplicaciones y servicios mediante APIs REST y servicios externos, asegurando consistencia y trazabilidad.',
      'Participación en code reviews, refactorización y mejora continua, orientada a reducir deuda técnica y mejorar la mantenibilidad.',
      'Implementación y mantenimiento de pruebas automatizadas y validaciones técnicas para garantizar la calidad del software.',
      'Participación en procesos de despliegue, integración continua y ciclo de vida de desarrollo (SDLC).',
      'Análisis y resolución de incidencias mediante debugging, análisis de logs y diagnóstico de problemas en frontend y backend.',
      'Uso de herramientas de IA y agentes de código (Claude Code, Codex, GitHub Copilot) para generación, refactorización, debugging, documentación y pruebas.',
      'Revisión y validación humana del código generado por IA, verificando calidad, seguridad, mantenibilidad y rendimiento.',
      'Colaboración con equipos multidisciplinarios para transformar requerimientos funcionales en soluciones tecnológicas.',
    ],
    achievements: [
      'Integración de IA en el flujo de ingeniería con Claude Code (vía CLI) y Gemini, reduciendo el time-to-market de nuevas funcionalidades en un 30%.',
      'Eliminación de deuda técnica en integraciones mediante generación dinámica de contratos de API con open-spec, estandarizando la comunicación entre servicios de forma segura, escalable y auditable.',
    ],
    stack: [
      'react', 'nextdotjs', 'typescript', 'javascript',
      'spring', 'brand-java', 'nodedotjs', 'nestjs',
      'mysql', 'postgresql', 'docker', 'kubernetes',
      'brand-aws', 'git', 'github', 'claudecode', 'brand-ai',
    ],
  },
  {
    id: 'qapac',
    company: 'Financiera Qapac S.A.',
    position: 'Software Engineer',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2022-06',
    end: '2023-03',
    summary:
      'Liderazgo de la modernización y mantenimiento evolutivo de módulos del core financiero bajo normativa SBS, con foco en integridad transaccional ACID y alta disponibilidad.',
    responsibilities: [
      'Liderar la modernización y mantenimiento evolutivo de módulos críticos del core financiero, garantizando cumplimiento de normativas regulatorias (SBS), integridad transaccional (ACID) y seguridad de la información.',
      'Optimizar esquemas de bases de datos relacionales y reestructurar queries complejas para soportar operaciones financieras masivas sin degradación de rendimiento.',
      'Asegurar la alta disponibilidad (SLA) de los servicios backend con estrategias de monitoreo, análisis de logs y resolución proactiva de incidentes en producción.',
    ],
    achievements: [
      'Pionero en la adopción de prácticas de desarrollo con IA, usando ChatGPT como asistencia técnica para refactorizar de forma segura sistemas monolíticos heredados en .NET y SQL Server hacia arquitecturas más ágiles y desacopladas.',
      'Mejora en métricas de ciberseguridad mediante automatización de auditorías de código (Cyber Threat Management) asistidas por IA, mitigando vulnerabilidades críticas antes de los pases a producción.',
    ],
    stack: ['dotnet', 'brand-sqlserver', 'database', 'brand-ai', 'shield-check', 'target'],
  },
  {
    id: 'cumbra',
    company: 'Avances Tecnológicos',
    client: 'Cumbra Perú',
    position: 'Analista Programador .NET',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2020-01',
    end: '2022-06',
    summary:
      'Integraciones entre el ERP corporativo y aplicaciones satélite del cliente, exponiendo APIs RESTful seguras para interoperabilidad con proveedores externos.',
    responsibilities: [
      'Diseñar y desarrollar integraciones complejas entre sistemas corporativos ERP y aplicaciones satélite (C#, .NET, SQL Server).',
      'Construir y exponer APIs RESTful seguras y bien documentadas para permitir la interoperabilidad entre plataformas internas y sistemas de proveedores externos.',
      'Levantar requerimientos técnicos con stakeholders de negocio para traducirlos en arquitecturas de software eficientes y escalables.',
    ],
    achievements: [
      'Refactorización exhaustiva de lógica de negocio y optimización de stored procedures, reduciendo significativamente los tiempos de respuesta en la generación de reportes gerenciales críticos.',
      'Estandarización y automatización de los procesos de despliegue hacia producción, disminuyendo el tiempo de inactividad del sistema durante ventanas de mantenimiento programadas.',
    ],
    stack: ['dotnet', 'brand-sqlserver', 'database', 'workflow', 'git'],
  },
  {
    id: 'scotiabank',
    company: 'Stefanini Brasil',
    client: 'Scotiabank Perú',
    position: '.NET Developer',
    location: 'Lima, Perú',
    mode: 'Remoto',
    start: '2019-07',
    end: '2020-01',
    summary:
      'Desarrollo evolutivo y correctivo de aplicaciones y servicios bancarios bajo el ecosistema Microsoft, para el canal digital de alta demanda transaccional.',
    responsibilities: [
      'Desarrollo evolutivo y correctivo de aplicaciones y servicios bancarios bajo el ecosistema Microsoft (.NET, SQL Server).',
      'Entrega de componentes de software de alta calidad y concurrentes para el canal digital del banco, soportando entornos de alta demanda transaccional.',
    ],
    achievements: [
      'Componentes entregados y liberados a producción dentro de los ciclos de sprint acordados con el cliente.',
    ],
    stack: ['dotnet', 'brand-sqlserver', 'database', 'git'],
  },
  {
    id: 'mitsui',
    company: 'Experis IT Perú',
    client: 'Mitsui Auto Finance',
    position: '.NET Developer',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2019-01',
    end: '2019-07',
    summary:
      'Desarrollo y mantenimiento de soluciones .NET para la gestión financiera automotriz, garantizando estabilidad operativa de plataformas internas.',
    responsibilities: [
      'Desarrollo de soluciones de software para la gestión financiera automotriz.',
      'Mantenimiento de plataformas internas utilizando tecnologías .NET, garantizando la estabilidad operativa y los flujos de información del negocio.',
    ],
    achievements: [
      'Plataformas internas estabilizadas y flujos de información del negocio preservados durante toda la asignación.',
    ],
    stack: ['dotnet', 'database', 'git'],
  },
  {
    id: 'credinka-analista',
    company: 'Financiera Credinka',
    position: 'Analista Programador de Sistemas',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2017-02',
    end: '2019-01',
    summary:
      'Desarrollo e implementación de mejoras para el core bancario Ayni (módulos Clientes PLAFT y Garantías), con modelado de datos y backend sobre SQL Server.',
    responsibilities: [
      'Desarrollo e implementación de mejoras para el core bancario Ayni, específicamente en los módulos de Clientes PLAFT y Garantías.',
      'Modelado de bases de datos y desarrollo backend/frontend con SQL Server, C#, WebServices, HTML5 y jQuery.',
    ],
    achievements: [
      'Implementación exitosa de la carga masiva de listas ONU y optimización de listas OFAC, mejorando drásticamente la búsqueda de clientes sensibles en bases negativas.',
      'Desarrollo del módulo de Garantías (Bonos, Carta Fianza, Joyas, Depósitos), permitiendo su registro, tasación y asociación automatizada con solicitudes de crédito.',
    ],
    stack: ['dotnet', 'brand-sqlserver', 'database', 'jquery', 'code'],
  },
  {
    id: 'maquisistema',
    company: 'EAFC Maquisistema',
    position: 'Analista Programador',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2016-01',
    end: '2017-02',
    summary:
      'Análisis, programación y soporte de sistemas corporativos para optimizar la gestión operativa del negocio.',
    responsibilities: [
      'Análisis, programación y soporte de sistemas corporativos para optimizar la gestión operativa.',
      'Mantenimiento de bases de datos relacionales y desarrollo de nuevas funcionalidades requeridas por el negocio.',
    ],
    achievements: [
      'Nuevas funcionalidades corporativasZS entregadas sobre bases de datos relacionales en producción.',
    ],
    stack: ['database', 'code', 'git'],
  },
  {
    id: 'credinka',
    company: 'Credinka',
    position: 'Analista Programador',
    location: 'Lima, Perú',
    mode: 'Presencial',
    start: '2015-02',
    end: '2015-12',
    summary:
      'Análisis de reglas de negocio y modelado de base de datos para la construcción de plataformas digitales, con contribution al proyecto Homebanking.',
    responsibilities: [
      'Análisis de reglas de negocio y modelado de base de datos para la construcción de plataformas digitales.',
    ],
    achievements: [
      'Contribución integral en el desarrollo del proyecto Homebanking de la entidad financiera.',
      'Creación del módulo de Afiliación a Homebanking en ventanilla, integrando servicios backend (C#, WebServices) con una interfaz HTML5, CSS3 y jQuery, automatizando la generación de constancias.',
    ],
    stack: ['dotnet', 'brand-sqlserver', 'jquery', 'code'],
  },
];

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

const MONTHS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'set', 'oct', 'nov', 'dic',
];

/** `2023-03` -> `mar 2023`. */
export function formatMonth(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** `2023-03` -> `2023-03`, for the `datetime` attribute. */
export function toDateTime(iso: string): string {
  return iso;
}

/** Whole months between two ISO months, inclusive of the end month. */
function monthsBetween(startIso: string, endIso: string): number {
  const [sy, sm] = startIso.split('-').map(Number);
  const [ey, em] = endIso.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

/** e.g. `1 año 6 meses`, `7 meses`. */
export function duration(startIso: string, endIso: string | null, now = new Date()): string {
  const end = endIso ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const months = monthsBetween(startIso, end);
  if (months < 1) return '—';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mes' : 'meses'}`);
  return parts.join(' ');
}

/** Label pair for the timeline header. */
export function periodLabel(role: Role): string {
  const from = formatMonth(role.start);
  const to = role.end ? formatMonth(role.end) : 'actualidad';
  return `${from} — ${to}`;
}

/** Total years of experience across all roles, as of now. */
export function totalExperience(now = new Date()): number {
  const earliest = experience.reduce(
    (min, r) => (r.start < min ? r.start : min),
    experience[0]!.start,
  );
  const months = monthsBetween(earliest, `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  return Math.floor(months / 12);
}
