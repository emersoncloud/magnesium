import { auth } from "@/lib/auth"

export default auth((_req) => {
  // req.auth
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
