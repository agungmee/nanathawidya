export default function AdminLoading() {
  return (
    <div className="p-6">
      <div className="h-8 w-48 skeleton-shimmer rounded-lg mb-6" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="h-12 skeleton-shimmer rounded-xl" />
        <div className="h-12 skeleton-shimmer rounded-xl" />
        <div className="h-12 skeleton-shimmer rounded-xl" />
        <div className="h-12 skeleton-shimmer rounded-xl" />
      </div>
    </div>
  );
}
