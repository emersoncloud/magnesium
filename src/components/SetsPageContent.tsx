'use client'

import { useState } from "react";
import { WALLS } from "@/lib/constants/walls";
import { SetCard } from "@/components/SetCard";
import RouteBrowser from "@/components/RouteBrowser";
import { BrowserRoute } from "@/app/actions";
import { LayoutGrid, List } from "lucide-react";

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
}

export default function SetsPageContent({ allRoutes, browserRoutes }: SetsPageContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("location");

  const activeRoutes = allRoutes.filter(route => route.status === "active");

  const routesByWall = activeRoutes.reduce((acc, route) => {
    const wallId = route.wall_id;
    if (!acc[wallId]) acc[wallId] = [];
    acc[wallId].push(route);
    return acc;
  }, {} as Record<string, typeof activeRoutes>);

  const bigSectionWalls = WALLS.slice(0, 9);
  const smallSectionWalls = WALLS.slice(9);

  const renderWallCard = (wall: Wall, index: number, total: number) => {
    const wallRoutes = routesByWall[wall.id] || [];
    const routeCount = wallRoutes.length;

    let mostRecentDate = null;
    if (wallRoutes.length > 0) {
      mostRecentDate = wallRoutes.reduce((latest, route) => {
        return !latest || new Date(route.set_date) > new Date(latest) ? route.set_date : latest;
      }, wallRoutes[0].set_date);
    }

    const allColorsForWall = wallRoutes.map(r => r.color);
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
          className="h-full relative z-10"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 py-8 md:py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wider">
          Sets
        </h1>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode("location")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "location"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">By Location</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">As List</span>
          </button>
        </div>
      </div>

      {viewMode === "location" ? (
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Big Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              {bigSectionWalls.map((wall, i) => renderWallCard(wall, i, bigSectionWalls.length))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Small Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              {smallSectionWalls.map((wall, i) => renderWallCard(wall, i, smallSectionWalls.length))}
            </div>
          </div>
        </div>
      ) : (
        <RouteBrowser routes={browserRoutes} />
      )}
    </div>
  );
}
