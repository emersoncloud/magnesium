"use client";

import GradeChart from "@/components/GradeChart";
import { LoginButton } from "@/components/LoginButton";
import { RouteBadge } from "@/components/RouteBadge";
import { SetCard } from "@/components/SetCard";
import StyleBreakdown from "@/components/StyleBreakdown";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SettingsProvider } from "@/context/SettingsContext";
import { Activity, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import FeedList from "./FeedList";
import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

// Types
type Route = {
  grade: string;
  route_name: string;
  setter: string;
  color: string;
  wall_id: string;
  set_date: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50 font-sans selection:bg-rockmill selection:text-white overflow-x-hidden">
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

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
        <section className="relative w-full min-h-[90vh] flex flex-col xl:flex-row items-center justify-center container mx-auto px-4 md:px-6 gap-12 xl:gap-24">

          {/* Hero Text */}
          <div className="flex-1 text-center xl:text-left z-10 pt-10 xl:pt-0">
            <div className="inline-block mb-6 px-4 py-1 border-2 border-black bg-rockmill transform -skew-x-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-bold font-mono tracking-[0.2em] text-white transform skew-x-12 block">
                {"// Magnesium (chalk) supports climbers"}
              </span>
            </div>
            <h1
              className="text-3xl md:text-8xl font-black tracking-tighter mb-8 text-balance text-transparent bg-clip-text"
              style={{
                backgroundImage: "url('/chalk.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "drop-shadow(0px 2px 0px rgba(0,0,0,0.1))"
              }}
            >
              A community logbook for Rock Mill climbers
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-slate-600 font-medium mb-10 leading-relaxed mx-auto xl:mx-0 text-balance">
              View the live routes set at Rock Mill. Track your sends and attempts to build your personal profile. Comment and rate routes to provide feedback to the setters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
              <Link href="/sets">
                <Button onClick={() => posthog.capture('marketing_page_view_live_routes_button_click')} size="lg" variant="primary" className="h-16 px-10 text-base bg-black hover:bg-slate-800 text-white border-none">
                  View the Routes
                </Button>
              </Link>
              <Link href="/login">
                <Button onClick={() => posthog.capture('marketing_page_start_logging_button_click')} size="lg" variant="secondary" className="h-16 px-10 text-base">
                  Start your Logbook
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visuals - Skewed Component Composition */}
          <div className="flex-1 relative w-full max-w-[600px] xl:h-[500px] mt-12 xl:mt-0 flex flex-col gap-8 items-center xl:block">
            {/* Floating Elements */}

            {/* Recent Send Card */}
            {recentSend && (
              <div className="xl:absolute xl:top-10 xl:left-0 z-20 transform xl:-rotate-6 hover:rotate-0 transition-transform duration-500 group">
                <Card className="w-auto p-4 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="font-black uppercase tracking-tighter">Recent Send</div>
                    <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold rounded-full overflow-hidden">
                      {recentSend.user_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={recentSend.user_image} alt="User" className="w-full h-full object-cover" />
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
            <div className="xl:absolute xl:top-1/2 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:-translate-y-1/2 z-10 hover:scale-105 transition-transform duration-500">
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
              <div className="xl:absolute xl:bottom-10 xl:right-0 z-20 transform xl:rotate-3 hover:rotate-0 transition-transform duration-500">
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
                <span className="text-zinc-500 text-xs font-mono uppercase">{"// Set by "}{route.setter}</span>
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
                  Know Your<br />Climbing Style.
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
                  <GradeChart activity={exampleUserActivity} externalMode={"DIFFICULTY"} hideControls />
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
                {"// Real-time activity from the gym"}
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <FeedList activity={recentActivity} />
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
            <nav className="flex items-center gap-6">
              <Link href="https://rockmillclimbing.com" className="text-sm font-bold uppercase tracking-tight hover:text-rockmill transition-colors">
                Rock Mill Climbing
              </Link>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="text-sm font-bold uppercase tracking-tight hover:text-rockmill transition-colors"
              >
                Feedback
              </button>
            </nav>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Data Driven Climbing.</p>
          </div>
        </div>
      </footer>

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