"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Badge } from "@/components/ui/Badge";
import { cn, getRouteColor } from "@/lib/utils";
import { WALLS } from "@/lib/constants/walls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

// Define a subset of route props needed for display
interface RouteBadgeProps {
  id: string;
  grade: string;
  difficulty_label?: string | null;
  color: string;
  wall_id: string;
  setter_name: string;
  set_date: string;
  avg_rating?: number;
  comment_count?: number;
  style?: string | null;
  hold_type?: string | null;
}

export function RouteBadge({
  route,
  className = "",
  showWallName = true
}: {
  route: RouteBadgeProps;
  className?: string;
  showWallName?: boolean;
}) {
  const { showDifficulty } = useSettings();
  const label = showDifficulty ? (route.difficulty_label || route.grade) : route.grade;

  // Determine wall name
  const wallName = WALLS.find(w => w.id === route.wall_id)?.name || "Unknown Wall";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center group cursor-help", className)}>
            {/* Color Indicator - The Shard */}
            <div
              className="h-5 w-3 transform -skew-x-12 border-2 border-black border-r-0"
              style={{ backgroundColor: getRouteColor(route.color) }}
            />

            {/* Grade Label */}
            <div className="h-5 px-2 bg-white border-2 border-black flex items-center justify-center transform -skew-x-12 min-w-[2.5rem]">
              <span className="transform skew-x-12 font-mono text-xs font-bold uppercase tracking-wider">
                {label}
              </span>
            </div>

            {/* Location Label (Optional) */}
            {showWallName && (
              <div className="ml-1 h-5 px-2 bg-slate-100 border-2 border-black flex items-center justify-center transform -skew-x-12">
                <span className="transform skew-x-12 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {wallName}
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-0 bg-transparent border-0 shadow-none">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 min-w-[200px]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-black uppercase tracking-tighter text-lg leading-none">
                  {route.difficulty_label || route.grade}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full border border-black" style={{ backgroundColor: getRouteColor(route.color) }} />
                  <span className="text-xs font-mono text-slate-500 uppercase">{route.color} Route</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                {route.grade}
              </Badge>
            </div>

            <div className="space-y-2 border-t-2 border-slate-100 pt-2 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono uppercase">Location</span>
                <span className="font-bold">{wallName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono uppercase">Setter</span>
                <span className="font-bold">{route.setter_name || "Unknown"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono uppercase">Set Date</span>
                <span className="font-bold">{route.set_date ? new Date(route.set_date).toLocaleDateString() : "Unknown"}</span>
              </div>
              {(route.style || route.hold_type) && (
                <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap gap-2">
                  {route.style && (
                    <Badge variant="secondary" className="text-[10px] px-1 h-5 bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {route.style}
                    </Badge>
                  )}
                  {route.hold_type && (
                    <Badge variant="secondary" className="text-[10px] px-1 h-5 bg-orange-50 text-orange-700 hover:bg-orange-100">
                      {route.hold_type}
                    </Badge>
                  )}
                </div>
              )}

            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
