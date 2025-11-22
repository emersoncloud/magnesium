import { auth } from "@/lib/auth"

export default auth((req) => {
  
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
