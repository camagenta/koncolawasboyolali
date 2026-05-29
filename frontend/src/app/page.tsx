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
            <img src="/logo-sma1.png" alt="Logo SMAN 1 Boyolali" className="w-8 h-8 rounded-lg" />
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
          <img src="/logo-sma1.png" alt="Logo SMAN 1 Boyolali" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            IKASMANSA
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
            Ikatan Alumni SMA N 1 Boyolali
          </p>
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
                    {stats.byTahunLulus?.length ?? 0}
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
