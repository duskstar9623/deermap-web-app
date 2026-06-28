interface SkeletonProps {
  className?: string;
}

/**
 * Single animated skeleton block. Use `className` to control size and shape.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={['animate-pulse bg-gray-200 rounded', className].filter(Boolean).join(' ')}
    />
  );
}

/**
 * Full-page loading skeleton used as the Suspense fallback in RootLayout.
 * Shows a grey animated placeholder that matches the general page height,
 * preventing the jarring "white flash" during lazy route loading.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-screen bg-gray-200" />
    </div>
  );
}
