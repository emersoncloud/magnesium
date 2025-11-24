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
  showBeta: boolean;
  toggleShowBeta: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [gradeDisplay, setGradeDisplay] = useState<GradeDisplay>("v-scale");
  const [shareActivity, setShareActivity] = useState(true);
  const [showBeta, setShowBeta] = useState(false);

  useEffect(() => {
    const savedShare = localStorage.getItem("route-mill-share-activity");
    if (savedShare !== null) {
      setShareActivity(savedShare === "true");
    }
    const savedBeta = localStorage.getItem("route-mill-show-beta");
    if (savedBeta !== null) {
      setShowBeta(savedBeta === "true");
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("route-mill-grade-display", gradeDisplay);
  }, [gradeDisplay]);

  useEffect(() => {
    localStorage.setItem("route-mill-share-activity", String(shareActivity));
  }, [shareActivity]);

  useEffect(() => {
    localStorage.setItem("route-mill-show-beta", String(showBeta));
  }, [showBeta]);

  const toggleGradeDisplay = () => {
    setGradeDisplay((prev) => (prev === "v-scale" ? "difficulty" : "v-scale"));
  };

  const toggleShareActivity = () => {
    setShareActivity((prev) => !prev);
  };

  const toggleShowBeta = () => {
    setShowBeta((prev) => !prev);
  };

  const showDifficulty = gradeDisplay === "difficulty";

  return (
    <SettingsContext.Provider value={{ gradeDisplay, setGradeDisplay, toggleGradeDisplay, showDifficulty, shareActivity, toggleShareActivity, showBeta, toggleShowBeta }}>
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
