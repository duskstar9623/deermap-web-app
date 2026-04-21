/**
 * 前端路由组共享布局
 * 包含导航栏和页脚
 */

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container-max flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-blue-600">deermap</div>
          <div className="flex gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              首页
            </a>
            <a href="/charts/basic" className="text-gray-600 hover:text-gray-900">
              基础制图
            </a>
            <a href="/team" className="text-gray-600 hover:text-gray-900">
              团队
            </a>
            <a href="/user/profile" className="text-gray-600 hover:text-gray-900">
              个人中心
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container-max py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2026 鹿图科技. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
