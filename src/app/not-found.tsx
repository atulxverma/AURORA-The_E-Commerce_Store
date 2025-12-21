import Link from 'next/link'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white overflow-hidden selection:bg-black selection:text-white relative">
      
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] -z-10" />

      <div className="text-center max-w-lg mx-auto px-6 relative z-10">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-400 shadow-sm border border-gray-200">
            <FiAlertCircle size={40} />
        </div>

        {/* 404 Text */}
        <h1 className="text-[8rem] md:text-[10rem] font-black text-gray-900 leading-none tracking-tighter select-none opacity-10">
            404
        </h1>
        
        <div className="relative -mt-12 md:-mt-16 mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Page Not Found</h2>
            <p className="text-gray-500 font-medium mt-4 text-lg max-w-sm mx-auto leading-relaxed">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-center">
            <Link 
                href="/" 
                className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                Return Home
            </Link>
        </div>
      </div>
    </div>
  )
}