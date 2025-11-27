"use client";

import { User } from "next-auth";
import { DashboardData } from "@/app/actions";
import DashboardHero from "./DashboardHero";
import DashboardQuickStats from "./DashboardQuickStats";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardWhatsNew from "./DashboardWhatsNew";

type DashboardContentProps = {
  user: User | null;
  dashboardData: DashboardData;
  showTraining?: boolean;
};

export default function DashboardContent({
  user,
  dashboardData,
  showTraining = false,
}: DashboardContentProps) {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <DashboardHero user={user} userStats={dashboardData.userStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <DashboardQuickStats
            userStats={dashboardData.userStats}
            isLoggedIn={dashboardData.isLoggedIn}
            totalActiveRoutes={dashboardData.totalActiveRoutes}
            totalClimbers={dashboardData.totalClimbers}
          />
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Quick Actions
          </h3>
          <DashboardQuickActions user={user} showTraining={showTraining} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardRecentActivity
          user={user}
          userActivity={dashboardData.userActivity}
          globalActivity={dashboardData.globalActivity}
        />

        <DashboardWhatsNew recentRoutes={dashboardData.recentRoutes} />
      </div>
    </div>
  );
}
