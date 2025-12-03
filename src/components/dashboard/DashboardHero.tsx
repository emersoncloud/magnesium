"use client";

import { UserQuickStats } from "@/app/actions";
import FeedbackModal from "@/components/FeedbackModal";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageSquare } from "lucide-react";
import { User } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

const INSPIRATIONAL_MESSAGES = [
  "Every send starts with a single move.",
  "The wall doesn't care how strong you are—just how persistent.",
  "Fall seven times, send eight.",
  "Your project is waiting.",
  "Crimp today, campus tomorrow.",
  "Trust your feet.",
  "The only bad session is the one you skipped.",
  "Dyno like nobody's watching.",
  "Beta is just a suggestion.",
  "Chalk up and try again.",
  "Your warmup is someone's project.",
  "Stay humble, stay hungry.",
  "The send is inevitable.",
  "Embrace the pump.",
  "One more try.",
];

const GREETING_MESSAGES = [
  "Let's crush it today.",
  "Ready to send?",
  "Time to climb.",
  "The wall awaits.",
  "Let's get after it.",
  "Another day, another send.",
];

type SocialLoginResult = {
  idToken?: string;
};

type DashboardHeroProps = {
  user: User | null;
  userStats: UserQuickStats | null;
};

function getRandomMessage<T>(messages: T[]): T {
  return messages[Math.floor(Math.random() * messages.length)];
}

const initialInspirationalMessage = getRandomMessage(INSPIRATIONAL_MESSAGES);
const initialGreetingMessage = getRandomMessage(GREETING_MESSAGES);

export default function DashboardHero({ user, userStats }: DashboardHeroProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [inspirationalMessage] = useState(initialInspirationalMessage);
  const [greetingMessage] = useState(initialGreetingMessage);

  const handleSignIn = async () => {
    signIn("google", { callbackUrl: "/overview" });
  };

  if (user) {
    const firstName = user.name?.split(" ")[0] || "Climber";

    return (
      <>
        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        <div className="relative overflow-hidden bg-rockmill p-4 md:p-8 mb-6">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                  {firstName}
                </h1>
                <p className="text-white/80 text-sm md:text-lg font-medium">{greetingMessage}</p>
                <p className="text-white/60 text-xs md:text-sm italic mt-1">
                  &ldquo;{inspirationalMessage}&rdquo;
                </p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="shrink-0 h-8 md:h-10 px-2 md:p-3 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Send Feedback"
              >
                <div className="flex text-white gap-1.5 md:gap-2 justify-center items-center">
                  <span className="text-sm md:text-base">Feedback</span>
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </button>
            </div>

            {userStats && userStats.currentStreak > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 md:px-4 md:py-2 mt-3">
                <span className="text-white font-black text-xs md:text-sm">
                  {userStats.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <div className="relative overflow-hidden bg-rockmill p-4 md:p-8 mb-6">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                Overview
              </h1>
              <p className="text-white/80 text-sm md:text-lg font-medium max-w-md">
                Track your sends, explore routes, and level up your climbing game.
              </p>
              <p className="text-white/60 text-xs md:text-sm italic mt-1 mb-4">
                &ldquo;{inspirationalMessage}&rdquo;
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="lg" onClick={handleSignIn}>
                  Sign Up Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Send Feedback"
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
