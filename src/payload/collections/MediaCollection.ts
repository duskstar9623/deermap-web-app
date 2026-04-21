import type { CollectionConfig } from 'payload'

export const MediaCollection: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
    },
  ],
}
