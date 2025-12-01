import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-9xl font-black text-gray-100 tracking-tighter select-none">404</h1>
        <div className="relative -mt-12 mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Page Not Found</h2>
            <p className="text-gray-500 font-medium mt-2">
                Oops! The page you are looking for seems to have vanished into the digital void.
            </p>
        </div>
        
        <div className="flex justify-center">
            <Link 
                href="/" 
                className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition shadow-xl"
            >
                <FiArrowLeft /> Return Home
            </Link>
        </div>
      </div>
    </div>
  )
}