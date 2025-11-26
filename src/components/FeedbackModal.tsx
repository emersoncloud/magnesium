"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/app/actions";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setFeedback("");
      setIsSuccess(false);
      setIsSubmitting(false);

      // Try to find a survey named "Feedback"
      // Try to find a survey named "feedback"
      posthog.getSurveys((surveys) => {
        // Prioritize exact match or specific ID if known, otherwise fuzzy match
        const feedbackSurvey = surveys.find(s => s.name.toLowerCase() === "feedback") ||
          surveys.find(s => s.name.toLowerCase().includes("feedback"));

        if (feedbackSurvey) {
          console.log("Found feedback survey:", feedbackSurvey.id);
          setSurveyId(feedbackSurvey.id);
        } else {
          console.log("No feedback survey found, falling back to custom event");
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      if (surveyId) {
        posthog.capture("survey sent", {
          $survey_id: surveyId,
          $survey_response: feedback
        });
      } else {
        posthog.capture("feedback_submitted", {
          feedback: feedback
        });
      }

      await submitFeedback(feedback);

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      console.error("Failed to submit feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border-2 border-black p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rockmill/10 rounded-full flex items-center justify-center text-rockmill">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Help improve Rock Mill Magnesium</h3>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">Share any feature requests, things that seem a little off, or any other comments.</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
              <Send className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold">Thanks!</h4>
            <p className="text-slate-600">We want this site to be awesome, and your feedback is (probably) super helpful.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="feedback" className="sr-only">Your Feedback</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="I've used this app so much I forgot to talk to the other climbers.."
                className="w-full min-h-[150px] p-4 rounded-lg border-2 border-slate-200 focus:border-rockmill focus:ring-0 resize-none bg-slate-50 text-sm placeholder:text-slate-400"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-slate-500 hover:text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                className={cn(
                  "bg-black text-white hover:bg-slate-800",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
