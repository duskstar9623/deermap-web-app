/**
 * Payload CMS Local API 工具
 * 用于在 Server Component 中直接调用 CMS 内容
 */

import { getPayload } from 'payload'
import config from '@/payload/payload.config'

let cachedPayload: ReturnType<typeof getPayload> | null = null

export async function getPayloadInstance() {
  if (!cachedPayload) {
    cachedPayload = await getPayload({ config })
  }
  return cachedPayload
}

/**
 * 获取 Banner 列表
 */
export async function getBanners() {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'banners',
      limit: 100,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

/**
 * 获取团队成员列表
 */
export async function getTeamMembers() {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'team',
      limit: 100,
      sort: 'order',
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}

/**
 * 获取行业讯息列表
 */
export async function getNews(limit: number = 10) {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'news',
      limit,
      sort: '-createdAt',
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
