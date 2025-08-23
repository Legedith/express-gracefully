import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Set `base` when building for GitHub Pages. Replace `REPO_NAME` with your
// repository name (e.g. `/my-repo/`) or set the env var `VITE_GH_PAGES_BASE`.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_GH_PAGES_BASE || '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
