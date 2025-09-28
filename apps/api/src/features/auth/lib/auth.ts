import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MOBILE_URL,
  WEB_URL,
} from "@repo/config";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  appName: "stealz",
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [WEB_URL, MOBILE_URL],
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  plugins: [openAPI()],
});
