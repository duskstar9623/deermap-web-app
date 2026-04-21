'use client'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Loader({ size = 'md' }: LoaderProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600`}
      />
    </div>
  )
}
