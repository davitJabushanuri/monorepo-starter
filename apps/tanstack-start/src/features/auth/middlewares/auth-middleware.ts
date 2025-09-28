import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "../lib/auth-client";

export const authMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const { data } = await getSession({
      fetchOptions: {
        credentials: "include",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    });

    if (!data?.session) {
      throw redirect({
        to: "/auth/signin",
      });
    }

    return next();
  },
);
