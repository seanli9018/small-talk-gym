import { NextRequest, NextResponse } from "next/server";
import { scenarioRequiresAuth } from "@/lib/scenario-meta";

// Routes that require authentication
const protectedRoutes = ["/chat"];
// Routes only for unauthenticated users (redirect to home if already signed in)
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for a Better Auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = !!sessionCookie;

  // Redirect signed-in users away from auth pages
  if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected pages,
  // but allow free scenarios through without signing in
  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    const scenarioId = pathname.split("/")[2]; // e.g. /chat/office-chat → "office-chat"
    if (scenarioRequiresAuth(scenarioId)) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - api/auth (Better Auth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
