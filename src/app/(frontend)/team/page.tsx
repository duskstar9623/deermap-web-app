import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team | Bio-Web',
  description: 'Meet our expert research team',
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Our Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Placeholder team members */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Team Member {i}</h3>
              <p className="text-gray-600 mb-4">Position / Title</p>
              <p className="text-sm text-gray-500">Bio and expertise information</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
