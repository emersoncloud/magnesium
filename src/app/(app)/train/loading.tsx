export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="h-12 w-72 bg-gray-200 rounded animate-pulse mb-8 mt-6" />
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
