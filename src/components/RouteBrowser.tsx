'use client'

import { BrowserRoute, generateRoutePlan, RoutePlan } from "@/app/actions";
import RoutePlanView from "./RoutePlanView";
import { WALLS, GRADES } from "@/lib/constants/walls";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowUpDown, Check, Zap, Star, MessageSquare, Filter, Map, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getRouteColor } from "@/lib/utils";
import { GradeDisplay } from "@/components/GradeDisplay";

type SortField = "grade" | "color" | "wall_id" | "avg_rating" | "comment_count" | "set_date" | "setter_name" | "style" | "hold_type";
type SortDirection = "asc" | "desc";

export default function RouteBrowser({ routes }: { routes: BrowserRoute[] }) {
  const [sortField, setSortField] = useState<SortField>("set_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterWall, setFilterWall] = useState<string>("all");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterStyle, setFilterStyle] = useState<string>("all");
  const [filterHold, setFilterHold] = useState<string>("all");
  const [filterSetter, setFilterSetter] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const plan = await generateRoutePlan();
      setRoutePlan(plan);
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Derive unique values for filters
  const styles = useMemo(() => Array.from(new Set(routes.map(r => r.style).filter(Boolean))).sort(), [routes]);
  const holds = useMemo(() => Array.from(new Set(routes.map(r => r.hold_type).filter(Boolean))).sort(), [routes]);
  const setters = useMemo(() => Array.from(new Set(routes.map(r => r.setter_name).filter(Boolean))).sort(), [routes]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (filterWall !== "all" && route.wall_id !== filterWall) return false;
      if (filterGrade !== "all" && route.grade !== filterGrade) return false;
      if (filterStyle !== "all" && route.style !== filterStyle) return false;
      if (filterHold !== "all" && route.hold_type !== filterHold) return false;
      if (filterSetter !== "all" && route.setter_name !== filterSetter) return false;

      if (filterStatus === "sent" && route.user_status !== "SEND" && route.user_status !== "FLASH") return false;
      if (filterStatus === "flashed" && route.user_status !== "FLASH") return false;
      if (filterStatus === "unattempted" && route.user_status) return false;

      return true;
    });
  }, [routes, filterWall, filterGrade, filterStyle, filterHold, filterSetter, filterStatus]);

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
            <Button
              onClick={() => routePlan ? setRoutePlan(null) : handleGeneratePlan()}
              variant={routePlan ? "secondary" : "primary"}
              disabled={isGeneratingPlan}
              className="gap-2"
            >
              {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
              {routePlan ? "Back to Routes" : "Generate Training Plan"}
            </Button>
          </div>
        </div>

        {!routePlan && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filterWall}
              onChange={(e) => setFilterWall(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Walls</option>
              {WALLS.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Grades</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Styles</option>
              {styles.map((s) => (
                <option key={s as string} value={s as string}>{s}</option>
              ))}
            </select>

            <select
              value={filterHold}
              onChange={(e) => setFilterHold(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Holds</option>
              {holds.map((h) => (
                <option key={h as string} value={h as string}>{h}</option>
              ))}
            </select>

            <select
              value={filterSetter}
              onChange={(e) => setFilterSetter(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Setters</option>
              {setters.map((s) => (
                <option key={s as string} value={s as string}>{s}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border-2 border-black px-3 py-2 text-xs font-mono uppercase tracking-widest focus:outline-none focus:bg-slate-50 w-full"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent / Flashed</option>
              <option value="flashed">Flashed Only</option>
              <option value="unattempted">Unattempted</option>
            </select>
          </div>
        )}
      </Card>

      {routePlan ? (
        <RoutePlanView plan={routePlan} />
      ) : (
        /* Table */
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b-2 border-black text-black font-mono uppercase tracking-widest text-xs">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("grade")}>
                    <div className="flex items-center gap-1">Grade <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("color")}>
                    <div className="flex items-center gap-1">Color <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("wall_id")}>
                    <div className="flex items-center gap-1">Wall <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("style")}>
                    <div className="flex items-center gap-1">Style <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("hold_type")}>
                    <div className="flex items-center gap-1">Holds <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("avg_rating")}>
                    <div className="flex items-center gap-1">Rating <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("comment_count")}>
                    <div className="flex items-center gap-1">Comments <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("setter_name")}>
                    <div className="flex items-center gap-1">Setter <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={() => handleSort("set_date")}>
                    <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-black text-slate-700 text-lg">
                      <GradeDisplay
                        grade={route.grade}
                        difficulty={route.difficulty_label}
                        className="text-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: getRouteColor(route.color) }}></span>
                        <span className="capitalize text-slate-600">{route.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {WALLS.find(w => w.id === route.wall_id)?.name || route.wall_id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.style || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.hold_type || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {route.avg_rating > 0 ? (
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-100">
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
                      {new Date(route.set_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {route.user_status === "SEND" && <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>}
                        {route.user_status === "FLASH" && <div className="bg-yellow-100 p-1 rounded-full"><Zap className="w-4 h-4 text-yellow-600 fill-current" /></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/route/${route.id}`} className="text-slate-400 hover:text-violet-600 font-medium transition-colors opacity-0 group-hover:opacity-100">
                        View
                      </Link>
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
      )}
    </div>
  );
}
