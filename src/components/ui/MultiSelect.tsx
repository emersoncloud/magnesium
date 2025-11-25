"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onChange(next);
  };

  const displayLabel = selected.size > 0
    ? `${label} (${selected.size})`
    : `All ${label}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full bg-white border-2 px-3 py-2 text-xs font-mono uppercase tracking-widest text-left flex items-center justify-between gap-2",
          selected.size > 0 ? "border-black" : "border-black"
        )}
      >
        <span className={selected.size > 0 ? "text-black" : "text-slate-600"}>
          {displayLabel}
        </span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-lg max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => toggle(option.value)}
              className="w-full px-3 py-2 text-xs font-mono uppercase tracking-widest text-left flex items-center justify-between hover:bg-slate-50"
            >
              <span>{option.label}</span>
              {selected.has(option.value) && (
                <Check className="w-3 h-3 text-black" />
              )}
            </button>
          ))}
          {selected.size > 0 && (
            <button
              onClick={() => onChange(new Set())}
              className="w-full px-3 py-2 text-xs font-mono uppercase tracking-widest text-left text-slate-400 hover:bg-slate-50 border-t border-slate-100"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
