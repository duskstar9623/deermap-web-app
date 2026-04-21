export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Bio-Web Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          One-stop scientific research service platform for biologists
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/charts/basic"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/team"
            className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-gray-400 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Basic Charting', desc: 'Self-service chart generation' },
            { title: 'Custom Graphics', desc: 'Professional 1v1 design service' },
            { title: 'Paper Services', desc: 'Paper polishing & formatting' },
          ].map((service) => (
            <div
              key={service.title}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Bio-Web. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
