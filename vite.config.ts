import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import terser from "@rollup/plugin-terser";
import yaml from "@rollup/plugin-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(() => ({
  plugins: [yaml()],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "index.html"),
        sw: resolve(__dirname, "src/sw.ts"),
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
}));
