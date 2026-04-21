import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: '网站全局配置',
  },
  fields: [
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'contactWechat',
      type: 'text',
      admin: { description: '微信客服账号' },
    },
    {
      name: 'wechatQrCode',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '微信二维码' },
    },
    {
      name: 'wechatOfficialAccountUrl',
      type: 'text',
      admin: { description: '微信公众号主页链接' },
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'isExternal', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'icp',
      type: 'text',
      admin: { description: 'ICP 备案号' },
    },
  ],
}
