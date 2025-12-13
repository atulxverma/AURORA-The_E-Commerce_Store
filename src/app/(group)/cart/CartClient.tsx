"use client";

import React, { useOptimistic, startTransition } from "react";
import { deleteProductFromCart, updateQuantity, clearCartInDb } from "@/actions/prodactions";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import FadeIn from "../../components/FadeIn";

/* ===================== TYPES ===================== */

type CartItem = {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
};

type CartAction =
  | { action: "delete"; id: string }
  | { action: "update"; id: string; qty: number }
  | { action: "clear" };

/* ===================== COMPONENT ===================== */

export default function CartClient({ initialCart }: { initialCart: CartItem[] }) {
  const router = useRouter();

  const [optimisticCart, addOptimisticCart] = useOptimistic<
    CartItem[],
    CartAction
  >(initialCart, (state, updatedItem) => {
    switch (updatedItem.action) {
      case "delete":
        return state.filter(i => i.id !== updatedItem.id);

      case "update":
        return state.map(i =>
          i.id === updatedItem.id
            ? { ...i, quantity: updatedItem.qty }
            : i
        );

      case "clear":
        return [];

      default:
        return state;
    }
  });

  /* ===================== HANDLERS ===================== */

  const handleRemove = async (id: string) => {
    startTransition(() =>
      addOptimisticCart({ action: "delete", id })
    );
    await deleteProductFromCart(id);
    router.refresh();
  };

  const handleQty = async (id: string, qty: number) => {
    startTransition(() =>
      addOptimisticCart({ action: "update", id, qty })
    );
    await updateQuantity(id, qty);
    router.refresh();
  };

  const handleClear = async () => {
    if (confirm("Clear Cart?")) {
      startTransition(() =>
        addOptimisticCart({ action: "clear" })
      );
      await clearCartInDb();
      router.refresh();
    }
  };

  /* ===================== CALCULATIONS ===================== */

  const subtotal = optimisticCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = Math.ceil(subtotal + shipping + tax);

  /* ===================== EMPTY CART ===================== */

  if (optimisticCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <FiShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition shadow-xl"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
      {/* LEFT */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="font-bold text-xl text-gray-900">
            Items ({optimisticCart.length})
          </h2>
          <button
            onClick={handleClear}
            className="text-xs font-bold text-red-500 hover:underline uppercase"
          >
            Clear All
          </button>
        </div>

        {optimisticCart.map(item => (
          <div
            key={item.id}
            className="flex gap-6 bg-white p-4 rounded-[2rem] shadow-sm border hover:shadow-lg transition"
          >
            <div
              className="w-28 h-28 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() =>
                router.push(`/product/${item.productId || item.id}`)
              }
            >
              <img
                src={item.image_url || "/placeholder.png"}
                alt={item.title}
                className="w-full h-full object-contain p-2"
                onError={e =>
                  (e.currentTarget.src = "/placeholder.png")
                }
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-xs text-gray-500 uppercase">
                    {item.category || "General"}
                  </p>
                </div>
                <span className="font-black">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      handleQty(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-white rounded-lg"
                  >
                    <FiMinus size={12} />
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleQty(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-black text-white rounded-lg"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg sticky top-32">
          <h2 className="font-black mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t mt-6 pt-6 flex justify-between">
            <span>Total</span>
            <span className="text-2xl font-black">
              ₹{total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-bold flex justify-center gap-2"
          >
            Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </FadeIn>
  );
}
