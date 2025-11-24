import { getRoutes } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import { Suspense } from "react";
import { WallCardSkeleton } from "@/components/skeletons";
import { SetCard } from "@/components/SetCard";

export default async function SetsPage() {
  const allRoutes = await getRoutes();

  // Group routes by wall
  const routesByWall = allRoutes.reduce((acc, route) => {
    const wallId = route.wall_id;
    if (!acc[wallId]) acc[wallId] = [];
    acc[wallId].push(route);
    return acc;
  }, {} as Record<string, typeof allRoutes>);



  const renderWallCard = (wall: typeof WALLS[number], index: number, total: number) => {
    const wallRoutes = routesByWall[wall.id] || [];
    const routeCount = wallRoutes.length;
    
    // Find most recent set date
    let mostRecentDate = null;
    if (wallRoutes.length > 0) {
      mostRecentDate = wallRoutes.reduce((latest, route) => {
        return !latest || new Date(route.set_date) > new Date(latest) ? route.set_date : latest;
      }, wallRoutes[0].set_date);
    }

    // Find all unique colors in the most recent set
    const uniqueColors = Array.from(new Set(
      wallRoutes
        .filter(r => r.set_date === mostRecentDate)
        .map(r => r.color)
    ));

    return (
      <div 
        key={wall.id} 
        className="relative group md:[&:nth-child(2n)_>_.connector]:hidden lg:[&:nth-child(2n)_>_.connector]:block lg:[&:nth-child(3n)_>_.connector]:hidden"
      >
        {/* Visual Connector Line */}
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
    <div className="space-y-12 py-8 md:py-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-2">
          Current Sets
        </h1>
        <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
          What&apos;s on the wall
        </p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><WallCardSkeleton /><WallCardSkeleton /><WallCardSkeleton /></div>}>
        
        {/* Walls Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            Right to Left
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {WALLS.map((wall, i) => renderWallCard(wall, i, WALLS.length))}
          </div>
        </div>

      </Suspense>
    </div>
  );
}
