import React from "react";
import Header from "../../components/Header";
import prismaClient from "@/services/prisma";
import { getCurrentUser } from "@/lib/auth";
import CartClient from "./CartClient"; 
import Link from "next/link";
import FadeIn from "../../components/FadeIn";
import { FiShoppingBag, FiUser, FiGrid } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();

  // --- 1. NO USER UI ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={null} />
        <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
            <FadeIn>
                <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                        <FiShoppingBag size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Your Cart is Waiting</h1>
                    <p className="text-gray-500 mb-8 max-w-md">Login to complete your purchase securely.</p>
                    <Link href="/login" className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl flex items-center gap-3 cursor-pointer">
                        <FiUser /> Login to View
                    </Link>
                </div>
            </FadeIn>
        </div>
      </div>
    );
  }

  // --- FETCH CART ---
  const cartItems = await prismaClient.cart.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  // --- 2. EMPTY CART UI (NO HEADER) ---
  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
                <FadeIn>
                    <div className="bg-white p-24 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <FiShoppingBag size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Your Cart is Empty</h1>
                        <p className="text-gray-500 mb-8 max-w-sm font-medium">Looks like you haven't added anything yet.</p>
                        <Link href="/" className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl cursor-pointer">
                            <FiGrid /> Start Shopping
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
  }

  // --- 3. FILLED CART UI (WITH HEADER) ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header sirf tab dikhega jab items honge */}
        <FadeIn>
            <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">My Shopping Bag</h1>
        </FadeIn>
        <CartClient initialCart={cartItems} />
      </div>
    </div>
  );
}