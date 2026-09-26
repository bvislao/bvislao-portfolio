/**
 * Academic background, newest first.
 */

export interface Education {
  id: string;
  institution: string;
  degree: string;
  detail?: string;
  period: string;
  href?: string;
  icon: string;
}

export const education: Education[] = [
  {
    id: 'utp',
    institution: 'Universidad Tecnológica del Perú',
    degree: 'Ingeniería de Sistemas',
    period: '2024',
    href: 'https://www.utp.edu.pe/',
    icon: 'graduation-cap',
  },
  {
    id: 'sise',
    institution: 'Instituto SISE',
    degree: 'Computación e Informática · Software & Sistemas',
    period: '2012 – 2016',
    href: 'https://www.sise.edu.pe/',
    icon: 'graduation-cap',
  },
];
