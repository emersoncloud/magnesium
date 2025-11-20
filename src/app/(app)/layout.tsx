import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Map, List, Activity, User, Settings, LogOut } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const navItems = [
    { name: "Map", href: "/gym", icon: Map },
    { name: "Routes", href: "/routes", icon: List },
    { name: "Feed", href: "/feed", icon: Activity },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-20">
      {/* Floating Glass Navbar */}
      <nav className="fixed bottom-4 left-4 right-4 md:top-4 md:bottom-auto z-50">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/gym" className="text-xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden md:block">
            Route Mill
          </Link>

          <div className="flex items-center justify-between w-full md:w-auto gap-1 md:gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="flex flex-col md:flex-row items-center gap-1 text-slate-500 hover:text-violet-600 transition-colors p-2 rounded-lg hover:bg-violet-50"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-4 ml-2">
             {session.user?.image && (
                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
             )}
             <Link href="/api/auth/signout" className="text-slate-400 hover:text-rose-500">
               <LogOut className="w-5 h-5" />
             </Link>
          </div>
        </div>
      </nav>

      <main className="px-4 pt-8 md:pt-0 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
