"use client";

import React, { useOptimistic, startTransition } from "react";
import {
  deleteProductFromCart,
  updateQuantity,
  clearCartInDb,
} from "@/actions/prodactions";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import FadeIn from "../../components/FadeIn";
import { toast } from "sonner";

/* ================= TYPES ================= */

type CartItem = {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  category?: string | null;
};

type CartAction =
  | { action: "delete"; id: string }
  | { action: "update"; id: string; qty: number }
  | { action: "clear" };

/* ================= COMPONENT ================= */

export default function CartClient({
  initialCart,
}: {
  initialCart: CartItem[];
}) {
  const router = useRouter();

  /* ================= OPTIMISTIC STATE ================= */

  const [optimisticCart, addOptimisticCart] = useOptimistic<CartItem[], CartAction>(
    initialCart,
    (state, updated) => {
      if (updated.action === "delete")
        return state.filter((i) => i.id !== updated.id);

      if (updated.action === "update")
        return state.map((i) =>
          i.id === updated.id ? { ...i, quantity: updated.qty } : i
        );

      if (updated.action === "clear") return [];

      return state;
    }
  );

  /* ================= HANDLERS ================= */

  const handleRemove = async (id: string) => {
  startTransition(() =>
    addOptimisticCart({ action: "delete", id })
  );
  await toast.promise(
    deleteProductFromCart(id),
    {
      loading: "Removing item...",
      success: "Item removed from cart",
      error: "Failed to remove item",
    }
  );
  router.refresh();
};


  const handleQty = async (id: string, qty: number) => {
    // — If qty < 1 → REMOVE item —
    if (qty < 1) {
      handleRemove(id);
      return;
    }

    startTransition(() => addOptimisticCart({ action: "update", id, qty }));
    await updateQuantity(id, qty);
    router.refresh();
  };

  const handleClear = async () => {
      // Custom Confirm Toast
      toast.custom((t) => (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64">
            <p className="text-sm font-bold mb-3">Clear entire cart?</p>
            <div className="flex gap-2">
                <button onClick={() => toast.dismiss(t)} className="flex-1 bg-gray-100 text-xs font-bold py-2 rounded-lg">Cancel</button>
                <button onClick={async () => {
                    toast.dismiss(t);
                    startTransition(() => addOptimisticCart({ action: 'clear' }));
                    await clearCartInDb();
                    router.refresh();
                    toast.success("Cart Cleared");
                }} className="flex-1 bg-red-500 text-white text-xs font-bold py-2 rounded-lg">Clear</button>
            </div>
        </div>
      ));
  }

  /* ================= CALCULATIONS ================= */

  const subtotal = optimisticCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  /* ================= EMPTY CART ================= */

  if (optimisticCart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <FiShoppingBag size={40} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          Looks like you haven’t added anything yet.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl"
        >
          Start Shopping
        </button>
      </div>
    );

  /* ================= UI ================= */

  return (
    <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
      {/* LEFT SIDE */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="font-bold text-xl text-gray-900">
            Items ({optimisticCart.length})
          </h2>

          <button
            onClick={handleClear}
            className="text-xs font-bold text-red-500 uppercase hover:underline"
          >
            Clear All
          </button>
        </div>

        {optimisticCart.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Image */}
            <div
              className="w-28 h-28 bg-[#F4F4F5] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() =>
                router.push(`/product/${item.productId || item.id}`)
              }
            >
              <img
                src={item.image_url || "/placeholder.png"}
                alt={item.title}
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="flex justify-between">
                <div
                  onClick={() =>
                    router.push(`/product/${item.productId || item.id}`)
                  }
                  className="cursor-pointer"
                >
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-blue-600 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {item.category || "General"}
                  </p>
                </div>

                <span className="font-black text-lg text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>

              {/* Quantity + Remove */}
              <div className="flex justify-between items-end">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-3 border border-gray-100">
                  {/* MINUS */}
                  <button
                    onClick={() => handleQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-black hover:bg-gray-100 transition active:scale-95"
                  >
                    <FiMinus size={12} />
                  </button>

                  <span className="text-sm font-bold w-6 text-center select-none">
                    {item.quantity}
                  </span>

                  {/* PLUS */}
                  <button
                    onClick={() => handleQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition active:scale-95"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50 active:scale-90"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — SUMMARY */}
      <div className="lg:col-span-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 sticky top-32">
          <h2 className="text-xl font-black text-gray-900 mb-6 uppercase">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900 font-bold">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span className="text-gray-900 font-bold">₹{tax}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6 pt-6 flex justify-between">
            <span className="text-sm font-bold text-gray-500 uppercase">
              Total
            </span>

            <span className="text-3xl font-black text-gray-900">
              ₹{total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] hover:bg-gray-900 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            Checkout <FiArrowRight />
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 font-medium">
            🔒 Secure Checkout • ↺ Free Returns
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
