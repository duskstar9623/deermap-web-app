import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nextJsHeaders } from '@payloadcms/next/utilities'
import { BannerCollection } from './collections/BannerCollection'
import { TeamCollection } from './collections/TeamCollection'
import { NewsCollection } from './collections/NewsCollection'
import { MediaCollection } from './collections/MediaCollection'
import { SiteGlobal } from './globals/SiteGlobal'

export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
  collections: [MediaCollection, BannerCollection, TeamCollection, NewsCollection],
  globals: [SiteGlobal],
  admin: {
    meta: {
      titleSuffix: ' - Bio Admin',
    },
  },
  secret: process.env.PAYLOAD_SECRET!,
  async onInit(payload) {
    // Initialize payload
  },
})
