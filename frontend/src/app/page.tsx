async function getStats() {
  try {
    const apiUrl = process.env.API_INTERNAL_URL || 'http://localhost:3001'
    const res = await fetch(`${apiUrl}/api/stats/overview`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function LandingPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IK</span>
            </div>
            <span className="font-semibold text-gray-900">IKASMANSA</span>
          </div>
          <a
            href="/api/auth/google"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Login with Google
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-3xl">IK</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            IKASMANSA
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
            Ikatan Alumni SMA N 1 Boyolali
          </p>
          <a
            href="/api/auth/google"
            className="inline-flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-8 py-3.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </a>
        </section>

        {stats && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
                Statistik Alumni
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-1">{stats.total ?? 0}</p>
                  <p className="text-sm text-gray-500">Total Alumni Terdaftar</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    {stats.byYear?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Total Angkatan</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-purple-600 mb-1">
                    {stats.totalForumThreads ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Diskusi Forum</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} IKASMANSA - Ikatan Alumni SMA N 1 Boyolali
        </div>
      </footer>
    </div>
  )
}
