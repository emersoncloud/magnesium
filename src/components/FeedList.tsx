"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Check, Zap, Star, CheckCircle2, MessageSquare, ArrowRight, Quote } from "lucide-react";
import { RouteBadge } from "@/components/RouteBadge";
import { cn } from "@/lib/utils";
import AchievementCard from "@/components/AchievementCard";
import ActivityReactions from "@/components/ActivityReactions";
import type { AchievementFeedItem } from "@/lib/achievements";

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
  achievement_title?: string;
  achievement_description?: string | null;
  achievement_type?: string;
  achievement_key?: string;
  achievement_metadata?: Record<string, unknown> | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.05,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

function UserAvatar({
  userName,
  userImage,
  userId,
  className,
  size = "md",
}: {
  userName: string | null;
  userImage: string | null;
  userId: string | null;
  className?: string;
  size?: "sm" | "md";
}) {
  const firstName = userName?.split(" ")[0] || "Someone";
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 relative z-30 pointer-events-none",
        className
      )}
    >
      <Link
        href={`/profile/${userId}`}
        className="flex-shrink-0 relative group pointer-events-auto"
      >
        <div
          className={cn(
            sizeClasses,
            "bg-slate-200 border-2 border-black transform -skew-x-6 flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-105"
          )}
        >
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={firstName}
              className="w-full h-full object-cover transform skew-x-6 scale-110"
            />
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
}

function RouteInfo({
  routeId,
  routeGrade,
  routeLabel,
  routeColor,
  wallId,
  setterName,
  setDate,
  className,
}: {
  routeId: string | null;
  routeGrade: string | null;
  routeLabel: string | null;
  routeColor: string | null;
  wallId: string | null;
  setterName: string | null;
  setDate: string | null;
  className?: string;
}) {
  if (!routeId) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 pointer-events-none w-full border-b-2 border-black/5 bg-white/50 backdrop-blur-sm",
        className
      )}
    >
      <div className="w-full">
        <RouteBadge
          route={{
            id: routeId,
            grade: routeGrade || "?",
            difficulty_label: routeLabel,
            color: routeColor || "gray",
            wall_id: wallId || "unknown",
            setter_name: setterName || "Unknown",
            set_date: setDate || new Date().toISOString(),
          }}
          className="scale-100 origin-left shadow-sm w-full"
          showWallName={true}
          showSetDate={true}
        />
      </div>
    </div>
  );
}

function timeAgo(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function ViewRouteLink({
  routeId,
  date,
  light = false,
}: {
  routeId: string | null;
  date: Date | null;
  light?: boolean;
}) {
  if (!routeId) return null;

  return (
    <>
      <Link href={`/route/${routeId}`} className="absolute inset-0 z-20" aria-label="View Route" />
      <div
        className={cn(
          "absolute bottom-2 right-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 pointer-events-none z-30 opacity-60",
          light ? "text-white" : "text-slate-500"
        )}
      >
        {timeAgo(date)}
      </div>
    </>
  );
}

function SendCard({ item }: { item: ActivityItem }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-green-600 p-0 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} light />
      <div className="absolute -right-8 -bottom-8 text-white/10 pointer-events-none">
        <Check className="w-48 h-48" />
      </div>

      <div className="absolute top-2 right-2 z-30">
        <ActivityReactions activityId={item.id} variant="light" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4 pb-4">
          <UserAvatar userName={item.user_name} userImage={item.user_image} userId={item.user_id} />
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

function FlashCard({ item }: { item: ActivityItem }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-yellow-400 text-black p-0 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} />
      <div className="absolute -right-6 -bottom-6 text-black/5 pointer-events-none">
        <Zap className="w-32 h-32 fill-white stroke-white opacity-50" />
      </div>

      <div className="absolute top-2 right-2 z-30">
        <ActivityReactions activityId={item.id} variant="dark" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4 pb-4">
          <UserAvatar userName={item.user_name} userImage={item.user_image} userId={item.user_id} />
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

function RatingCard({ item }: { item: ActivityItem }) {
  const rating = parseInt(item.content || "0");

  return (
    <Card className="relative overflow-hidden p-0 flex flex-col gap-0 bg-white group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} />
      <div className="absolute -right-6 -bottom-6 text-yellow-400/10 pointer-events-none">
        <Star className="w-32 h-32 fill-current" />
      </div>

      <div className="relative z-10 w-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4">
          <UserAvatar userName={item.user_name} userImage={item.user_image} userId={item.user_id} />
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

function ProposeGradeCard({ item }: { item: ActivityItem }) {
  return (
    <Card className="relative overflow-hidden p-0 flex flex-col gap-0 bg-slate-50 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} />

      <div className="relative z-10 w-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4">
          <UserAvatar userName={item.user_name} userImage={item.user_image} userId={item.user_id} />
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

function CommentCard({ item }: { item: ActivityItem }) {
  return (
    <Card className="relative overflow-hidden p-0 flex flex-col gap-0 bg-white group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} />

      <div className="relative z-10 w-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4">
          <UserAvatar
            userName={item.user_name}
            userImage={item.user_image}
            userId={item.user_id}
            className="w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
              <MessageSquare className="w-3 h-3" /> Commented
            </p>
            <div className="relative pl-6 pointer-events-none">
              <Quote className="absolute left-0 top-0 w-4 h-4 text-slate-200 -scale-x-100" />
              <p className="text-base text-slate-700 font-medium leading-relaxed">{item.content}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AttemptCard({ item }: { item: ActivityItem }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-slate-200 text-slate-700 p-0 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all cursor-pointer">
      <ViewRouteLink routeId={item.route_id} date={item.created_at} />
      <div className="absolute -right-8 -bottom-8 text-slate-300 pointer-events-none">
        <CheckCircle2 className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <RouteInfo
          routeId={item.route_id}
          routeGrade={item.route_grade}
          routeLabel={item.route_label}
          routeColor={item.route_color}
          wallId={item.wall_id}
          setterName={item.setter_name}
          setDate={item.set_date}
        />

        <div className="flex gap-3 items-start p-4">
          <UserAvatar
            userName={item.user_name}
            userImage={item.user_image}
            userId={item.user_id}
            className="opacity-75 grayscale"
          />
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-1">
              Attempted
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FeedCard({ item }: { item: ActivityItem }) {
  switch (item.action_type) {
    case "SEND":
      return <SendCard item={item} />;
    case "FLASH":
      return <FlashCard item={item} />;
    case "RATING":
      return <RatingCard item={item} />;
    case "PROPOSE_GRADE":
      return <ProposeGradeCard item={item} />;
    case "COMMENT":
      return <CommentCard item={item} />;
    case "ACHIEVEMENT":
      return (
        <AchievementCard
          item={{
            id: item.id,
            user_id: item.user_id || "",
            user_name: item.user_name,
            user_image: item.user_image,
            action_type: "ACHIEVEMENT",
            content: item.content,
            created_at: item.created_at,
            route_grade: null,
            route_color: null,
            route_label: null,
            route_id: null,
            wall_id: null,
            setter_name: null,
            set_date: null,
            achievement_title: item.achievement_title || "Achievement",
            achievement_description: item.achievement_description || null,
            achievement_type: item.achievement_type || "MILESTONE",
            achievement_key: item.achievement_key || "",
            achievement_metadata: item.achievement_metadata || null,
          }}
        />
      );
    default:
      return <AttemptCard item={item} />;
  }
}

export default function FeedList({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {activity.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <FeedCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>

      {activity.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center py-12 text-slate-400"
        >
          No recent activity. Go climb something!
        </motion.div>
      )}
    </div>
  );
}
