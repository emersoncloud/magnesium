import RouteDetails from "@/components/RouteDetails";
import Modal from "@/components/ui/Modal";

export default async function InterceptedRoutePage({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId } = await params;
  return (
    <Modal>
      <RouteDetails id={routeId} />
    </Modal>
  );
}
