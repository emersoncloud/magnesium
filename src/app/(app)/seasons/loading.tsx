export default function Loading() {
  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="h-16 w-96 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white border-2 border-black p-6 mb-12 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-6 w-full bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
