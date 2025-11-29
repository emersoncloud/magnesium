import { GRADES } from "@/lib/constants/walls";
import { Crown, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";

type ActivityLog = {
  action_type: string;
  route_grade: string | null;
};

export default function BestAscents({ activity }: { activity: ActivityLog[] }) {
  const getBestGrade = (type: "SEND" | "FLASH") => {
    const relevant = activity.filter((a) => a.action_type === type && a.route_grade);
    if (relevant.length === 0) return null;

    // Sort by grade index
    const sorted = relevant.sort((a, b) => {
      const idxA = (GRADES as readonly string[]).indexOf(a.route_grade as string);
      const idxB = (GRADES as readonly string[]).indexOf(b.route_grade as string);
      return idxB - idxA; // Descending
    });

    return sorted[0].route_grade;
  };

  const bestSend = getBestGrade("SEND");
  const bestFlash = getBestGrade("FLASH");

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card className="p-6 relative overflow-hidden group border-l-4 border-l-green-500">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Crown className="w-16 h-16 text-green-600" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
          Best Send
        </h3>
        <div className="text-4xl font-black text-slate-900">
          {bestSend || <span className="text-slate-300 text-2xl">-</span>}
        </div>
      </Card>

      <Card className="p-6 relative overflow-hidden group border-l-4 border-l-yellow-400">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap className="w-16 h-16 text-yellow-500 fill-current" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
          Best Flash
        </h3>
        <div className="text-4xl font-black text-slate-900">
          {bestFlash || <span className="text-slate-300 text-2xl">-</span>}
        </div>
      </Card>
    </div>
  );
}
