import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paper Services | Bio-Web',
  description: 'Professional paper polishing, formatting, and optimization',
}

export default function PaperPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4 text-center">Paper Services</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Professional support for paper polishing, formatting, and graphic optimization
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Services Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Language Polishing',
                  desc: 'Professional English proofreading and editing by native speakers',
                },
                {
                  title: 'Formatting & Layout',
                  desc: 'Journal-compliant formatting and layout optimization',
                },
                {
                  title: 'Graphic Optimization',
                  desc: 'Chart and figure enhancement for publication quality',
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Table */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Pricing</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Service</th>
                    <th className="px-6 py-3 text-right font-semibold">Starting Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Language Polishing', '¥200/1000 words'],
                    ['Journal Formatting', '¥300/paper'],
                    ['Graphic Optimization', '¥150/figure'],
                  ].map(([service, price], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3">{service}</td>
                      <td className="px-6 py-3 text-right font-semibold">{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
              Submit Your Paper
            </button>
            <p className="text-gray-600 mt-4">
              Free consultation • Turnaround: 3-5 business days
            </p>
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
