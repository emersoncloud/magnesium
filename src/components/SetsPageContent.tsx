"use client";

import { WALLS } from "@/lib/constants/walls";
import { SetCard } from "@/components/SetCard";
import RouteBrowser from "@/components/RouteBrowser";
import { BrowserRoute, UpcomingRouteData } from "@/app/actions";
import { LayoutGrid, List } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { parseDateString } from "@/lib/utils";

type Route = {
  id: string;
  wall_id: string;
  grade: string;
  color: string;
  setter_name: string;
  set_date: string;
  status: string;
  attributes: string[] | null;
  difficulty_label: string | null;
  setter_notes: string | null;
  setter_beta: string | null;
  style: string | null;
  hold_type: string | null;
};

type Wall = {
  id: string;
  name: string;
  type: string;
};

type ViewMode = "location" | "list";

interface SetsPageContentProps {
  allRoutes: Route[];
  browserRoutes: BrowserRoute[];
  upcomingRoutes: UpcomingRouteData[];
}

export default function SetsPageContent({
  allRoutes,
  browserRoutes,
  upcomingRoutes,
}: SetsPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewMode: ViewMode = searchParams.get("view") === "list" ? "list" : "location";

  const setViewMode = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "list") {
      params.set("view", "list");
    } else {
      params.delete("view");
    }
    router.replace(`/sets?${params.toString()}`, { scroll: false });
  };

  const activeRoutes = allRoutes.filter((route) => route.status === "active");

  const routesByWall = activeRoutes.reduce(
    (acc, route) => {
      const wallId = route.wall_id;
      if (!acc[wallId]) acc[wallId] = [];
      acc[wallId].push(route);
      return acc;
    },
    {} as Record<string, typeof activeRoutes>
  );

  const upcomingRoutesByWall = upcomingRoutes.reduce(
    (acc, route) => {
      const wallId = route.wall_id;
      if (!acc[wallId]) acc[wallId] = [];
      acc[wallId].push({ grade: route.grade, color: route.color });
      return acc;
    },
    {} as Record<string, { grade: string; color: string }[]>
  );

  const renderWallCard = (wall: Wall, index: number, total: number) => {
    const wallRoutes = routesByWall[wall.id] || [];
    const routeCount = wallRoutes.length;
    const wallUpcomingRoutes = upcomingRoutesByWall[wall.id] || [];

    let mostRecentDate = null;
    if (wallRoutes.length > 0) {
      mostRecentDate = wallRoutes.reduce((latest, route) => {
        return !latest ||
          parseDateString(route.set_date).getTime() > parseDateString(latest).getTime()
          ? route.set_date
          : latest;
      }, wallRoutes[0].set_date);
    }

    const allColorsForWall = wallRoutes.map((r) => r.color);
    const uniqueColors = Array.from(new Set(allColorsForWall));

    return (
      <div
        key={wall.id}
        className="relative group md:[&:nth-child(2n)_>_.connector]:hidden lg:[&:nth-child(2n)_>_.connector]:block lg:[&:nth-child(3n)_>_.connector]:hidden"
      >
        {index < total - 1 && (
          <div className="connector hidden md:block absolute top-1/2 left-full w-12 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        )}

        <SetCard
          wallId={wall.id}
          wallName={wall.name}
          routeCount={routeCount}
          date={mostRecentDate || undefined}
          colors={uniqueColors}
          upcomingRoutes={wallUpcomingRoutes}
          className="h-full relative z-10"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 py-8 md:py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            Current Sets
          </h1>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
            What&apos;s on the wall
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode("location")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "location"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-10 h-10" />
            <span className="hidden sm:inline text-xl">By Location</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-10 h-10" />
            <span className="hidden sm:inline text-xl">As List</span>
          </button>
        </div>
      </div>

      {viewMode === "location" ? (
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Right to Left
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              {WALLS.map((wall, i) => renderWallCard(wall, i, WALLS.length))}
            </div>
          </div>
        </div>
      ) : (
        <RouteBrowser routes={browserRoutes} />
      )}
    </div>
  );
}
