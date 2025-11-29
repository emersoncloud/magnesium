"use client";

import { useState } from "react";
import { GRADES } from "@/lib/constants/walls";
import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityLog = {
  action_type: string;
  route_grade: string | null;
  route_label: string | null;
};

export default function GradeChart({
  activity,
  externalMode,
  hideControls = false,
}: {
  activity: ActivityLog[];
  externalMode?: "V-SCALE" | "DIFFICULTY";
  hideControls?: boolean;
}) {
  const [localMode, setLocalMode] = useState<"V-SCALE" | "DIFFICULTY">("V-SCALE");
  const mode = externalMode || localMode;
  const setMode = setLocalMode; // We only set local mode, external must be controlled by parent

  // Process Data
  const data =
    mode === "V-SCALE"
      ? GRADES.map((g) => ({ label: g, key: g }))
      : [
          { label: "Intro", key: "intro" },
          { label: "Easy", key: "easy" },
          { label: "Mod", key: "mod" },
          { label: "Hard", key: "hard" },
          { label: "Extreme", key: "extreme" },
        ];

  const stats = data.map((item) => {
    const relevant = activity.filter((a) => {
      if (mode === "V-SCALE") return a.route_grade === item.key;
      // Fuzzy match for labels
      return a.route_label?.toLowerCase().includes(item.key);
    });

    return {
      label: item.label,
      sends: relevant.filter((a) => a.action_type === "SEND").length,
      flashes: relevant.filter((a) => a.action_type === "FLASH").length,
      attempts: relevant.filter((a) => a.action_type === "ATTEMPT").length,
    };
  });

  const maxVal = Math.max(...stats.map((s) => s.sends + s.flashes + s.attempts), 1);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Grade Distribution
        </h3>

        {!hideControls && (
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode("V-SCALE")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                mode === "V-SCALE"
                  ? "bg-white shadow text-black"
                  : "text-slate-500 hover:text-black"
              )}
            >
              V-Scale
            </button>
            <button
              onClick={() => setMode("DIFFICULTY")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                mode === "DIFFICULTY"
                  ? "bg-white shadow text-black"
                  : "text-slate-500 hover:text-black"
              )}
            >
              Difficulty
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {stats.map((stat) => {
          if (stat.sends + stat.flashes + stat.attempts === 0) return null;

          const total = stat.sends + stat.flashes + stat.attempts;
          const width = (total / maxVal) * 100;

          return (
            <div key={stat.label} className="flex items-center gap-4 text-sm">
              <div className="w-12 font-bold text-slate-700 text-right">{stat.label}</div>
              <div className="flex-1 h-8 bg-slate-50 rounded-r-lg relative overflow-hidden flex">
                {/* Stacked Bar */}
                {stat.flashes > 0 && (
                  <div
                    style={{ width: `${(stat.flashes / total) * width}%` }}
                    className="h-full bg-yellow-400 relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {stat.flashes} Flashes
                    </div>
                  </div>
                )}
                {stat.sends > 0 && (
                  <div
                    style={{ width: `${(stat.sends / total) * width}%` }}
                    className="h-full bg-green-500 relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {stat.sends} Sends
                    </div>
                  </div>
                )}
                {stat.attempts > 0 && (
                  <div
                    style={{ width: `${(stat.attempts / total) * width}%` }}
                    className="h-full bg-slate-300 relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {stat.attempts} Attempts
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 text-xs text-slate-400 font-mono text-right">{total}</div>
            </div>
          );
        })}
        {stats.every((s) => s.sends + s.flashes + s.attempts === 0) && (
          <div className="text-center text-slate-400 italic py-8">No climbing data yet.</div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-sm" /> Flash
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm" /> Send
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-300 rounded-sm" /> Attempt
        </div>
      </div>
    </Card>
  );
}
