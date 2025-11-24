import { getUserTrainingPlans, getCommunityTrainingPlans, getBrowserRoutes } from "@/app/actions";
import { Suspense } from "react";
import TrainPageContent from "@/components/TrainPageContent";

export default async function TrainPage() {
  const [userPlans, communityPlans, browserRoutes] = await Promise.all([
    getUserTrainingPlans(),
    getCommunityTrainingPlans(),
    getBrowserRoutes(),
  ]);

  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <TrainPageContent
        userPlans={userPlans}
        communityPlans={communityPlans}
        browserRoutes={browserRoutes}
      />
    </Suspense>
  );
}
