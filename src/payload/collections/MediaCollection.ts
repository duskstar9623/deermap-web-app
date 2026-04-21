import type { CollectionConfig } from 'payload'

export const MediaCollection: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/uploads',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
