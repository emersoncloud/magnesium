import { getRoutes } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { Suspense } from "react";
import { WallCardSkeleton } from "@/components/skeletons";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, TrendingUp } from "lucide-react";

export default async function GymPage() {
  const allRoutes = await getRoutes();

  // Group routes by wall
  const routesByWall = allRoutes.reduce((acc, route) => {
    const wallId = route.wall_id;
    if (!acc[wallId]) acc[wallId] = [];
    acc[wallId].push(route);
    return acc;
  }, {} as Record<string, typeof allRoutes>);

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Gym Map
        </h1>
        <p className="text-slate-500 text-lg">Explore walls and find your next project.</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><WallCardSkeleton /><WallCardSkeleton /><WallCardSkeleton /></div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WALLS.map((wall) => {
            const routeCount = routesByWall[wall.id]?.length || 0;
            return (
              <Link key={wall.id} href={`/gym/${wall.id}`} className="block group">
                <Card className="h-full p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="group-hover:bg-white">
                        {routeCount} Routes
                      </Badge>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">
                      {wall.name}
                    </h2>
                    
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{wall.type || "Mixed"}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
}
