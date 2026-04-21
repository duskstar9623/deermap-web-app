import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { BannerCollection } from './collections/BannerCollection'
import { TeamCollection } from './collections/TeamCollection'
import { NewsCollection } from './collections/NewsCollection'
import { MediaCollection } from './collections/MediaCollection'
import { ChartExampleCollection } from './collections/ChartExampleCollection'

import { SiteSettings } from './globals/SiteSettings'
import { NavigationGlobal } from './globals/NavigationGlobal'

export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  collections: [
    MediaCollection,
    BannerCollection,
    TeamCollection,
    NewsCollection,
    ChartExampleCollection,
  ],
  globals: [
    SiteSettings,
    NavigationGlobal,
  ],
  admin: {
    meta: {
      titleSuffix: ' - Bio Admin',
    },
  },
  secret: process.env.PAYLOAD_SECRET!,
})
