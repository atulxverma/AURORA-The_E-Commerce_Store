"use client";
import React, { useTransition } from "react";
import { addProductToCart } from "@/actions/prodactions";
import { FiShoppingBag, FiLoader } from "react-icons/fi";

export default function AddToCart({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); // Link click hone se rokne ke liye (agar card ke andar hai)
    e.stopPropagation();

    startTransition(async () => {
      // Payload clean karke bhej rahe hain
      const payload = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        // Images logic handle kar rahe hain
        thumbnail: item.thumbnail || item.image_url || item.images?.[0] || ""
      };

      const res = await addProductToCart(payload);
      
      if (res.success) {
        // Optional: Toast notification laga sakte ho yahan
        console.log("Added!");
      } else {
        alert("Error: " + res.message);
      }
    });
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black font-medium py-3 rounded-xl hover:opacity-80 transition active:scale-95 disabled:opacity-60"
    >
      {isPending ? (
        <>
          <FiLoader className="animate-spin" /> Adding...
        </>
      ) : (
        <>
          <FiShoppingBag /> Add to Cart
        </>
      )}
    </button>
  );
}