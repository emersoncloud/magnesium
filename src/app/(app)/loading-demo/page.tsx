import { ChalkLoader } from "@/components/ChalkLoader";

export default function LoadingDemoPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold font-mono uppercase tracking-widest mb-8">
        Loading Animation Demo
      </h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">
            Large
          </h2>
          <div className="bg-slate-50 rounded-lg p-8 flex items-center justify-center min-h-[250px]">
            <ChalkLoader size="lg" textContent="Loading..." />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">
            Medium
          </h2>
          <div className="bg-slate-50 rounded-lg p-8 flex items-center justify-center min-h-[180px]">
            <ChalkLoader size="md" textContent="Fetching..." />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">
            Small (for buttons)
          </h2>
          <div className="bg-slate-50 rounded-lg p-8 flex items-center justify-center min-h-[120px]">
            <ChalkLoader size="sm" />
          </div>
        </section>
      </div>
    </div>
  );
}
