import React from "react";
import Header from "../components/Header";
import prismaClient from "@/services/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import ItemCard from "../components/Item-card"; 
import FadeIn from "../components/FadeIn";
import WishlistButton from "../components/wishlist-button"; 
import { FiHeart, FiUser, FiArrowRight, FiGrid } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getCurrentUser();

  // --- 1. NO USER UI ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={null} />
        <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
            <FadeIn>
                <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
                        <FiHeart size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Your Wishlist is Lonely</h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        Login to see the items you've saved.
                    </p>
                    <Link href="/login" className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl flex items-center gap-3 cursor-pointer">
                        <FiUser /> Login to View
                    </Link>
                </div>
            </FadeIn>
        </div>
      </div>
    );
  }

  // --- FETCH ---
  const wishlistItems = await prismaClient.wishlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  // --- 2. EMPTY STATE (NO HEADER) ---
  if (wishlistItems.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
                <FadeIn>
                    <div className="bg-white p-24 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <FiHeart size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">It's empty here.</h1>
                        <p className="text-gray-500 mb-8 max-w-sm font-medium">
                            You haven't saved any items yet. Start exploring!
                        </p>
                        <Link href="/" className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl cursor-pointer">
                            <FiGrid /> Explore Products
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
  }

  // --- 3. FILLED STATE (WITH PREMIUM HEADER) ---
  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      
      {/* HERO SECTION (Only shows if items exist) */}
      <div className="relative pt-40 pb-16 text-center overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-50 to-transparent rounded-full blur-3xl -z-10" />
         <FadeIn>
            <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Favorites</span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
                MY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">COLLECTION.</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">{wishlistItems.length} items saved for later</p>
         </FadeIn>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.05}>
                    <div className="relative group h-full">
                        
                        {/* --- FIXED: Increased spacing (top-4 right-4) --- */}
                        <div className="absolute top-4 right-4 z-30 transform transition hover:scale-110 cursor-pointer">
                            <WishlistButton 
                                product={{ id: item.productId }} 
                                initialLiked={true} 
                            />
                        </div>
                        
                        {/* CARD */}
                        <ItemCard 
                            item={{
                                id: item.productId, 
                                title: item.title, 
                                price: item.price, 
                                thumbnail: item.image_url,
                                category: "Saved"
                            }} 
                        />
                    </div>
                </FadeIn>
            ))}
        </div>
      </div>
    </div>
  );
}