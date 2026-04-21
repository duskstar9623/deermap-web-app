import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Basic Charting | Bio-Web',
  description: 'Self-service scientific chart generation',
}

export default function BasicChartsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4 text-center">Basic Charting</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Generate professional scientific charts with your data
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Chart Type Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Select Chart Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Heatmap',
                'Volcano Plot',
                'Box Plot',
                'Survival Curve',
                'Contour Plot',
                'Ternary Plot',
              ].map((type) => (
                <button
                  key={type}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition font-semibold"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Data Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8">
            <p className="text-lg font-semibold mb-4">Upload Your Data</p>
            <p className="text-gray-600 mb-6">
              Drag and drop your CSV or Excel file here, or click to browse
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Choose File
            </button>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold mb-2">ℹ️ Free Preview</h3>
            <p className="text-sm text-gray-700">
              Logged-in users: Pay per chart • Members: Unlimited charts per month
            </p>
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
