import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bio-Web | Scientific Research Platform',
  description: 'One-stop scientific research service platform for biologists',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
