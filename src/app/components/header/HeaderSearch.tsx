"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiArrowRight } from "react-icons/fi";

export default function HeaderSearch() {
  const [userInput, setUserInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!userInput.trim()) return setSuggestions([]);
      try {
        const res = await fetch(`/api/search?q=${userInput}`);
        const data = await res.json();
        setSuggestions(data.products.slice(0, 5) || []);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [userInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      router.push(`/search?q=${userInput}`);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative hidden md:block group z-50" ref={searchRef}>
      <form 
        onSubmit={handleSearchSubmit}
        className="flex items-center border border-gray-200 bg-gray-50/50 rounded-full px-4 py-2.5 w-48 focus-within:w-72 focus-within:bg-white focus-within:border-black focus-within:shadow-lg transition-all duration-500 ease-out"
      >
        <FiSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full placeholder-gray-400 font-medium text-gray-900"
        />
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full right-0 mt-4 w-96 bg-white shadow-2xl rounded-[2rem] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 p-2">
          <div className="py-2">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suggestions</p>
            {suggestions.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={() => setSuggestions([])}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-xl transition group/item cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={item.thumbnail || "/placeholder.png"} className="w-full h-full object-cover" alt={item.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover/item:text-blue-600 transition">{item.title}</p>
                  <p className="text-[10px] font-bold text-gray-400">₹{item.price}</p>
                </div>
                <FiArrowRight className="text-gray-300 group-hover/item:text-black -translate-x-2 group-hover/item:translate-x-0 transition opacity-0 group-hover/item:opacity-100" />
              </Link>
            ))}
          </div>
          <button
            onClick={handleSearchSubmit}
            className="w-full bg-black text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition cursor-pointer mt-2"
          >
            View all results
          </button>
        </div>
      )}
    </div>
  );
}