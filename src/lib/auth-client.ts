import { signIn } from "next-auth/react";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

export async function loginWithGoogle() {
  if (Capacitor.isNativePlatform()) {
    try {
      await SocialLogin.initialize({
        google: {
          webClientId: "499412392042-0od33amqe4e63erbjd4rgk937bqnhmj0.apps.googleusercontent.com",
          iOSClientId: "499412392042-jobevm2j3d30fptnabu20hth37hm5jrq.apps.googleusercontent.com",
          iOSServerClientId: "499412392042-0od33amqe4e63erbjd4rgk937bqnhmj0.apps.googleusercontent.com",
        },
      });
      const googleLoginResponse = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile"],
          forcePrompt: true,
        },
      });

      const googleResult = googleLoginResponse.result as { idToken?: string; accessToken?: unknown; profile?: unknown };

      if (!googleResult.idToken) {
        console.error("No idToken received from Google Sign-In. Response:", JSON.stringify(googleLoginResponse));
        throw new Error("Google Sign-In did not return an idToken");
      }

      await signIn("google-native", {
        idToken: googleResult.idToken,
        callbackUrl: "/sets",
      });
    } catch (nativeGoogleSignInError) {
      console.error("Native Google Sign-In failed:", nativeGoogleSignInError);
    }
  } else {
    signIn("google", { callbackUrl: "/sets" });
  }
}
