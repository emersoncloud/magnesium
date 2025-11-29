"use client";

import { BrowserRoute, generateRoutePlan, RoutePlan } from "@/app/actions";
import RoutePlanView from "./RoutePlanView";
import { WALLS, GRADES } from "@/lib/constants/walls";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { ArrowUpDown, Check, Zap, Star, MessageSquare, Filter, Map, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { getRouteColor, parseDateString } from "@/lib/utils";
import { GradeDisplay } from "@/components/GradeDisplay";

type SortField =
  | "grade"
  | "color"
  | "wall_id"
  | "avg_rating"
  | "comment_count"
  | "set_date"
  | "setter_name"
  | "style"
  | "hold_type";
type SortDirection = "asc" | "desc";

interface RouteBrowserProps {
  routes: BrowserRoute[];
  onSelect?: (route: BrowserRoute) => void;
  excludeRouteIds?: Set<string>;
}

// Helper to parse Set from URL param
const parseSetParam = (param: string | null): Set<string> => {
  if (!param) return new Set();
  return new Set(param.split(",").filter(Boolean));
};

export default function RouteBrowser({ routes, onSelect, excludeRouteIds }: RouteBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const filterWalls = parseSetParam(searchParams.get("walls"));
  const filterGrades = parseSetParam(searchParams.get("grades"));
  const filterStyles = parseSetParam(searchParams.get("styles"));
  const filterHolds = parseSetParam(searchParams.get("holds"));
  const filterSetters = parseSetParam(searchParams.get("setters"));
  const filterStatuses = parseSetParam(searchParams.get("status"));
  const sortField = (searchParams.get("sort") as SortField) || "set_date";
  const sortDirection = (searchParams.get("dir") as SortDirection) || "desc";

  // Update URL when filters change
  const updateParams = useCallback(
    (updates: Record<string, Set<string> | string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || (value instanceof Set && value.size === 0) || value === "") {
          params.delete(key);
        } else if (value instanceof Set) {
          params.set(key, Array.from(value).join(","));
        } else {
          params.set(key, value);
        }
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const setFilterWalls = (v: Set<string>) => updateParams({ walls: v });
  const setFilterGrades = (v: Set<string>) => updateParams({ grades: v });
  const setFilterStyles = (v: Set<string>) => updateParams({ styles: v });
  const setFilterHolds = (v: Set<string>) => updateParams({ holds: v });
  const setFilterSetters = (v: Set<string>) => updateParams({ setters: v });
  const setFilterStatuses = (v: Set<string>) => updateParams({ status: v });

  const styles = useMemo(
    () => Array.from(new Set(routes.map((r) => r.style).filter(Boolean))).sort(),
    [routes]
  );
  const holds = useMemo(
    () => Array.from(new Set(routes.map((r) => r.hold_type).filter(Boolean))).sort(),
    [routes]
  );
  const setters = useMemo(
    () => Array.from(new Set(routes.map((r) => r.setter_name).filter(Boolean))).sort(),
    [routes]
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      updateParams({ dir: sortDirection === "asc" ? "desc" : "asc" });
    } else {
      updateParams({ sort: field, dir: "desc" });
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (excludeRouteIds?.has(route.id)) return false;
      if (filterWalls.size > 0 && !filterWalls.has(route.wall_id)) return false;
      if (filterGrades.size > 0 && !filterGrades.has(route.grade)) return false;
      if (filterStyles.size > 0 && route.style && !filterStyles.has(route.style)) return false;
      if (filterHolds.size > 0 && route.hold_type && !filterHolds.has(route.hold_type))
        return false;
      if (filterSetters.size > 0 && !filterSetters.has(route.setter_name)) return false;

      if (filterStatuses.size > 0) {
        const hasStatus =
          (filterStatuses.has("sent") &&
            (route.user_status === "SEND" || route.user_status === "FLASH")) ||
          (filterStatuses.has("flashed") && route.user_status === "FLASH") ||
          (filterStatuses.has("unattempted") && !route.user_status);
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [
    routes,
    excludeRouteIds,
    filterWalls,
    filterGrades,
    filterStyles,
    filterHolds,
    filterSetters,
    filterStatuses,
  ]);

  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      let valA: string | number | null | undefined = a[sortField];
      let valB: string | number | null | undefined = b[sortField];

      if (sortField === "grade") {
        const idxA = (GRADES as readonly string[]).indexOf(a.grade);
        const idxB = (GRADES as readonly string[]).indexOf(b.grade);
        valA = idxA === -1 ? 999 : idxA;
        valB = idxB === -1 ? 999 : idxB;
      }

      // Handle nulls/undefined
      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRoutes, sortField, sortDirection]);

  return (
    <div className="space-y-6 py-1 md:py-6">
      {/* Filters Header */}
      <Card className="p-4 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs font-mono">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-mono uppercase tracking-widest">
              {sortedRoutes.length} routes found
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MultiSelect
            label="Grades"
            options={GRADES.map((g) => ({ value: g, label: g }))}
            selected={filterGrades}
            onChange={setFilterGrades}
          />

          <MultiSelect
            label="Walls"
            options={WALLS.map((w) => ({ value: w.id, label: w.name }))}
            selected={filterWalls}
            onChange={setFilterWalls}
          />

          <MultiSelect
            label="Styles"
            options={styles.map((s) => ({ value: s as string, label: s as string }))}
            selected={filterStyles}
            onChange={setFilterStyles}
          />

          <MultiSelect
            label="Holds"
            options={holds.map((h) => ({ value: h as string, label: h as string }))}
            selected={filterHolds}
            onChange={setFilterHolds}
          />

          <MultiSelect
            label="Setters"
            options={setters.map((s) => ({ value: s as string, label: s as string }))}
            selected={filterSetters}
            onChange={setFilterSetters}
          />

          <MultiSelect
            label="Status"
            options={[
              { value: "sent", label: "Sent / Flashed" },
              { value: "flashed", label: "Flashed Only" },
              { value: "unattempted", label: "Unattempted" },
            ]}
            selected={filterStatuses}
            onChange={setFilterStatuses}
          />
        </div>
      </Card>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b-2 border-black text-black font-mono uppercase tracking-widest text-xs">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("grade")}
                >
                  <div className="flex items-center gap-1">
                    Grade <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-1">Name</div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("color")}
                >
                  <div className="flex items-center gap-1">
                    Color <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("wall_id")}
                >
                  <div className="flex items-center gap-1">
                    Wall <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("style")}
                >
                  <div className="flex items-center gap-1">
                    Style <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("hold_type")}
                >
                  <div className="flex items-center gap-1">
                    Holds <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("avg_rating")}
                >
                  <div className="flex items-center gap-1">
                    Rating <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("comment_count")}
                >
                  <div className="flex items-center gap-1">
                    Comments <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("setter_name")}
                >
                  <div className="flex items-center gap-1">
                    Setter <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleSort("set_date")}
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedRoutes.map((route) => (
                <tr
                  key={route.id}
                  onClick={() => (onSelect ? onSelect(route) : router.push(`/route/${route.id}`))}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-black text-slate-700 text-lg">
                    <GradeDisplay
                      grade={route.grade}
                      difficulty={route.difficulty_label}
                      className="text-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-600 italic max-w-[150px] truncate">
                    {route.name || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm ring-1 ring-slate-100"
                        style={{ backgroundColor: getRouteColor(route.color) }}
                      ></span>
                      <span className="capitalize text-slate-600">{route.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {WALLS.find((w) => w.id === route.wall_id)?.name || route.wall_id}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{route.style || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{route.hold_type || "-"}</td>
                  <td className="px-6 py-4">
                    {route.avg_rating > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-50 text-yellow-700 border-yellow-100"
                      >
                        <Star className="w-3 h-3 fill-current mr-1" />
                        {route.avg_rating.toFixed(1)}
                      </Badge>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      {route.comment_count} <MessageSquare className="w-3 h-3" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {route.setter_name.charAt(0)}
                      </div>
                      <span className="text-slate-600">{route.setter_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                    {parseDateString(route.set_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {route.user_status === "SEND" && (
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {route.user_status === "FLASH" && (
                        <div className="bg-yellow-100 p-1 rounded-full">
                          <Zap className="w-4 h-4 text-yellow-600 fill-current" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedRoutes.length === 0 && (
          <div className="p-12 text-center text-slate-400">No routes found matching filters.</div>
        )}
      </Card>
    </div>
  );
}
