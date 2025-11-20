import { getRoutes } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function WallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wall = WALLS.find((w) => w.id === id);
  
  if (!wall) return notFound();

  const allRoutes = await getRoutes();
  const wallRoutes = allRoutes.filter((r) => r.wall_id === id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/gym" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Gym
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{wall.name}</h1>
        <p className="text-gray-500 mt-1">{wall.type}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wallRoutes.map((route) => (
          <Link key={route.id} href={`/route/${route.id}`} className="block group">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex justify-between items-center hover:border-blue-300">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-xl text-gray-800">{route.grade}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border bg-white`} style={{ borderColor: route.color, color: route.color }}>
                    {route.color}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Set by <span className="font-medium text-gray-700">{route.setter_name}</span> on {new Date(route.set_date).toLocaleDateString()}</p>
              </div>
              <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
                View &rarr;
              </div>
            </div>
          </Link>
        ))}
        {wallRoutes.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 italic">No routes on this wall yet.</p>
            <Link href="/admin" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Set a route here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
