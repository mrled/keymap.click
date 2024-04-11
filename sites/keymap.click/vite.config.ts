import { resolve } from "path";
import { defineConfig } from "vite";

// Allows using jsconfig ~ paths in the website
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested: resolve(__dirname, "about.html"),
      },
    },
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "../../src"),
    },
  },
});
