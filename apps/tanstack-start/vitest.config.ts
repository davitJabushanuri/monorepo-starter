import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    ),
    "process.env.NEXT_PUBLIC_BASE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
  },
  test: {
    setupFiles: ["./src/tests/setup/setup-test-env.tsx"],
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [
        {
          browser: "chromium",
        },
      ],
      headless: true,
      screenshotFailures: false, // Disable automatic screenshots on failure
    },
  },
});
