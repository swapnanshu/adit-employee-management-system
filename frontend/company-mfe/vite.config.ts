import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "company_mfe",
      filename: "remoteEntry.js",
      exposes: {
        "./Component": "./src/mount.tsx",
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "axios",
        "tailwindcss",
        "postcss",
        "autoprefixer",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "es2022",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 4202,
    cors: true,
    origin: "http://localhost:4202",
  },
  preview: {
    port: 4202,
    cors: true,
  },
});
