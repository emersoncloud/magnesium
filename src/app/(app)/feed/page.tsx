import { getGlobalActivity } from "@/app/actions";
import { Suspense } from "react";
import { FeedItemSkeleton } from "@/components/skeletons";
import FeedList from "@/components/FeedList";

async function FeedContainer() {
  const activity = await getGlobalActivity();
  return <FeedList activity={activity} />;
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto pb-24">
      <h1 className="text-5xl font-black text-black mb-8 uppercase tracking-tighter mt-6">Activity Feed</h1>
      <Suspense fallback={<div className="space-y-4"><FeedItemSkeleton /><FeedItemSkeleton /><FeedItemSkeleton /></div>}>
        <FeedContainer />
      </Suspense>
    </div>
  );
}


