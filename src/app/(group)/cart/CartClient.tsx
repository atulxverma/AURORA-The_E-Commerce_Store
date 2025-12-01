"use client";
import React, { useOptimistic, startTransition } from "react";
import { deleteProductFromCart, updateQuantity, clearCartInDb } from "@/actions/prodactions";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import FadeIn from "../../components/FadeIn";

export default function CartClient({ initialCart }: { initialCart: any[] }) {
  const router = useRouter();

  const [optimisticCart, addOptimisticCart] = useOptimistic(
    initialCart,
    (state, updatedItem) => {
        if(updatedItem.action === 'delete') return state.filter(i => i.id !== updatedItem.id);
        if(updatedItem.action === 'update') return state.map(i => i.id === updatedItem.id ? {...i, quantity: updatedItem.qty} : i);
        if(updatedItem.action === 'clear') return [];
        return state;
    }
  );

  const handleRemove = async (id: string) => {
    startTransition(() => addOptimisticCart({ action: 'delete', id }));
    await deleteProductFromCart(id);
    router.refresh();
  };

  const handleQty = async (id: string, qty: number) => {
    startTransition(() => addOptimisticCart({ action: 'update', id, qty }));
    await updateQuantity(id, qty);
    router.refresh();
  };

  const handleClear = async () => {
      if(confirm("Clear Cart?")) {
          startTransition(() => addOptimisticCart({ action: 'clear' }));
          await clearCartInDb();
          router.refresh();
      }
  }

  const subtotal = optimisticCart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (optimisticCart.length === 0) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <FiShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2 mb-8">Looks like you haven't added anything yet.</p>
          <button onClick={() => router.push('/')} className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition shadow-xl">
              Start Shopping
          </button>
      </div>
  );

  return (
    <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
      
      {/* LEFT: Items List */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-xl text-gray-900">Items ({optimisticCart.length})</h2>
            <button onClick={handleClear} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wide transition">Clear All</button>
        </div>

        {optimisticCart.map((item) => (
          <div key={item.id} className="flex gap-6 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden relative">
                <img 
                    src={item.image_url || "/placeholder.png"} 
                    alt={item.title} 
                    className="w-full h-full object-contain p-2 mix-blend-multiply"
                    onError={(e) => e.currentTarget.src = "/placeholder.png"} 
                />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">{item.category || "General"}</p>
                    </div>
                    <span className="font-black text-lg text-gray-900">₹{item.price * item.quantity}</span>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-4 border border-gray-100">
                        <button disabled={item.quantity <= 1} onClick={() => handleQty(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-black disabled:opacity-50 transition">
                            <FiMinus size={12} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition">
                            <FiPlus size={12} />
                        </button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50">
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 sticky top-32">
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 font-medium">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span className="text-gray-900 font-bold">₹{(subtotal * 0.18).toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6 pt-6 flex justify-between items-end">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-gray-900">₹{Math.ceil(total + (subtotal * 0.18)).toFixed(2)}</span>
            </div>

            <button 
                onClick={() => router.push("/checkout")}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition shadow-xl flex items-center justify-center gap-2"
            >
                Checkout <FiArrowRight />
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                Secure Checkout • Free Returns
            </p>
          </div>
      </div>
    </FadeIn>
  );
}