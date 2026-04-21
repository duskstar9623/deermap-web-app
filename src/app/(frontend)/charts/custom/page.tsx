import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Graphics | Bio-Web',
  description: 'Professional 1v1 custom design service',
}

export default function CustomChartsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4 text-center">Custom Graphics</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Professional 1v1 custom design service for complex scientific graphics
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose Custom Design?</h2>
            <ul className="space-y-4">
              {[
                'Non-standard complex graphics',
                'Professional publication-quality output',
                'Dedicated designer support',
                'Unlimited revisions',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Gallery Placeholder */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Gallery Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg"
                />
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Pricing</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <p className="text-lg font-semibold mb-4">From ¥500 per graphic</p>
              <p className="text-gray-600 mb-6">
                Final price depends on complexity and revision requirements
              </p>
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Request a Quote
              </button>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-600 mb-6">Contact our team for more information</p>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
              Contact Us
            </button>
          </section>
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
