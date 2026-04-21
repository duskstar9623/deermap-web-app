'use client'

import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-blue-600">
            Bio-Web
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/charts/basic" className="text-gray-700 hover:text-blue-600 transition">
              Charts
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-blue-600 transition">
              News
            </Link>
            <Link href="/team" className="text-gray-700 hover:text-blue-600 transition">
              Team
            </Link>
            <Link href="/user/profile" className="text-gray-700 hover:text-blue-600 transition">
              Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
