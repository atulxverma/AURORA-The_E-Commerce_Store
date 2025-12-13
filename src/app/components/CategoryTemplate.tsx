"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import ItemCard from "./Item-card";
import FadeIn from "./FadeIn";
import WishlistButton from "./wishlist-button";
import SkeletonCard from "./SkeletonCard";
import { getWishlist } from "@/actions/prodactions";
import { FiChevronDown, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CategoryTemplateProps {
  title: string;
  subtitle: string;
  filterType: "category" | "tag" | "sale" | "new";
  filterValue: string; 
  heroGradient: string; 
}

const ITEMS_PER_PAGE = 40;

export default function CategoryTemplate({ title, subtitle, filterType, filterValue, heroGradient }: CategoryTemplateProps) {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- MAIN FETCH LOGIC (FIXED) ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch Everything in Parallel
        const [prodRes, userRes] = await Promise.all([
            fetch("https://dummyjson.com/products?limit=100"), 
            fetch("/api/me")
        ]);

        const apiData = await prodRes.json();
        let products = apiData.products || [];
        
        // 2. Fetch DB Products
        const dbRes = await fetch('/api/product');
        const dbData = await dbRes.json();
        if(dbData.success) {
             const dbProds = dbData.products.filter((p:any) => p.id.length === 24);
             products = [...dbProds, ...products];
        }

        // 3. Handle User
        let activeUser = null;
        if (userRes.ok) {
            const uData = await userRes.json();
            activeUser = uData.user;
            setCurrentUser(activeUser);
        }

        // 4. FILTER LOGIC
        if (filterType === "category") {
            products = products.filter((p: any) => {
                const cat = (p.category || "").toLowerCase();
                const tit = (p.title || "").toLowerCase();
                const val = filterValue.toLowerCase();

                if (["smartphones", "laptops", "automotive", "motorcycle", "lighting", "groceries"].includes(cat)) return false;

                if (val === "men") {
                    return (cat === "mens-shirts" || cat === "mens-shoes" || cat === "mens-watches" || (tit.includes("men") && !tit.includes("women")));
                }
                if (val === "women") {
                    return (cat.includes("women") || cat === "tops" || cat === "skincare" || cat === "fragrances" || tit.includes("lipstick") || tit.includes("mascara") || tit.includes("perfume"));
                }
                if (val === "accessories") {
                    return (cat === "sunglasses" || cat.includes("watch") || cat.includes("jewel") || cat.includes("bag"));
                }
                return cat.includes(val);
            });
        } 
        else if (filterType === "sale") {
            products = products.filter((p: any) => p.discountPercentage > 10 || p.price < 50); 
        }
        else if (filterType === "new") {
            products = products.slice(0, 20);
        }

        // 5. WISHLIST CHECK (CRITICAL FIX)
        if (activeUser) {
            const wishlistItems = await getWishlist(); // Server Action
            const likedIds = new Set(wishlistItems.map((w: any) => String(w.productId))); // Ensure String ID match
            
            // Update isLiked flag BEFORE setting state
            products = products.map((p: any) => ({
                ...p,
                isLiked: likedIds.has(String(p.id))
            }));
        }

        setFilteredProducts(products);
        setCurrentPage(1);

      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchData();
  }, [filterType, filterValue]);

  // --- LISTENER FOR INSTANT SYNC ---
  useEffect(() => {
    const handleWishlistSync = (e: any) => {
        const { id, status } = e.detail;
        setFilteredProducts(prev => prev.map(p => 
            p.id === id ? { ...p, isLiked: status } : p
        ));
    };
    window.addEventListener("wishlist-updated", handleWishlistSync);
    return () => window.removeEventListener("wishlist-updated", handleWishlistSync);
  }, []);

  const sortedProducts = [...filteredProducts];
  if (sortOrder === "asc") sortedProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") sortedProducts.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header user={currentUser} />
      
      <div className={`relative pt-44 pb-20 px-6 overflow-hidden ${heroGradient}`}>
         <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl"></div>
         <FadeIn className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Collection</p>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none uppercase">{title}</h1>
                <p className="text-lg text-gray-600 mt-4 max-w-xl font-medium">{subtitle}</p>
            </div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">{[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}</div>
                ) : sortedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <FiSearch className="text-5xl text-gray-300 mb-4"/>
                        <h3 className="text-xl font-black text-gray-900">No Products Found</h3>
                        <p className="text-sm text-gray-500 mt-2">Check back later for new drops.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 mb-16">
                            {currentProducts.map((item, index) => {
                                const isOwner = currentUser?.id === item.ownerId;
                                return (
                                    <FadeIn key={item.id} delay={index * 0.05}>
                                        <div className="relative group h-full">
                                            {!isOwner && (
                                                <div className="absolute top-2 right-2 z-30 transform transition group-hover:scale-110">
                                                    {/* Using Key to Force Re-render if Liked status changes */}
                                                    <WishlistButton 
                                                        key={item.isLiked ? 'liked' : 'unliked'}
                                                        product={item} 
                                                        initialLiked={item.isLiked || false} 
                                                    />
                                                </div>
                                            )}
                                            <ItemCard 
                                                item={item} 
                                                deleteItem={isOwner ? () => alert("Go to dashboard to manage") : undefined} 
                                            />
                                        </div>
                                    </FadeIn>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all"><FiChevronLeft size={20} /></button>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all"><FiChevronRight size={20} /></button>
                            </div>
                        )}
                    </>
                )}
            </FadeIn>
        </main>
      </div>
    </div>
  );
}