import type { CollectionConfig } from 'payload'

/**
 * Team Collection - 团队成员
 */
export const TeamCollection: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
