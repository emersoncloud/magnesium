import { getBrowserRoutes } from "@/app/actions";
import RouteBrowser from "@/components/RouteBrowser";
import { Suspense } from "react";

export default async function RoutesPage() {
  const routes = await getBrowserRoutes();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Route Browser</h1>
      <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading routes...</div>}>
        <RouteBrowser routes={routes} />
      </Suspense>
    </div>
  );
}
