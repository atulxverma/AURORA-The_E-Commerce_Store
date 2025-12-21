'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { FiAlertOctagon, FiRefreshCw, FiHome } from 'react-icons/fi'
import Link from 'next/link'
 
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-black selection:text-white">
      
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center max-w-md mx-auto relative overflow-hidden">
        
        {/* Decorative Blur */}
        <div className="absolute top-0 left-0 w-full h-32 bg-red-50 -z-10 rounded-b-[50%]" />

        {/* Icon */}
        <div className="w-20 h-20 bg-white text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg border border-red-50">
            <FiAlertOctagon size={40} />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight uppercase">Something went wrong!</h2>
        <p className="text-gray-500 text-sm mb-10 font-medium leading-relaxed px-4">
            We encountered an unexpected error. Don't worry, it's not your fault. Let's try that again.
        </p>

        <div className="flex flex-col gap-3">
            <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition shadow-lg active:scale-95 cursor-pointer"
            >
            <FiRefreshCw /> Try Again
            </button>

            <Link href="/" className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-100 transition cursor-pointer">
                <FiHome /> Go Home
            </Link>
        </div>
      </div>
    </div>
  )
}