import { createRoute, getGradeDistribution, ingestRoutes } from "@/app/actions";
import { WALLS, GRADES, COLORS } from "@/lib/constants/walls";
import { redirect } from "next/navigation";
import { auth, isAdmin } from "@/lib/auth";
import { RefreshCw } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");
  
  if (!isAdmin(session.user.email)) {
    return <div className="p-8 text-center text-red-600 font-bold">Access Denied: You are not an admin.</div>;
  }

  // In a real app, check for "admin" role. For now, just check auth.

  const distribution = await getGradeDistribution();
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">Setter Dashboard</h1>
        <form action={async () => {
          "use server";
          await ingestRoutes();
        }}>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Sync from Sheets
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New Route</h2>
          <form action={async (formData) => {
            "use server";
            const wall_id = formData.get("wall_id") as string;
            const grade = formData.get("grade") as string;
            const color = formData.get("color") as string;
            const setter_name = formData.get("setter_name") as string;
            
            await createRoute({
              wall_id,
              grade,
              color,
              setter_name,
              set_date: new Date().toISOString(),
              status: "active",
            });
          }} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Wall</label>
              <select name="wall_id" className="w-full p-2 border rounded-md bg-gray-50">
                {WALLS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Grade</label>
              <select name="grade" className="w-full p-2 border rounded-md bg-gray-50">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Color</label>
              <select name="color" className="w-full p-2 border rounded-md bg-gray-50">
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Setter</label>
              <input name="setter_name" type="text" required className="w-full p-2 border rounded-md bg-gray-50" placeholder="Your Name" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
              Create Route
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
          <div className="space-y-2">
            {distribution.map((d: any) => (
              <div key={d.grade} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="font-medium text-gray-800">{d.grade}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{d.count} routes</span>
              </div>
            ))}
            {distribution.length === 0 && (
              <p className="text-gray-500 italic">No routes set yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
