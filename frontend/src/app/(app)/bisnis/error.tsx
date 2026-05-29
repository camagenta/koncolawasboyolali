'use client'

export default function BisnisError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-16">
      <svg className="w-12 h-12 mx-auto text-red-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-gray-500 text-sm mb-1">Terjadi kesalahan saat memuat data</p>
      <p className="text-xs text-gray-400 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )
}
