"use client";

export default function Loading() {
  return (
    // FIX: z-[99999] ensures it covers EVERYTHING
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/90 backdrop-blur-3xl transition-all duration-500">
      
      <div className="relative flex flex-col items-center gap-8">
        
        {/* --- PREMIUM SPINNER --- */}
        <div className="relative w-24 h-24">
            
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
            
            {/* Spinning Gradient Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-t-black border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            
            {/* Inner Pulsing Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full animate-pulse shadow-[0_0_20px_rgba(0,0,0,0.3)]"></div>
        
        </div>

        {/* --- BRAND TEXT --- */}
        <div className="text-center space-y-2 animate-pulse">
            <h2 className="text-2xl font-black text-black tracking-tighter uppercase">
                AURORA
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] ml-1">
                Loading Experience
            </p>
        </div>

      </div>
    </div>
  );
}