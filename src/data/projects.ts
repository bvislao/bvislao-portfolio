/**
 * Projects shown on the landing page.
 *
 * The CV has no projects section, so these start as case studies derived from
 * the most concrete achievements in the work history. `links` entries with a
 * `null` url are rendered as disabled pills instead of broken anchors, so the
 * grid never shows a dead link.
 *
 * To publish a real project, add an entry and point `url` at the live site and
 * `repo` at the repository. Nothing else needs to change.
 */

export interface ProjectLink {
  label: string;
  url: string | null;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  /** One line hook shown on the collapsed card. */
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  /** Quantified result, if the CV provides one. */
  metric?: { value: string; label: string };
  stack: string[];
  links: ProjectLink[];
  icon: string;
  /** `true` while the entry is a stand-in for a real project. */
  draft?: boolean;
}

export const projects: Project[] = [
  {
    id: 'open-spec',
    title: 'Contratos de API con open-spec',
    tagline: 'Generación dinámica de contratos entre servicios para eliminar deuda técnica en integraciones.',
    problem:
      'Las integraciones entre servicios tenían contratos implícitos en el código: cada endpoint se documentaba en un lugar distinto y los cambios rompían consumidores sin aviso.',
    approach:
      'Definí la especificación de cada endpoint como fuente de verdad y la generé de forma automática, de modo que el contrato se versiona junto al servicio y la comunicación entre equipos queda auditable.',
    outcome:
      'Comunicación entre servicios estandarizada, segura y escalable, con la deuda técnica de integraciones eliminada.',
    metric: { value: '100%', label: 'de contratos generados' },
    stack: ['typescript', 'nodedotjs', 'nestjs', 'git'],
    links: [
      { label: 'Repositorio', url: null, icon: 'github' },
      { label: 'Documentación', url: null, icon: 'file' },
    ],
    icon: 'workflow',
    draft: true,
  },
  {
    id: 'ia-ingenieria',
    title: 'IA integrada en el ciclo de ingeniería',
    tagline: 'Claude Code y agentes de código como parte del flujo de trabajo, con revisión humana obligatoria.',
    problem:
      'La asistencia con IA se usaba de forma aislada y sin control de calidad, generando más trabajo de revisión que ahorro.',
    approach:
      'Integré Claude Code (vía CLI) y Gemini en el flujo diario para generación de componentes modulares, refactorización, debugging y optimización de queries, con una etapa explícita de validación humana sobre calidad, seguridad, mantenibilidad y rendimiento.',
    outcome:
      'Reducción del 30% en el time-to-market de nuevas funcionalidades, con auditoría de código asistida por IA que mitiga vulnerabilidades críticas antes de producción.',
    metric: { value: '-30%', label: 'time-to-market' },
    stack: ['claudecode', 'brand-ai', 'typescript', 'dotnet'],
    links: [{ label: 'Escribir caso', url: null, icon: 'file' }],
    icon: 'brand-ai',
    draft: true,
  },
  {
    id: 'core-financiero',
    title: 'Modernización del core financiero',
    tagline: 'Desacoplamiento de un monolito .NET hacia una arquitectura ágil, con foco en integridad ACID.',
    problem:
      'El core financiero era un monolito heredado en .NET y SQL Server, difícil de evolve y con alto riesgo regulatorio (SBS).',
    approach:
      'Refactorización segura asistida por IA sobre la lógica de negocio, extracción de módulos y reestructuración de queries y stored procedures para soportar operaciones masivas sin degradación de rendimiento.',
    outcome:
      'Arquitectura más ágil y desacoplada, tiempos de respuesta reducidos en reportes gerenciales críticos y menos inactividad durante ventanas de mantenimiento.',
    metric: { value: 'ACID', label: 'integridad transaccional' },
    stack: ['dotnet', 'brand-sqlserver', 'database', 'brand-ai'],
    links: [{ label: 'Escribir caso', url: null, icon: 'file' }],
    icon: 'brand-oracle',
    draft: true,
  },
  {
    id: 'plaft-ofac',
    title: 'Módulo PLAFT & listas OFAC',
    tagline: 'Carga masiva y optimización de búsquedas de clientes sensibles en bases negativas.',
    problem:
      'La revisión de listas negativas (ONU, OFAC) sobre clientes era manual y lenta, con riesgo de omitir clientes sensibles.',
    approach:
      'Implementé la carga masiva de listas ONU y optimicé las consultas sobre listas OFAC en el core bancario Ayni, dentro de los módulos de Clientes PLAFT y Garantías.',
    outcome:
      'Búsqueda drásticamente más rápida sobre clientes sensibles, con registro, tasación y asociación automatizada de garantías (Bonos, Carta Fianza, Joyas, Depósitos) a solicitudes de crédito.',
    stack: ['brand-sqlserver', 'database', 'dotnet'],
    links: [{ label: 'Escribir caso', url: null, icon: 'file' }],
    icon: 'shield-check',
    draft: true,
  },
];

/** Projects that are safe to show publicly, i.e. without draft entries. */
export const publishedProjects = projects.filter((p) => !p.draft);

export const hasPublishedProjects = publishedProjects.length > 0;
