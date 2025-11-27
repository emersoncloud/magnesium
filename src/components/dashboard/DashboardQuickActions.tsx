"use client";

import { User } from "next-auth";
import Link from "next/link";
import { Library, Dumbbell, User as UserIcon, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

type DashboardQuickActionsProps = {
  user: User | null;
  showTraining?: boolean;
};

export default function DashboardQuickActions({
  user,
  showTraining = false,
}: DashboardQuickActionsProps) {
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

        if ((res.result as any).idToken) {
          await signIn("google-native", {
            idToken: (res.result as any).idToken,
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

  const actionButtonClasses =
    "flex items-center gap-3 p-4 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group";

  if (user) {
    return (
      <div className="flex flex-col gap-3">
        <Link href="/sets" className={actionButtonClasses}>
          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center group-hover:bg-rockmill/10 transition-colors">
            <Library className="w-5 h-5 text-slate-700 group-hover:text-rockmill transition-colors" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 text-sm">Browse Routes</div>
            <div className="text-xs text-slate-500">Find your next project</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </Link>

        {showTraining && (
          <Link href="/train" className={actionButtonClasses}>
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center group-hover:bg-rockmill/10 transition-colors">
              <Dumbbell className="w-5 h-5 text-slate-700 group-hover:text-rockmill transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 text-sm">
                Start Training
              </div>
              <div className="text-xs text-slate-500">Generate a session plan</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </Link>
        )}

        <Link href={`/profile/${user.id}`} className={actionButtonClasses}>
          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center group-hover:bg-rockmill/10 transition-colors">
            <UserIcon className="w-5 h-5 text-slate-700 group-hover:text-rockmill transition-colors" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 text-sm">My Profile</div>
            <div className="text-xs text-slate-500">View stats & settings</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Link href="/sets" className={actionButtonClasses}>
        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center group-hover:bg-rockmill/10 transition-colors">
          <Library className="w-5 h-5 text-slate-700 group-hover:text-rockmill transition-colors" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-900 text-sm">Browse Routes</div>
          <div className="text-xs text-slate-500">Explore the gym</div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
      </Link>

      <button onClick={handleSignIn} className={actionButtonClasses}>
        <div className="w-10 h-10 bg-rockmill/10 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-rockmill" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-slate-900 text-sm">
            Sign Up to Track
          </div>
          <div className="text-xs text-slate-500">Log sends & view stats</div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
      </button>
    </div>
  );
}
