export default function StorefrontLoading() {
  return (
    <div className="p-4 space-y-4">
      <div className="skeleton-shimmer rounded-2xl aspect-[2/1] sm:aspect-[3/1]" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-shimmer w-24 h-10 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton-shimmer aspect-square rounded-2xl" />
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
