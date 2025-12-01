import React from "react";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full w-full">
      
      {/* --- IMAGE AREA SKELETON --- */}
      {/* Matches aspect-[3/4] and rounded-[1.5rem] of ItemCard */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-[1.5rem] overflow-hidden animate-pulse">
        {/* Optional: Subtle shimmer effect icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full opacity-50" />
        </div>
      </div>

      {/* --- CONTENT AREA SKELETON --- */}
      <div className="p-5 flex flex-col gap-4">
        
        {/* Title & Price Row */}
        <div className="flex justify-between items-start gap-4">
            {/* Title Bar */}
            <div className="h-5 bg-gray-100 rounded-full w-3/4 animate-pulse" />
            {/* Price Badge */}
            <div className="h-6 bg-gray-100 rounded-lg w-16 animate-pulse" />
        </div>

        {/* Description Lines */}
        <div className="space-y-2">
            <div className="h-3 bg-gray-50 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-gray-50 rounded-full w-2/3 animate-pulse" />
        </div>

        {/* Button Placeholder (Bottom) */}
        <div className="mt-2 pt-2">
            <div className="h-11 w-full bg-gray-100 rounded-xl animate-pulse" />
        </div>

      </div>
    </div>
  );
}