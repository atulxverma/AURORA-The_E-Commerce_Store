"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "../components/Header";
import ItemCard from "../components/Item-card";
import { deleteProductFromDb, getWishlist } from "@/actions/prodactions"; // Import getWishlist
import WishlistButton from "../components/wishlist-button";
import FadeIn from "../components/FadeIn"; 
import FilterModal from "../components/FilterModal"; 
import SkeletonCard from "../components/SkeletonCard";
import { FiArrowRight, FiBox, FiGlobe, FiShield } from "react-icons/fi";
import { AuroraBackground } from "../components/ui/aurora-background"; 
import { FlipWords } from "../components/ui/flip-words"; 

// --- ROTATING TEXT COMPONENT ---
const RotatingText = () => {
  const words = ["LUXURY.", "FUTURE.", "STYLE.", "CLASS."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#020617] via-[#3b82f6] to-[#020617] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] transition-opacity duration-500 block min-h-[1.2em]">
      {words[index]}
    </span>
  );
};

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  // --- 1. DATA FETCHING (FIXED LOGIC) ---
  const fetchData = useCallback(async () => {
    try {
      // Parallel Fetch: Product + User
      const [prodRes, userRes] = await Promise.all([
        fetch("/api/product", { cache: "no-store" }),
        fetch("/api/me", { cache: "no-store" })
      ]);

      const prodData = await prodRes.json();
      let activeUser = null;

      // 1. Set User
      if (userRes.ok) {
          const uData = await userRes.json();
          activeUser = uData.user;
          setCurrentUser(activeUser);
      }
      setUserLoading(false);

      // 2. Set Products with Wishlist Status
      if (prodData.success) {
          let rawProducts = prodData.products || [];

          // --- LOGIC FIX: Check Wishlist if User Exists ---
          if (activeUser) {
              const wishlistItems = await getWishlist(); // Server Action
              // Create a Set of Liked Product IDs for fast lookup
              const likedIds = new Set(wishlistItems.map((w: any) => w.productId));
              
              // Map products and set isLiked = true if in wishlist
              rawProducts = rawProducts.map((p: any) => ({
                  ...p,
                  isLiked: likedIds.has(p.id)
              }));
          }

          setAllProducts(rawProducts);
          setFilteredProducts(rawProducts);
      }
    } catch (error) {
      console.error("Error:", error);
      setUserLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. LISTENERS ---
  useEffect(() => {
    fetchData(); 
    
    // Optimistic Add Listener
    const handleOptimisticAdd = (e: any) => {
        const newProduct = e.detail; 
        if(newProduct) {
            setAllProducts(prev => [newProduct, ...prev]);
            setFilteredProducts(prev => [newProduct, ...prev]);
        }
    };

    // Wishlist Sync Listener (Keeps UI in sync without reload)
    const handleWishlistSync = (e: any) => {
        const { id, status } = e.detail;
        
        const updateList = (list: any[]) => list.map(p => 
            p.id === id ? { ...p, isLiked: status } : p
        );

        setAllProducts(prev => updateList(prev));
        setFilteredProducts(prev => updateList(prev));
    };

    const handleRefresh = () => fetchData();

    window.addEventListener("product-added-optimistic", handleOptimisticAdd);
    window.addEventListener("product-updated", handleRefresh);
    window.addEventListener("wishlist-updated", handleWishlistSync);
    
    return () => {
      window.removeEventListener("product-added-optimistic", handleOptimisticAdd);
      window.removeEventListener("product-updated", handleRefresh);
      window.removeEventListener("wishlist-updated", handleWishlistSync);
    };
  }, [fetchData]);

  // --- 3. HANDLERS ---
  const handleFilter = (filters: any) => {
    let result = [...allProducts];
    if (filters.category) result = result.filter(p => p.category?.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.min || filters.max) result = result.filter(p => p.price >= filters.min && p.price <= filters.max);
    if (filters.sort === "asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "desc") result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    const updateList = (prev: any[]) => prev.filter((p) => p.id !== id);
    setAllProducts(updateList);
    setFilteredProducts(updateList);
    const res = await deleteProductFromDb(id); 
    if (!res.success) { alert(res.message); fetchData(); }
  };

  const getDisplayName = () => {
    if (!currentUser) return "";
    return currentUser.name || currentUser.username || "User";
  };

  const getInitial = () => getDisplayName().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: flex; min-width: 200%; animation: marquee 25s linear infinite; }
        .bg-grid-pattern { background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px); background-size: 20px 20px; }
      `}</style>

      <Header user={currentUser} />

      {/* --- HERO SECTION --- */}
      <AuroraBackground className="h-[90vh]">
         <FadeIn className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center pt-28 px-6">
            
            {/* Welcome Badge */}
            {userLoading ? (
                <div className="h-12 w-64 bg-white/50 rounded-full animate-pulse mb-8 border border-white/20"></div>
            ) : currentUser ? (
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white/50 px-6 py-3 rounded-full shadow-xl mb-8 hover:scale-105 transition-transform cursor-default">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">{getInitial()}</div>
                    <span className="text-sm font-bold text-gray-800">Welcome back, <span className="text-black font-black text-base ml-1">{getDisplayName()}</span></span>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-sm mb-8">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    <span className="text-xs font-bold tracking-wider uppercase text-gray-600">New Collection 2026</span>
                </div>
            )}

            <div className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-gray-900 leading-[0.9]">
                DEFINING <br className="hidden md:block"/>
                <RotatingText />
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                Experience the future of e-commerce. Curated, exclusive, and designed for the modern aesthetic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <button className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition shadow-2xl flex items-center justify-center gap-2 group">Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
                <button className="bg-white/80 backdrop-blur-sm text-black border border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white transition shadow-sm">View Lookbook</button>
            </div>
         </FadeIn>
      </AuroraBackground>

      {/* --- MARQUEE --- */}
      <div className="mt-20 bg-black text-white py-4 overflow-hidden border-y border-black relative flex z-20">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                  <React.Fragment key={i}>
                      <span className="font-bold uppercase tracking-widest text-sm">Free Shipping Worldwide</span> • 
                      <span className="font-bold uppercase tracking-widest text-sm">30-Day Returns</span> • 
                      <span className="font-bold uppercase tracking-widest text-sm">Secure Payment</span> • 
                      <span className="font-bold uppercase tracking-widest text-sm">New Arrivals Daily</span> • 
                  </React.Fragment>
              ))}
          </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative bg-white border border-gray-100 p-10 rounded-[3rem] h-96 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 ease-out">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-500 z-10"><FiBox size={28} /></div>
                  <div className="relative z-10"><h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Superfast <br /> Delivery.</h3><p className="text-gray-500 font-medium">Doorstep delivery within 24 hours.</p></div>
                  <span className="absolute -bottom-4 -right-4 text-9xl font-black text-gray-50 select-none group-hover:text-gray-100 transition-colors duration-500">24</span>
              </div>
              <div className="group relative bg-[#0F0F0F] p-10 rounded-[3rem] h-96 flex flex-col justify-between overflow-hidden hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex justify-between items-start"><div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 border border-white/10"><FiGlobe size={28} /></div><div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span></div></div>
                  <div className="relative z-10"><h3 className="text-3xl font-black text-white tracking-tight mb-2">Shipping <br /> Global.</h3><p className="text-gray-400 font-medium">We ship to over 100+ countries.</p></div>
              </div>
              <div className="group relative bg-[#F4F4F5] p-10 rounded-[3rem] h-96 flex flex-col justify-between overflow-hidden hover:bg-gray-200 transition-colors duration-500">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform duration-500 z-10"><FiShield size={28} /></div>
                  <div className="relative z-10"><h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">100% Secure <br /> Payment.</h3><p className="text-gray-500 font-medium">Encrypted transactions.</p></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[16px] border-white rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
              </div>
          </div>
      </section>

      {/* --- PRODUCTS GRID --- */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <FadeIn><div className="border-l-4 border-black pl-6 py-2"><h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">LATEST <br /> <span className="text-gray-300">DROPS.</span></h2></div></FadeIn>
            <div className="w-full md:w-auto"><FilterModal onApply={handleFilter} /></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (<SkeletonCard key={i} />))}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-[3rem]"><p className="text-xl text-gray-400 font-bold">No products found.</p><button onClick={() => window.location.reload()} className="text-black underline mt-2 font-bold">Reset All</button></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((item, index) => {
              const isOwner = currentUser?.id === item.ownerId;
              return (
                <FadeIn key={item.id} delay={index * 0.05}>
                    <div className="relative group h-full">
                        {!isOwner && (<div className="absolute top-3 right-3 z-30 transform transition hover:scale-110"><WishlistButton product={item} initialLiked={item.isLiked || false} /></div>)}
                        <ItemCard item={item} deleteItem={isOwner ? handleDelete : undefined} />
                    </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}