import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900'>404</h1>
        <p className='mt-4 text-2xl font-semibold text-gray-700'>页面不存在</p>
        <p className='mt-2 text-gray-600'>抱歉，我们找不到您要访问的页面。</p>
        <Link
          href='/'
          className='mt-8 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
