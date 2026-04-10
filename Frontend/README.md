# Node.js + React + Tailwind Starter

Modern web-development starter powered by:

- [Vite 7](https://vitejs.dev/) for lightning-fast dev server and optimized builds
- [React 19](https://react.dev/) for building interactive UI
- [Tailwind CSS 4](https://tailwindcss.com/) for utility-first styling

## Getting Started

```bash
npm install
npm run dev
```

Visit the URL that Vite prints (default: http://localhost:5173) to see the starter landing page. Edit any file in `src/` and the browser updates instantly.

## Available Scripts

- `npm run dev` – start the Vite dev server with HMR
- `npm run build` – create an optimized production build
- `npm run preview` – locally preview the production build
- `npm run lint` – run ESLint across the project

## Tailwind CSS

Tailwind 4’s single-entry import lives at the top of `src/index.css` as `@import "tailwindcss";`. Define additional tokens or layers with the new `@theme` / `@layer` APIs as needed. Utility classes are used directly in React components (see `src/App.jsx`). Update `tailwind.config.js` if you need to customize content paths or plugins.
