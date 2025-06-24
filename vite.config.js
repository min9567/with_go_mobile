import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        navigateFallback: "/",
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "WITHGOAPP",
        short_name: "WITHGO",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/image/bbiyo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/image/bbiyo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
