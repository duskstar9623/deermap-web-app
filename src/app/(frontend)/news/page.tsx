import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industry News | Bio-Web',
  description: 'Latest scientific research news and industry insights',
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4 text-center">Industry News</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Latest research trends, policy updates, and industry insights
        </p>

        {/* News List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <article
                key={i}
                className="border-b border-gray-200 pb-8 hover:shadow-sm transition"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg" />
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-2">
                      Research Trends
                    </span>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 cursor-pointer">
                      News Title {i}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Brief excerpt of the news article goes here. Click to read the full story
                      and learn more about the latest developments.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By Author Name</span>
                      <span>•</span>
                      <span>2024-04-{20 - i}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  page === 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
