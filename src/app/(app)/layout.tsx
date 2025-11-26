import NavBar from "@/components/NavBar";
import PostHogIdentify from "@/components/PostHogIdentify";

import { SettingsProvider } from "@/context/SettingsContext";
import { auth, isAdmin } from "@/lib/auth";


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const admin = isAdmin(session?.user?.email);
  const showSeasons = process.env.ENABLE_SEASONS === "true";

  return (
    <SettingsProvider>
      {session?.user?.id && (
        <PostHogIdentify
          userId={session.user.id}
          email={session.user.email}
          name={session.user.name}
        />
      )}
      <div className="min-h-screen pb-24 relative bg-slate-50">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <NavBar user={session?.user} isAdmin={admin} showSeasons={showSeasons} />


        <main className="px-4 pt-8 md:pt-0 max-w-6xl mx-auto relative z-10">
          {children}
        </main>
      </div>
    </SettingsProvider>
  );
}
