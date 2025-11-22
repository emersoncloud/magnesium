import RouteDetails from "@/components/RouteDetails";

export default async function RoutePage({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId } = await params;
  return <RouteDetails id={routeId} />;
}
