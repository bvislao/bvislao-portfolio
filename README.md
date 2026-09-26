# Portafolio — Bryan Vislao Chávez

Sitio de una sola página: perfil, experiencia, proyectos, stack y contacto.
Estático, en español, y con hoja de estilos de impresión para exportar el CV a
PDF desde el navegador.

- **URL** — https://bvislaoch.dev
- **Stack** — Astro 7 · Tailwind CSS 4 · TypeScript
- **Deploy** — Netlify (`netlify.toml` incluido)

## Comandos

```bash
npm install
npm run dev                # http://localhost:4321
npm run build              # sprite + sitemap + build a dist/
npm run check              # astro check (tipos)
npm run preview            # sirve dist/
npm run sprites            # regenera public/icons/sprite.svg
npm run og                 # regenera og.png, favicon y placeholder de foto
npm run smoke              # smoke test visual (requiere dev server)
npm run audit:contrast     # auditoría WCAG AA (requiere dev server)
npm run verify             # check + build + smoke + contraste
```

## Dónde editar el contenido

**No toques los `.astro` para cambiar textos.** Todo el contenido vive en
`src/data/`:

| Archivo | Qué contiene |
| --- | --- |
| `src/data/site.ts` | Nombre, rol, resumen, email, teléfono, redes, nav |
| `src/data/experience.ts` | Los 8 empleos, con fechas ISO y helpers de duración |
| `src/data/projects.ts` | Proyectos y casos de estudio |
| `src/data/skills.ts` | Stack agrupado por dominio + certificaciones |
| `src/data/education.ts` | Estudios |
| `src/data/icons.ts` | Etiquetas legibles de los iconos del sprite |

## Pendientes antes de publicar

1. **Foto de perfil** — reemplazar `public/profile.jpg` por una foto real
   (mínimo 512×512). Hoy hay un monograma de respaldo, generado por
   `npm run og`.
2. **Proyectos reales** — en `src/data/projects.ts`, cada proyecto con
   `links[].url === null` se renderiza como chip deshabilitado, no como enlace
   roto. Poner la URL del repo y de la demo para publicarlo. Quitar
   `draft: true` cuando el caso esté listo.

El CV ya está en `public/cv-bryan-vislao.pdf` (9 páginas, 354 KB), que es la
ruta del botón "Descargar CV". Si lo actualizas, reemplaza ese archivo.

## Cómo está construido

### Iconos

`scripts/generate-sprite.mjs` fusiona dos fuentes en un solo
`public/icons/sprite.svg`:

1. **Marcas** de [Simple Icons](https://simple-icons.org) (CC0), que se
   renderizan con `fill: currentColor`.
2. **Glifos propios** estilo Lucide (stroke), para los conceptos genéricos y
   para las marcas que Simple Icons ya no distribuye por temas de licencia
   (Java, Oracle, SQL Server, AWS, LinkedIn, React Native).

Un sprite en vez de SVG inline: la referencia que sirvió de base pesaba 502 KB
de SVG en línea; aquí el sprite completo son 85 KB raw / 29 KB brotli y se
cachea entre páginas.

Si agregas una tecnología, el flujo es: añadir el slug a `BRAND_ICONS` (o un
glifo a `UI_ICONS`), correr `npm run sprites`, y registrar la etiqueta en
`src/data/icons.ts`.

### Tema

`data-theme` en `<html>` guarda siempre el valor **resuelto** (`light` o
`dark`) porque es lo que consume el CSS. La **elección** del usuario
(`light` / `dark` / `system`) vive en `localStorage.theme` y la resuelve
`ThemeToggle.astro`.

Un script inline bloqueante en el `<head>` aplica el tema antes del primer
pintado, así que no hay flash. Si "system" estuviera en `data-theme`, el bloque
oscuro del CSS nunca aplicaría — de ahí la separación.

### Contraste

Los valores de `--text-muted`, `--text-faint` y `--accent` están **resueltos
numéricamente** para cumplir WCAG AA (≥ 4.5:1) en ambos temas, no
elegidos a ojo. `npm run audit:contrast` lo verifica y falla si algo
regresa.

### Capas de Tailwind

Reglas como `.icon` viven **dentro** de `@layer components`. En Tailwind v4 las
reglas sin capa ganan a las de utilities, así que un `.icon { display:
inline-block }` suelto vencería a `.hidden { display: none }` y dejaría los
iconos de tema apilados.

### Impresión

`@media print` en `src/styles/global.css` convierte la página en un CV: oculta
la navegación, las ampollas de filtrado y los botones, imprime la URL de los
enlaces externos y fuerza saltos para no partir tarjetas. El botón de la
impresora del footer llama a `window.print()`.

## Verificación

`npm run verify` corre, en orden: tipos, build, smoke test visual (4
viewports × 2 temas, errores de consola, requests fallidos, overflow
horizontal, área táctil, iconos rotos) y la auditoría de contraste.

Estado actual: `astro check` en 0 errores / 0 warnings / 0 hints, 32/32
comprobaciones de contraste, y ninguna incidencia visual ni de consola.

### Peso de la primera carga

| Archivo | Raw | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| `index.html` | 167 KB | 17.2 KB | 13.4 KB |
| CSS | 31.7 KB | 6.8 KB | 5.9 KB |
| JS | 2.4 KB | 1.1 KB | 1.0 KB |
| `icons/sprite.svg` | 84.9 KB | 32.7 KB | 28.7 KB |
| **Total** | **286 KB** | **57.8 KB** | **49 KB** |

Sin fuentes ni CDNs de terceros: nada bloquea el render por un origen ajeno.

Las capturas quedan en `.screenshots/` (ignorado por git).

## Créditos

Marcas de Simple Icons: CC0-1.0. Fuentes: Outfit (SIL OFL). Las tipografías se
autoalojan con `fontsource`; no hay CDNs ni fuentes de terceros en runtime.
