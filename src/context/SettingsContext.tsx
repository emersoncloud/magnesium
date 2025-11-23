"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type GradeDisplay = "v-scale" | "difficulty";

interface SettingsContextType {
  gradeDisplay: GradeDisplay;
  setGradeDisplay: (display: GradeDisplay) => void;
  toggleGradeDisplay: () => void;
  showDifficulty: boolean;
  shareActivity: boolean;
  toggleShareActivity: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [gradeDisplay, setGradeDisplay] = useState<GradeDisplay>("v-scale");
  const [shareActivity, setShareActivity] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("route-mill-grade-display");
    if ((saved === "v-scale" || saved === "difficulty") && saved !== gradeDisplay) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradeDisplay(saved);
    }
  }, [gradeDisplay]);

  useEffect(() => {
    const savedShare = localStorage.getItem("route-mill-share-activity");
    if (savedShare !== null) {
      setShareActivity(savedShare === "true");
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("route-mill-grade-display", gradeDisplay);
  }, [gradeDisplay]);

  useEffect(() => {
    localStorage.setItem("route-mill-share-activity", String(shareActivity));
  }, [shareActivity]);

  const toggleGradeDisplay = () => {
    setGradeDisplay((prev) => (prev === "v-scale" ? "difficulty" : "v-scale"));
  };

  const toggleShareActivity = () => {
    setShareActivity((prev) => !prev);
  };

  const showDifficulty = gradeDisplay === "difficulty";

  return (
    <SettingsContext.Provider value={{ gradeDisplay, setGradeDisplay, toggleGradeDisplay, showDifficulty, shareActivity, toggleShareActivity }}>
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
