"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { GradeDisplay } from "@/components/GradeDisplay";
import { Badge } from "@/components/ui/Badge";
import { cn, getRouteColor } from "@/lib/utils";
import { WALLS } from "@/lib/constants/walls";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

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
  showWallName = true,
  showSetDate = false,
  size = "default",
}: {
  route: RouteBadgeProps;
  className?: string;
  showWallName?: boolean;
  showSetDate?: boolean;
  size?: "default" | "sm";
}) {
  const isSmall = size === "sm";
  const heightClass = isSmall ? "h-6" : "h-8";
  const colorIndicatorWidth = isSmall ? "w-3" : "w-4";
  const paddingClass = isSmall ? "px-2" : "px-3";
  const gradeTextSize = isSmall ? "text-sm" : "text-lg";
  const labelTextSize = isSmall ? "text-[10px]" : "text-xs";
  const wallName = WALLS.find((w) => w.id === route.wall_id)?.name || "Unknown Wall";

  // Parse the YYYY-MM-DD string and display it directly without timezone conversion
  const formattedDate = route.set_date
    ? (() => {
        const [y, m, d] = route.set_date.split("-").map(Number);
        // Create date using local time components to avoid timezone shift
        // or just format the string directly since we have the parts
        return `${m}/${d}`;
      })()
    : "";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex w-full items-center group cursor-help", className)}>
          <div
            className={cn(heightClass, colorIndicatorWidth, "transform border-r-0 shrink-0")}
            style={{ backgroundColor: getRouteColor(route.color) }}
          />

          <div
            className={cn(
              heightClass,
              paddingClass,
              "bg-white flex items-center justify-center transform min-w-[2rem]"
            )}
          >
            <GradeDisplay
              grade={route.grade}
              difficulty={route.difficulty_label}
              variant="badge"
              className={cn("transform", gradeTextSize)}
              showSecondary={false}
            />
          </div>

          {showWallName && (
            <div
              className={cn(
                "ml-1",
                heightClass,
                paddingClass,
                "bg-slate-100 flex items-center justify-center transform"
              )}
            >
              <span
                className={cn(
                  "transform font-mono font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap",
                  labelTextSize
                )}
              >
                {wallName}
              </span>
            </div>
          )}

          {showSetDate && formattedDate && (
            <div
              className={cn(
                "ml-1",
                heightClass,
                paddingClass,
                "bg-slate-100 flex items-center justify-center transform"
              )}
            >
              <span
                className={cn(
                  "transform font-mono font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap",
                  labelTextSize
                )}
              >
                {formattedDate}
              </span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-0 bg-transparent border-0 shadow-none">
        <div className="bg-white  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 min-w-[200px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-black uppercase tracking-tighter text-lg leading-none">
                <GradeDisplay
                  grade={route.grade}
                  difficulty={route.difficulty_label}
                  className="text-lg"
                />
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-2 h-2 rounded-full border border-black"
                  style={{ backgroundColor: getRouteColor(route.color) }}
                />
                <span className="text-xs font-mono text-slate-500 uppercase">
                  {route.color} Route
                </span>
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
              <span className="font-bold">
                {route.set_date
                  ? (() => {
                      const [y, m, d] = route.set_date.split("-").map(Number);
                      return `${m}/${d}/${y}`;
                    })()
                  : "Unknown"}
              </span>
            </div>
            {(route.style || route.hold_type) && (
              <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {route.style && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1 h-5 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {route.style}
                  </Badge>
                )}
                {route.hold_type && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1 h-5 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    {route.hold_type}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
