"use client";
import React, { useState, useTransition, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toggleWishlist } from "@/actions/prodactions";
import { FaHeart } from "react-icons/fa"; 
import { useRouter } from "next/navigation";

export default function WishlistButton({ product, initialLiked }: { product: any, initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 1. Sync with Prop changes
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  // 2. LISTEN FOR GLOBAL EVENTS (Sync across pages)
  useEffect(() => {
    const handleGlobalSync = (e: any) => {
      const { id, status } = e.detail;
      // Agar ye wahi product hai jo event me aaya hai, to state update karo
      if (id === product.id) {
        setLiked(status);
      }
    };

    window.addEventListener("wishlist-updated", handleGlobalSync);
    return () => window.removeEventListener("wishlist-updated", handleGlobalSync);
  }, [product.id]);

  const handleToggle = () => {
    const newState = !liked;
    setLiked(newState); // Instant Local Update

    // 3. BROADCAST EVENT (Sabko batao ki change hua hai)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wishlist-updated", { 
        detail: { id: product.id, status: newState } 
      }));
    }

    startTransition(async () => {
      const res = await toggleWishlist(product);
      
      if (!res.success) {
        // Revert if failed
        setLiked(!newState); 
        
        // Broadcast Revert
        window.dispatchEvent(new CustomEvent("wishlist-updated", { 
            detail: { id: product.id, status: !newState } 
        }));

        if (res.message.includes("Login") || res.message.includes("Unauthorized")) {
            router.push("/login");
        } else {
            alert(res.message);
        }
      }
    });
  };

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      className={`p-2 rounded-full shadow-sm transition hover:scale-110 cursor-pointer ${liked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
    >
      {liked ? <FaHeart size={18} /> : <FiHeart size={18} />}
    </button>
  );
}