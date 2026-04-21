import type { CollectionConfig } from 'payload'

/**
 * News Collection - 行业讯息
 * 无独立页面，仅在首页子模块展示
 * 点击跳转至企业微信公众号对应文章
 */
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
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'wechatArticleUrl',
      type: 'text',
      label: '微信公众号文章链接',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
  ],
}
