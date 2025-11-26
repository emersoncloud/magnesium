export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-6 mb-8 mt-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-48 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}
