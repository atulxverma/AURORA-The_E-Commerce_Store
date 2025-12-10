"use client";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";

export default function HeaderLogo({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <div className="flex items-center gap-4">

      {/* Global Animation Keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>

      <button
        className="lg:hidden bg-black text-white text-3xl p-3 rounded-xl shadow-xl hover:scale-110 hover:shadow-2xl transition-all"
        onClick={onOpenMobileMenu}
      >
        <FiMenu size={28} />
      </button>


      <Link
        href="/"
        className="group relative flex items-end gap-0.5 cursor-pointer"
      >
        {/* MAIN TEXT (Faster Shimmer: 1s) */}
        <span
          className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-400 to-black bg-[length:200%_auto] transition-all duration-500 group-hover:animate-[shimmer_1s_linear_infinite]"
        >
          AURORA
        </span>

        {/* BLUE DOT (Bigger Size) */}
        <span className="text-blue-600 text-6xl leading-[0.5] mb-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          .
        </span>
      </Link>
    </div>
  );
}