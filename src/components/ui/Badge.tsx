import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "accent";
  className?: string;
  color?: string;
}

export function Badge({ children, variant = "default", className = "", color }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-widest transform -skew-x-12 transition-colors font-mono border-2";

  const variants = {
    default: "bg-black text-white border-black hover:bg-slate-900",
    secondary: "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200",
    outline: "bg-transparent text-slate-900 border-slate-900 hover:bg-slate-50",
    accent: "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500",
  };

  // Custom color override
  const style = color ? { backgroundColor: color, color: "white", borderColor: color } : {};

  return (
    <div className={cn(baseStyles, variants[variant], className)} style={style}>
      <span className="transform skew-x-12 inline-block">{children}</span>
    </div>
  );
}
