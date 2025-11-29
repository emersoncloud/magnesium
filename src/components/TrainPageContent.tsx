"use client";

import { useState, useTransition } from "react";
import {
  BrowserRoute,
  SavedTrainingPlan,
  TrainingPlanType,
  TrainingPlanLength,
  GeneratedPlan,
  generateNewTrainingPlan,
  saveTrainingPlan,
} from "@/app/actions";
import { Users, User, Plus } from "lucide-react";
import TrainingTypeSelector from "./TrainingTypeSelector";
import TrainingConfigForm from "./TrainingConfigForm";
import TrainingPlanEditor from "./TrainingPlanEditor";
import TrainingPlanCard from "./TrainingPlanCard";

type TabType = "my-plans" | "community";

interface TrainPageContentProps {
  userPlans: SavedTrainingPlan[];
  communityPlans: SavedTrainingPlan[];
  browserRoutes: BrowserRoute[];
}

export default function TrainPageContent({
  userPlans,
  communityPlans,
  browserRoutes,
}: TrainPageContentProps) {
  const hasPlans = userPlans.length > 0;
  const [activeTab, setActiveTab] = useState<TabType>("my-plans");
  const [showCreateForm, setShowCreateForm] = useState(!hasPlans);
  const [selectedType, setSelectedType] = useState<TrainingPlanType | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [planConfig, setPlanConfig] = useState<{
    baseGrade: string;
    length: TrainingPlanLength;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGeneratePlan = (
    type: TrainingPlanType,
    baseGrade: string,
    length: TrainingPlanLength
  ) => {
    startTransition(async () => {
      const plan = await generateNewTrainingPlan(type, baseGrade, length);
      setGeneratedPlan(plan);
      setPlanConfig({ baseGrade, length });
    });
  };

  const handleSavePlan = async (
    name: string,
    routes: { route_id: string; section_name: string | null; order_index: number }[]
  ) => {
    if (!selectedType || !planConfig) return;

    await saveTrainingPlan({
      name,
      type: selectedType,
      base_grade: planConfig.baseGrade,
      length: planConfig.length,
      routes,
    });

    setShowCreateForm(false);
    setSelectedType(null);
    setGeneratedPlan(null);
    setPlanConfig(null);
  };

  const handleResetCreate = () => {
    setSelectedType(null);
    setGeneratedPlan(null);
    setPlanConfig(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    handleResetCreate();
  };

  const renderCreateForm = () => (
    <div className="space-y-8">
      {!selectedType ? (
        <TrainingTypeSelector onSelect={setSelectedType} />
      ) : !generatedPlan ? (
        <div className="space-y-6">
          <button
            onClick={handleResetCreate}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            &larr; Back to training types
          </button>
          <TrainingConfigForm
            type={selectedType}
            onGenerate={(baseGrade, length) => handleGeneratePlan(selectedType, baseGrade, length)}
            isPending={isPending}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setGeneratedPlan(null)}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            &larr; Back to configuration
          </button>
          <TrainingPlanEditor
            plan={generatedPlan}
            browserRoutes={browserRoutes}
            onSave={handleSavePlan}
            onCancel={handleCancelCreate}
          />
        </div>
      )}
    </div>
  );

  const renderPlansTab = () => {
    const plans = activeTab === "my-plans" ? userPlans : communityPlans;
    const emptyMessage =
      activeTab === "my-plans"
        ? "You haven't created any training plans yet."
        : "No community plans have been shared yet.";

    if (plans.length === 0) {
      return (
        <div className="text-center py-12 text-slate-500">
          <p>{emptyMessage}</p>
          {activeTab === "my-plans" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Plan
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <TrainingPlanCard key={plan.id} plan={plan} showAuthor={activeTab === "community"} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 py-8 md:py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wider">Train</h1>

        {!showCreateForm && hasPlans && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        )}
      </div>

      {showCreateForm ? (
        <div className="space-y-6">
          {hasPlans && (
            <button
              onClick={handleCancelCreate}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              &larr; Back to plans
            </button>
          )}
          {renderCreateForm()}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("my-plans")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "my-plans"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Plans</span>
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "community"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </button>
          </div>

          {renderPlansTab()}
        </>
      )}
    </div>
  );
}
