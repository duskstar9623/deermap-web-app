import type { GlobalConfig } from 'payload'

export const SiteGlobal: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'wechatCode',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
