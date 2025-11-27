"use client";

import { Activity, Check, Zap, MessageSquare, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "", icon: <Activity className="w-4 h-4" /> },
  { label: "Sends", value: "SEND", icon: <Check className="w-4 h-4" /> },
  { label: "Flashes", value: "FLASH", icon: <Zap className="w-4 h-4" /> },
  { label: "Awards", value: "ACHIEVEMENT", icon: <Trophy className="w-4 h-4" /> },
  { label: "Comments", value: "COMMENT", icon: <MessageSquare className="w-4 h-4" /> },
  { label: "Ratings", value: "RATING", icon: <Star className="w-4 h-4" /> },
];

interface FeedFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  className?: string;
}

export default function FeedFilters({
  activeFilters,
  onFilterChange,
  className,
}: FeedFiltersProps) {
  const handleFilterClick = (value: string) => {
    if (value === "") {
      onFilterChange([]);
      return;
    }

    if (activeFilters.includes(value)) {
      const newFilters = activeFilters.filter((f) => f !== value);
      onFilterChange(newFilters);
    } else {
      onFilterChange([...activeFilters, value]);
    }
  };

  const isAllSelected = activeFilters.length === 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 w-max ml-1">
          {FILTER_OPTIONS.map((option) => {
            const isActive =
              option.value === "" ? isAllSelected : activeFilters.includes(option.value);

            return (
              <button
                key={option.value || "all"}
                onClick={() => handleFilterClick(option.value)}
                className={cn(
                  "inline-flex items-center px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transform -skew-x-12 border-2 transition-all whitespace-nowrap flex-shrink-0",
                  "hover:scale-105 active:scale-95",
                  isActive
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                )}
              >
                <span className="transform skew-x-12 flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
