"use client";

import { UserQuickStats } from "@/app/actions";
import { Card } from "@/components/ui/Card";
import { Crown, Zap, Target, TrendingUp, Mountain, Users } from "lucide-react";

type DashboardQuickStatsProps = {
  userStats: UserQuickStats | null;
  isLoggedIn: boolean;
  totalActiveRoutes: number;
  totalClimbers: number;
};

export default function DashboardQuickStats({
  userStats,
  isLoggedIn,
  totalActiveRoutes,
  totalClimbers,
}: DashboardQuickStatsProps) {
  if (isLoggedIn && userStats) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 relative overflow-hidden group border-l-4 border-l-green-500">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Best Send
          </h3>
          <div className="text-3xl font-black text-slate-900">
            {userStats.bestSendGrade || <span className="text-slate-300 text-xl">-</span>}
          </div>
        </Card>

        <Card className="p-4 relative overflow-hidden group border-l-4 border-l-yellow-400">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-yellow-500 fill-current" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Best Flash
          </h3>
          <div className="text-3xl font-black text-slate-900">
            {userStats.bestFlashGrade || <span className="text-slate-300 text-xl">-</span>}
          </div>
        </Card>

        <Card className="p-4 relative overflow-hidden group border-l-4 border-l-blue-500">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Total Sends
          </h3>
          <div className="text-3xl font-black text-slate-900">
            {userStats.totalSends + userStats.totalFlashes}
          </div>
        </Card>

        <Card className="p-4 relative overflow-hidden group border-l-4 border-l-purple-500">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            This Week
          </h3>
          <div className="text-3xl font-black text-slate-900">{userStats.routesThisWeek}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4 relative overflow-hidden group border-l-4 border-l-slate-400">
        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Mountain className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
          Active Routes
        </h3>
        <div className="text-3xl font-black text-slate-900">{totalActiveRoutes}</div>
      </Card>

      <Card className="p-4 relative overflow-hidden group border-l-4 border-l-slate-400">
        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
          Climbers
        </h3>
        <div className="text-3xl font-black text-slate-900">{totalClimbers}</div>
      </Card>
    </div>
  );
}
