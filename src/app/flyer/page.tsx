import { getGlobalActivity, getRoutes } from "@/app/actions";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WALLS } from "@/lib/constants/walls";
import { Activity, TrendingUp } from "lucide-react";

export default async function FlyerPage() {
  // 1. Fetch all data in parallel
  const [rawRoutes, activity] = await Promise.all([getRoutes(), getGlobalActivity()]);

  // 2. Process Routes for Ticker (just taking a few for display)
  const routes = rawRoutes.slice(0, 10).map((route) => ({
    grade: route.grade,
    route_name: route.difficulty_label || "Route",
    setter: route.setter_name,
    color: route.color,
    wall_id: route.wall_id,
    set_date: route.set_date,
  }));

  // 3. Process Recent Activity
  const recentActivity = activity.slice(0, 3);
  const recentSend =
    activity.find((a) => a.action_type === "SEND" || a.action_type === "FLASH") || null;

  // 4. Calculate Gym Stats
  const totalRoutes = rawRoutes.length;
  const uniqueGrades = new Set(rawRoutes.map((r) => r.difficulty_label)).size;

  // 5. Find Newest Set
  const wallSets: Record<string, { date: string; count: number; color: string }> = {};

  rawRoutes.forEach((route) => {
    if (!wallSets[route.wall_id]) {
      wallSets[route.wall_id] = { date: route.set_date, count: 0, color: route.color };
    }
    wallSets[route.wall_id].count++;
    if (new Date(route.set_date) > new Date(wallSets[route.wall_id].date)) {
      wallSets[route.wall_id].date = route.set_date;
    }
  });

  let newestSet = null;
  let maxDate = 0;

  Object.entries(wallSets).forEach(([wallId, data]) => {
    const date = new Date(data.date).getTime();
    if (date > maxDate) {
      maxDate = date;
      const wallName = WALLS.find((w) => w.id === wallId)?.name || "Unknown Wall";
      const setColors = Array.from(
        new Set(
          rawRoutes
            .filter((r) => r.wall_id === wallId && r.set_date === data.date)
            .map((r) => r.color)
        )
      );

      newestSet = {
        wallName,
        count: data.count,
        colors: setColors,
        date: new Date(maxDate).toISOString(),
      };
    }
  });
  const gymStats = { totalRoutes, gradeCount: uniqueGrades, uniqueGrades };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
      {/* Flyer Container - A4ish Aspect Ratio */}
      <div className="w-[800px] h-[1131px] bg-white shadow-2xl overflow-hidden relative flex flex-col border-8 border-black">
        {/* Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Header Section */}
        <header className="bg-black text-white p-12 pb-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-6xl font-black font-rockmill tracking-tighter uppercase text-rockmill mb-2">
                Rock Mill <span className="text-slate-400">Magnesium</span>
              </h1>
              <p className="text-xl font-mono uppercase tracking-widest text-slate-400">
                {"// The Official Gym App"}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-1 border-2 border-white bg-rockmill transform -skew-x-12">
                <span className="text-sm font-bold font-mono uppercase tracking-[0.2em] text-white transform skew-x-12 block">
                  Live Data
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-12 flex flex-col gap-10 relative z-10">
          {/* Hero Text */}
          <div className="text-center">
            <h2 className="text-7xl font-black tracking-tighter mb-4 leading-tight">
              LEVEL UP YOUR
              <br />
              CLIMBING.
            </h2>
            <p className="text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
              Track sends, view beta, and compete on the leaderboard.
            </p>
          </div>

          {/* Visuals Grid */}
          <div className="grid grid-cols-2 gap-8 items-center mt-4">
            {/* Left Column: Stats & Set */}
            <div className="flex flex-col gap-8 items-center">
              {/* Gym Stats */}
              <Card className="w-full p-6 text-white border-2 border-rockmill bg-white shadow-[8px_8px_0px_0px_rgba(225,38,29,0.2)] transform -rotate-2">
                <div className="flex items-center gap-2 mb-2 text-rockmill">
                  <TrendingUp className="w-6 h-6" />
                  <span className="font-mono uppercase tracking-widest text-sm">Gym Stats</span>
                </div>
                <div className="text-5xl font-black text-black mb-1">
                  {gymStats.totalRoutes}{" "}
                  <span className="text-black text-2xl font-bold">Routes</span>
                </div>
                <div className="text-lg text-slate-600">
                  Across {gymStats.uniqueGrades} difficulties
                </div>
              </Card>

              {/* New Set */}
              {newestSet && (
                <div className="transform rotate-2 w-full">
                  {/* <SetCard
                    wallName={newestSet.wallName}
                    routeCount={newestSet.count}
                    date={newestSet.date}
                    colors={newestSet.colors}
                    className="w-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                  /> */}
                </div>
              )}
            </div>

            {/* Right Column: Recent Activity */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-rockmill" />
                <span className="font-black uppercase tracking-tight text-lg">Recent Activity</span>
              </div>

              {recentActivity.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 flex items-center gap-4 border-2 border-slate-100 shadow-sm bg-white"
                >
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold rounded-full text-sm shrink-0">
                    {item.user_name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold uppercase text-sm truncate">{item.user_name}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(item.created_at!).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.action_type === "SEND" && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">SENT</Badge>
                      )}
                      {item.action_type === "FLASH" && (
                        <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black text-[10px]">
                          FLASH
                        </Badge>
                      )}
                      <span className="text-xs font-bold text-slate-700 truncate">
                        {item.route_label || "Route"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-3 gap-4 mt-auto border-t-2 border-slate-200 pt-8">
            {[
              { title: "Track Progress", icon: "📈" },
              { title: "Log Sends", icon: "✅" },
              { title: "View Beta", icon: "🎥" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <div className="font-black uppercase tracking-tight">{feature.title}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer / QR Code Area */}
        <footer className="bg-rockmill p-8 flex items-center justify-between text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Get the App</h3>
            <p className="font-medium opacity-90 mb-4">
              Scan the QR code to log your climbs and join the community.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-75">
              <span>iOS</span> • <span>Android</span> • <span>Web</span>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="relative z-10 bg-white p-2 rounded-lg shadow-lg transform -rotate-3">
            <div className="w-32 h-32 bg-white flex items-center justify-center border-2 border-slate-100">
              <span className="text-slate-300 font-mono text-xs text-center">
                QR CODE
                <br />
                HERE
              </span>
            </div>
            <div className="text-center mt-1">
              <span className="text-black font-black text-xs uppercase tracking-widest">
                Scan Me
              </span>
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </footer>
      </div>
    </div>
  );
}
