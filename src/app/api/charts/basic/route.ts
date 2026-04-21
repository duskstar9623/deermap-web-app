import { NextResponse } from 'next/server'

/**
 * 基础制图入口
 * POST: 提交制图任务
 * GET: 查询制图状态
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // TODO: 验证用户权限（游客/非会员/会员）
    // TODO: 调用 NestJS API 创建制图任务
    // TODO: 返回任务 ID

    return NextResponse.json({
      taskId: 'task-123',
      status: 'processing',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create chart' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // TODO: 根据 taskId 查询制图任务状态
    return NextResponse.json({
      taskId: 'task-123',
      status: 'completed',
      outputUrl: 'https://example.com/chart.png',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chart status' },
      { status: 500 }
    )
  }
}
