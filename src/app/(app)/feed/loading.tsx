import { Activity } from "lucide-react";

function FeedItemSkeleton() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden animate-pulse">
      <div className="h-16 bg-slate-100 border-b border-slate-200" />
      <div className="p-4 flex gap-3">
        <div className="w-10 h-10 bg-slate-200 transform -skew-x-6 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-9 w-24 bg-slate-200 rounded transform -skew-x-12 animate-pulse flex-shrink-0"
        />
      ))}
    </div>
  );
}

export default function FeedLoading() {
  return (
    <div className="container mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6" />
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
          Activity Feed
        </h1>
      </div>

      <div className="mb-6">
        <FilterSkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <FeedItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
