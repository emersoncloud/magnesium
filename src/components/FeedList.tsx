import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Check, Zap, Star, CheckCircle2, MessageSquare, ArrowRight, Quote } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RouteBadge } from "@/components/RouteBadge";
import { cn } from "@/lib/utils";

// Define the type based on what getGlobalActivity returns
type ActivityItem = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_image: string | null;
  action_type: string;
  content: string | null;
  created_at: Date | null;
  route_grade: string | null;
  route_color: string | null;
  route_label: string | null;
  route_id: string | null;
  wall_id: string | null;
  setter_name: string | null;
  set_date: string | null;
};

export default function FeedList({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {activity.map((item) => {
        // Common User Avatar Component
        const UserAvatar = ({ className }: { className?: string }) => (
          <Link href={`/profile/${item.user_id}`} className={cn("flex-shrink-0 relative z-10", className)}>
            <div className="w-12 h-12 bg-slate-200 border-2 border-black transform -skew-x-6 flex items-center justify-center overflow-hidden shadow-sm">
              {item.user_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.user_image} alt={item.user_name || "User"} className="w-full h-full object-cover transform skew-x-6 scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold transform skew-x-6">
                  {item.user_name?.[0] || "?"}
                </div>
              )}
            </div>
          </Link>
        );

        // Common Route Info Component
        const RouteInfo = ({ className, light = false }: { className?: string, light?: boolean }) => (
          item.route_id ? (
            <div className={cn("flex flex-col items-end gap-1", className)}>
              <Link href={`/route/${item.route_id}`}>
                <RouteBadge
                  route={{
                    id: item.route_id,
                    grade: item.route_grade || "?",
                    difficulty_label: item.route_label,
                    color: item.route_color || "gray",
                    wall_id: item.wall_id || "unknown",
                    setter_name: item.setter_name || "Unknown",
                    set_date: item.set_date || new Date().toISOString(),
                  }}
                  className="scale-90 origin-right shadow-sm"
                />
              </Link>
              <Link
                href={`/route/${item.route_id}`}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1",
                  light ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-black"
                )}
              >
                View Route &rarr;
              </Link>
            </div>
          ) : null
        );

        // --- SEND CARD ---
        if (item.action_type === "SEND") {
          return (
            <Card key={item.id} className="relative overflow-hidden border-0 bg-green-600 text-white p-0">
              <div className="absolute -right-8 -bottom-8 text-white/10 pointer-events-none">
                <Check className="w-48 h-48" />
              </div>
              <div className="p-5 flex gap-4 items-center relative z-10">
                <UserAvatar />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-black uppercase tracking-tight leading-none mb-1">
                        <Link href={`/profile/${item.user_id}`} className="hover:underline decoration-2 underline-offset-2">
                          {item.user_name || "Someone"}
                        </Link>
                      </p>
                      <p className="text-sm font-bold text-green-100 uppercase tracking-wider flex items-center gap-2">
                        <Check className="w-4 h-4" /> Sent
                      </p>
                    </div>
                    <RouteInfo light />
                  </div>
                  {item.content && (
                    <div className="mt-3 text-green-50 text-sm italic border-l-2 border-green-400 pl-3">
                      &quot;{item.content}&quot;
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        }

        // --- FLASH CARD ---
        if (item.action_type === "FLASH") {
          return (
            <Card key={item.id} className="relative overflow-hidden border-0 bg-yellow-400 text-black p-0">
              <div className="absolute -right-6 -bottom-6 text-black/5 pointer-events-none">
                <Zap className="w-32 h-32 fill-white stroke-white opacity-50" />
              </div>
              <div className="p-5 flex gap-4 items-center relative z-10">
                <UserAvatar />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-black uppercase tracking-tight leading-none mb-1">
                        <Link href={`/profile/${item.user_id}`} className="hover:underline decoration-2 underline-offset-2">
                          {item.user_name || "Someone"}
                        </Link>
                      </p>
                      <p className="text-sm font-bold text-yellow-900/70 uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-black" /> Flashed
                      </p>
                    </div>
                    <RouteInfo />
                  </div>
                  {item.content && (
                    <div className="mt-3 text-yellow-900/80 text-sm italic border-l-2 border-black/20 pl-3">
                      &quot;{item.content}&quot;
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        }

        // --- RATING CARD ---
        if (item.action_type === "RATING") {
          const rating = parseInt(item.content || "0");
          return (
            <Card key={item.id} className="p-5 flex gap-4 items-start bg-white">
              <UserAvatar />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      <Link href={`/profile/${item.user_id}`} className="hover:text-violet-600 transition-colors">
                        {item.user_name || "Someone"}
                      </Link>
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Rated a route</p>
                  </div>
                  <RouteInfo />
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-6 h-6",
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          );
        }

        // --- PROPOSED GRADE CARD ---
        if (item.action_type === "PROPOSE_GRADE") {
          return (
            <Card key={item.id} className="p-5 flex gap-4 items-start bg-slate-50 border-l-4 border-blue-500">
              <UserAvatar />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      <Link href={`/profile/${item.user_id}`} className="hover:text-violet-600 transition-colors">
                        {item.user_name || "Someone"}
                      </Link>
                    </p>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Proposed Grade Change</p>
                  </div>
                  <RouteInfo />
                </div>

                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 w-fit">
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Current</div>
                    <div className="text-xl font-black text-slate-700">{item.route_grade}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-blue-500 font-bold">Proposed</div>
                    <div className="text-xl font-black text-blue-600">{item.content}</div>
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        // --- COMMENT CARD ---
        if (item.action_type === "COMMENT") {
          return (
            <Card key={item.id} className="p-6 flex flex-col gap-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <UserAvatar className="w-10 h-10" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      <Link href={`/profile/${item.user_id}`} className="hover:text-violet-600 transition-colors">
                        {item.user_name || "Someone"}
                      </Link>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Commented
                    </p>
                  </div>
                </div>
                <RouteInfo />
              </div>

              <div className="relative pl-8">
                <Quote className="absolute left-0 top-0 w-6 h-6 text-slate-200 -scale-x-100" />
                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                  {item.content}
                </p>
              </div>
            </Card>
          );
        }

        // --- ATTEMPT CARD (Default Fallback) ---
        return (
          <Card key={item.id} className="p-5 flex gap-4 items-center bg-slate-50">
            <UserAvatar className="opacity-75 grayscale" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    <Link href={`/profile/${item.user_id}`} className="hover:text-violet-600 transition-colors">
                      {item.user_name || "Someone"}
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attempted
                  </p>
                </div>
                <RouteInfo />
              </div>
            </div>
          </Card>
        );
      })}

      {activity.length === 0 && (
        <div className="text-center py-12 text-slate-400">No recent activity. Go climb something!</div>
      )}
    </div>
  );
}
