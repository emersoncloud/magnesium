import { Card } from "@/components/ui/Card";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto pb-24 animate-pulse">
      <div className="bg-slate-200 h-40 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="h-3 w-24 bg-slate-200 mb-3" />
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 h-24">
              <div />
            </Card>
            <Card className="p-4 h-24">
              <div />
            </Card>
            <Card className="p-4 h-24">
              <div />
            </Card>
            <Card className="p-4 h-24">
              <div />
            </Card>
          </div>
        </div>

        <div>
          <div className="h-3 w-24 bg-slate-200 mb-3" />
          <div className="space-y-3">
            <Card className="p-4 h-16">
              <div />
            </Card>
            <Card className="p-4 h-16">
              <div />
            </Card>
            <Card className="p-4 h-16">
              <div />
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="h-5 w-40 bg-slate-200 mb-4" />
          <div className="space-y-3">
            <Card className="p-3 h-20">
              <div />
            </Card>
            <Card className="p-3 h-20">
              <div />
            </Card>
            <Card className="p-3 h-20">
              <div />
            </Card>
          </div>
        </div>

        <div>
          <div className="h-5 w-32 bg-slate-200 mb-4" />
          <div className="space-y-4">
            <div>
              <div className="h-3 w-20 bg-slate-200 mb-2" />
              <div className="flex gap-2">
                <div className="h-10 w-16 bg-slate-200" />
                <div className="h-10 w-16 bg-slate-200" />
                <div className="h-10 w-16 bg-slate-200" />
              </div>
            </div>
            <div>
              <div className="h-3 w-20 bg-slate-200 mb-2" />
              <div className="flex gap-2">
                <div className="h-10 w-16 bg-slate-200" />
                <div className="h-10 w-16 bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
