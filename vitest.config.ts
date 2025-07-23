import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/tests/**",
        "**/__tests__/**",
        "eslint.config.js",
        "vite.config.ts",
        "vitest.config.ts",
        "src/*.tsx",
        "src/types.ts",
        "src/components/**",
      ],
    },
  },
});
