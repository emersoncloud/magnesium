import RouteDetails from "@/components/RouteDetails";
import Drawer from "@/components/ui/Drawer";
import { Suspense } from "react";
import RouteDetailsSkeleton from "@/components/RouteDetailsSkeleton";
import { getRouteColor } from "@/lib/utils";

function getSkeletonBackgroundColor(color: string | undefined): string {
  if (!color) return "#f8fafc";
  const routeColor = getRouteColor(color);
  return `color-mix(in srgb, ${routeColor} 25%, white)`;
}

export default async function InterceptedRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ routeId: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { routeId } = await params;
  const { color } = await searchParams;
  const skeletonBackgroundColor = getSkeletonBackgroundColor(color);

  return (
    <Drawer>
      <Suspense fallback={<RouteDetailsSkeleton backgroundColor={skeletonBackgroundColor} />}>
        <RouteDetails id={routeId} />
      </Suspense>
    </Drawer>
  );
}
