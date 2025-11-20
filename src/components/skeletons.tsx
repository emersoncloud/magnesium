export function WallCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded mt-4"></div>
    </div>
  );
}

export function FeedItemSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
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
