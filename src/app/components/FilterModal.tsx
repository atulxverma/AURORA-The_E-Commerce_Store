"use client";
import React, { useState } from "react";
import { FiX, FiFilter } from "react-icons/fi";

export default function FilterModal({ onApply }: { onApply: (filters: any) => void }) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("All");

  // Common Categories
  const categories = ["All", "Clothing", "Shoes", "Electronics", "Accessories", "General"];

  const handleApply = () => {
    onApply({
      sort,
      min: Number(minPrice) || 0,
      max: Number(maxPrice) || 1000000,
      category: category === "All" ? "" : category
    });
    setOpen(false);
  };

  const handleReset = () => {
    setSort(""); setMinPrice(""); setMaxPrice(""); setCategory("All");
    onApply({ sort: "", min: 0, max: 1000000, category: "" });
    setOpen(false);
  };

  return (
    <>
      {/* Main UI Button */}
      <button 
        onClick={() => setOpen(true)}
        className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black hover:text-white transition flex items-center gap-2 shadow-sm"
      >
        <FiFilter /> Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black">Filter & Sort</h2>
                <button onClick={() => setOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><FiX /></button>
            </div>

            {/* Sort */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Sort By Price</h3>
                <div className="flex gap-3">
                    <button onClick={() => setSort("asc")} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${sort === "asc" ? "bg-black text-white border-black" : "border-gray-200"}`}>Low to High</button>
                    <button onClick={() => setSort("desc")} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${sort === "desc" ? "bg-black text-white border-black" : "border-gray-200"}`}>High to Low</button>
                </div>
            </div>

            {/* Price */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Price Range</h3>
                <div className="flex gap-4 items-center">
                    <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50 outline-none" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50 outline-none" />
                </div>
            </div>

            {/* Category */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${category === cat ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={handleReset} className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Reset</button>
                <button onClick={handleApply} className="flex-1 bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition">Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}