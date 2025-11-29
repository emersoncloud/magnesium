import { signIn } from "next-auth/react";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

export async function loginWithGoogle() {
  if (Capacitor.isNativePlatform()) {
    try {
      console.log("[GoogleAuth] Starting native Google Sign-In...");

      console.log("[GoogleAuth] Initializing SocialLogin plugin...");
      await SocialLogin.initialize({
        google: {
          webClientId: "499412392042-0od33amqe4e63erbjd4rgk937bqnhmj0.apps.googleusercontent.com",
          iOSClientId: "499412392042-jobevm2j3d30fptnabu20hth37hm5jrq.apps.googleusercontent.com",
          iOSServerClientId:
            "499412392042-0od33amqe4e63erbjd4rgk937bqnhmj0.apps.googleusercontent.com",
        },
      });
      console.log("[GoogleAuth] SocialLogin initialized successfully");

      console.log("[GoogleAuth] Calling SocialLogin.login()...");
      const googleLoginResponse = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile"],
          forcePrompt: true,
        },
      });
      console.log(
        "[GoogleAuth] SocialLogin.login() returned:",
        JSON.stringify(googleLoginResponse)
      );

      const googleResult = googleLoginResponse.result as {
        idToken?: string;
        accessToken?: unknown;
        profile?: unknown;
      };

      if (!googleResult.idToken) {
        console.error(
          "[GoogleAuth] No idToken received from Google Sign-In. Response:",
          JSON.stringify(googleLoginResponse)
        );
        throw new Error("Google Sign-In did not return an idToken");
      }

      console.log("[GoogleAuth] Got idToken, calling signIn('google-native')...");
      await signIn("google-native", {
        idToken: googleResult.idToken,
        callbackUrl: "/overview",
      });
      console.log("[GoogleAuth] signIn completed");
    } catch (nativeGoogleSignInError) {
      console.error("[GoogleAuth] Native Google Sign-In failed:", nativeGoogleSignInError);
    }
  } else {
    signIn("google", { callbackUrl: "/overview" });
  }
}
