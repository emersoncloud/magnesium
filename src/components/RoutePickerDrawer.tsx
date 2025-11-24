"use client";

import { useState, useMemo } from "react";
import { Drawer as VaulDrawer } from "vaul";
import { BrowserRoute } from "@/app/actions";
import { GRADES, WALLS } from "@/lib/constants/walls";
import { getRouteColor } from "@/lib/utils";
import { Search, X, Check, Zap } from "lucide-react";

interface RoutePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (route: BrowserRoute) => void;
  routes: BrowserRoute[];
  excludeRouteIds: Set<string>;
}

export default function RoutePickerDrawer({
  isOpen,
  onClose,
  onSelect,
  routes,
  excludeRouteIds,
}: RoutePickerDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [wallFilter, setWallFilter] = useState<string>("");

  const availableRoutes = useMemo(() => {
    return routes.filter((route) => !excludeRouteIds.has(route.id));
  }, [routes, excludeRouteIds]);

  const filteredRoutes = useMemo(() => {
    return availableRoutes.filter((route) => {
      const matchesSearch = searchQuery === "" ||
        route.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.wall_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (route.difficulty_label?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGrade = gradeFilter === "" || route.grade === gradeFilter;
      const matchesWall = wallFilter === "" || route.wall_id === wallFilter;

      return matchesSearch && matchesGrade && matchesWall;
    });
  }, [availableRoutes, searchQuery, gradeFilter, wallFilter]);

  const handleSelect = (route: BrowserRoute) => {
    onSelect(route);
    setSearchQuery("");
    setGradeFilter("");
    setWallFilter("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSearchQuery("");
      setGradeFilter("");
      setWallFilter("");
    }
  };

  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={handleOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <VaulDrawer.Content className="flex flex-col rounded-t-[10px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none overflow-hidden bg-white">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-12 h-1.5 flex-shrink-0 rounded-full bg-black/20" />

          <div className="flex-1 overflow-hidden flex flex-col pt-8">
            <div className="px-4 pb-4 border-b border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Select Route</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routes..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockmill focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rockmill"
                >
                  <option value="">All Grades</option>
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>

                <select
                  value={wallFilter}
                  onChange={(e) => setWallFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rockmill"
                >
                  <option value="">All Walls</option>
                  {WALLS.map((wall) => (
                    <option key={wall.id} value={wall.id}>
                      {wall.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-500">
                {filteredRoutes.length} routes available
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => handleSelect(route)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-rockmill hover:bg-slate-50 transition-all text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: getRouteColor(route.color) }}
                    >
                      {route.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">
                        {route.difficulty_label || route.grade}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        {WALLS.find((w) => w.id === route.wall_id)?.name || route.wall_id}
                      </div>
                    </div>
                    {route.user_status && (
                      <div className="flex-shrink-0">
                        {route.user_status === "FLASH" ? (
                          <Zap className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {filteredRoutes.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No routes found matching your filters.
                </div>
              )}
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
