# Portfolio de Adrián Busquets

Portfolio personal hecho con React 18, TypeScript, Vite y Motion.

## Ponerlo en marcha

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera la carpeta dist/ lista para desplegar
```

## Cambiar el contenido

Todo el texto está en `src/data.ts`: perfil, proyectos, experiencia, stack, formación e idiomas.

- **Capturas de los proyectos:** guarda la imagen en `public/capturas/` y añade
  `image: "capturas/jostelpro.webp"` al proyecto en `src/data.ts`.
- **CV en PDF:** sustituye `public/cv-adrian-busquets.pdf` por la versión nueva cuando lo actualices.
- **Ticket:** las líneas del ticket están en `src/components/TicketPrinter.tsx`.
- **Comandos de la terminal:** en `src/components/HeroTerminal.tsx`.

## Desplegar

En Vercel o Netlify: importa el repositorio, comando de build `npm run build` y carpeta de salida `dist`.

Cuando tengas el dominio definitivo, añade en `index.html` las etiquetas `og:url` y `og:image`
(una captura de 1200×630 en `public/`) para que el enlace se vea bien al compartirlo.
