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

  // Sync with Prop changes
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  // Listen for global updates
  useEffect(() => {
    const handleGlobalUpdate = (e: any) => {
      const { id, status } = e.detail;
      if (id === product.id) {
        setLiked(status);
      }
    };
    window.addEventListener("wishlist-updated", handleGlobalUpdate);
    return () => window.removeEventListener("wishlist-updated", handleGlobalUpdate);
  }, [product.id]);

  const handleToggle = () => {
    const newState = !liked;
    setLiked(newState); 

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wishlist-updated", { 
        detail: { id: product.id, status: newState } 
      }));
    }

    startTransition(async () => {
      const res = await toggleWishlist(product);
      
      if (!res.success) {
        setLiked(!newState); 
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("wishlist-updated", { 
                detail: { id: product.id, status: !newState } 
            }));
        }

        // --- FIX: Safely Access Message ---
        const msg = res.message || "Something went wrong";
        
        if (msg.includes("Login") || msg.includes("Unauthorized")) {
            router.push("/login");
        } else {
            alert(msg);
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