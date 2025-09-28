import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/config";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: API_URL,
  });
