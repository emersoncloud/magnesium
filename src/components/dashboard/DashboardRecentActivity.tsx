"use client";

import Link from "next/link";
import { User } from "next-auth";
import { GlobalActivityItem } from "@/app/actions";
import { Card } from "@/components/ui/Card";
import { RouteBadge } from "@/components/RouteBadge";
import { Check, Zap, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardRecentActivityProps = {
  user: User | null;
  userActivity: GlobalActivityItem[] | null;
  globalActivity: GlobalActivityItem[];
};

export default function DashboardRecentActivity({
  user,
  globalActivity,
}: DashboardRecentActivityProps) {
  const emptyMessage = user
    ? "No activity yet. Go climb something!"
    : "No recent activity in the community.";

  const timeAgo = (date: Date | null) => {
    if (!date) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const sendsAndFlashes = globalActivity.filter(
    (item) =>
      item.action_type === "SEND" || item.action_type === "FLASH" || item.action_type === "COMMENT"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </h2>
        {user && (
          <Link
            href={`/profile/${user.id}`}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {sendsAndFlashes.length === 0 ? (
        <Card className="p-6 text-center text-slate-400">{emptyMessage}</Card>
      ) : (
        <div className="space-y-3">
          {sendsAndFlashes.slice(0, 5).map((item) => {
            const isFlash = item.action_type === "FLASH";
            const firstName = item.user_name?.split(" ")[0] || "Someone";

            return (
              <Link key={item.id} href={`/route/${item.route_id}`}>
                <Card
                  className={cn(
                    "p-3 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md",
                    isFlash ? "border-l-4 border-l-yellow-400" : "border-l-4 border-l-green-500"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center flex-shrink-0",
                      isFlash ? "bg-yellow-100" : "bg-green-100"
                    )}
                  >
                    {isFlash ? (
                      <Zap className="w-4 h-4 text-yellow-600 fill-current" />
                    ) : (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700 truncate">{firstName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {isFlash ? "Flashed" : "Sent"}
                      </span>
                    </div>
                    {item.route_id && (
                      <RouteBadge
                        route={{
                          id: item.route_id,
                          grade: item.route_grade || "?",
                          difficulty_label: item.route_label,
                          color: item.route_color || "gray",
                          wall_id: item.wall_id || "unknown",
                          setter_name: item.setter_name || "Unknown",
                          set_date: item.set_date || new Date().toISOString(),
                        }}
                        className="scale-90 origin-left"
                        showWallName={true}
                      />
                    )}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
                    {timeAgo(item.created_at)}
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
