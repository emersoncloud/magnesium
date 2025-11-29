"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export function CapacitorStatusBar() {
  useEffect(() => {
    const isRunningInCapacitorApp = Capacitor.isNativePlatform();
    const currentPlatform = Capacitor.getPlatform();

    console.log(
      "[CapacitorStatusBar] Platform:",
      currentPlatform,
      "Native:",
      isRunningInCapacitorApp
    );

    if (isRunningInCapacitorApp) {
      console.log("[CapacitorStatusBar] Setting status bar to black");
      StatusBar.setBackgroundColor({ color: "#000000" })
        .then(() => console.log("[CapacitorStatusBar] Background color set"))
        .catch((e) => console.error("[CapacitorStatusBar] Error:", e));
      StatusBar.setStyle({ style: Style.Light });

      if (currentPlatform === "android") {
        document.documentElement.style.setProperty("--safe-area-top", "24px");
      }
    }
  }, []);

  return null;
}
