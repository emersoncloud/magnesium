import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:translate-y-1 transform -skew-x-12 border-2 font-mono";

  const variants = {
    primary:
      "bg-black text-white border-black hover:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px]",
    secondary:
      "bg-white text-black border-black hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]",
    ghost:
      "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900 shadow-none transform-none",
    danger:
      "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]",
    accent:
      "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px]",
  };

  const sizes = {
    sm: "h-8 px-4 text-[10px]",
    md: "h-12 px-6 text-xs",
    lg: "h-14 px-8 text-sm",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      <span
        className={
          variant !== "ghost"
            ? "transform skew-x-12 inline-flex items-center gap-2"
            : "inline-flex items-center gap-2"
        }
      >
        {children}
      </span>
    </button>
  );
}
