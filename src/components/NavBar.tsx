"use client";

import { cn } from "@/lib/utils";
import { Activity, Library, List, Settings, Trophy, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn } from "next-auth/react";

import { CetaitDemain } from "./mountains/CetaitDemain";
import { Dreamtime } from "./mountains/Dreamtime";
import { GrandpaPeabody } from "./mountains/GrandpaPeabody";
import { MidnightLightning } from "./mountains/MidnightLightning";
import { TheMandala } from "./mountains/TheMandala";
import { TheRhino } from "./mountains/TheRhino";

export default function NavBar({ user, isAdmin }: { user?: User | null, isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Sets", href: "/sets", icon: Library, Mountain: MidnightLightning },
    { name: "Routes", href: "/routes", icon: List, Mountain: Dreamtime },
    { name: "Seasons", href: "/seasons", icon: Trophy, Mountain: TheRhino },
    { name: "Feed", href: "/feed", icon: Activity, Mountain: TheMandala },
    ...(user
      ? [{ name: "Profile", href: `/profile/${user.id}`, icon: UserIcon, Mountain: GrandpaPeabody }]
      : [{ name: "Sign In", href: "#", icon: UserIcon, onClick: () => signIn("google", { callbackUrl: "/sets" }), Mountain: TheMandala }]
    ),
    ...(isAdmin ? [{ name: "Sync", href: "/sync", icon: Settings, Mountain: CetaitDemain }] : []),
  ];

  // Determine active item (handle sub-routes if needed, e.g. /profile/123)
  const activeItem = navItems.find(item =>
    pathname === item.href || (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href))
  ) || navItems[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center items-end pb-0">
      {/* Mountain Range Container */}
      <nav className="relative flex items-end justify-center  gap-0 md:gap-2 pointer-events-auto pb-0 filter drop-shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
        {navItems.map((item, index) => {
          const isActive = activeItem.href === item.href;
          const Icon = item.icon;
          const Mountain = item.Mountain;

          // Fixed heights for the "range"
          // Using slightly larger base heights since we aren't growing them anymore
          const height = [5.5, 6, 6.5, 6, 6.5, 6][index % 6];

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={item.onClick}
              className={cn(
                "group relative flex flex-col items-center justify-end pb-5 -mb-3 transition-all duration-300 ease-in-out -mx-2",
                isActive ? "z-20" : "z-10 hover:z-15",
                // Responsive dimensions using CSS variables defined in style
                "h-[calc(var(--nav-height)*0.65)] w-[calc(var(--nav-height)*0.65*1.6)]",
                "md:h-[calc(var(--nav-height)*0.8)] md:w-[calc(var(--nav-height)*0.8*1.6)]",
                "lg:h-[var(--nav-height)] lg:w-[calc(var(--nav-height)*1.6)]"
              )}
              style={{
                "--nav-height": `${height}rem`,
              } as React.CSSProperties}
            >
              {/* Mountain SVG Background */}
              <div className="absolute inset-0 w-full h-full overflow-hidden flex items-end">
                <Mountain
                  className={cn(
                    "w-full h-full transition-colors duration-300",
                    isActive
                      ? "text-rockmill"
                      : "text-black group-hover:text-slate-900"
                  )}
                />
              </div>

              {/* Content Overlay */}
              <div className="flex flex-col items-center gap-1 z-10 mb-1 relative">
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300 hidden md:block",
                  isActive ? "text-white scale-110" : "text-gray-200 group-hover:text-slate-300"
                )} />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-200 group-hover:text-slate-300"
                )}>
                  {item.name}
                </span>
              </div>

              {/* Snow cap / Highlight for active */}
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{
                  maskImage: 'linear-gradient(to right, black 0%, transparent 40%)',
                  WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 40%)'
                }}
              >
                <Mountain className="w-full h-full text-white opacity-50" />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
