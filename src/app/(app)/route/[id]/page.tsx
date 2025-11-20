import { getRoute, getRouteActivity } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, User } from "lucide-react";
import { auth } from "@/lib/auth";
import RouteActivity from "@/components/RouteActivity";
import StarRating from "@/components/StarRating";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function RoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = await getRoute(id);
  if (!route) return <div>Route not found</div>;

  const wall = WALLS.find((w) => w.id === route.wall_id);
  const activity = await getRouteActivity(id);
  const session = await auth();
  
  const user = session?.user?.email ? {
    id: session.user.email,
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null,
  } : null;

  const myRatingLog = activity.find(a => a.user_id === session?.user?.email && a.action_type === "RATING");
  const myRating = myRatingLog ? parseInt(myRatingLog.content || "0") : 0;

  const ratings = activity.filter(a => a.action_type === "RATING" && a.content).map(a => parseInt(a.content!));
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <Link href={`/gym/${route.wall_id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to {wall?.name}
      </Link>

      <div className="grid gap-6">
        {/* Hero Card */}
        <Card className="p-8 relative overflow-hidden border-0 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-100 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="text-lg px-3 py-1" color={route.color.toLowerCase()}>
                    {route.color}
                  </Badge>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">{route.grade}</h1>
                </div>
                <p className="text-xl text-slate-500 font-medium">{wall?.name}</p>
              </div>
              
              {avgRating && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-3xl font-bold text-slate-900">
                    {avgRating} <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-slate-400">{ratings.length} ratings</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Set by <span className="font-semibold text-slate-700">{route.setter_name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(route.set_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Rating & Activity */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="p-6 h-full">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Your Rating</h3>
              <div className="flex justify-center py-4">
                <StarRating routeId={id} initialRating={myRating} />
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Activity Log</h3>
              <RouteActivity 
                routeId={id} 
                initialActivity={activity} 
                user={user}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
