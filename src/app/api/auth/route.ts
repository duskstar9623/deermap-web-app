import { NextResponse } from 'next/server'

/**
 * 获取当前登录用户信息
 */
export async function GET() {
  try {
    // TODO: 从 Cookie/Session 中获取用户信息
    // 这里仅作为示例返回
    return NextResponse.json({
      id: 'user-123',
      phoneNumber: '+86 138xxxx1234',
      nickname: 'Test User',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
