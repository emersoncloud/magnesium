import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Upsert user
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (!existingUser) {
        await db.insert(users).values({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      } else {
        // Update info if changed
        if (existingUser.name !== user.name || existingUser.image !== user.image) {
          await db.update(users)
            .set({ name: user.name, image: user.image })
            .where(eq(users.email, user.email));
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        // On sign in, fetch the UUID from DB
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });
        if (dbUser) {
          token.userId = dbUser.id;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
})

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = process.env.ADMIN_EMAILS?.split(",") || [];
  return admins.map(e => e.trim()).includes(email);
}
