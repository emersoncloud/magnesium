"use client";

import { Drawer as VaulDrawer } from "vaul";
import { BrowserRoute } from "@/app/actions";
import { X } from "lucide-react";
import RouteBrowser from "./RouteBrowser";

interface RoutePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (route: BrowserRoute) => void;
  routes: BrowserRoute[];
  excludeRouteIds: Set<string>;
}

export default function RoutePickerDrawer({
  isOpen,
  onClose,
  onSelect,
  routes,
  excludeRouteIds,
}: RoutePickerDrawerProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleSelect = (route: BrowserRoute) => {
    onSelect(route);
    onClose();
  };

  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={handleOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <VaulDrawer.Content className="flex flex-col rounded-t-[10px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none overflow-hidden bg-white">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-12 h-1.5 flex-shrink-0 rounded-full bg-black/20" />

          <div className="flex-1 overflow-hidden flex flex-col pt-8">
            <div className="px-4 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Select Route</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              <RouteBrowser
                routes={routes}
                onSelect={handleSelect}
                excludeRouteIds={excludeRouteIds}
              />
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
