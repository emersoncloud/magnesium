import { WallCardSkeleton } from "@/components/skeletons";
import { LayoutGrid, List } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            Current Sets
          </h1>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
            What&apos;s on the wall
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-slate-900 shadow-sm">
            <LayoutGrid className="w-10 h-10" />
            <span className="hidden sm:inline text-xl">By Location</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-md text-slate-500">
            <List className="w-10 h-10" />
            <span className="hidden sm:inline text-xl">As List</span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            Right to Left
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
            <WallCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
