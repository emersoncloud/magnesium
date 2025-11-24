import RouteDetails from "@/components/RouteDetails";
import Drawer from "@/components/ui/Drawer";
import { Suspense } from "react";
import RouteDetailsSkeleton from "@/components/RouteDetailsSkeleton";
import { getRoute } from "@/app/actions";
import { getRouteColor } from "@/lib/utils";

export default async function InterceptedRoutePage({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId } = await params;
  const route = await getRoute(routeId);
  const backgroundColor = route ? getRouteColor(route.color) : "#f8fafc";

  return (
    <Drawer>
      <Suspense fallback={<RouteDetailsSkeleton backgroundColor={backgroundColor} />}>
        <RouteDetails id={routeId} />
      </Suspense>
    </Drawer>
  );
}
