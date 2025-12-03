import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url"; // <-- Import 'url' helpers

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the new, correct way for ESM projects
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
