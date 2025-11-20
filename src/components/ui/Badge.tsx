import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  color?: string;
}

export function Badge({ children, variant = "default", className = "", color }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  let variantStyles = "bg-slate-900 text-slate-50 hover:bg-slate-900/80";
  if (variant === "secondary") variantStyles = "bg-slate-100 text-slate-900 hover:bg-slate-100/80";
  if (variant === "outline") variantStyles = "text-slate-950 border border-slate-200";

  // Custom color override
  const style = color ? { backgroundColor: color, color: "white", borderColor: color } : {};

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} style={style}>
      {children}
    </div>
  );
}
