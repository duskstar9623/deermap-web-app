import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware - 用于路由保护和认证检查
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API 路由不需要中间件处理
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Admin 路由保护（后续添加认证检查）
  if (pathname.startsWith('/admin')) {
    // TODO: 检查管理员权限
    return NextResponse.next()
  }

  // 用户保护路由
  if (pathname.startsWith('/user/')) {
    // TODO: 检查用户登录状态
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  // 匹配所有路径，除了 _next、api、public 等
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
