import { HoldSkeleton } from "@/components/skeletons";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="relative z-10 p-6 pb-2 border-b-2 border-black/5 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <Link href="/sets" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rockmill transition-colors mb-4 font-mono">
          <div className="w-6 h-6 border border-slate-300 group-hover:border-rockmill flex items-center justify-center transform -skew-x-12 transition-colors">
            <ArrowLeft className="w-3 h-3 transform skew-x-12" />
          </div>
          <span>Return to Sets</span>
        </Link>

        <div className="flex items-baseline gap-4">
          <div className="h-14 md:h-20 w-64 bg-gray-200 rounded animate-pulse transform -skew-x-6" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 max-w-7xl mx-auto">
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
          <HoldSkeleton />
        </div>
      </div>
    </div>
  );
}
