"use client";

import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

interface GradeDisplayProps {
  grade: string;
  difficulty?: string | null;
  className?: string;
  variant?: "default" | "badge";
  showSecondary?: boolean;
}

export function GradeDisplay({
  grade,
  difficulty,
  className,
  variant = "default",
  showSecondary = true
}: GradeDisplayProps) {
  const { gradeDisplay } = useSettings();

  // If no difficulty is provided, just show the grade
  if (!difficulty) {
    return <span className={className}>{grade}</span>;
  }

  const isVScale = gradeDisplay === "v-scale";
  const primary = isVScale ? grade : difficulty;
  const secondary = isVScale ? difficulty : grade;

  if (variant === "badge") {
    if (!showSecondary) {
      return (
        <div className={cn("flex items-center justify-center leading-none", className)}>
          <span className="font-black text-sm whitespace-nowrap">{primary}</span>
        </div>
      );
    }
    return (
      <div className={cn("flex flex-col items-center leading-none", className)}>
        <span className="font-bold">{primary}</span>
        <span className="text-[0.6em] opacity-80 font-normal">{secondary}</span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="font-black tracking-tight">{primary}</span>
      {showSecondary && (
        <span className="text-[0.6em] text-slate-500 font-mono uppercase tracking-wider font-bold transform -translate-y-0.5">
          {secondary}
        </span>
      )}
    </div>
  );
}
