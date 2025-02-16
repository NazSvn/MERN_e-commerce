import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), sentryVitePlugin({
    org: "nazsvns",
    project: "node-express"
  })],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },

  build: {
    sourcemap: true
  }
});