import { getGlobalActivity, getRoutes, getUserActivity } from "@/app/actions";
import MarketingPageContent from "@/components/MarketingPageContent";
import { WALLS } from "@/lib/constants/walls";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/sets");
  }
  // 1. Fetch all data in parallel
  const [rawRoutes, activity, exampleUserActivity] = await Promise.all([
    getRoutes(),
    getGlobalActivity(),
    getUserActivity("fad3426d-4e67-4f74-a69f-a028d5d9b4f9")
  ]);

  // 2. Process Routes for Ticker
  const routes = rawRoutes.slice(0, 20).map(route => ({
    grade: route.grade,
    route_name: route.difficulty_label || "Route",
    setter: route.setter_name,
    color: route.color,
    wall_id: route.wall_id,
    set_date: route.set_date,
  }));

  // 3. Process Recent Activity
  const recentActivity = activity.slice(0, 5);
  const recentSend = activity.find(a => a.action_type === "SEND" || a.action_type === "FLASH") || null;

  // 4. Calculate Gym Stats
  const totalRoutes = rawRoutes.length;
  const uniqueGrades = new Set(rawRoutes.map(r => r.difficulty_label)).size;

  // 5. Find Newest Set
  // Group routes by wall and find the one with the most recent set_date
  const wallSets: Record<string, { date: string; count: number; color: string }> = {};
  
  rawRoutes.forEach(route => {
    if (!wallSets[route.wall_id]) {
      wallSets[route.wall_id] = { date: route.set_date, count: 0, color: route.color };
    }
    wallSets[route.wall_id].count++;
    // Update date if newer
    if (new Date(route.set_date) > new Date(wallSets[route.wall_id].date)) {
      wallSets[route.wall_id].date = route.set_date;
    }
  });

  let newestSet = null;
  let maxDate = 0;

  Object.entries(wallSets).forEach(([wallId, data]) => {
    const date = new Date(data.date).getTime();
    if (date > maxDate) {
      maxDate = date;
      const wallName = WALLS.find(w => w.id === wallId)?.name || "Unknown Wall";
      
      // Find all colors for this set
      const setColors = Array.from(new Set(
        rawRoutes
          .filter(r => r.wall_id === wallId && r.set_date === data.date)
          .map(r => r.color)
      ));

      newestSet = {
        wallName,
        count: data.count,
        colors: setColors,
        date: new Date(maxDate).toISOString()
      };
    }
  });

  return (
    <MarketingPageContent 
      routes={routes}
      recentActivity={recentActivity}
      exampleUserActivity={exampleUserActivity}
      recentSend={recentSend}
      newSet={newestSet}
      gymStats={{ totalRoutes, gradeCount: uniqueGrades }}
    />
  );
}
