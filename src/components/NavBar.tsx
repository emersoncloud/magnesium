"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List, Activity, User as UserIcon, Settings, Settings2, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import { User } from "next-auth";
import { Switch } from "./ui/Switch";
import posthog from "posthog-js";

export default function NavBar({ user, isAdmin }: { user?: User | null, isAdmin?: boolean }) {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showBeta, setShowBeta] = useState(true);
  const { gradeDisplay, toggleGradeDisplay } = useSettings();
  
  const navItems = [
    { name: "Map", href: "/gym", icon: Map },
    { name: "Routes", href: "/routes", icon: List },
    { name: "Feed", href: "/feed", icon: Activity },
    ...(user ? [{ name: "Profile", href: `/profile/${user.id}`, icon: UserIcon }] : []),
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  // Determine active item (handle sub-routes if needed, e.g. /profile/123)
  const activeItem = navItems.find(item => 
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  ) || navItems[0];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center pb-6 pt-2 md:pb-2">
      {navItems.map((item) => {
        const isActive = activeItem.href === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors duration-200",
              isActive ? "text-black" : "text-slate-400 hover:text-slate-600"
            )}
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
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4">
        {isSettingsOpen && (
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200 min-w-[200px]">
             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between gap-4">
                 <span className="font-mono text-xs uppercase font-bold">V-Scale / Diff</span>
                 <Switch 
                    checked={gradeDisplay === "difficulty"} 
                    onCheckedChange={() => toggleGradeDisplay()}
                    className="data-[state=checked]:bg-rockmill"
                 />
               </div>
               <div className="flex items-center justify-between gap-4">
                 <span className="font-mono text-xs uppercase font-bold">Show Beta</span>
                 <Switch 
                    checked={showBeta} 
                    onCheckedChange={setShowBeta}
                    className="data-[state=checked]:bg-rockmill"
                 />
               </div>
               <button 
               id="beta-button"
                 className="w-full bg-rockmill text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all"
                
               > Feedback&nbsp;
                 <Megaphone className={`w-6 h-6 transition-transform duration-300`} />
               </button>
             </div>
          </div>
        )}
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-14 h-14 bg-rockmill text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Settings2 className={`w-6 h-6 transition-transform duration-300 ${isSettingsOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </nav>
  );
}
