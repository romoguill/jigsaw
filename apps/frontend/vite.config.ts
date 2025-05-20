import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        "@/frontend": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "../server/static",
      emptyOutDir: true,
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_SERVER_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
