import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Profile | Bio-Web',
  description: 'Manage your account information and preferences',
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12">Account Settings</h1>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          {/* Profile Info */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Membership */}
          <section className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Membership</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold mb-2">Current Plan: Free User</p>
              <p className="text-sm text-gray-600">
                Upgrade to membership for unlimited chart generation
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-8">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Save Changes
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
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
