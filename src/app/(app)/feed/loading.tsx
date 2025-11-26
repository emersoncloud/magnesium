import { FeedItemSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-8 mt-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
      </div>
    </div>
  );
}
