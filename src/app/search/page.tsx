"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- IMPORT
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import ItemCard from "../components/Item-card";
import FadeIn from "../components/FadeIn";
import WishlistButton from "../components/wishlist-button";
import { FiSliders, FiSearch, FiChevronDown, FiX } from "react-icons/fi";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [mounted, setMounted] = useState(false); // For Portal

    // Filters
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("");

    const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean)];

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. Fetch Data
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetch(`/api/search?q=${query}`);
                const data = await res.json();
                setAllProducts(data.products || []);
                setFilteredProducts(data.products || []);

                const userRes = await fetch("/api/me");
                if (userRes.ok) {
                    const uData = await userRes.json();
                    setCurrentUser(uData.user);
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        }
        if (query) fetchData();
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

    useEffect(() => {
        const handleWishlistSync = (e: any) => {
            const { id, status } = e.detail;

            const updateList = (list: any[]) => list.map(p =>
                p.id === id ? { ...p, isLiked: status } : p
            );

            setAllProducts(prev => updateList(prev));
            setFilteredProducts(prev => updateList(prev));
        };

        window.addEventListener("wishlist-updated", handleWishlistSync);
        return () => window.removeEventListener("wishlist-updated", handleWishlistSync);
    }, []);

    // --- REUSABLE FILTER CONTENT ---
    const FilterContent = () => (
        <div className="space-y-8 h-full overflow-y-auto custom-scrollbar p-1">
            {/* Sort */}
            <div>
                <h4 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wide mb-3">Sort by</h4>
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none appearance-none pr-5 cursor-pointer">
                        <option value="">Relevance</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Category */}
            <div>
                <h4 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wide mb-3">Category</h4>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-xl font-bold text-[12px] transition-all ${selectedCategory === cat ? "bg-black text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h4 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wide mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-black transition" />
                    <span className="text-gray-300 font-black">-</span>
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-black transition" />
                </div>
            </div>

            {/* Reset */}
            {(minPrice || maxPrice || selectedCategory !== "All" || sortOrder) && (
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedCategory("All"); setSortOrder(""); }} className="w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold hover:bg-red-100 transition flex justify-center items-center gap-2 text-sm">
                    <FiX size={14} /> Reset All Filters
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">

            <Header user={currentUser} />

            <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-0">

                {/* ---- HEADER AREA ---- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-100 pb-6">
                    <FadeIn>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Results for</p>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">"{query}"</h1>
                        <p className="text-gray-400 font-semibold text-sm mt-1">{filteredProducts.length} products found</p>
                    </FadeIn>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition"
                    >
                        <FiSliders /> Filters
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* --- DESKTOP SIDEBAR (Visible only on LG) --- */}
                    <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="sticky top-32 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[1.8rem] p-6 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                <FiSliders className="text-black" />
                                <h3 className="text-lg font-black">Filters</h3>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* --- MOBILE DRAWER (PORTAL) --- */}
                    {mounted && showMobileFilters && createPortal(
                        <div className="fixed inset-0 z-[99999] flex justify-end">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)} />

                            {/* Drawer */}
                            <div className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black">Filters</h3>
                                    <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><FiX /></button>
                                </div>
                                {/* Reusing Filter Content */}
                                <FilterContent />
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* --- RESULTS GRID --- */}
                    <main className="flex-1 w-full">
                        <FadeIn>
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">{[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[1.5rem] animate-pulse"></div>)}</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-gray-100 rounded-[3rem]"><FiSearch className="text-5xl text-gray-300 mb-4" /><h3 className="text-xl font-black text-gray-900">No Products Found</h3><button onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedCategory("All"); }} className="text-blue-600 font-bold mt-2 hover:underline">Clear Filters</button></div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 pb-20">
                                    {filteredProducts.map((item, index) => {
                                        const isOwner = currentUser?.id === item.ownerId;
                                        return (
                                            <FadeIn key={item.id} delay={index * 0.05}>
                                                <div className="relative group h-full">
                                                    {!isOwner && (<div className="absolute top-2 right-2 z-30 transform transition group-hover:scale-110"><WishlistButton product={item} initialLiked={item.isLiked || false} /></div>)}
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
        </div>
    );
}