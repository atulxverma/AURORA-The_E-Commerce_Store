"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import ItemCard from "../components/Item-card"; 
import FadeIn from "../components/FadeIn";
import WishlistButton from "../components/wishlist-button"; 
import { FiSliders, FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import { BackgroundBeams } from "../components/ui/background-beams"; // <--- IMPORT THIS

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean)];

  // 1. Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setAllProducts(data.products || []);
        setFilteredProducts(data.products || []);

        // Fetch User for Wishlist/Ownership logic
        const userRes = await fetch("/api/me");
        if(userRes.ok) {
            const uData = await userRes.json();
            setCurrentUser(uData.user);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    if(query) fetchData();
  }, [query]);

  // 2. Filter Logic
  useEffect(() => {
    let result = [...allProducts];
    if (selectedCategory !== "All") result = result.filter(p => p.category === selectedCategory);
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
    if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [minPrice, maxPrice, selectedCategory, sortOrder, allProducts]);

  return (
    <div className="min-h-screen bg-white relative selection:bg-black selection:text-white">
      <Header user={currentUser} />
      
      {/* --- BACKGROUND BEAMS (The Magic UI) --- */}
      {/* Fixed position taaki scroll karte waqt bhi piche rahe */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <BackgroundBeams />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* --- HEADER AREA --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <FadeIn>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Search Results</p>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                    "{query}"
                </h1>
                <p className="text-gray-400 font-medium mt-2">{filteredProducts.length} items found</p>
            </FadeIn>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 px-5 py-3 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort:</span>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                    <option value="">Relevance</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
                <FiChevronDown className="text-gray-400" />
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* --- SIDEBAR --- */}
            <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-32 space-y-8 p-6 bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-xl">
                    
                    <div className="flex items-center gap-2 text-gray-900 mb-2">
                        <div className="p-2 bg-black text-white rounded-full"><FiSliders size={16}/></div>
                        <h3 className="font-black uppercase tracking-wide text-sm">Filters</h3>
                    </div>

                    {/* Category */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Category</h4>
                        <div className="space-y-2">
                            {categories.map((cat: any) => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 hover:bg-white/60 rounded-xl transition">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedCategory === cat ? "border-black" : "border-gray-300"}`}>
                                        {selectedCategory === cat && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                    <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="hidden" />
                                    <span className={`text-sm font-bold ${selectedCategory === cat ? "text-black" : "text-gray-500 group-hover:text-black"}`}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                                <input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-6 pr-2 text-sm font-bold outline-none focus:border-black transition" />
                            </div>
                            <span className="text-gray-300 font-bold">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-6 pr-2 text-sm font-bold outline-none focus:border-black transition" />
                            </div>
                        </div>
                    </div>

                    {/* Reset */}
                    {(minPrice || maxPrice || selectedCategory !== "All") && (
                        <button onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedCategory("All"); setSortOrder(""); }} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-500 py-3 rounded-xl hover:bg-red-600 transition shadow-md">
                            <FiX /> Clear All
                        </button>
                    )}
                </div>
            </aside>

            {/* --- RESULTS GRID --- */}
            <main className="flex-1">
                <FadeIn>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-gray-100">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-gray-300 shadow-sm">
                                <FiSearch size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">No results found</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">We couldn't find anything matching "{query}". Try different keywords or filters.</p>
                            <button onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedCategory("All"); }} className="mt-6 text-black font-bold underline">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                            {filteredProducts.map((item) => {
                                const isOwner = currentUser?.id === item.ownerId;
                                return (
                                    <div key={item.id} className="relative group h-full">
                                        {!isOwner && (
                                            <div className="absolute top-3 right-3 z-30 transform transition group-hover:scale-110">
                                                <WishlistButton product={item} initialLiked={false} />
                                            </div>
                                        )}
                                        <ItemCard item={item} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </FadeIn>
            </main>

        </div>
      </div>
    </div>
  );
}