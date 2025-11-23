"use client";

import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { Activity, List, Map, Settings, Trophy, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn } from "next-auth/react";

export default function NavBar({ user, isAdmin }: { user?: User | null, isAdmin?: boolean }) {
  const pathname = usePathname();
  const { gradeDisplay, toggleGradeDisplay } = useSettings();

  const navItems = [
    { name: "Map", href: "/gym", icon: Map },
    { name: "Routes", href: "/routes", icon: List },
    { name: "Seasons", href: "/seasons", icon: Trophy },
    { name: "Feed", href: "/feed", icon: Activity },
    ...(user
      ? [{ name: "Profile", href: `/profile/${user.id}`, icon: UserIcon }]
      : [{ name: "Sign In", href: "#", icon: UserIcon, onClick: () => signIn("google", { callbackUrl: "/sets" }) }]
    ),
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  // Determine active item (handle sub-routes if needed, e.g. /profile/123)
  const activeItem = navItems.find(item =>
    pathname === item.href || (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href))
  ) || navItems[0];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center pb-6 pt-2 md:pb-2">
      {navItems.map((item) => {
        const isActive = activeItem.href === item.href;
        const commonClasses = cn(
          "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors duration-200",
          isActive ? "text-black" : "text-slate-400 hover:text-slate-600"
        );

        if (item.onClick) {
          return (
            <button
              key={item.name}
              onClick={item.onClick}
              className={commonClasses}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-black/5")} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isActive ? "text-black" : "text-slate-400"
              )}>
                {item.name}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={commonClasses}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-black/5")} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isActive ? "text-black" : "text-slate-400"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
      {/* Floating Action Button for Settings */}

    </nav>
  );
}
