import { getDashboardData } from "@/app/actions";
import { auth } from "@/lib/auth";
import { DashboardContent } from "@/components/dashboard";
import { cookies } from "next/headers";

export default async function OverviewPage() {
  const session = await auth();
  const dashboardData = await getDashboardData(session?.user?.id);

  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get("route-mill-settings");
  let showTraining = false;

  if (settingsCookie?.value) {
    try {
      const settings = JSON.parse(settingsCookie.value);
      showTraining = settings.experimentalFeatures ?? false;
    } catch {
      showTraining = false;
    }
  }

  return (
    <DashboardContent
      user={session?.user ?? null}
      dashboardData={dashboardData}
      showTraining={showTraining}
    />
  );
}
