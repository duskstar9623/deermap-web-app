import type { CollectionConfig } from 'payload'

export const ChartExampleCollection: CollectionConfig = {
  slug: 'chart-examples',
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
      name: 'category',
      type: 'select',
      options: [
        { label: '基础制图', value: 'basic' },
        { label: '个性化制图', value: 'custom' },
      ],
      required: true,
    },
    {
      name: 'chartType',
      type: 'text',
      admin: { description: 'heatmap | volcano | boxplot | survival | contour | ternary' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isHighlighted',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
