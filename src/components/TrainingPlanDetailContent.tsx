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
import { ArrowLeft, Pencil, Trash2, Globe, Lock, Save, X, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, getRouteColor } from "@/lib/utils";
import { WALLS } from "@/lib/constants/walls";
import RoutePickerDrawer from "./RoutePickerDrawer";

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

  const groupedRoutes = editedRoutes.reduce((acc, route) => {
    const sectionName = route.section_name || "Routes";
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(route);
    return acc;
  }, {} as Record<string, typeof editedRoutes>);

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
      const lastSectionName = editedRoutes.length > 0
        ? editedRoutes[editedRoutes.length - 1].section_name
        : null;

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
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {routes.map((planRoute, index) => (
                <div
                  key={planRoute.id}
                  className={cn(
                    "relative group bg-white rounded-lg border border-slate-200 p-4",
                    isEditing && "hover:shadow-md transition-shadow"
                  )}
                >
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditRoute(editedRoutes.findIndex((r) => r.id === planRoute.id))}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveRoute(planRoute.route_id)}
                        className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <Link
                    href={`/route/${planRoute.route_id}`}
                    className={cn(!isEditing && "block")}
                    onClick={(e) => isEditing && e.preventDefault()}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: getRouteColor(planRoute.route.color) }}
                      >
                        {planRoute.route.grade}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">
                          {planRoute.route.difficulty_label || planRoute.route.grade}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {WALLS.find((w) => w.id === planRoute.route.wall_id)?.name || planRoute.route.wall_id}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {isEditing && (
                <button
                  onClick={handleAddRoute}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-600 transition-colors min-h-[80px]"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-sm">Add Route</span>
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
