import type { CollectionConfig } from 'payload'

export const NewsCollection: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: ['Industry News', 'Research Trends', 'Policy Updates', 'Case Studies'],
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
