"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FadeIn from "../components/FadeIn";
import { FiArrowUpRight } from "react-icons/fi";

const LOOKBOOK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", title: "Urban Explorer", category: "Men", link: "/men" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", title: "Evening Elegance", category: "Women", link: "/women" },
  { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", title: "Summer Breeze", category: "Women", link: "/women" },
  { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop", title: "Classic Tailoring", category: "Men", link: "/men" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", title: "Avant Garde", category: "Unisex", link: "/new-arrivals" },
  { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop", title: "Street Culture", category: "Women", link: "/women" },
  { src: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=800&auto=format&fit=crop", title: "Minimalist", category: "Accessories", link: "/accessories" },
  { src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop", title: "Modern Aesthetic", category: "Men", link: "/men" },
  { src: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=800&auto=format&fit=crop", title: "Abstract", category: "Women", link: "/women" },
];

export default function LookbookPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch User for Header
  useEffect(() => {
    async function getUser() {
        try {
            const res = await fetch("/api/me");
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            }
        } catch (e) { console.error(e); }
    }
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Header user={currentUser} /> 

      <div className="pt-40 pb-20 px-6 max-w-[1600px] mx-auto">
        
        {/* Title */}
        <FadeIn className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Editorial</p>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900 leading-[0.85]">
                SEASON <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200">2026</span>
            </h1>
        </FadeIn>

        {/* Masonry Grid (Preserved Premium Look) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {LOOKBOOK_IMAGES.map((img, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                    <Link href={img.link} className="block relative group overflow-hidden rounded-[2rem] cursor-pointer break-inside-avoid">
                        <img 
                            src={img.src} 
                            alt={img.title}
                            className="w-full h-auto object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                        />
                        
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">{img.category}</p>
                            <h3 className="text-3xl font-black text-white leading-none mb-4">{img.title}</h3>
                            
                            <div className="flex items-center gap-2 text-white text-sm font-bold border-b border-white/50 pb-1 w-fit group-hover:border-white transition-all">
                                Shop the Look <FiArrowUpRight />
                            </div>
                        </div>
                    </Link>
                </FadeIn>
            ))}
        </div>

        {/* Quote */}
        <div className="mt-32 text-center">
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 font-medium italic">
                "Style is a way to say who you are without having to speak."
            </p>
            <div className="text-sm font-bold uppercase tracking-widest text-black">— Rachel Zoe</div>
        </div>

      </div>
    </div>
  );
}