"use client";

import { GradeDisplay } from "@/components/GradeDisplay";
import GradeVoting from "@/components/GradeVoting";
import { RouteActivityProvider } from "@/components/RouteActivityContext";
import RouteControls from "@/components/RouteControls";
import RouteFeed from "@/components/RouteFeed";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/Badge";
import { getRouteColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, GripHorizontal, Hash, Info, Rabbit, Smile, Star, Turtle, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import { Wall } from "@/lib/constants/walls";
import { activityLogs, routes } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
type Route = InferSelectModel<typeof routes>;
type Activity = InferSelectModel<typeof activityLogs>;

type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
} | null;

type RouteDetailsViewProps = {
  route: Route;
  wall: Wall | undefined;
  activity: Activity[];
  personalNote: string;
  user: User;
  avgRating: string | null;
  ratingsCount: number;
  myRating: number;
  gradeVotes: number[];
  myVote: number | null;
};

export default function RouteDetailsView({
  route,
  wall,
  activity,
  personalNote,
  user,
  avgRating,
  ratingsCount,
  myRating,
  gradeVotes,
  myVote,
}: RouteDetailsViewProps) {
  const router = useRouter();

  // Compute grade consensus
  const getGradeConsensus = () => {
    if (gradeVotes.length === 0) return null;
    const soft = gradeVotes.filter(v => v === -1).length;
    const fair = gradeVotes.filter(v => v === 0).length;
    const hard = gradeVotes.filter(v => v === 1).length;
    const total = gradeVotes.length;

    // Find the majority
    const max = Math.max(soft, fair, hard);
    const pct = Math.round((max / total) * 100);

    if (max === soft) return { label: "Soft", pct, icon: Turtle, color: "text-green-600" };
    if (max === hard) return { label: "Stiff", pct, icon: Rabbit, color: "text-red-600" };
    return { label: "Fair", pct, icon: Smile, color: "text-blue-600" };
  };

  const consensus = getGradeConsensus();

  return (
    <RouteActivityProvider
      routeId={route.id}
      initialActivity={activity}
      initialPersonalNote={personalNote}
      user={user}
      routeGrade={route.grade}
    >
      <motion.div
        layoutId={`route-card-${route.id}`}
        className="w-full pb-24 transition-colors duration-500 bg-white overflow-x-hidden"
        style={{ backgroundColor: `color-mix(in srgb, ${getRouteColor(route.color)} 25%, white)` }}
        initial={{ borderRadius: 12 }}
        animate={{ borderRadius: 0 }}
      >
        <div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 md:px-8">

          {/* Navigation Command */}
          <button
            onClick={() => router.back()}
            style={{ borderColor: getRouteColor(route.color) }}
            className="border border-left-1 group bg-white p-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rockmill transition-colors mb-8 font-mono"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Hero Section: The Monolith */}
          <div className="relative mb-12 group">
            {/* Decorative Underlay */}
            <div className="absolute -inset-4 bg-slate-200 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white border-l-4 border-black shadow-2xl overflow-hidden">
              {/* Header Content */}
              <div className="relative z-10 p-6 md:p-8">
                {/* Top: Wall name + color bar */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="h-3 w-16 transform -skew-x-12"
                    style={{ backgroundColor: getRouteColor(route.color) }}
                  />
                  <span className="font-bold text-lg text-slate-700 uppercase tracking-wide">
                    {wall?.name || "Unknown Wall"}
                  </span>
                </div>

                {/* Grade */}
                <motion.div layoutId={`route-grade-${route.id}`}>
                  <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-black leading-none">
                    <GradeDisplay
                      grade={route.grade}
                      difficulty={route.difficulty_label}
                      className="text-6xl md:text-7xl"
                    />
                  </h1>
                </motion.div>

                {/* Style tags */}
                {(route.style || route.hold_type) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {route.style && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 pl-2">
                        <Zap className="w-3 h-3" />
                        {route.style}
                      </Badge>
                    )}
                    {route.hold_type && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1 pl-2">
                        <GripHorizontal className="w-3 h-3" />
                        {route.hold_type}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Setter, Rating, Hardness */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-sm text-slate-600">
                    <span className="font-semibold">{route.setter_name}</span>
                    <span className="text-slate-400 ml-1 font-mono text-xs">
                      {new Date(route.set_date).toLocaleDateString()}
                    </span>
                  </span>

                  <span className="text-slate-300">|</span>
                  {avgRating ? (
                    <span className="flex items-center gap-1 text-sm text-yellow-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {avgRating}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                      <Star className="w-3.5 h-3.5" />
                      Unrated
                    </span>
                  )}

                  <span className="text-slate-300">|</span>
                  {consensus ? (
                    <span className={`flex items-center gap-1 text-sm font-medium ${consensus.color}`}>
                      <consensus.icon className="w-3.5 h-3.5" />
                      {consensus.pct}% {consensus.label}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                      No votes
                    </span>
                  )}
                </div>
              </div>

              {/* Background Texture & Gradient */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-slate-100 to-transparent transform skew-x-12 origin-bottom-right -mr-12 pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            </div>
          </div>

          {/* Data Terminal: Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">

            {/* Left Column: Stats & Rating */}
            <div className="md:col-span-4 space-y-8">

              {/* Mobile-only Controls */}
              <div className="block md:hidden">
                <RouteControls />
              </div>

              {/* Rating Module */}
              <div className="bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rockmill" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Star className="w-3 h-3" /> Community Rating
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-slate-900">
                    {avgRating || "-.-"}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">
                    / 5.0
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono mb-6">
                  from {ratingsCount} climber{ratingsCount === 1 ? "" : "s"}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-sm mb-3">Rate the Route</h4>
                  <div className="flex justify-center">
                    <StarRating routeId={route.id} initialRating={myRating} />
                  </div>
                </div>
              </div>

              {/* Grade Voting Module */}
              <GradeVoting routeId={route.id} initialVotes={gradeVotes} userVote={myVote} />

              {/* Setter Notes Module */}
              {(route.setter_notes || route.setter_beta) && (
                <div className="bg-slate-900 text-slate-200 p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <User className="w-24 h-24" />
                  </div>

                  {route.setter_notes && (
                    <div className="mb-6">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <Hash className="w-3 h-3" /> Setter Notes
                      </h3>
                      <p className="font-mono text-sm leading-relaxed relative z-10">
                        &quot;{route.setter_notes}&quot;
                      </p>
                    </div>
                  )}

                  {route.setter_beta && (
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Intended Beta
                      </h3>
                      <p className="font-mono text-sm leading-relaxed relative z-10 text-yellow-400/80 italic">
                        &quot;{route.setter_beta}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Activity Log Stream */}
            <div className="md:col-span-8">
              <div className="bg-white border border-slate-200 shadow-sm min-h-[500px]">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Recent Activity
                  </h3>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="hidden md:block mb-12">
                    <RouteControls />
                  </div>
                  <RouteFeed />
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </RouteActivityProvider>
  );
}
