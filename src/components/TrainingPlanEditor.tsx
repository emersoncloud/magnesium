"use client";

import { useState, useTransition } from "react";
import { BrowserRoute, GeneratedPlan } from "@/app/actions";
import { X, Pencil, Plus, Save, Loader2 } from "lucide-react";
import RoutePickerDrawer from "./RoutePickerDrawer";
import RouteHold from "./RouteHold";

interface TrainingPlanEditorProps {
  plan: GeneratedPlan;
  browserRoutes: BrowserRoute[];
  onSave: (name: string, routes: { route_id: string; section_name: string | null; order_index: number }[]) => Promise<void>;
  onCancel: () => void;
}

type EditableSection = {
  title: string;
  description: string;
  routes: BrowserRoute[];
};

export default function TrainingPlanEditor({
  plan,
  browserRoutes,
  onSave,
  onCancel,
}: TrainingPlanEditorProps) {
  const [sections, setSections] = useState<EditableSection[]>(
    plan.sections.map((s) => ({ ...s, routes: [...s.routes] }))
  );
  const [planName, setPlanName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<{
    sectionIndex: number;
    routeIndex: number | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelectedRouteIds = new Set(sections.flatMap((s) => s.routes.map((r) => r.id)));

  const handleRemoveRoute = (sectionIndex: number, routeIndex: number) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        routes: newSections[sectionIndex].routes.filter((_, i) => i !== routeIndex),
      };
      return newSections;
    });
  };

  const handleEditRoute = (sectionIndex: number, routeIndex: number) => {
    setEditingContext({ sectionIndex, routeIndex });
    setIsDrawerOpen(true);
  };

  const handleAddRoute = (sectionIndex: number) => {
    setEditingContext({ sectionIndex, routeIndex: null });
    setIsDrawerOpen(true);
  };

  const handleRouteSelect = (route: BrowserRoute) => {
    if (!editingContext) return;

    setSections((prev) => {
      const newSections = [...prev];
      const section = { ...newSections[editingContext.sectionIndex] };

      if (editingContext.routeIndex !== null) {
        section.routes = [...section.routes];
        section.routes[editingContext.routeIndex] = route;
      } else {
        section.routes = [...section.routes, route];
      }

      newSections[editingContext.sectionIndex] = section;
      return newSections;
    });

    setIsDrawerOpen(false);
    setEditingContext(null);
  };

  const handleSave = () => {
    if (!planName.trim()) return;

    startTransition(async () => {
      const routesWithOrder: { route_id: string; section_name: string | null; order_index: number }[] = [];
      let orderIndex = 0;

      for (const section of sections) {
        for (const route of section.routes) {
          routesWithOrder.push({
            route_id: route.id,
            section_name: section.title,
            order_index: orderIndex++,
          });
        }
      }

      await onSave(planName, routesWithOrder);
    });
  };

  const totalRoutes = sections.reduce((sum, s) => sum + s.routes.length, 0);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Review Your Plan</h2>
        <p className="text-sm text-slate-500 mt-1">
          {totalRoutes} routes selected. Edit as needed, then save.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Plan Name</label>
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="e.g., Tuesday Session, Power Endurance..."
          className="w-full md:w-96 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockmill focus:border-transparent"
        />
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-800">{section.title}</h3>
              <p className="text-sm text-slate-500">{section.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {section.routes.map((route, routeIndex) => (
                <div key={`${route.id}-${routeIndex}`} className="relative group">
                  <RouteHold
                    route={route}
                    size="sm"
                    showStats={false}
                  />
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <button
                      onClick={() => handleEditRoute(sectionIndex, routeIndex)}
                      className="p-1.5 rounded-full bg-white shadow-md hover:bg-slate-100 text-slate-600"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveRoute(sectionIndex, routeIndex)}
                      className="p-1.5 rounded-full bg-white shadow-md hover:bg-red-100 text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleAddRoute(sectionIndex)}
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={isPending || !planName.trim() || totalRoutes === 0}
          className="px-6 py-3 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Plan
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      <RoutePickerDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingContext(null);
        }}
        onSelect={handleRouteSelect}
        routes={browserRoutes}
        excludeRouteIds={allSelectedRouteIds}
      />
    </div>
  );
}
