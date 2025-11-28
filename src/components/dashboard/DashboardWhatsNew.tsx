"use client";

import Link from "next/link";
import { RecentRoute } from "@/app/actions";
import { Card } from "@/components/ui/Card";
import { RouteBadge } from "@/components/RouteBadge";
import { Sparkles, ArrowRight } from "lucide-react";
import { WALLS } from "@/lib/constants/walls";
import { parseDateString } from "@/lib/utils";

type DashboardWhatsNewProps = {
  recentRoutes: RecentRoute[];
};

function formatRelativeSetDate(setDateString: string | null): string {
  if (!setDateString) return "";

  const setDate = parseDateString(setDateString);
  const today = new Date();

  const setDateNormalized = new Date(setDate.getFullYear(), setDate.getMonth(), setDate.getDate());
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffInMilliseconds = todayNormalized.getTime() - setDateNormalized.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "set today";
  if (diffInDays === 1) return "set yesterday";
  if (diffInDays < 7) return `set ${diffInDays} days ago`;
  if (diffInDays < 14) return "set last week";
  return `set ${Math.floor(diffInDays / 7)} weeks ago`;
}

function getMostRecentSetDate(routes: RecentRoute[]): string | null {
  const routesWithDates = routes.filter((r) => r.set_date);
  if (routesWithDates.length === 0) return null;

  return routesWithDates.reduce(
    (mostRecent, route) => {
      if (!mostRecent) return route.set_date;
      return parseDateString(route.set_date).getTime() > parseDateString(mostRecent).getTime()
        ? route.set_date
        : mostRecent;
    },
    null as string | null
  );
}

export default function DashboardWhatsNew({ recentRoutes }: DashboardWhatsNewProps) {
  const routesByWall = recentRoutes.reduce(
    (acc, route) => {
      const wallId = route.wall_id;
      if (!acc[wallId]) {
        acc[wallId] = [];
      }
      acc[wallId].push(route);
      return acc;
    },
    {} as Record<string, RecentRoute[]>
  );

  const wallIds = Object.keys(routesByWall);

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          What&apos;s New
        </h2>
      </div>

      {recentRoutes.length === 0 ? (
        <Card className="p-6 text-center text-slate-400">No new routes this week.</Card>
      ) : (
        <div className="space-y-4">
          {wallIds.slice(0, 3).map((wallId) => {
            const wall = WALLS.find((w) => w.id === wallId);
            const wallName = wall?.name || wallId;
            const wallRoutes = routesByWall[wallId];

            return (
              <div key={wallId}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {wallName}
                    {getMostRecentSetDate(wallRoutes) && (
                      <span className="text-slate-400 font-medium normal-case ml-2">
                        • {formatRelativeSetDate(getMostRecentSetDate(wallRoutes))}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/sets/${wallId}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    View Wall
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wallRoutes.map((route) => (
                    <Link key={route.id} href={`/route/${route.id}`}>
                      <RouteBadge
                        route={{
                          id: route.id,
                          grade: route.grade,
                          difficulty_label: route.difficulty_label,
                          color: route.color,
                          wall_id: route.wall_id,
                          setter_name: route.setter_name,
                          set_date: route.set_date,
                        }}
                        showWallName={false}
                        size="sm"
                        className="hover:scale-105 transition-transform cursor-pointer"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {wallIds.length > 3 && (
            <Link
              href="/sets"
              className="block text-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors py-2"
            >
              View {wallIds.length - 3} more walls with new routes
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
