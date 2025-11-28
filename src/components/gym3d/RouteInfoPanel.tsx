"use client";

import { BrowserRoute } from "@/app/actions";
import { getRouteColor, cn, parseDateString } from "@/lib/utils";
import { X, Star, MessageSquare, Zap, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { WALLS } from "@/lib/constants/walls";

type RouteInfoPanelProps = {
  route: BrowserRoute;
  onClose: () => void;
};

export function RouteInfoPanel({ route, onClose }: RouteInfoPanelProps) {
  const wall = WALLS.find((w) => w.id === route.wall_id);

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-0 md:left-auto md:right-0 md:w-96 z-50 animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
      <div className="bg-black/80 backdrop-blur-lg rounded-t-2xl md:rounded-none md:rounded-l-2xl border-t md:border-t-0 md:border-l border-white/10 p-4 max-h-[60vh] md:max-h-screen md:h-screen overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-16 h-16 rounded-xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: getRouteColor(route.color) }}
          >
            <div className="bg-white/40 backdrop-blur-[2px] rounded-lg px-2 py-1">
              <span className="font-black text-black text-lg">{route.grade}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                style={{
                  backgroundColor: getRouteColor(route.color),
                  color: route.color === "Black" ? "white" : "black",
                }}
              >
                {route.color}
              </span>
              {route.difficulty_label && (
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs font-medium">
                  {route.difficulty_label}
                </span>
              )}
            </div>
            <p className="text-white/60 text-sm">
              {wall?.name} • {wall?.type}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {route.user_status && (
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium",
                  route.user_status === "FLASH"
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                )}
              >
                {route.user_status === "FLASH" ? (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Flashed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Sent
                  </>
                )}
              </div>
            )}

            {route.avg_rating > 0 && (
              <div className="flex items-center gap-1 text-white/80">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{route.avg_rating.toFixed(1)}</span>
              </div>
            )}

            {route.comment_count > 0 && (
              <div className="flex items-center gap-1 text-white/60">
                <MessageSquare className="w-4 h-4" />
                <span>{route.comment_count}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Setter</p>
              <p className="text-white/90">{route.setter_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Set Date</p>
              <p className="text-white/90">
                {parseDateString(route.set_date).toLocaleDateString()}
              </p>
            </div>
            {route.style && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Style</p>
                <p className="text-white/90">{route.style}</p>
              </div>
            )}
            {route.hold_type && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Holds</p>
                <p className="text-white/90">{route.hold_type}</p>
              </div>
            )}
          </div>

          {route.attributes && route.attributes.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1.5">Attributes</p>
              <div className="flex flex-wrap gap-1.5">
                {route.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/80"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/route/${route.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            View Full Details
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
