"use client";

import { Drawer as VaulDrawer } from "vaul";
import { Share, Plus, MoreVertical, X, Smartphone } from "lucide-react";

type Platform = "ios" | "android" | "desktop";

interface InstallAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  canPromptNativeInstall: boolean;
  onNativeInstall: () => Promise<void>;
  onDismiss: () => void;
}

function IOSInstructions() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center shrink-0">
          <Share className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-slate-900">1. Tap the Share button</p>
          <p className="text-sm text-slate-500">
            Look for the square with an arrow pointing up at the bottom of Safari
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-slate-900">2. Tap &quot;Add to Home Screen&quot;</p>
          <p className="text-sm text-slate-500">Scroll down in the share menu to find it</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600 font-bold text-sm">Add</span>
        </div>
        <div>
          <p className="font-bold text-slate-900">3. Tap &quot;Add&quot;</p>
          <p className="text-sm text-slate-500">In the top right corner to finish</p>
        </div>
      </div>
    </div>
  );
}

function AndroidInstructions({
  onNativeInstall,
  canPromptNativeInstall,
}: {
  onNativeInstall: () => Promise<void>;
  canPromptNativeInstall: boolean;
}) {
  if (canPromptNativeInstall) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">
          Click the button below to add this app to your home screen for quick access.
        </p>
        <button
          onClick={onNativeInstall}
          className="w-full py-3 px-4 bg-black text-white font-bold hover:bg-slate-800 transition-colors"
        >
          Install App
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-green-100 flex items-center justify-center shrink-0">
          <MoreVertical className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-slate-900">1. Tap the menu button</p>
          <p className="text-sm text-slate-500">The three dots in the top right corner of Chrome</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-green-100 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-slate-900">2. Tap &quot;Add to Home screen&quot;</p>
          <p className="text-sm text-slate-500">Or &quot;Install app&quot; if you see it</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-green-100 flex items-center justify-center shrink-0">
          <span className="text-green-600 font-bold text-sm">Add</span>
        </div>
        <div>
          <p className="font-bold text-slate-900">3. Confirm</p>
          <p className="text-sm text-slate-500">Tap &quot;Add&quot; to finish</p>
        </div>
      </div>
    </div>
  );
}

function DesktopInstructions({
  onNativeInstall,
  canPromptNativeInstall,
}: {
  onNativeInstall: () => Promise<void>;
  canPromptNativeInstall: boolean;
}) {
  if (canPromptNativeInstall) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">
          Click the button below to install this app for quick access from your desktop.
        </p>
        <button
          onClick={onNativeInstall}
          className="w-full py-3 px-4 bg-black text-white font-bold hover:bg-slate-800 transition-colors"
        >
          Install App
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        Look for the install icon in your browser&apos;s address bar, or use your browser&apos;s
        menu to &quot;Install app&quot; or &quot;Add to Home screen&quot;.
      </p>
    </div>
  );
}

export default function InstallAppDrawer({
  isOpen,
  onClose,
  platform,
  canPromptNativeInstall,
  onNativeInstall,
  onDismiss,
}: InstallAppDrawerProps) {
  const handleDismiss = () => {
    onDismiss();
    onClose();
  };

  const platformLabel =
    platform === "ios" ? "iPhone" : platform === "android" ? "Android" : "Desktop";

  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <VaulDrawer.Content className="bg-white fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] outline-none">
          <div className="p-6 pb-safe-area-bottom">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6" />

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rockmill/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-rockmill" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Install App</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase">
                    Detected: {platformLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8">
              {platform === "ios" && <IOSInstructions />}
              {platform === "android" && (
                <AndroidInstructions
                  onNativeInstall={onNativeInstall}
                  canPromptNativeInstall={canPromptNativeInstall}
                />
              )}
              {platform === "desktop" && (
                <DesktopInstructions
                  onNativeInstall={onNativeInstall}
                  canPromptNativeInstall={canPromptNativeInstall}
                />
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-4 border-t border-slate-100"
            >
              I want to navigate here by trying to remember the website and being confused how to
              get here again
            </button>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
