import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Additional CSS classes */
  className?: string
  /** Intrinsic width for CLS prevention */
  width?: number
  /** Intrinsic height for CLS prevention */
  height?: number
  /** Mark as high-priority (above the fold) — disables lazy loading */
  priority?: boolean
  /** Object fit mode */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  /** Fallback background color shown while loading */
  placeholderColor?: string
  /** Custom error fallback image path */
  fallbackSrc?: string
  /** Callback when image loads */
  onLoad?: () => void
}

const FALLBACK_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E';

/**
 * OptimizedImage — Performance-optimized image component.
 *
 * Features:
 * - Native lazy loading (loading="lazy") for below-fold images
 * - Async decoding (decoding="async")
 * - CLS prevention via width/height attributes
 * - Fade-in animation on load
 * - Error fallback with graceful degradation
 * - fetchpriority="high" for above-fold critical images
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  placeholderColor = '#f3f4f6',
  fallbackSrc,
  onLoad,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  const imgSrc = error ? (fallbackSrc || FALLBACK_PLACEHOLDER) : src;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? undefined : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-300 ${
          loaded || priority ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit }}
      />
    </div>
  );
}

