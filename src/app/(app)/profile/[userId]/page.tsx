import { getUserActivity } from "@/app/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const decodedUserId = decodeURIComponent(userId);
  const activity = await getUserActivity(decodedUserId);

  if (activity.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
        <p className="text-gray-500">This user has no public activity.</p>
      </div>
    );
  }

  const user = {
    name: activity[0].user_name || "Unknown Climber",
    image: activity[0].user_image,
    email: activity[0].user_id,
  };

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

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sends}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Sends</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.flashes}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Flashes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.comments}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Comments</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Activity History</h2>
      <div className="space-y-4">
        {activity.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {log.action_type === "SEND" && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold">SENT</span>}
                {log.action_type === "FLASH" && <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold">FLASHED</span>}
                {log.action_type === "COMMENT" && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">COMMENTED</span>}
                <Link href={`/route/${log.route_id}`} className="font-bold text-gray-900 hover:underline">
                  {log.route_grade} - {log.route_color}
                </Link>
              </div>
              {log.content && <p className="text-gray-600 text-sm">{log.content}</p>}
            </div>
            <span className="text-xs text-gray-400">{new Date(log.created_at!).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
