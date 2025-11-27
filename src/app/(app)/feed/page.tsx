import { getPaginatedGlobalActivity } from "@/app/actions";
import FeedContainer from "@/components/FeedContainer";

const DEFAULT_FILTERS = ["SEND", "FLASH", "ACHIEVEMENT"];

export default async function FeedPage() {
  const initialData = await getPaginatedGlobalActivity({
    limit: 20,
    activityTypes: DEFAULT_FILTERS,
  });

  return (
    <FeedContainer
      initialItems={initialData.items}
      initialCursor={initialData.nextCursor}
      initialHasMore={initialData.hasMore}
    />
  );
}
