import { signIn } from "next-auth/react";

export async function loginWithGoogle() {
  signIn("google", { callbackUrl: "/overview" });
}
