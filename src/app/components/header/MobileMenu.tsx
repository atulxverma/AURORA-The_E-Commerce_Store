"use client";
import React from "react";
import Link from "next/link";
import { FiX, FiUser, FiLogOut, FiGrid } from "react-icons/fi";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  handleLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, currentUser, handleLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">

      {/* ✅ SOLID DARK BACKDROP */}
      <div
        className="absolute inset-0 bg-black/85 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* ✅ SOLID WHITE PREMIUM SIDEBAR */}
      <div
        className="fixed left-0 top-0 w-[300px] sm:w-[320px] h-full bg-white shadow-[12px_0_80px_rgba(0,0,0,0.40)] p-7 flex flex-col border-r border-gray-100 animate-slideIn"
      >

        {/* ---- LOGO + CLOSE ---- */}
        <div className="flex justify-between items-center mb-14">
          <Link href="/" onClick={onClose} className="cursor-pointer">
            <span className="text-3xl font-extrabold tracking-tighter text-gray-900">
              AURORA
              <span className="text-blue-600 text-5xl leading-none">.</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="p-2.5 bg-gray-100 rounded-full cursor-pointer hover:scale-110 hover:bg-gray-300 transition-all shadow-sm"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* ---- NAV LINKS ---- */}
        <nav className="flex flex-col gap-5 text-[17px] font-extrabold text-gray-800">
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-black transition">New Arrivals</Link>
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-black transition">Men</Link>
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-black transition">Women</Link>
          <Link href="#" onClick={onClose} className="cursor-pointer text-red-600 hover:text-red-800 transition">Sale</Link>

          {currentUser && (
            <Link
              href="/profile?tab=overview"
              onClick={onClose}
              className="flex items-center justify-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm hover:scale-105 hover:bg-black hover:text-white transition-all text-black"
            >
              <FiGrid size={20} /> Dashboard
            </Link>
          )}
        </nav>

        {/* ---- FOOTER AREA ---- */}
        <div className="mt-auto pt-6 border-t border-gray-200/40">
          {currentUser ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center font-black text-lg">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-[15px] font-extrabold">{currentUser.name}</p>
                  <p className="text-[11px] font-bold text-gray-500">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-black bg-red-50 py-3 rounded-xl cursor-pointer hover:bg-red-200 hover:scale-105 transition-all shadow-sm"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-extrabold cursor-pointer hover:scale-105 hover:shadow-xl transition-all"
            >
              <FiUser size={18} /> Login / Register
            </Link>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease forwards;
        }
      `}</style>

    </div>
  );
}
