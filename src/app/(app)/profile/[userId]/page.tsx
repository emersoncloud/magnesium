import { getUserActivity } from "@/app/actions";
import Link from "next/link";
import GradeDistribution from "@/components/GradeDistribution";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileStats from "@/components/ProfileStats";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { userId } = await params;
  const decodedUserId = decodeURIComponent(userId);
  const activity = await getUserActivity(decodedUserId);

  const isOwnProfile = session.user.id === decodedUserId;

  let user = {
    name: activity[0]?.user_name || "Unknown Climber",
    image: activity[0]?.user_image,
    id: activity[0]?.user_id || decodedUserId,
  };

  if (activity.length === 0) {
    if (isOwnProfile) {
      user = {
        name: session.user.name || "Unknown Climber",
        image: session.user.image || null,
        id: session.user.id || decodedUserId,
      };
    } else {
      // For other users with no activity, we don't have their info.
      // We'll show a generic profile.
      user = {
        name: "Unknown Climber",
        image: null,
        id: decodedUserId,
      };
    }
  }

  const stats = {
    sends: activity.filter(a => a.action_type === "SEND").length,
    flashes: activity.filter(a => a.action_type === "FLASH").length,
    comments: activity.filter(a => a.action_type === "COMMENT").length,
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-3xl shadow-md">
            {user.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">Climber</p>
        </div>
      </div>

      <ProfileStats activity={activity} />

      {isOwnProfile && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Account</h3>
          <form action={async () => {
            "use server";
            await import("@/app/actions").then(m => m.logout());
          }}>
            <button type="submit" className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline">
              Log Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
