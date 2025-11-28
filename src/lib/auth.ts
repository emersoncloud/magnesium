import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import * as jose from "jose";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyNewUser } from "@/lib/telegram";

// Google's public key set for verifying ID tokens
const GOOGLE_JWKS = jose.createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

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
          const { payload } = await jose.jwtVerify(credentials.idToken as string, GOOGLE_JWKS, {
            issuer: ["https://accounts.google.com", "accounts.google.com"],
            audience: process.env.GOOGLE_CLIENT_ID,
          });

          if (!payload.sub || !payload.email) return null;

          return {
            id: payload.sub,
            name: payload.name as string | undefined,
            email: payload.email as string,
            image: payload.picture as string | undefined,
          };
        } catch (error) {
          console.error("Error verifying Google ID token:", error);
          return null;
        }
      },
    }),
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
          const { data, error } = await supabaseAdmin.storage
            .from("avatars")
            .upload(fileName, buffer, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (!error && data) {
            // Get public URL
            const {
              data: { publicUrl },
            } = supabaseAdmin.storage.from("avatars").getPublicUrl(fileName);

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
          await db
            .update(users)
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
});

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = process.env.ADMIN_EMAILS?.split(",") || [];
  return admins.map((e) => e.trim()).includes(email);
}
