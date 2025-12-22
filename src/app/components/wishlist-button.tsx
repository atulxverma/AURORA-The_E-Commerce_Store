"use client";
import React, { useState, useTransition, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toggleWishlist } from "@/actions/prodactions";
import { FaHeart } from "react-icons/fa"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

export default function WishlistButton({ product, initialLiked }: { product: any, initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => { setLiked(initialLiked); }, [initialLiked]);

  useEffect(() => {
    const handleGlobalUpdate = (e: any) => {
      const { id, status } = e.detail;
      if (id === product.id) setLiked(status);
    };
    window.addEventListener("wishlist-updated", handleGlobalUpdate);
    return () => window.removeEventListener("wishlist-updated", handleGlobalUpdate);
  }, [product.id]);

  const handleToggle = () => {
    const newState = !liked;
    setLiked(newState); 

    // Instant Toast Feedback
    if(newState) toast.success("Added to Favorites");
    else toast.info("Removed from Favorites");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { id: product.id, status: newState } }));
    }

    startTransition(async () => {
      const res = await toggleWishlist(product);
      
      if (!res.success) {
        setLiked(!newState); // Revert
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { id: product.id, status: !newState } }));
        
        // --- FIX: SAFE ACCESS TO MESSAGE ---
        const msg = res.message || "Unknown Error";

        if (msg.includes("Login") || msg.includes("Unauthorized")) {
            toast.error("Please Login", { description: "You need an account to save items." });
            router.push("/login");
        } else {
            toast.error("Action Failed", { description: msg });
        }
      }
    });
  };

  return (
    <button 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggle(); }}
      disabled={isPending}
      className={`p-2 rounded-full shadow-sm transition hover:scale-110 cursor-pointer ${liked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
    >
      {liked ? <FaHeart size={18} /> : <FiHeart size={18} />}
    </button>
  );
}