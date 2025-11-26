import { RouteCardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <RouteCardSkeleton />
        <RouteCardSkeleton />
        <RouteCardSkeleton />
        <RouteCardSkeleton />
        <RouteCardSkeleton />
      </div>
    </div>
  );
}
