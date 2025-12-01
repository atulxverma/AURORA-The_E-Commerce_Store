'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { FiAlertOctagon, FiRefreshCw } from 'react-icons/fi'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-md mx-auto relative overflow-hidden">
        
        {/* Background Blur Effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-red-50/50 -z-10 rounded-b-[50%]" />

        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FiAlertOctagon size={40} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Something went wrong!</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium leading-relaxed">
            We encountered an unexpected error. Don't worry, it's not your fault.
        </p>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-900 transition shadow-lg active:scale-95"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    </div>
  )
}