"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        onClick={() => onCheckedChange?.(!checked)}
        ref={ref}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border-2 border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-200 data-[state=checked]:bg-black",
          className
        )}
        {...props}
      >
        <span
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block h-4 w-4 bg-black shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-white"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
