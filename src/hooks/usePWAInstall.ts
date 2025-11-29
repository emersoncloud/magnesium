"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop";

type PWAInstallState = {
  isStandalone: boolean;
  isDismissed: boolean;
  platform: Platform;
  canPromptNativeInstall: boolean;
  showInstallButton: boolean;
  promptNativeInstall: () => Promise<void>;
  dismissInstall: () => void;
};

const DISMISS_STORAGE_KEY = "pwa-install-dismissed";

function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const userAgent = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isAndroid = /android/i.test(userAgent);

  if (isIOS) return "ios";
  if (isAndroid) return "android";
  return "desktop";
}

function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const displayModeStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const navigatorStandalone =
    (navigator as unknown as { standalone?: boolean }).standalone === true;

  return displayModeStandalone || navigatorStandalone;
}

function getIsDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DISMISS_STORAGE_KEY) === "true";
}

function subscribeToDisplayMode(callback: () => void): () => void {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissedState, setIsDismissedState] = useState(false);

  const isStandalone = useSyncExternalStore(subscribeToDisplayMode, getIsStandalone, () => false);

  const platform = useSyncExternalStore(
    () => () => {},
    getPlatform,
    () => "desktop" as Platform
  );

  const isDismissed = useSyncExternalStore(
    () => () => {},
    () => isDismissedState || getIsDismissed(),
    () => false
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const promptNativeInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismissInstall = useCallback(() => {
    localStorage.setItem(DISMISS_STORAGE_KEY, "true");
    setIsDismissedState(true);
  }, []);

  const canPromptNativeInstall = deferredPrompt !== null;
  const showInstallButton = !isStandalone && !isDismissed;

  return {
    isStandalone,
    isDismissed,
    platform,
    canPromptNativeInstall,
    showInstallButton,
    promptNativeInstall,
    dismissInstall,
  };
}
