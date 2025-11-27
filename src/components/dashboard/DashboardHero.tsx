"use client";

import { UserQuickStats } from "@/app/actions";
import FeedbackModal from "@/components/FeedbackModal";
import { Button } from "@/components/ui/Button";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
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
    if (Capacitor.isNativePlatform()) {
      try {
        await SocialLogin.initialize({
          google: {
            webClientId: "499412392042-255j7a3fvvhfcob0tofgago3q86fjpmn.apps.googleusercontent.com",
            iOSClientId: "499412392042-jobevm2j3d30fptnabu20hth37hm5jrq.apps.googleusercontent.com",
          },
        });
        const res = await SocialLogin.login({
          provider: "google",
          options: {
            scopes: ["email", "profile"],
            forceRefreshToken: true,
          },
        });

        const loginResult = res.result as SocialLoginResult;
        if (loginResult.idToken) {
          await signIn("google-native", {
            idToken: loginResult.idToken,
            callbackUrl: "/overview",
          });
        }
      } catch (error) {
        console.error("Native Google Sign-In failed:", error);
      }
    } else {
      signIn("google", { callbackUrl: "/overview" });
    }
  };

  if (user) {
    const firstName = user.name?.split(" ")[0] || "Climber";
    const weeklyActivitySuffix = userStats?.routesThisWeek
      ? ` — ${userStats.routesThisWeek} route${userStats.routesThisWeek === 1 ? "" : "s"} this week`
      : "";

    return (
      <>
        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        <div className="relative overflow-hidden bg-rockmill p-6 md:p-8 mb-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                  {firstName}
                </h1>
                <p className="text-white/80 text-lg font-medium mb-3">
                  {greetingMessage}
                  {weeklyActivitySuffix}
                </p>
                <p className="text-white/60 text-sm italic">&ldquo;{inspirationalMessage}&rdquo;</p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex-shrink-0 h-10 p-3 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Send Feedback"
              >
                <div className="flex text-white gap-2 justify-center align-baseline">
                  <span>Feedback</span>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>

            {userStats && userStats.currentStreak > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 mt-4">
                <span className="text-white font-black text-sm">
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
      <div className="relative overflow-hidden bg-rockmill p-6 md:p-8 mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                Overview
              </h1>
              <p className="text-white/80 text-lg font-medium mb-3 max-w-md">
                Track your sends, explore routes, and level up your climbing game.
              </p>
              <p className="text-white/60 text-sm italic mb-6">
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
              className="flex-shrink-0 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Send Feedback"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
