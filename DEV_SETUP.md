## Notas de setup y próximos pasos

He añadido una estructura base escalable y ejemplos:

- `src/hooks/useDarkMode.ts`
- `src/hooks/useLocalStorage.ts`
- `src/store/themeStore.ts`
- `src/services/api.ts`
- `src/components/common/Button.tsx`
- `src/components/common/Modal.tsx`
- `src/__tests__/useDarkMode.test.tsx`

Pasos recomendados para continuar (instalar dependencias):

```bash
npm install axios zustand @tanstack/react-query
npm install -D typescript @types/react @types/react-dom vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Opcional (DX):

```bash
npm install -D eslint prettier husky lint-staged
npx husky install
```

Sugerencia de migración gradual a TypeScript:
1. Añade las dependencias de TypeScript.
2. Renombra archivos uno a uno a `.tsx` y arregla tipos.
3. Añade `QueryClientProvider` en `src/main.jsx` una vez que instales `@tanstack/react-query`.

Si quieres, me encargo de: instalar y configurar React Query, migrar algunos componentes a TSX, y añadir ESLint/Prettier/Husky y tests automáticos.
