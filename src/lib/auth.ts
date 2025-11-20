import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],
})

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = process.env.ADMIN_EMAILS?.split(",") || [];
  return admins.map(e => e.trim()).includes(email);
}
