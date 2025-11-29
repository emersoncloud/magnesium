import { getRoutes, getBrowserRoutes } from "@/app/actions";
import { Suspense } from "react";
import { WallCardSkeleton } from "@/components/skeletons";
import SetsPageContent from "@/components/SetsPageContent";

export default async function SetsPage() {
  const [allRoutes, browserRoutes] = await Promise.all([getRoutes(), getBrowserRoutes()]);

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WallCardSkeleton />
          <WallCardSkeleton />
          <WallCardSkeleton />
        </div>
      }
    >
      <SetsPageContent allRoutes={allRoutes} browserRoutes={browserRoutes} />
    </Suspense>
  );
}
