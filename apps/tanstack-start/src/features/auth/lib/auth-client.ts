import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/config";

// For client-side usage
export const authClient = createAuthClient({
  baseURL: API_URL,
});

// For server-side usage in routes/loaders
export const getServerAuthClient = () => {
  // In server context, we need to access env vars differently
  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("VITE_API_URL environment variable is required");
  }

  return createAuthClient({
    baseURL: apiUrl,
  });
};
