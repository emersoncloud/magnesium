import { getSeasonsLeaderboard } from "@/app/seasons/actions";
import SeasonsLeaderboard from "@/components/SeasonsLeaderboard";
import { auth } from "@/lib/auth";
import { Calendar, Info } from "lucide-react";

export const metadata = {
  title: "Seasons | Route Mill",
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
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
          Current Season
        </h1>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
          <span className="w-1 h-1 bg-slate-600 rounded-full mx-1" />
          <span className="text-yellow-500">Active</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8 flex gap-4">
        <div className="bg-slate-800 p-2 rounded-lg h-fit">
          <Info className="w-5 h-5 text-slate-400" />
        </div>
        <div className="text-sm text-slate-400 space-y-1">
          <p>
            <strong className="text-slate-200">How it works:</strong> Points are awarded for your best send or flash on each route.
          </p>
          <ul className="list-disc list-inside pl-1 space-y-1 opacity-80">
            <li>Base Score: (Grade Index + 1) × 100</li>
            <li>Flash Bonus: +50 points</li>
            <li>Only climbs within the current season count.</li>
          </ul>
        </div>
      </div>

      {/* Leaderboard */}
      <SeasonsLeaderboard data={leaderboard} currentUserId={session?.user?.id} />
    </div>
  );
}
