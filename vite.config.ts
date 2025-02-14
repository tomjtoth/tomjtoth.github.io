import { defineConfig } from "vite";
import { resolve } from "path";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"), // React app entry
        sw: resolve(__dirname, "src/sw.ts"), // Service worker entry
      },
      output: [
        {
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: (asset) =>
            asset.name === "sw" ? "sw.js" : "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",

          format: "es",
        },
      ],
      plugins: [terser()],
    },
    minify: "terser",
  },
});
