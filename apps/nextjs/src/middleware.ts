import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/auth-client";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /auth/signin, /dashboard)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/signup"];
  const isPublicPath = publicPaths.includes(path);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  try {
    const { data } = await getSession({
      fetchOptions: {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    });

    if (!data?.session) {
      // Redirect to sign in page
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  } catch {
    // If session check fails, redirect to sign in
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
