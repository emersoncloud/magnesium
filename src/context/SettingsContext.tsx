"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type GradeDisplay = "v-scale" | "difficulty";

interface SettingsContextType {
  gradeDisplay: GradeDisplay;
  setGradeDisplay: (display: GradeDisplay) => void;
  toggleGradeDisplay: () => void;
  showDifficulty: boolean;
  shareActivity: boolean;
  toggleShareActivity: () => void;
  showBeta: boolean;
  toggleShowBeta: () => void;
  experimentalFeatures: boolean;
  toggleExperimentalFeatures: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function getInitialValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  if (typeof defaultValue === "boolean") {
    return (saved === "true") as T;
  }
  return saved as T;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [gradeDisplay, setGradeDisplayState] = useState<GradeDisplay>(() =>
    getInitialValue("route-mill-grade-display", "v-scale" as GradeDisplay)
  );
  const [shareActivity, setShareActivityState] = useState(() =>
    getInitialValue("route-mill-share-activity", true)
  );
  const [showBeta, setShowBetaState] = useState(() =>
    getInitialValue("route-mill-show-beta", false)
  );
  const [experimentalFeatures, setExperimentalFeaturesState] = useState(() =>
    getInitialValue("route-mill-experimental-features", false)
  );

  const setGradeDisplay = useCallback((display: GradeDisplay) => {
    setGradeDisplayState(display);
    localStorage.setItem("route-mill-grade-display", display);
  }, []);

  const toggleGradeDisplay = useCallback(() => {
    setGradeDisplayState((prev) => {
      const next = prev === "v-scale" ? "difficulty" : "v-scale";
      localStorage.setItem("route-mill-grade-display", next);
      return next;
    });
  }, []);

  const toggleShareActivity = useCallback(() => {
    setShareActivityState((prev) => {
      const next = !prev;
      localStorage.setItem("route-mill-share-activity", String(next));
      return next;
    });
  }, []);

  const toggleShowBeta = useCallback(() => {
    setShowBetaState((prev) => {
      const next = !prev;
      localStorage.setItem("route-mill-show-beta", String(next));
      return next;
    });
  }, []);

  const toggleExperimentalFeatures = useCallback(() => {
    setExperimentalFeaturesState((prev) => {
      const next = !prev;
      localStorage.setItem("route-mill-experimental-features", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.cookie = `route-mill-settings=${JSON.stringify({
      experimentalFeatures,
      shareActivity,
      showBeta,
      gradeDisplay,
    })}; path=/; max-age=31536000`;
  }, [experimentalFeatures, shareActivity, showBeta, gradeDisplay]);

  const showDifficulty = gradeDisplay === "difficulty";

  return (
    <SettingsContext.Provider
      value={{
        gradeDisplay,
        setGradeDisplay,
        toggleGradeDisplay,
        showDifficulty,
        shareActivity,
        toggleShareActivity,
        showBeta,
        toggleShowBeta,
        experimentalFeatures,
        toggleExperimentalFeatures,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
