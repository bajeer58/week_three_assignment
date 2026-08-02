export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow animate-pulse space-y-3">
      <div className="h-4 w-16 bg-gray-200 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}