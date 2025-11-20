import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
}
