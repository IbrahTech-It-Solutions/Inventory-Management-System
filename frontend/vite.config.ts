import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "InventorySystem",
        short_name: "InventorySystem",
        description: "Inventory management system",
        start_url: "/dashboard",
        scope: "/",
        display: "standalone",
        theme_color: "var(--color-primary)",
        background_color: "#f8fafc",

        icons: [
          {
            src: "/icons.svg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons.svg",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons.svg",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff2}",
        ],
      },
    }),
  ],
});