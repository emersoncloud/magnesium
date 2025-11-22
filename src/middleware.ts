import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/sets') ||
    req.nextUrl.pathname.startsWith('/routes') ||
    req.nextUrl.pathname.startsWith('/feed') ||
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/sync');

  if (isOnDashboard) {
    if (isLoggedIn) return;
    return Response.redirect(new URL('/api/auth/signin', req.nextUrl));
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
