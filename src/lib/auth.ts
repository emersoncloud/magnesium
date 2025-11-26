import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyNewUser } from "@/lib/telegram";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "google-native",
      name: "Google Native",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        
        try {
          const { OAuth2Client } = await import("google-auth-library");
          const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
          const ticket = await client.verifyIdToken({
            idToken: credentials.idToken as string,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          
          if (!payload) return null;

          return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            image: payload.picture,
          };
        } catch (error) {
          console.error("Error verifying Google ID token:", error);
          return null;
        }
      },
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      let imageUrl = user.image;

      // If image is from Google, upload to Supabase
      if (imageUrl && imageUrl.includes("googleusercontent.com")) {
        console.log("Found Google image, attempting upload:", imageUrl);
        try {
          const { supabaseAdmin } = await import("@/lib/supabase");
          
          // Fetch the image
          const response = await fetch(imageUrl);
          const buffer = await response.arrayBuffer();
          
          const uniqueIdentifier = user.id || crypto.randomUUID();
          const fileName = `${uniqueIdentifier}_${Date.now()}.jpg`;
          
          // Upload to Supabase
          const { data, error } = await supabaseAdmin
            .storage
            .from('avatars')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (!error && data) {
            // Get public URL
            const { data: { publicUrl } } = supabaseAdmin
              .storage
              .from('avatars')
              .getPublicUrl(fileName);
              
            console.log("Upload successful, new URL:", publicUrl);
            imageUrl = publicUrl;
          } else {
            console.error("Error uploading to Supabase:", error);
          }
        } catch (e) {
          console.error("Failed to process Google image:", e);
        }
      } else {
        console.log("Image is not from Google or is missing:", imageUrl);
      }

      // Upsert user
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (!existingUser) {
        await db.insert(users).values({
          email: user.email,
          name: user.name,
          image: imageUrl,
        });

        notifyNewUser(user.name || "Unknown", user.email).catch((error) => {
          console.error("Failed to send new user notification:", error);
        });
      } else {
        // Update info if changed
        if (existingUser.name !== user.name || existingUser.image !== imageUrl) {
          await db.update(users)
            .set({ name: user.name, image: imageUrl })
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
          if (dbUser.image) {
            token.picture = dbUser.image;
          }
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
