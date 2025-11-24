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
        const UserAvatar = ({ className, size = "md" }: { className?: string, size?: "sm" | "md" }) => {
          const firstName = item.user_name?.split(" ")[0] || "Someone";
          const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";

          return (
            <div className={cn("flex flex-col items-center gap-1 relative z-10", className)}>
              <Link href={`/profile/${item.user_id}`} className="flex-shrink-0 relative group">
                <div className={cn(sizeClasses, "bg-slate-200 border-2 border-black transform -skew-x-6 flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-105")}>
                  {item.user_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.user_image} alt={firstName} className="w-full h-full object-cover transform skew-x-6 scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold transform skew-x-6 text-xs">
                      {firstName[0]}
                    </div>
                  )}
                </div>
              </Link>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-white/50 px-1 rounded backdrop-blur-sm">
                {firstName}
              </div>
            </div>
          );
        };

        // Common Route Info Component
        const RouteInfo = ({ className, light = false }: { className?: string, light?: boolean }) => (
          item.route_id ? (
            <div className={cn("flex flex-col items-start gap-1 pointer-events-none w-full border-b-2 border-black/5 bg-white/50 backdrop-blur-sm", className)}>
              <div className="pointer-events-auto w-full">
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
                  className="scale-100 origin-left shadow-sm w-full"
                  showWallName={true}
                  showSetDate={true}
                />
              </div>
            </div>
          ) : null
        );

        const timeAgo = (date: Date | null) => {
          if (!date) return "";
          const now = new Date();
          const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

          if (diffInSeconds < 60) return "just now";
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
          if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
          return new Date(date).toLocaleDateString();
        };

        const ViewRouteLink = ({ routeId, date, light = false }: { routeId: string | null, date: Date | null, light?: boolean }) => {
          if (!routeId) return null;
          return (
            <>
              <Link href={`/route/${routeId}`} className="absolute inset-0 z-0" aria-label="View Route" />
              <div className={cn(
                "absolute bottom-2 right-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 pointer-events-none opacity-60",
                light ? "text-white" : "text-slate-500"
              )}>
                {timeAgo(date)}
              </div>
            </>
          )
        }

        // --- SEND CARD ---
        if (item.action_type === "SEND") {
          return (
            <Card key={item.id} className="relative overflow-hidden border-0 bg-green-600  p-0 group hover:shadow-lg transition-shadow cursor-pointer">
              <ViewRouteLink routeId={item.route_id} date={item.created_at} light />
              <div className="absolute -right-8 -bottom-8 text-white/10 pointer-events-none">
                <Check className="w-48 h-48" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <RouteInfo />

                <div className="flex gap-3 items-start p-4">
                  <UserAvatar />
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm font-bold text-green-100 uppercase tracking-wider flex items-center gap-2 mb-1">
                      Sent
                    </p>
                    {item.content && (
                      <div className="mt-2 text-green-50 text-sm italic border-l-2 border-green-400 pl-3">
                        &quot;{item.content}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        // --- FLASH CARD ---
        if (item.action_type === "FLASH") {
          return (
            <Card key={item.id} className="relative overflow-hidden border-0 bg-yellow-400 text-black p-0 group hover:shadow-lg transition-shadow cursor-pointer">
              <ViewRouteLink routeId={item.route_id} date={item.created_at} />
              <div className="absolute -right-6 -bottom-6 text-black/5 pointer-events-none">
                <Zap className="w-32 h-32 fill-white stroke-white opacity-50" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <RouteInfo />

                <div className="flex gap-3 items-start p-4">
                  <UserAvatar />
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm font-bold text-yellow-900/70 uppercase tracking-wider flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 fill-black" /> Flashed
                    </p>
                    {item.content && (
                      <div className="mt-2 text-yellow-900/80 text-sm italic border-l-2 border-black/20 pl-3">
                        &quot;{item.content}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        // --- RATING CARD ---
        if (item.action_type === "RATING") {
          const rating = parseInt(item.content || "0");
          return (
            <Card key={item.id} className="relative overflow-hidden p-0 flex flex-col gap-0 bg-white group hover:shadow-lg transition-shadow cursor-pointer">
              <ViewRouteLink routeId={item.route_id} date={item.created_at} />
              <div className="absolute -right-6 -bottom-6 text-yellow-400/10 pointer-events-none">
                <Star className="w-32 h-32 fill-current" />
              </div>

              <div className="relative z-10 w-full">
                <RouteInfo />

                <div className="flex gap-3 items-start p-4">
                  <UserAvatar />
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rated</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-8 h-8",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        // --- PROPOSED GRADE CARD ---
        if (item.action_type === "PROPOSE_GRADE") {
          return (
            <Card key={item.id} className="relative overflow-hidden p-0 flex flex-col gap-0 bg-slate-50 group hover:shadow-lg transition-shadow cursor-pointer">
              <ViewRouteLink routeId={item.route_id} date={item.created_at} />

              <div className="relative z-10 w-full">
                <RouteInfo />

                <div className="flex gap-3 items-start p-4">
                  <UserAvatar />
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 w-fit shadow-sm">
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
                </div>
              </div>
            </Card>
          );
        }

        // --- COMMENT CARD ---
        if (item.action_type === "COMMENT") {
          return (
            <Card key={item.id} className="relative overflow-hidden p-0 flex flex-col gap-0 bg-white group hover:shadow-lg transition-shadow cursor-pointer">
              <ViewRouteLink routeId={item.route_id} date={item.created_at} />

              <div className="relative z-10 w-full">
                <RouteInfo />

                <div className="flex gap-3 items-start p-4">
                  <UserAvatar className="w-10 h-10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MessageSquare className="w-3 h-3" /> Commented
                    </p>
                    <div className="relative pl-6 pointer-events-none">
                      <Quote className="absolute left-0 top-0 w-4 h-4 text-slate-200 -scale-x-100" />
                      <p className="text-base text-slate-700 font-medium leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        // --- ATTEMPT CARD (Default Fallback) ---
        return (
          <Card key={item.id} className="relative overflow-hidden border-0 bg-slate-200 text-slate-700 p-0 group hover:shadow-lg transition-shadow cursor-pointer">
            <ViewRouteLink routeId={item.route_id} date={item.created_at} />
            <div className="absolute -right-8 -bottom-8 text-slate-300 pointer-events-none">
              <CheckCircle2 className="w-48 h-48" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <RouteInfo />

              <div className="flex gap-3 items-start p-4">
                <UserAvatar className="opacity-75 grayscale" />
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-1">
                    Attempted
                  </p>
                </div>
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
