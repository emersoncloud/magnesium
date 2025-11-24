import { getSeasonsLeaderboard } from "@/app/seasons/actions";
import SeasonsLeaderboard from "@/components/SeasonsLeaderboard";
import { auth } from "@/lib/auth";
import { Calendar, Info } from "lucide-react";

export const metadata = {
  title: "Seasons",
  description: "Compete in the seasonal leaderboard.",
};

export default async function SeasonsPage() {
  const session = await auth();
  const leaderboard = await getSeasonsLeaderboard();

  // Calculate season dates (Last 30 days for now)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen relative bg-slate-50 font-sans selection:bg-yellow-400 selection:text-black overflow-hidden">
      {/* Global Technical Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container max-w-3xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-rockmill transform -skew-x-12" />
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter uppercase transform -skew-x-6 mb-4 leading-none">
            SEASON <span className="text-transparent bg-clip-text bg-gradient-to-r from-rockmill to-red-600">LEADERBOARD</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-mono uppercase tracking-widest">
            <div className="bg-black text-white px-3 py-1 transform -skew-x-12">
              <div className="flex items-center gap-2 transform skew-x-12">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-black font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Competition Active</span>
            </div>
          </div>
        </div>

        {/* Info Card - The Monolith Style */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] p-6 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Info className="w-24 h-24 transform rotate-12" />
          </div>

          <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-rockmill" />
            Rules of Engagement
          </h3>

          <div className="space-y-4 relative z-10">
            <p className="font-bold text-lg leading-tight">
              Points are awarded for your single best send or flash on each route.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-slate-500">
              <div className="bg-slate-50 p-3 border border-slate-200">
                <strong className="text-black block mb-1">BASE SCORE</strong>
                (Grade Index + 1) × 100
              </div>
              <div className="bg-red-50 p-3 border border-red-200">
                <strong className="text-rockmill block mb-1">FLASH BONUS</strong>
                +50 POINTS
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <SeasonsLeaderboard data={leaderboard} currentUserId={session?.user?.id} />
      </div>
    </div>
  );
}
