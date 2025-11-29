"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono",
          description: "group-[.toast]:text-slate-500",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
