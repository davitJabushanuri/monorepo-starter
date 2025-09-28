import { DATABASE_URL } from "@repo/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/migrations",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
