"use client";
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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute left-0 top-0 w-4/5 max-w-xs h-full bg-white shadow-2xl p-8 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
        <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black tracking-tighter">AURORA.</span>
            <button onClick={onClose} className="p-3 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-200 transition">
                <FiX size={20} />
            </button>
        </div>

        <nav className="flex flex-col gap-6 text-xl font-bold text-gray-900">
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-blue-600 transition">New Arrivals</Link>
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-blue-600 transition">Men</Link>
          <Link href="#" onClick={onClose} className="cursor-pointer hover:text-blue-600 transition">Women</Link>
          <Link href="#" onClick={onClose} className="text-red-500 cursor-pointer hover:text-red-700 transition">Sale</Link>
          
          {currentUser && (
              <Link href="/profile?tab=overview" onClick={onClose} className="flex items-center gap-3 text-black bg-gray-50 p-4 rounded-2xl cursor-pointer mt-4 border border-gray-100">
                  <FiGrid /> Dashboard
              </Link>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-100">
          {currentUser ? (
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 py-3 rounded-xl cursor-pointer hover:bg-red-100 transition">
                    <FiLogOut /> Logout
                </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-bold cursor-pointer hover:scale-105 transition shadow-xl">
                <FiUser /> Login / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}