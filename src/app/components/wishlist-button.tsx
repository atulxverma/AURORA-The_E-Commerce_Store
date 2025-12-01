"use client";
import React, { useState, useTransition } from "react";
import { FiHeart } from "react-icons/fi";
import { toggleWishlist } from "@/actions/prodactions";
import { FaHeart } from "react-icons/fa"; 
// No router needed for button logic now

export default function WishlistButton({ product, initialLiked }: { product: any, initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 1. Optimistic Update
    const newState = !liked;
    setLiked(newState);

    startTransition(async () => {
      const res = await toggleWishlist(product);
      
      if (!res.success) {
        // 2. Revert if failed
        setLiked(!newState); 
        
        // 3. Show Alert ONLY (No Redirect)
        alert(res.message); // "Please login to add to wishlist"
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