"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Switch } from "@/components/ui/Switch";

export default function ProfileSettings() {
  const { gradeDisplay, toggleGradeDisplay, shareActivity, toggleShareActivity, showBeta, toggleShowBeta } = useSettings();

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">App Settings</h3>
      
      <div className="space-y-6">
        {/* Grade Display Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">V-Scale / Difficulty</span>
            <span className="text-xs text-gray-500">Toggle between V-grades and difficulty colors</span>
          </div>
          <Switch
            checked={gradeDisplay === "difficulty"}
            onCheckedChange={() => toggleGradeDisplay()}
            className="data-[state=checked]:bg-rockmill"
          />
        </div>

        {/* Share Activity Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Share Activity</span>
            <span className="text-xs text-gray-500">Allow others to see your climbs</span>
          </div>
          <Switch
            checked={shareActivity}
            onCheckedChange={() => toggleShareActivity()}
            className="data-[state=checked]:bg-rockmill"
          />
        </div>

        {/* Show Beta Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Show Beta</span>
            <span className="text-xs text-gray-500">Display route beta and tips</span>
          </div>
          <Switch
            checked={showBeta}
            onCheckedChange={toggleShowBeta}
            className="data-[state=checked]:bg-rockmill"
          />
        </div>

        {/* Feedback Button */}
        <div className="pt-4">
          <button
            id="beta-button"
            className="w-full bg-slate-100 text-slate-900 border-2 border-slate-200 hover:border-black hover:bg-white flex items-center justify-center py-3 rounded-lg transition-all font-bold text-xs uppercase tracking-widest gap-2"
          >
            Send Feedback
            <Megaphone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
