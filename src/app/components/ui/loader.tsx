"use client";
import React from "react";

export default function PremiumLoader() {
  return (
    // z-[99999] ensures it sits on top of Header & Footer
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center gap-8">
        
        {/* SPINNER */}
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-t-black border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full animate-pulse shadow-[0_0_20px_rgba(0,0,0,0.3)]"></div>
        </div>

        {/* TEXT */}
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