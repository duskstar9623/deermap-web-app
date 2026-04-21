'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900'>出错了</h1>
        <p className='mt-4 text-lg text-gray-600'>
          抱歉，页面出现了问题。请稍后重试。
        </p>
        {error.digest && (
          <p className='mt-2 text-sm text-gray-500'>错误代码: {error.digest}</p>
        )}
        <button
          onClick={() => reset()}
          className='mt-8 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
        >
          重新尝试
        </button>
      </div>
    </div>
  )
}
