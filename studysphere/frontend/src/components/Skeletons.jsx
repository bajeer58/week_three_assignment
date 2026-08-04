function Pulse({ className }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Pulse className="h-5 w-16 rounded-full" />
        <Pulse className="h-3 w-12" />
      </div>
      <Pulse className="mt-3 h-5 w-3/4" />
      <Pulse className="mt-2 h-3 w-1/2" />
      <div className="mt-4 flex items-center gap-3">
        <Pulse className="h-7 w-7 rounded-full" />
        <Pulse className="h-3 w-24" />
      </div>
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
