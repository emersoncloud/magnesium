'use client'

import { BrowserRoute } from "@/app/actions";
import { WALLS, GRADES } from "@/lib/constants/walls";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowUpDown, Check, Zap, Star, MessageSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type SortField = "grade" | "color" | "wall_id" | "avg_rating" | "comment_count" | "set_date" | "setter_name";
type SortDirection = "asc" | "desc";

export default function RouteBrowser({ routes }: { routes: BrowserRoute[] }) {
  const [sortField, setSortField] = useState<SortField>("set_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterWall, setFilterWall] = useState<string>("all");
  const [filterGrade, setFilterGrade] = useState<string>("all");

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
      return true;
    });
  }, [routes, filterWall, filterGrade]);

  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "grade") {
        valA = GRADES.indexOf(a.grade as any);
        valB = GRADES.indexOf(b.grade as any);
      }
      
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRoutes, sortField, sortDirection]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={filterWall}
            onChange={(e) => setFilterWall(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none w-full md:w-48"
          >
            <option value="all">All Walls</option>
            {WALLS.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none w-full md:w-32"
          >
            <option value="all">All Grades</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-slate-500 font-medium">
          {sortedRoutes.length} routes found
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
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
                  <td className="px-6 py-4 font-black text-slate-700 text-lg">{route.grade}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shadow-sm ring-1 ring-slate-100" style={{ backgroundColor: route.color.toLowerCase() }}></span>
                      <span className="capitalize text-slate-600">{route.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {WALLS.find(w => w.id === route.wall_id)?.name || route.wall_id}
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
    </div>
  );
}
