"use client";

import Link from "next/link";
import { Mountain, Activity, TrendingUp, BarChart3, Settings2, Check, Zap, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoginButton } from "@/components/LoginButton";
import { Card } from "@/components/ui/Card";
import GradeChart from "@/components/GradeChart";
import StyleBreakdown from "@/components/StyleBreakdown";
import VisitHistory from "@/components/VisitHistory";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import { RouteBadge } from "@/components/RouteBadge";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { SetCard } from "@/components/SetCard";

// Types
type Route = {
  grade: string;
  route_name: string;
  setter: string;
  color: string;
  wall_id: string;
  set_date: string;
};

type ActivityItem = any; 

interface MarketingPageContentProps {
  routes: Route[];
  recentActivity: ActivityItem[];
  exampleUserActivity: ActivityItem[];
  recentSend: ActivityItem | null;
  newSet: { wallName: string; count: number; colors: string[]; date: string } | null;
  gymStats: { totalRoutes: number; gradeCount: number };
}

function MarketingContent({ 
  routes, 
  recentActivity, 
  exampleUserActivity, 
  recentSend, 
  newSet,
  gymStats
}: MarketingPageContentProps) {
  const { gradeDisplay, toggleGradeDisplay } = useSettings();
  const [showBeta, setShowBeta] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50 font-sans selection:bg-rockmill selection:text-white overflow-x-hidden">
      {/* Global Technical Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 h-20 flex items-center border-b-2 border-black bg-white/90 backdrop-blur-md">
        <Link className="flex items-center justify-center group" href="#">
          <span className="text-2xl font-black font-rockmill tracking-tighter uppercase hidden sm:inline-block text-rockmill">Rock Mill <span className="text-slate-400">Magnesium</span></span>
          <span className="text-2xl font-black font-rockmill tracking-tighter sm:hidden text-rockmill">RM<span className="text-slate-400">Mg</span></span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          
          <LoginButton />
        </nav>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section - Component Composition */}
        <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-center container mx-auto px-4 md:px-6 gap-12 lg:gap-24">
          
          {/* Hero Text */}
          <div className="flex-1 text-center lg:text-left z-10 pt-10 lg:pt-0">
            <div className="inline-block mb-6 px-4 py-1 border-2 border-black bg-rockmill transform -skew-x-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-white transform skew-x-12 block">
                // Live Data
              </span>
            </div>
            <h1 className="text-3xl md:text-8xl font-black tracking-tighter mb-8 text-balance">
              A community logbook for Rock Mill climbers
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-slate-600 font-medium mb-10 leading-relaxed mx-auto lg:mx-0 text-balance">
              View the live routes set at Rock Mill. Track your sends and attempts to build your personal profile. Comment and rate routes to provide feedback to the setters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sets">
                <Button size="lg" variant="primary" className="h-16 px-10 text-base bg-black hover:bg-slate-800 text-white border-none">
                  View Live Routes
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-16 px-10 text-base">
                  Start Logging
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visuals - Skewed Component Composition */}
          <div className="flex-1 relative w-full max-w-[600px] lg:h-[500px] mt-12 lg:mt-0 flex flex-col gap-8 items-center lg:block">
            {/* Floating Elements */}
            
            {/* Recent Send Card */}
            {recentSend && (
              <div className="lg:absolute lg:top-10 lg:left-0 z-20 transform lg:-rotate-6 hover:rotate-0 transition-transform duration-500 group">
                <Card className="w-auto p-4 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="font-black uppercase tracking-tighter">Recent Send</div>
                    <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold rounded-full overflow-hidden">
                       {recentSend.user_image ? (
                         <img src={recentSend.user_image} className="w-full h-full object-cover" />
                       ) : (
                         recentSend.user_name?.[0] || "?"
                       )}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{recentSend.user_name || "Climber"}</div>
                      <RouteBadge 
                        route={{
                          id: recentSend.route_id,
                          grade: recentSend.route_grade,
                          difficulty_label: recentSend.route_label,
                          color: recentSend.route_color,
                          wall_id: recentSend.wall_id,
                          setter_name: recentSend.setter_name,
                          set_date: recentSend.set_date,
                        }}
                        className="scale-90 origin-left"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* sets Stats Card */}
            <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 hover:scale-105 transition-transform duration-500">
               <Card className="w-80 p-6 text-white border-2 border-rockmill shadow-[16px_16px_0px_0px_rgba(0,0,0,0.3)]">
                 <div className="flex items-center gap-2 mb-4 text-rockmill">
                   <TrendingUp className="w-5 h-5" />
                   <span className="font-mono uppercase tracking-widest text-xs">Gym Stats</span>
                 </div>
                 <div className="text-4xl text-black mb-1">{gymStats.totalRoutes} <span className="text-black text-lg">Routes</span></div>
                 <div className="text-sm text-black mb-4">Across {gymStats.gradeCount} difficulties</div>
                 <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-rockmill w-3/4" />
                 </div>
               </Card>
            </div>

            {/* New Set Card */}
            {newSet && (
              <div className="lg:absolute lg:bottom-10 lg:right-0 z-20 transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
                <SetCard 
                  wallName={newSet.wallName}
                  routeCount={newSet.count}
                  date={newSet.date}
                  colors={newSet.colors}
                  className="w-64"
                />
              </div>
            )}
            
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-rockmill/10 rounded-full blur-3xl -z-10" />
          </div>
        </section>

        {/* Live Route Ticker */}
        <section id="routes" className="w-full bg-black text-white py-4 border-y-2 border-black overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...routes, ...routes].map((route, i) => (
              <div key={i} className="inline-flex items-center mx-8 gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-default">
                <span className="text-rockmill font-mono text-sm">[{route.grade}]</span>
                <span className="font-black uppercase tracking-tight">{route.route_name}</span>
                <span className="text-zinc-500 text-xs font-mono uppercase">// Set by {route.setter}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Showcase (Example Profile) */}
        <section id="analytics" className="py-24 bg-white border-b-2 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6 sticky top-24">
                <div className="inline-flex items-center gap-2 text-rockmill font-mono uppercase tracking-widest text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span>Deep Analytics</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                  Know Your<br/>Climbing Style.
                </h2>
                <p className="text-lg text-slate-600">
                  Magnesium automatically analyzes your sends to visualize your grade pyramid, consistency, and style preferences.
                </p>
                <ul className="space-y-3">
                  {["Grade Distribution Charts", "Session Consistency Tracking", "Style & Hold Analysis", "Personal Bests"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold uppercase tracking-tight text-sm">
                      <div className="w-1.5 h-1.5 bg-black transform rotate-45" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full space-y-6">
                <div className="grid gap-6">
                  <GradeChart activity={exampleUserActivity} externalMode={gradeDisplay === "v-scale" ? "V-SCALE" : "DIFFICULTY"} hideControls />
                  <StyleBreakdown activity={exampleUserActivity} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Community Feed */}
        <section id="community" className="py-24 bg-slate-100 border-b-2 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Community Pulse</h2>
              <p className="text-slate-500 font-mono uppercase tracking-widest">
                // Real-time activity from the gym
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
              {recentActivity.map((item) => (
                <Card key={item.id} className="p-4 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center transform -skew-x-12 font-bold text-xs">
                        {item.user_name?.[0] || "?"}
                      </div>
                      <div className="font-bold uppercase tracking-tight text-sm truncate max-w-[100px]">{item.user_name || "Climber"}</div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{new Date(item.created_at!).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex-1">
                    {item.action_type === "SEND" && (
                        <div className="bg-green-50 border border-green-100 p-3 rounded text-center">
                            <div className="text-green-600 font-black uppercase tracking-tighter text-lg">SENT</div>
                            <div className="text-xs font-bold text-slate-700">{item.route_label || "Route"}</div>
                        </div>
                    )}
                    {item.action_type === "FLASH" && (
                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-center">
                            <div className="text-yellow-600 font-black uppercase tracking-tighter text-lg">FLASHED</div>
                            <div className="text-xs font-bold text-slate-700">{item.route_label || "Route"}</div>
                        </div>
                    )}
                    {item.action_type === "COMMENT" && (
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded">
                             <div className="flex items-center gap-1 text-slate-400 text-xs font-mono uppercase mb-1">
                                <MessageSquare className="w-3 h-3" /> Comment
                             </div>
                             <div className="text-sm text-slate-700 italic">
                                {item.content}
                             </div>
                        </div>
                    )}
                    {item.action_type === "RATING" && (
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded text-center">
                             <div className="flex justify-center gap-1 text-yellow-400 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < parseInt(item.content) ? "fill-current" : "text-slate-200"}`} />
                                ))}
                             </div>
                             <div className="text-xs font-bold text-slate-700">{item.route_label || "Route"}</div>
                        </div>
                    )}
                  </div>

                  {item.route_grade && (
                    <div className="flex justify-end">
                       <Badge variant="outline" className="font-mono text-[10px] border-black">
                         {item.route_grade}
                       </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/sets">
                <Button variant="secondary" className="border-2 border-black bg-transparent hover:bg-black hover:text-white">
                  View All Activity
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t-2 border-black py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black font-rockmill tracking-tighter text-rockmill transform -skew-x-12 inline-block">
                RM<span className="text-slate-400">Mg</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Data Driven Climbing.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Settings */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isSettingsOpen && (
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200 min-w-[200px]">
             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between gap-4">
                 <span className="font-mono text-xs uppercase font-bold">V-Scale / Diff</span>
                 <Switch 
                    checked={gradeDisplay === "difficulty"} 
                    onCheckedChange={() => toggleGradeDisplay()}
                    className="data-[state=checked]:bg-rockmill"
                 />
               </div>
               <div className="flex items-center justify-between gap-4">
                 <span className="font-mono text-xs uppercase font-bold">Show Beta</span>
                 <Switch 
                    checked={showBeta} 
                    onCheckedChange={setShowBeta}
                    className="data-[state=checked]:bg-rockmill"
                 />
               </div>
             </div>
          </div>
        )}
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-14 h-14 bg-rockmill text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Settings2 className={`w-6 h-6 transition-transform duration-300 ${isSettingsOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default function MarketingPageContent(props: MarketingPageContentProps) {
  return (
    <SettingsProvider>
      <MarketingContent {...props} />
    </SettingsProvider>
  );
}