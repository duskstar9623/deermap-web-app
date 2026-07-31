/**
 * iconfont 图标映射表（project 4685754）
 * key  — 组件 props 中使用的语义名，稳定不变
 * value — iconfont CSS class，下载本地或重新生成后只改这里
 *
 * 新增图标：在 iconfont 项目里添加后，在此文件补一行即可
 * 切换本地资源：修改 src/index.css 中的 @import 路径
 */
export const ICON_MAP = {
  // 导航 / 通用 UI
  arrowRight:         'icon-arrow-right',
  menu:               'icon-list-item',   // 无汉堡菜单图标，用 list-item 代替
  close:              'icon-list-item',   // 无关闭图标，暂用 list-item 代替
  home:               'icon-contact',     // 无首页图标，暂用 contact 代替
  globe:              'icon-contact',     // 无地球/语言图标，暂用 contact 代替
  check:              'icon-list-item',
  listItem:           'icon-list-item',
  // 数据分析
  dataAnalysis:       'icon-data-analysis',
  visualization:      'icon-visualization',
  informatics:        'icon-informatics-analysis',
  dataSecurity:       'icon-data-security',
  // 生物学
  biology:            'icon-biology',
  microorganism:      'icon-microorganism',
  // 工具
  techSupport:        'icon-tech-support',
  baseDraw:           'icon-base-draw',
  customDraw:         'icon-custom-draw',
  draw:               'icon-draw',
  expertTeam:         'icon-expert-team',
  // 报告 / 内容
  report:             'icon-report',
  professionalReport: 'icon-professional-report',
  news:               'icon-news',
  // 联系
  email:              'icon-email',
  contact:            'icon-contact',
  // 法律
  icp:                'icon-ICP',
  // 社交平台
  xiaohongshu:        'icon-xiaohongshu',
  bilibili:           'icon-bilibili',
  weibo:              'icon-weibo',
  douyin:             'icon-douyin',
  qq:                 'icon-qq',
  wechat:             'icon-wechat',
  alipay:             'icon-alipay',
} as const;

export type IconfontName = keyof typeof ICON_MAP;
