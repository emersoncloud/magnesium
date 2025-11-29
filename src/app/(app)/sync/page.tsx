import { auth, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import RouteSyncView from "@/components/RouteSyncView";

export default async function SyncPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  if (!isAdmin(session.user.email)) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Access Denied: You are not an admin.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Route Synchronization</h1>
        <p className="text-gray-500 mt-2">Manage route data from Google Sheets</p>
      </div>

      <RouteSyncView />
    </div>
  );
}
