"use client";

import { useState } from "react";
import { Settings2, Megaphone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

export default function SettingsFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBeta, setShowBeta] = useState(true); // Local state for beta toggle (visual only for now?)
  const { gradeDisplay, toggleGradeDisplay, shareActivity, toggleShareActivity } = useSettings();

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200 min-w-[220px]">
          <div className="flex flex-col gap-4">
            {/* Grade Display Toggle */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase font-bold">V-Scale / Diff</span>
              <Switch
                checked={gradeDisplay === "difficulty"}
                onCheckedChange={() => toggleGradeDisplay()}
                className="data-[state=checked]:bg-rockmill"
              />
            </div>

            {/* Share Activity Toggle */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase font-bold">Share Activity</span>
              <Switch
                checked={shareActivity}
                onCheckedChange={() => toggleShareActivity()}
                className="data-[state=checked]:bg-rockmill"
              />
            </div>

            {/* Show Beta Toggle (Visual placeholder or local state if needed globally later) */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase font-bold">Show Beta</span>
              <Switch
                checked={showBeta}
                onCheckedChange={setShowBeta}
                className="data-[state=checked]:bg-rockmill"
              />
            </div>

            {/* Feedback Button */}
            <button
              id="beta-button"
              className="w-full bg-rockmill text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center py-2 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xs uppercase tracking-widest gap-2"
            >
              Feedback
              <Megaphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 bg-rockmill text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all",
          isOpen && "translate-y-1 shadow-none"
        )}
      >
        <Settings2 className={cn("w-6 h-6 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
    </div>
  );
}
