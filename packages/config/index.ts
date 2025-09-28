import dotenv from "dotenv";
import { z } from "zod";

// Load .env only on server-side to avoid bundling issues in client
if (process?.env) {
  dotenv.config({ path: "../../.env" });
}

// Zod schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  WEB_URL: z.string().url("WEB_URL must be a valid URL"),
  MOBILE_URL: z.string().url("MOBILE_URL must be a valid URL"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => !Number.isNaN(val) && val > 0,
      "PORT must be a valid number",
    ),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  parsedEnv.error.issues.forEach((_error: z.ZodIssue) => {});
  throw new Error(
    "Environment validation failed. Please check your .env file.",
  );
}

const env = parsedEnv.data;

export const DATABASE_URL = env.DATABASE_URL;
export const BETTER_AUTH_SECRET = env.BETTER_AUTH_SECRET;
export const BETTER_AUTH_URL = env.BETTER_AUTH_URL;
export const WEB_URL = env.WEB_URL;
export const MOBILE_URL = env.MOBILE_URL;
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
export const PORT = env.PORT;
