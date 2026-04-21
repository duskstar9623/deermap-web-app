/**
 * Payload CMS Local API utilities for RSC
 */
import { getPayload } from 'payload'
import config from '@/payload.config'

let payloadInstance: ReturnType<typeof getPayload>

async function getPayloadInstance() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

/**
 * Get all banners
 */
export async function getBanners() {
  const payload = await getPayloadInstance()
  return payload.find({
    collection: 'banners',
    where: {
      isActive: { equals: true },
    },
    sort: 'order',
  })
}

/**
 * Get all team members
 */
export async function getTeamMembers() {
  const payload = await getPayloadInstance()
  return payload.find({
    collection: 'team',
    sort: 'order',
  })
}

/**
 * Get published news articles
 */
export async function getNews(limit: number = 10) {
  const payload = await getPayloadInstance()
  return payload.find({
    collection: 'news',
    where: {
      isPublished: { equals: true },
    },
    limit,
    sort: '-publishedAt',
  })
}

/**
 * Get single news by slug
 */
export async function getNewsBySlug(slug: string) {
  const payload = await getPayloadInstance()
  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
    },
  })
  return result.docs?.[0] || null
}

/**
 * Get site settings
 */
export async function getSiteSettings() {
  const payload = await getPayloadInstance()
  return payload.findGlobal({
    slug: 'site-settings',
  })
}
