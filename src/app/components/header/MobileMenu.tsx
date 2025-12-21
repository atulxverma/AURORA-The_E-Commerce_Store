"use client";
import Link from "next/link";
import { FiX, FiUser, FiLogOut, FiGrid, FiArrowRight } from "react-icons/fi";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  handleLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, currentUser, handleLogout }: MobileMenuProps) {
  // If not open, return null (don't render)
  if (!isOpen) return null;

  return (
    // FIX: z-[9999] ensures it's above everything
    <div className="fixed inset-0 z-[9999] lg:hidden">
      
      {/* Backdrop (Click to close) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="absolute left-0 top-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-8 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] animate-in slide-in-from-left">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black tracking-tighter uppercase">AURORA.</span>
            <button 
                onClick={onClose} 
                className="p-3 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-200 transition"
            >
                <FiX size={20} />
            </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {/* Helper Component for Links */}
          <MobileLink href="/new-arrivals" onClick={onClose}>New Arrivals</MobileLink>
          <MobileLink href="/men" onClick={onClose}>Men</MobileLink>
          <MobileLink href="/women" onClick={onClose}>Women</MobileLink>
          <MobileLink href="/accessories" onClick={onClose}>Accessories</MobileLink>
          
          <Link 
            href="/sale" 
            onClick={onClose} 
            className="flex items-center justify-between text-lg font-bold text-red-600 hover:bg-red-50 p-4 rounded-2xl transition-all"
          >
            Sale <FiArrowRight />
          </Link>

          {/* Dashboard Link */}
          {currentUser && (
            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                href="/profile?tab=overview"
                onClick={onClose}
                className="flex items-center gap-3 text-white bg-black p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-lg"
                >
                <FiGrid /> Dashboard
                </Link>
            </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-8 border-t border-gray-100">
          {currentUser ? (
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <div className="w-10 h-10 bg-white border border-gray-200 text-black rounded-full flex items-center justify-center font-bold">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="text-sm overflow-hidden">
                        <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        handleLogout();
                        onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-bold bg-white border border-red-100 py-4 rounded-2xl cursor-pointer hover:bg-red-50 transition"
                >
                    <FiLogOut /> Logout
                </button>
            </div>
          ) : (
            <Link 
                href="/login" 
                onClick={onClose}
                className="flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-bold cursor-pointer hover:scale-105 transition shadow-xl"
            >
                <FiUser /> Login / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for Clean Links ---
const MobileLink = ({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) => (
    <Link 
        href={href} 
        onClick={onClick} 
        className="flex items-center justify-between text-lg font-bold text-gray-900 hover:bg-gray-50 p-4 rounded-2xl transition-all active:scale-95"
    >
        {children}
        <FiArrowRight className="text-gray-300" />
    </Link>
);