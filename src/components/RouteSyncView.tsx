"use client";

import { useState } from "react";
import {
  previewSync,
  confirmSync,
  SyncPreview,
  SyncRoute,
  UpcomingSyncRoute,
  backfillAllUsersAchievements,
} from "@/app/actions";
import { RefreshCw, Check, AlertTriangle, Save, Trophy, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

// SyncRoute imported from actions

export default function RouteSyncView() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "preview" | "syncing" | "success" | "error"
  >("idle");
  const [previewData, setPreviewData] = useState<SyncPreview | null>(null);
  const [syncResult, setSyncResult] = useState<{
    count: number;
    archivedCount: number;
    updatedCount: number;
    namedCount: number;
    upcomingCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [achievementStatus, setAchievementStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [achievementResult, setAchievementResult] = useState<{
    processedUsers: number;
    totalAchievements: number;
  } | null>(null);
  const router = useRouter();

  const handleBackfillAchievements = async () => {
    setAchievementStatus("loading");
    try {
      const result = await backfillAllUsersAchievements();
      setAchievementResult(result);
      setAchievementStatus("success");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setAchievementStatus("error");
    }
  };

  const handleCheckForUpdates = async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await previewSync();
      setPreviewData(data);
      setStatus("preview");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch updates");
      setStatus("error");
    }
  };

  const handleConfirmSync = async () => {
    setStatus("syncing");
    try {
      const result = await confirmSync();
      setSyncResult(result);
      setStatus("success");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to sync");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setStatus("idle");
    setPreviewData(null);
    setError(null);
  };

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync Routes</h2>
          <p className="text-gray-500 mb-8">
            Check for updates from the Google Sheet. You&apos;ll be able to review changes before
            applying them.
          </p>
          <button
            onClick={handleCheckForUpdates}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Check for Updates
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md">
          <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Backfill Achievements</h2>
          <p className="text-gray-500 mb-8">
            Scan all users and award any achievements they&apos;ve earned based on their activity
            history.
          </p>
          {achievementStatus === "idle" && (
            <button
              onClick={handleBackfillAchievements}
              className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" /> Run Backfill
            </button>
          )}
          {achievementStatus === "loading" && (
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
              <span className="font-medium">Processing users...</span>
            </div>
          )}
          {achievementStatus === "success" && achievementResult && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-800 font-bold mb-2">Backfill Complete!</div>
              <div className="text-sm text-green-700">
                Processed {achievementResult.processedUsers} users, awarded{" "}
                {achievementResult.totalAchievements} new achievements
              </div>
              <button
                onClick={() => setAchievementStatus("idle")}
                className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Run Again
              </button>
            </div>
          )}
          {achievementStatus === "error" && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-red-800 font-bold mb-2">Backfill Failed</div>
              <button
                onClick={() => setAchievementStatus("idle")}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === "loading" || status === "syncing") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">
          {status === "loading" ? "Checking for updates..." : "Syncing routes..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center max-w-2xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={handleCancel}
          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "success" && syncResult) {
    return (
      <div className="bg-green-50 p-8 rounded-xl border border-green-200 text-center max-w-4xl mx-auto">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-4">Sync Complete!</h2>
        <div className="grid grid-cols-5 gap-4 mb-8 text-left">
          <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">New</div>
            <div className="text-2xl font-bold text-green-600">+{syncResult.count}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Updated</div>
            <div className="text-2xl font-bold text-blue-600">{syncResult.updatedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Archived</div>
            <div className="text-2xl font-bold text-red-600">-{syncResult.archivedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Named</div>
            <div className="text-2xl font-bold text-purple-600">{syncResult.namedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Upcoming</div>
            <div className="text-2xl font-bold text-amber-600">{syncResult.upcomingCount}</div>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  if (status === "preview" && previewData) {
    const { newRoutes, existingRoutes, missingRoutes, upcomingRoutes } = previewData;

    // For existing routes, we might want to filter or show only if we had a way to know they changed.
    // The current previewSync logic returns ALL existing routes.
    // Let's just show counts for existing, and list details for New and Missing.

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Review Changes</h2>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSync}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Confirm Sync
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* New Routes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100 flex justify-between items-center">
              <h3 className="font-bold text-green-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                New Routes
              </h3>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                {newRoutes.length}
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto p-0">
              {newRoutes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">No new routes found</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {newRoutes.map((route: SyncRoute, i: number) => (
                    <li key={i} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-900">
                            {route.grade} - {route.color}
                          </div>
                          <div className="text-xs text-gray-500">
                            {route.setter_name} • {route.wall_id}
                          </div>
                        </div>
                        {route.difficulty_label && (
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                            {route.difficulty_label}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Missing Routes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
              <h3 className="font-bold text-red-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                To Archive
              </h3>
              <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                {missingRoutes.length}
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto p-0">
              {missingRoutes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">No routes to archive</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {missingRoutes.map((route: SyncRoute) => (
                    <li key={route.id} className="p-3 hover:bg-gray-50 opacity-75">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-900 line-through decoration-red-500">
                            {route.grade} - {route.color}
                          </div>
                          <div className="text-xs text-gray-500">
                            {route.setter_name} • {route.wall_id}
                          </div>
                        </div>
                        <div className="text-xs text-red-600 font-medium">Missing</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Existing Routes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                Existing
              </h3>
              <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">
                {existingRoutes.length}
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto p-0">
              <div className="p-4 text-sm text-gray-500">
                {existingRoutes.length} routes matched. Mutable fields (style, hold type, setter)
                will be updated if changed.
              </div>
              {/* We could list them but it might be too many. Just showing a sample or summary is better. */}
              <ul className="divide-y divide-gray-100">
                {existingRoutes.slice(0, 10).map((route: SyncRoute, i: number) => (
                  <li key={i} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-700">
                          {route.grade} - {route.color}
                        </div>
                        <div className="text-xs text-gray-500">{route.wall_id}</div>
                      </div>
                    </div>
                  </li>
                ))}
                {existingRoutes.length > 10 && (
                  <li className="p-3 text-center text-xs text-gray-500 italic">
                    ...and {existingRoutes.length - 10} more
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Upcoming Routes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex justify-between items-center">
              <h3 className="font-bold text-amber-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Upcoming
              </h3>
              <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full font-bold">
                {upcomingRoutes.length}
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto p-0">
              {upcomingRoutes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">No upcoming routes</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {upcomingRoutes.slice(0, 15).map((route: UpcomingSyncRoute, i: number) => (
                    <li key={i} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-900">
                            {route.grade} - {route.color}
                          </div>
                          <div className="text-xs text-gray-500">{route.wall_id}</div>
                        </div>
                        {route.difficulty_label && (
                          <span className="text-xs bg-amber-100 px-1.5 py-0.5 rounded text-amber-700">
                            {route.difficulty_label}
                          </span>
                        )}
                      </div>
                      {route.setter_comment && (
                        <div className="text-xs text-gray-500 mt-1 italic">
                          {route.setter_comment}
                        </div>
                      )}
                    </li>
                  ))}
                  {upcomingRoutes.length > 15 && (
                    <li className="p-3 text-center text-xs text-gray-500 italic">
                      ...and {upcomingRoutes.length - 15} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
