# Assets 管理规范

本文档定义项目中图片、字体、Icon、SVG 等静态资源的管理规范。

## 目录结构

```
public/                          ← 不需要构建处理的静态资源（直接 URL 访问）
├── images/
│   ├── hero/                    ← 首页 Hero 视频/背景
│   ├── backgrounds/             ← Section 级别背景图
│   ├── cards/                   ← 卡片封面背景图
│   ├── analysis/                ← 分析类型配图
│   ├── omics/                   ← 组学领域主图
│   ├── workflow/                ← 流程大图/Hero 图
│   ├── charts/                  ← 图表缩略图（40+ 张）
│   └── workflow-steps/          ← 流程步骤图（24 张）
└── favicon.ico                  ← 站点图标

src/assets/                      ← 需要 Vite 构建管道处理的资源
├── icons/                       ← SVG Icons（组件化使用）
│   ├── index.ts                 ← 统一导出入口
│   ├── logo.svg                 ← 品牌 Logo
│   ├── logo-dark.svg            ← 暗色版 Logo
│   └── social/                  ← 第三方平台图标（预留）
├── svgs/                        ← 装饰性/插画 SVG（预留）
└── fonts/                       ← 自定义字体（预留）
```

## 归属规则

| 条件 | 放置位置 |
|------|----------|
| 不需要构建处理 + 文件较大 + 引用广泛 | `public/images/` |
| 需要 hash（缓存破裂）+ 组件化 + 优化 | `src/assets/` |
| SVG 需要作为 React 组件使用 | `src/assets/icons/` |
| 外部服务需要固定 URL（如 OG、favicon） | `public/` 根目录 |

## 文件命名规范

- **格式**: kebab-case（全小写，连字符分隔）
- **语义前缀**:
  - `card-bg-` — 卡片背景图
  - `bg-` — Section 背景
  - `hero-` — Hero 区域资源
  - `analysis-` — 分析配图
  - `workflow-` — 流程图
  - `icon-` — Icon 文件

**示例**: `card-bg-genomics.jpg`, `analysis-rna-expression.jpg`, `workflow-hero-genomics.jpg`

## Icon 体系

| 场景 | 方案 | 示例 |
|------|------|------|
| 通用 UI Icons | `lucide-react` 库 | `<ArrowRight />`, `<Menu />` |
| 品牌/业务 Icons | `src/assets/icons/*.svg` + svgr | `import { Logo } from '@/assets/icons'` |
| 第三方平台 Icons | `src/assets/icons/social/*.svg` | WeChat、GitHub 等 |

### SVG 编写规范

- 移除硬编码 `width`/`height`，使用 `viewBox`
- 填充色使用 `currentColor` 以适配主题
- 去除编辑器元数据（Illustrator、Figma 注释）
- 坐标精度限制在小数点后 2 位

### SVG 使用方式

通过 `vite-plugin-svgr` 将 SVG 转为 React 组件。导入时使用 `?react` 后缀：

```tsx
// Unified export in src/assets/icons/index.ts
export { default as Logo } from './logo.svg?react'
export { default as LogoDark } from './logo-dark.svg?react'
```

```tsx
// Use in business components (supports className, fill, etc. props)
import { Logo } from '@/assets/icons'

<Logo className="w-8 h-8 text-primary" />
```

## 图片优化规范

### HTML 属性（必须）

| 属性 | 用法 | 说明 |
|------|------|------|
| `loading="lazy"` | 首屏以下所有图片 | 原生延迟加载 |
| `decoding="async"` | 所有非关键图片 | 不阻塞渲染 |
| `width` + `height` | 所有 img 标签 | 防止 CLS（布局偏移） |
| `fetchPriority="high"` | 仅 LCP 图片 | 首屏关键图片 |
| `alt` | 所有 img 标签 | 无障碍访问 |

### OptimizedImage 组件

位于 `src/components/shared/Image/index.tsx`，封装以下功能：

- 自动 `loading="lazy"` / `decoding="async"`
- `priority` prop 标记关键图片（`fetchPriority="high"`）
- 加载淡入动画
- 错误兜底（fallback 占位图）
- 背景色占位防 CLS

```tsx
import { OptimizedImage } from '@/components/shared/Image'

<OptimizedImage
  src="/images/cards/card-bg-genomics.jpg"
  alt="Genomics"
  width={800}
  height={192}
  objectFit="cover"
/>
```

### 图片格式选择

| 格式 | 适用场景 |
|------|----------|
| `.jpg` | 照片、复杂背景 |
| `.png` | 图表截图、需要透明通道 |
| `.svg` | Icon、插画、Logo |
| `.webp` | （部署层转换）所有光栅图的现代替代 |
| `.avif` | （部署层转换）下一代格式 |

### Video 优化

```tsx
<video
  autoPlay loop muted playsInline
  preload="metadata"           // Do not preload the full video
  poster="/images/hero/poster.jpg"  // Static poster frame
>
  <source src="video.webm" type="video/webm" />  <!-- 优先 WebM -->
  <source src="video.mp4" type="video/mp4" />
</video>
```

## 路径引用

### 使用常量（推荐）

```tsx
import { ASSETS } from '@/constants/assets'

<img src={ASSETS.cards.genomics} alt="..." />
```

### 直接路径（仅 charts/workflow-steps）

```tsx
// For large quantities rendered via data loops, keep direct paths
{ img: '/images/charts/volcano.png' }
{ img: '/images/workflow-steps/genomics-step1.png' }
```

## 字体管理（预留）

目前使用系统字体栈。如需引入自定义字体：

1. 将 `.woff2` 文件放入 `src/assets/fonts/`
2. 在 `src/index.css` 添加 `@font-face` 声明
3. 在 `tailwind.config.js` 中扩展 `fontFamily`

```css
@font-face {
  font-family: 'BrandFont';
  src: url('@/assets/fonts/brand-font.woff2') format('woff2');
  font-display: swap;
}
```

## 构建工具链

| 工具 | 用途 | 配置文件 |
|------|------|----------|
| `vite-plugin-svgr` | SVG → React 组件（`?react` 后缀导入） | `vite.config.ts` |
| Vite asset pipeline | `src/assets/` 中资源自动 hash | 内置 |
| `manualChunks` | react-vendor / i18n / recharts / framer-motion 分包 | `vite.config.ts` |
| `@` 路径别名 | `src/` 目录映射为 `@/` | `vite.config.ts` |

## 部署层优化（建议）

- CDN 启用图片自动 WebP/AVIF 转换
- 配置 `Cache-Control: public, max-age=31536000, immutable` 对 hash 资源
- 视频考虑 HLS/DASH 分片传输
- 移动端通过 CDN 参数裁剪尺寸（如 `?w=400&q=75`）
