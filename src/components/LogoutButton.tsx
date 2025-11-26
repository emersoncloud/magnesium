"use client";

import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { logout } from "@/app/actions";

export function LogoutButton() {
  const handleLogout = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await SocialLogin.logout({ provider: "google" });
      } catch (error) {
        console.error("Native Google Sign-Out failed:", error);
      }
    }
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
    >
      Log Out
    </button>
  );
}
