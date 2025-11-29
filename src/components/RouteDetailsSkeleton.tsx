type RouteDetailsSkeletonProps = {
  backgroundColor?: string;
};

export default function RouteDetailsSkeleton({
  backgroundColor = "#f8fafc",
}: RouteDetailsSkeletonProps) {
  const shimmerBaseClass =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor }}>
      <div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 md:px-8">
        <div
          className={`${shimmerBaseClass} border border-black/10 p-1 inline-flex items-center gap-2 mb-8 w-48 h-8 bg-white/30 rounded`}
        />

        <div className="relative mb-12 bg-white/80 border-l-4 border-black/10 shadow-sm overflow-hidden">
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`${shimmerBaseClass} h-3 w-24 bg-black/10 transform -skew-x-12 rounded`}
                />
                <div className={`${shimmerBaseClass} h-3 w-32 bg-black/5 rounded`} />
              </div>

              <div className={`${shimmerBaseClass} h-24 w-48 bg-black/10 rounded mb-2`} />

              <div className="flex gap-2 mt-4">
                <div className={`${shimmerBaseClass} h-6 w-20 bg-black/5 rounded-full`} />
                <div className={`${shimmerBaseClass} h-6 w-20 bg-black/5 rounded-full`} />
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <div className={`${shimmerBaseClass} h-6 w-32 bg-black/10 rounded mb-2`} />
              <div className={`${shimmerBaseClass} h-4 w-24 bg-black/5 rounded`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-4 space-y-8">
            <div
              className={`${shimmerBaseClass} bg-white/80 border border-black/10 p-6 h-64 rounded`}
            />
            <div className={`${shimmerBaseClass} bg-black/5 p-6 h-48 rounded`} />
          </div>

          <div className="md:col-span-8">
            <div
              className={`${shimmerBaseClass} bg-white/80 border border-black/10 h-[500px] rounded`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
