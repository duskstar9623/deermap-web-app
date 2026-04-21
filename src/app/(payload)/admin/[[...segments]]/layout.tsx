import { RootLayout } from '@payloadcms/next/layouts'
import { notFound } from 'next/navigation'

export default async function AdminLayout({
  params,
}: {
  params: Promise<{
    segments?: string[]
  }>
}) {
  const { segments } = await params

  return (
    <RootLayout
      params={{
        segments: segments || [],
      }}
    />
  )
}
