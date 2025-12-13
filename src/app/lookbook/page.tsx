"use client";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import { FiArrowUpRight } from "react-icons/fi";
import { getCurrentUser } from "@/lib/auth"; // You might need to adjust this based on client/server component structure
// Since this is a client page, we'll fetch user inside or wrap it. 
// For UI focus, let's keep it static premium visual.

const LOOKBOOK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", title: "Urban Explorer", category: "Men" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", title: "Evening Elegance", category: "Women" },
  { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", title: "Summer Breeze", category: "Women" },
  { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop", title: "Classic Tailoring", category: "Men" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", title: "Avant Garde", category: "Unisex" },
  { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop", title: "Street Culture", category: "Women" },
  { src: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=800&auto=format&fit=crop", title: "Minimalist", category: "Accessories" },
  { src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop", title: "Modern Aesthetic", category: "Men" },
  { src: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=800&auto=format&fit=crop", title: "Abstract", category: "Women" },
];

export default function LookbookPage() {
  // Mock User fetch or pass as prop if needed
  // For visual purpose, Header handles its own user state if needed or we pass null
  
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* We can pass user={null} or implement fetching if you want header state */}
      <Header user={null} /> 

      <div className="pt-40 pb-20 px-6 max-w-[1600px] mx-auto">
        
        {/* Title */}
        <FadeIn className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Editorial</p>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900 leading-[0.85]">
                SEASON <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200">2026</span>
            </h1>
        </FadeIn>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {LOOKBOOK_IMAGES.map((img, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                    <div className="relative group overflow-hidden rounded-[2rem] cursor-pointer break-inside-avoid">
                        <img 
                            src={img.src} 
                            alt={img.title}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        
                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">{img.category}</p>
                            <h3 className="text-3xl font-black text-white leading-none">{img.title}</h3>
                            <div className="flex items-center gap-2 text-white mt-4 text-sm font-bold border-b border-white/50 pb-1 w-fit">
                                Shop the Look <FiArrowUpRight />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 font-medium">
                "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening."
            </p>
            <div className="text-sm font-bold uppercase tracking-widest text-black">— Coco Chanel</div>
        </div>

      </div>
    </div>
  );
}