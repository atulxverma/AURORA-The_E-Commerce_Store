"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* SPINNER */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* TEXT (Optional, can remove) */}
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">
          Loading Aurora...
        </p>
      </div>
    </div>
  );
}