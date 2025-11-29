"use client";

import { useState, useTransition } from "react";
import {
  BrowserRoute,
  SavedTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  togglePlanPublic,
  copyTrainingPlan,
} from "@/app/actions";
import { ArrowLeft, Pencil, Trash2, Globe, Lock, Save, X, Copy, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import RoutePickerDrawer from "./RoutePickerDrawer";
import RouteHold from "./RouteHold";

interface TrainingPlanDetailContentProps {
  plan: SavedTrainingPlan;
  browserRoutes: BrowserRoute[];
  isOwner: boolean;
}

export default function TrainingPlanDetailContent({
  plan,
  browserRoutes,
  isOwner,
}: TrainingPlanDetailContentProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(plan.name);
  const [editedRoutes, setEditedRoutes] = useState(plan.routes);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelectedRouteIds = new Set(editedRoutes.map((r) => r.route_id));

  const groupedRoutes = editedRoutes.reduce(
    (acc, route) => {
      const sectionName = route.section_name || "Routes";
      if (!acc[sectionName]) acc[sectionName] = [];
      acc[sectionName].push(route);
      return acc;
    },
    {} as Record<string, typeof editedRoutes>
  );

  const handleSaveChanges = () => {
    startTransition(async () => {
      await updateTrainingPlan(plan.id, {
        name: editedName,
        routes: editedRoutes.map((r, i) => ({
          route_id: r.route_id,
          section_name: r.section_name,
          order_index: i,
        })),
      });
      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this training plan?")) return;

    startTransition(async () => {
      await deleteTrainingPlan(plan.id);
      router.push("/train");
    });
  };

  const handleTogglePublic = () => {
    startTransition(async () => {
      await togglePlanPublic(plan.id);
      router.refresh();
    });
  };

  const handleCopy = () => {
    startTransition(async () => {
      const { id } = await copyTrainingPlan(plan.id);
      router.push(`/train/${id}`);
    });
  };

  const handleRemoveRoute = (routeId: string) => {
    setEditedRoutes((prev) => prev.filter((r) => r.route_id !== routeId));
  };

  const handleEditRoute = (index: number) => {
    setEditingRouteIndex(index);
    setIsDrawerOpen(true);
  };

  const handleAddRoute = () => {
    setEditingRouteIndex(null);
    setIsDrawerOpen(true);
  };

  const handleRouteSelect = (route: BrowserRoute) => {
    if (editingRouteIndex !== null) {
      setEditedRoutes((prev) => {
        const newRoutes = [...prev];
        newRoutes[editingRouteIndex] = {
          ...newRoutes[editingRouteIndex],
          route_id: route.id,
          route,
        };
        return newRoutes;
      });
    } else {
      const lastSectionName =
        editedRoutes.length > 0 ? editedRoutes[editedRoutes.length - 1].section_name : null;

      setEditedRoutes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          route_id: route.id,
          section_name: lastSectionName,
          order_index: prev.length,
          route,
        },
      ]);
    }

    setIsDrawerOpen(false);
    setEditingRouteIndex(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(plan.name);
    setEditedRoutes(plan.routes);
  };

  return (
    <div className="space-y-8 py-8 md:py-12">
      <div className="space-y-4">
        <Link
          href="/train"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-rockmill focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-slate-800">{plan.name}</h1>
            )}
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-slate-500 capitalize">{plan.type}</span>
              <span className="text-sm text-slate-500">{plan.base_grade}</span>
              <span className="text-sm text-slate-500 capitalize">{plan.length}</span>
              {plan.user_name && !isOwner && (
                <span className="text-sm text-slate-500">by {plan.user_name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleTogglePublic}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {plan.is_public ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Share
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={handleCopy}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy to My Plans
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedRoutes).map(([sectionName, routes]) => (
          <div key={sectionName} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">{sectionName}</h2>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {routes.map((planRoute) => (
                <div key={planRoute.id} className="relative group">
                  {isEditing ? (
                    <>
                      <RouteHold route={planRoute.route} size="md" showStats={false} />
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <button
                          onClick={() =>
                            handleEditRoute(editedRoutes.findIndex((r) => r.id === planRoute.id))
                          }
                          className="p-1.5 rounded-full bg-white shadow-md hover:bg-slate-100 text-slate-600"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveRoute(planRoute.route_id)}
                          className="p-1.5 rounded-full bg-white shadow-md hover:bg-red-100 text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link href={`/route/${planRoute.route_id}`}>
                      <RouteHold route={planRoute.route} size="md" showStats={true} />
                    </Link>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={handleAddRoute}
                  className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100"
                >
                  <Plus className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>
        ))}

        {editedRoutes.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            This plan has no routes.
            {isEditing && (
              <button
                onClick={handleAddRoute}
                className="mt-4 block mx-auto px-4 py-2 bg-rockmill text-white rounded-lg hover:bg-rockmill/90"
              >
                Add Your First Route
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <RoutePickerDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingRouteIndex(null);
          }}
          onSelect={handleRouteSelect}
          routes={browserRoutes}
          excludeRouteIds={allSelectedRouteIds}
        />
      )}
    </div>
  );
}
