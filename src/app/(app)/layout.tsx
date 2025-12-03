import NavBar from "@/components/NavBar";
import PostHogIdentify from "@/components/PostHogIdentify";

import { SettingsProvider } from "@/context/SettingsContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { auth, isAdmin } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const admin = isAdmin(session?.user?.email);
  const showSeasons = process.env.ENABLE_SEASONS === "true";

  return (
    <QueryProvider>
      <SettingsProvider>
        {session?.user?.id && (
          <PostHogIdentify
            userId={session.user.id}
            email={session.user.email}
            name={session.user.name}
          />
        )}
        <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] relative bg-[#F8FAFC]">
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <NavBar user={session?.user} isAdmin={admin} showSeasons={showSeasons} />

          <main className="px-4 pt-[calc(3rem+var(--safe-area-top))] md:pt-[calc(1rem+var(--safe-area-top))] max-w-6xl mx-auto relative z-10">
            {children}
          </main>
        </div>
      </SettingsProvider>
    </QueryProvider>
  );
}
