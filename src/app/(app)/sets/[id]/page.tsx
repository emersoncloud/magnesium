import { getBrowserRoutes, getUpcomingRoutesForWall } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import WallPageContent from "@/components/WallPageContent";

export default async function WallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wall = WALLS.find((w) => w.id === id);

  if (!wall) return notFound();

  const [allRoutes, upcomingRoutes] = await Promise.all([
    getBrowserRoutes(),
    getUpcomingRoutesForWall(id),
  ]);

  const wallRoutes = allRoutes.filter((r) => r.wall_id === id);

  return (
    <div className="relative flex flex-col">
      <div className="relative z-10 p-6 pb-2 border-b-2 border-black/5 bg-white/80 backdrop-blur-sm shrink-0">
        <Link
          href="/sets"
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rockmill transition-colors mb-4 font-mono"
        >
          <div className="w-6 h-6 border border-slate-300 group-hover:border-rockmill flex items-center justify-center transform -skew-x-12 transition-colors">
            <ArrowLeft className="w-3 h-3 transform skew-x-12" />
          </div>
          <span>Return to Sets</span>
        </Link>

        <div className="flex items-baseline gap-4">
          <h1 className="text-5xl md:text-7xl font-black text-rockmill tracking-tighter uppercase transform -skew-x-6">
            {wall.name}
          </h1>
          <span className="text-sm font-mono text-slate-400 uppercase tracking-widest hidden md:inline-block">
            {"// "}
            {wall.type} Set
          </span>
        </div>
      </div>

      <WallPageContent wallId={id} wallRoutes={wallRoutes} upcomingRoutes={upcomingRoutes} />
    </div>
  );
}
