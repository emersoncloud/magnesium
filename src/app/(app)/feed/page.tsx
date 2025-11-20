import { getGlobalActivity } from "@/app/actions";
import { Suspense } from "react";
import { FeedItemSkeleton } from "@/components/skeletons";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Check, Zap, MessageSquare, Star } from "lucide-react";

async function FeedList() {
  const activity = await getGlobalActivity();

  return (
    <div className="space-y-4">
      {activity.map((item) => (
        <Card key={item.id} className="p-5 flex gap-4 items-start">
          <Link href={`/profile/${item.user_id}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
              {item.user_image ? (
                <img src={item.user_image} alt={item.user_name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                  {item.user_name?.[0] || "?"}
                </div>
              )}
            </div>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className="text-sm text-slate-900">
                <Link href={`/profile/${item.user_id}`} className="font-bold hover:text-violet-600 transition-colors">
                  {item.user_name || "Someone"}
                </Link>
                <span className="text-slate-500 mx-1">
                  {item.action_type === "SEND" && "sent"}
                  {item.action_type === "FLASH" && "flashed"}
                  {item.action_type === "COMMENT" && "commented on"}
                  {item.action_type === "RATING" && "rated"}
                </span>
                <Link href={`/route/${item.route_id}`} className="font-medium text-slate-900 hover:text-violet-600 transition-colors">
                  Route
                </Link>
              </p>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                {new Date(item.created_at!).toLocaleDateString()}
              </span>
            </div>

            {item.content && (
              <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {item.action_type === "RATING" ? (
                  <div className="flex items-center gap-1 text-yellow-600 font-bold">
                    {item.content} <Star className="w-4 h-4 fill-current" />
                  </div>
                ) : (
                  <p>"{item.content}"</p>
                )}
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-2">
               {item.action_type === "SEND" && <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100"><Check className="w-3 h-3 mr-1" /> Send</Badge>}
               {item.action_type === "FLASH" && <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-100"><Zap className="w-3 h-3 mr-1" /> Flash</Badge>}
            </div>
          </div>
        </Card>
      ))}
      {activity.length === 0 && (
        <div className="text-center py-12 text-slate-400">No recent activity. Go climb something!</div>
      )}
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-8">Activity Feed</h1>
      <Suspense fallback={<div className="space-y-4"><FeedItemSkeleton /><FeedItemSkeleton /><FeedItemSkeleton /></div>}>
        <FeedList />
      </Suspense>
    </div>
  );
}

import { Badge } from "@/components/ui/Badge";
