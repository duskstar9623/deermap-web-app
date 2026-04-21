import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'deermap - 一站式科研服务平台',
  description: '鹿图科技提供基础制图、个性化制图、论文服务、生信分析等科研服务',
  keywords: ['科研', '制图', '生物信息学', '论文服务'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
