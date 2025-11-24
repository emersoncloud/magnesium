"use client";

import { useState, useTransition } from "react";
import { generateRoutePlan, RoutePlan } from "@/app/actions";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RouteBadge } from "@/components/RouteBadge";
import { Loader2, Zap, Dumbbell, Trophy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RoutePlanGenerator() {
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showBeta } = useSettings();

  if (!showBeta) return null;

  const handleGenerate = () => {
    startTransition(async () => {
      const newPlan = await generateRoutePlan();
      setPlan(newPlan);
    });
  };

  return (
    <div className="mb-12">
      {!plan ? (
        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Dumbbell className="w-64 h-64 transform rotate-12" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Need a Plan?
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Generate a personalized training session based on your max grade.
              We'll curate a warm-up, a main set, and some challenge routes just for you.
            </p>

            <Button
              onClick={handleGenerate}
              disabled={isPending}
              size="lg"
              className="bg-rockmill hover:bg-red-600 text-white border-none font-bold uppercase tracking-widest h-14 px-8"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Building Plan...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2 fill-current" />
                  Generate Session
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Your Session</h2>
            <Button
              onClick={handleGenerate}
              variant="ghost"
              disabled={isPending}
              className="text-slate-500 hover:text-black"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Warm Up */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-100 flex flex-col h-full">
              <div className="mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-blue-900 mb-2">
                  {plan.warmUp.title}
                </h3>
                <p className="text-sm text-blue-700/70 leading-relaxed">
                  {plan.warmUp.description}
                </p>
              </div>
              <div className="space-y-3 flex-1">
                {plan.warmUp.routes.map(route => (
                  <Link key={route.id} href={`/route/${route.id}`} className="block group">
                    <div className="bg-white p-3 rounded border border-blue-100 hover:border-blue-300 transition-colors flex items-center justify-between shadow-sm">
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 truncate mr-2">
                        {route.difficulty_label || route.grade}
                      </span>
                      <RouteBadge route={route} className="scale-75 origin-right" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Main Set */}
            <Card className="p-6 bg-white border-2 border-slate-200 shadow-lg flex flex-col h-full transform md:-translate-y-4">
              <div className="mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-800">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">
                  {plan.mainSet.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {plan.mainSet.description}
                </p>
              </div>
              <div className="space-y-3 flex-1">
                {plan.mainSet.routes.map(route => (
                  <Link key={route.id} href={`/route/${route.id}`} className="block group">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200 hover:border-slate-400 transition-colors flex items-center justify-between shadow-sm">
                      <span className="font-bold text-slate-700 group-hover:text-black truncate mr-2">
                        {route.difficulty_label || route.grade}
                      </span>
                      <RouteBadge route={route} className="scale-75 origin-right" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Challenge */}
            <Card className="p-6 bg-yellow-50 border-2 border-yellow-100 flex flex-col h-full">
              <div className="mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                  <Trophy className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-yellow-900 mb-2">
                  {plan.challenge.title}
                </h3>
                <p className="text-sm text-yellow-700/70 leading-relaxed">
                  {plan.challenge.description}
                </p>
              </div>
              <div className="space-y-3 flex-1">
                {plan.challenge.routes.map(route => (
                  <Link key={route.id} href={`/route/${route.id}`} className="block group">
                    <div className="bg-white p-3 rounded border border-yellow-100 hover:border-yellow-300 transition-colors flex items-center justify-between shadow-sm">
                      <span className="font-bold text-slate-700 group-hover:text-yellow-600 truncate mr-2">
                        {route.difficulty_label || route.grade}
                      </span>
                      <RouteBadge route={route} className="scale-75 origin-right" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
