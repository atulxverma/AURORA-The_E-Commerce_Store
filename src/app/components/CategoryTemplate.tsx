"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import ItemCard from "./Item-card";
import FadeIn from "./FadeIn";
import WishlistButton from "./wishlist-button";
import SkeletonCard from "./SkeletonCard";
import { getWishlist } from "@/actions/prodactions";
import { FiSliders, FiChevronDown, FiX, FiSearch } from "react-icons/fi";

interface CategoryTemplateProps {
  title: string;
  subtitle: string;
  filterType: "category" | "tag" | "sale" | "new";
  filterValue: string; // e.g., "men", "women", "sale"
  heroGradient: string; // Custom gradient for each page
}

export default function CategoryTemplate({ title, subtitle, filterType, filterValue, heroGradient }: CategoryTemplateProps) {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Filters
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch ALL products first
        const [prodRes, userRes] = await Promise.all([
            fetch("/api/product", { cache: "no-store" }),
            fetch("/api/me")
        ]);

        const prodData = await prodRes.json();
        let products = prodData.products || [];
        let activeUser = null;

        if (userRes.ok) {
            const uData = await userRes.json();
            activeUser = uData.user;
            setCurrentUser(activeUser);
        }

        // --- CORE FILTER LOGIC ---
        if (filterType === "category") {
            // Loose matching (e.g. "men" matches "mens-shirts", "men-shoes")
            // But ensure "men" doesn't match "women"
            products = products.filter((p: any) => {
                const cat = p.category.toLowerCase();
                if (filterValue === "men") return cat.includes("men") && !cat.includes("women");
                if (filterValue === "women") return cat.includes("women") || cat.includes("dress");
                return cat.includes(filterValue);
            });
        } 
        else if (filterType === "sale") {
            // Mock Sale: Products cheaper than 500 or random logic
            products = products.filter((p: any) => p.price < 100); 
        }
        else if (filterType === "new") {
            // Mock New: Just take last 10 products
            products = products.slice(0, 10);
        }

        // Check Wishlist
        if (activeUser) {
            const wishlistItems = await getWishlist();
            const likedIds = new Set(wishlistItems.map((w: any) => w.productId));
            products = products.map((p: any) => ({ ...p, isLiked: likedIds.has(p.id) }));
        }

        setAllProducts(products);
        setFilteredProducts(products);

      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchData();
  }, [filterType, filterValue]);

  // Sync with Wishlist Events
  useEffect(() => {
    const handleWishlistSync = (e: any) => {
        const { id, status } = e.detail;
        const updateList = (list: any[]) => list.map(p => p.id === id ? { ...p, isLiked: status } : p);
        setAllProducts(prev => updateList(prev));
        setFilteredProducts(prev => updateList(prev));
    };
    window.addEventListener("wishlist-updated", handleWishlistSync);
    return () => window.removeEventListener("wishlist-updated", handleWishlistSync);
  }, []);

  // Sort Logic
  useEffect(() => {
    let result = [...allProducts];
    if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [sortOrder, allProducts]);

  return (
    <div className="min-h-screen bg-white">
      <Header user={currentUser} />
      
      {/* --- PREMIUM HERO HEADER --- */}
      <div className={`relative pt-44 pb-20 px-6 overflow-hidden ${heroGradient}`}>
         <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl"></div>
         <FadeIn className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Collection</p>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                    {title}
                </h1>
                <p className="text-lg text-gray-600 mt-4 max-w-xl font-medium">{subtitle}</p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl border border-white/50 px-5 py-3 rounded-2xl shadow-sm hover:border-black/20 transition-all cursor-pointer">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort</span>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none pr-6 z-10">
                            <option value="">Featured</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>
         </FadeIn>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-20 relative z-10">
        <main>
            <FadeIn>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[1.5rem] animate-pulse"></div>)}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <FiSearch className="text-5xl text-gray-300 mb-4"/>
                        <h3 className="text-xl font-black text-gray-900">No Products Found</h3>
                        <p className="text-sm text-gray-500 mt-2">Check back later for new drops.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                        {filteredProducts.map((item, index) => {
                            const isOwner = currentUser?.id === item.ownerId;
                            return (
                                <FadeIn key={item.id} delay={index * 0.05}>
                                    <div className="relative group h-full">
                                        {!isOwner && (
                                            <div className="absolute top-2 right-2 z-30 transform transition group-hover:scale-110">
                                                <WishlistButton product={item} initialLiked={item.isLiked || false} />
                                            </div>
                                        )}
                                        <ItemCard item={item} />
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}
            </FadeIn>
        </main>
      </div>
    </div>
  );
}