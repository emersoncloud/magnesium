import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-300  shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]",
      className
    )}>
      {children}
    </div>
  );
}
