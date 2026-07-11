interface SkeletonProps {
  className?: string;
}

/**
 * Single animated skeleton block. Use `className` to control size and shape.
 */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={['animate-pulse bg-gray-200 rounded', className].filter(Boolean).join(' ')}
    />
  );
}
