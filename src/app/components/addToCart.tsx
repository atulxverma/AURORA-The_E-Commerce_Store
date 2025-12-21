"use client";
import React, { useState, useTransition } from "react";
import { addProductToCart } from "@/actions/prodactions";
import { FiShoppingBag, FiLoader, FiCheck } from "react-icons/fi";
import { toast } from "sonner"; 

export default function AddToCart({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); 
    e.stopPropagation();

    startTransition(async () => {
      const payload = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        thumbnail: item.thumbnail || item.image_url || item.images?.[0] || ""
      };

      const res = await addProductToCart(payload);
      
      if (res.success) {
        setAdded(true);
        // --- PREMIUM TOAST ---
        toast.success(`${item.title} added to cart!`, {
            description: "Go to cart to complete checkout.",
            duration: 3000,
        });
        setTimeout(() => setAdded(false), 2000);
      } else {
        toast.error("Failed to add", { description: res.message });
      }
    });
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      // Added cursor-pointer
      className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-md active:scale-95 disabled:opacity-60 cursor-pointer text-sm"
    >
      {isPending ? (
        <> <FiLoader className="animate-spin" /> Adding... </>
      ) : (
        <> <FiShoppingBag /> Add to Cart </>
      )}
    </button>
  );
}