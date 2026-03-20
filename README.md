# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## CV PDF / Serverless setup


This project includes a client-side PDF generator using `pdf-lib` (lightweight, compatible with Vite) and examples of serverless endpoints to: 1) increment a download counter and 2) validate `token` query params.

Quick setup:

1. Install runtime dependencies:

```bash
npm install pdf-lib react-helmet-async
```

2. Environment variables (create a `.env` file, don't commit it):

- `VITE_DOWNLOAD_COUNTER_URL` — URL of your serverless function that increments download counts.
- `VITE_TOKEN_VALIDATION_URL` — URL of serverless function that validates tokens and returns extra CV data.

3. Serverless examples are in `serverless_examples/netlify/` — adapt for Netlify, Vercel or Supabase Edge Functions. The functions should use a service role key to access the DB (keep it secret).

4. Usage: the PDF generator is created on-demand when the user clicks "Descargar CV". Token validation runs on page load and, if valid, can inject extra data into the generated CV.

Security: never commit service role keys or `.env` files. Use provider secrets in your hosting platform.
