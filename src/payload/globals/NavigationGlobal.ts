import type { GlobalConfig } from 'payload'

export const NavigationGlobal: GlobalConfig = {
  slug: 'navigation',
  admin: {
    description: '导航菜单配置',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { 
          name: 'isExternal', 
          type: 'checkbox', 
          defaultValue: false,
          admin: { description: '是否为外部链接' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
