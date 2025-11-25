"use client";

import { Drawer as VaulDrawer } from "vaul";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

export default function Drawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);

  // If URL changed (e.g., browser back), don't render the drawer
  if (pathname !== initialPathRef.current) {
    return null;
  }

  const handleClose = () => {
    router.back();
  };

  return (
    <VaulDrawer.Root
      open
      onClose={handleClose}
      shouldScaleBackground
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <VaulDrawer.Content className="flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none overflow-hidden">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-12 h-1.5 flex-shrink-0 rounded-full bg-black/20" />
          <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-t-[10px] pt-8">
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
