import { getTrainingPlan, getBrowserRoutes } from "@/app/actions";
import { notFound } from "next/navigation";
import TrainingPlanDetailContent from "@/components/TrainingPlanDetailContent";
import { auth } from "@/lib/auth";

interface TrainingPlanDetailPageProps {
  params: Promise<{ planId: string }>;
}

export default async function TrainingPlanDetailPage({ params }: TrainingPlanDetailPageProps) {
  const { planId } = await params;
  const [plan, browserRoutes, session] = await Promise.all([
    getTrainingPlan(planId),
    getBrowserRoutes(),
    auth(),
  ]);

  if (!plan) {
    notFound();
  }

  const isOwner = session?.user?.id === plan.user_id;

  return <TrainingPlanDetailContent plan={plan} browserRoutes={browserRoutes} isOwner={isOwner} />;
}
