"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiUser, FiShoppingBag, FiLogOut, FiSettings, FiHeart, FiGrid } from "react-icons/fi";

interface HeaderIconsProps {
  currentUser: any;
  handleLogout: () => void;
}

export default function HeaderIcons({ currentUser, handleLogout }: HeaderIconsProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      
      {/* DASHBOARD BUTTON (Only Logged In) */}
      {currentUser && (
        <Link
          href="/profile?tab=overview"
          className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 text-black px-5 py-2.5 rounded-full text-xs font-bold shadow-sm hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-pointer uppercase tracking-wide"
        >
          <FiGrid size={14} /> Dashboard
        </Link>
      )}

      <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-300 cursor-pointer">
        <FiHeart size={22} />
      </Link>

      <Link href="/cart" className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition duration-300 cursor-pointer">
        <FiShoppingBag size={22} />
      </Link>

      {/* PROFILE DROPDOWN */}
      <div className="relative" ref={profileRef}>
        {currentUser ? (
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border transition-all duration-300 ${
                showProfileMenu ? "bg-black text-white border-black shadow-lg" : "bg-gray-50 text-black border-gray-200 hover:border-gray-400"
            }`}
          >
            {currentUser.name ? currentUser.name[0].toUpperCase() : <FiUser />}
          </button>
        ) : (
          <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <FiUser size={22} />
          </Link>
        )}

        {showProfileMenu && currentUser && (
          <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 p-2 z-50">
            <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
              <p className="text-sm font-bold text-gray-900 truncate">
                {currentUser.name || currentUser.username}
              </p>
              <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-wide">{currentUser.email}</p>
            </div>

            {/* ONLY SETTINGS LINK */}
            <Link href="/profile?tab=settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition cursor-pointer">
              <FiSettings size={16} /> Account Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition text-left cursor-pointer mt-1"
            >
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}