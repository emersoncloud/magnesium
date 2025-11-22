"use client";

import Link from "next/link";
import { ArrowLeft, Star, Calendar, User, Activity, Hash, MapPin, Info, GripHorizontal, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import RouteActivity from "@/components/RouteActivity";
import StarRating from "@/components/StarRating";
import GradeVoting from "@/components/GradeVoting";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BrowserRoute } from "@/app/actions";

type RouteDetailsViewProps = {
  route: any; // Using any for now to avoid complex type imports, ideally should be Route type
  wall: any;
  activity: any[];
  personalNote: string;
  user: any;
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
  return (
    <motion.div 
      layoutId={`route-card-${route.id}`}
      className="min-h-screen pb-24 transition-colors duration-500 bg-white" 
      style={{ backgroundColor: route.color }}
      initial={{ borderRadius: 12 }}
      animate={{ borderRadius: 0 }}
    >
      {/* Global Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 mix-blend-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 md:px-8">
        
        {/* Navigation Command */}
        <Link 
          href={`/sets/${route.wall_id}`} 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span>Return to Set // {wall?.name}</span>
        </Link>

        {/* Hero Section: The Monolith */}
        <div className="relative mb-12 group">
          {/* Decorative Underlay */}
          <div className="absolute -inset-4 bg-slate-200 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white border-l-4 border-black shadow-2xl overflow-hidden">
            {/* Header Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              
              {/* Route Identity */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="h-3 w-24 transform -skew-x-12" 
                    style={{ backgroundColor: route.color.toLowerCase() }} 
                  />
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                    ID: {route.id.slice(0, 8)}
                  </span>
                </div>
                
                <motion.div layoutId={`route-grade-${route.id}`}>
                  <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-black leading-none mb-2">
                    {route.difficulty_label || route.grade}
                  </h1>
                </motion.div>
                
                {route.difficulty_label && (
                  <div className="text-2xl font-bold text-slate-400 flex items-center gap-2">
                    <span className="h-px w-8 bg-slate-300" />
                    {route.grade}
                  </div>
                )}

                {/* Style & Hold Type Badges */}
                {(route.style || route.hold_type) && (
                  <div className="flex flex-wrap gap-2 mt-4">
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
              </div>

              {/* Setter Stamp */}
              <div className="flex flex-col items-end text-right">
                <div className="bg-black text-white px-4 py-2 transform -skew-x-12 mb-2">
                  <span className="block transform skew-x-12 font-mono text-xs uppercase tracking-widest">
                    Official Set
                  </span>
                </div>
                <div className="font-bold text-lg">{route.setter_name}</div>
                <div className="text-sm text-slate-500 font-mono">
                  {new Date(route.set_date).toLocaleDateString()}
                </div>
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
            
            {/* Rating Module */}
            <div className="bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400" />
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
                Based on {ratingsCount} climber logs
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-bold text-sm mb-3">Your Assessment</h4>
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
                      "{route.setter_notes}"
                    </p>
                  </div>
                )}

                {route.setter_beta && (
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <Info className="w-3 h-3" /> Intended Beta
                    </h3>
                    <p className="font-mono text-sm leading-relaxed relative z-10 text-yellow-400/80 italic">
                      "{route.setter_beta}"
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
                  <Activity className="w-3 h-3" /> Activity Stream
                </h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
              
              <div className="p-6">
                <RouteActivity 
                  routeId={route.id} 
                  initialActivity={activity} 
                  initialPersonalNote={personalNote || ""}
                  user={user}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
