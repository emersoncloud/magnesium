export function WallCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 w-36 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded border-2 border-black"></div>
      </div>
    </div>
  );
}

export function FeedItemSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse overflow-hidden">
      <div className="h-12 bg-gray-100 border-b border-gray-200" />
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 transform -skew-x-6" />
        <div className="flex-1 pt-1">
          <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RouteCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-6 w-8 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
    </div>
  );
}

export function HoldSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse shadow-lg ${className || "w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44"}`}
      style={{
        borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white/40 rounded-xl p-2 w-12 h-8 md:w-16 md:h-10" />
      </div>
    </div>
  );
}
