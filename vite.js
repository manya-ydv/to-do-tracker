import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: !!process.env.PORT
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    strictPort: !!process.env.PORT
  }
});
