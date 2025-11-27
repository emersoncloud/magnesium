"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { getPaginatedGlobalActivity, type GlobalActivityItem } from "@/app/actions";
import FeedList from "@/components/FeedList";
import FeedFilters from "@/components/FeedFilters";
import { ChalkLoader } from "@/components/ChalkLoader";

interface FeedContainerProps {
  initialItems: GlobalActivityItem[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export default function FeedContainer({
  initialItems,
  initialCursor,
  initialHasMore,
}: FeedContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const DEFAULT_FILTERS = ["SEND", "FLASH", "ACHIEVEMENT"];
  const filterParam = searchParams.get("filter");
  const initialFilters = filterParam ? filterParam.split(",") : DEFAULT_FILTERS;

  const [items, setItems] = useState<GlobalActivityItem[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilters);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursor) return;

    setIsLoadingMore(true);
    try {
      const result = await getPaginatedGlobalActivity({
        cursor,
        limit: 20,
        activityTypes: activeFilters.length > 0 ? activeFilters : undefined,
      });

      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, hasMore, isLoadingMore, activeFilters]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchFilteredData = async () => {
      setIsFilterLoading(true);
      try {
        const result = await getPaginatedGlobalActivity({
          limit: 20,
          activityTypes: activeFilters.length > 0 ? activeFilters : undefined,
        });

        setItems(result.items);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } finally {
        setIsFilterLoading(false);
      }
    };

    fetchFilteredData();

    const isDefaultFilters =
      activeFilters.length === DEFAULT_FILTERS.length &&
      DEFAULT_FILTERS.every((f) => activeFilters.includes(f));

    const newParams = new URLSearchParams();
    if (activeFilters.length > 0 && !isDefaultFilters) {
      newParams.set("filter", activeFilters.join(","));
    }
    const shouldHaveParams = activeFilters.length > 0 && !isDefaultFilters;
    const newUrl = shouldHaveParams ? `?${newParams.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [activeFilters, router]);

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6" />
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
          Activity Feed
        </h1>
      </div>

      <FeedFilters
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />

      {isFilterLoading ? (
        <div className="flex justify-center py-12">
          <ChalkLoader size="md" textContent="Filtering..." />
        </div>
      ) : (
        <>
          <FeedList activity={items} />

          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <ChalkLoader size="sm" showText={false} />
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="text-center py-8 text-slate-400 font-mono text-sm uppercase tracking-wider">
              You&apos;ve reached the end
            </div>
          )}
        </>
      )}
    </div>
  );
}
