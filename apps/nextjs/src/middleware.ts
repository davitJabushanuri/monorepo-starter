import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /auth/signin, /dashboard)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/signup", "/"];
  const isPublicPath = publicPaths.includes(path);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // Note: getSessionCookie only checks for cookie existence, not validity
  // Always validate session on the server for protected actions
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // If no session cookie, redirect to sign in
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
