import React from "react";
import Header from "../components/Header";
import prismaClient from "@/services/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { FiArrowLeft, FiPackage, FiClock } from "react-icons/fi";
import FadeIn from "../components/FadeIn";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-40 text-center font-bold">Please login.</div>;

  const orders = await prismaClient.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-20">
        <FadeIn>
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">ORDER HISTORY</h1>
                    <p className="text-gray-500">Track and manage your recent purchases.</p>
                </div>
                <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-bold hover:underline">
                    <FiArrowLeft /> Continue Shopping
                </Link>
            </div>
        </FadeIn>

        {orders.length === 0 ? (
            <FadeIn delay={0.1} className="text-center py-32 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
                <FiPackage className="text-6xl text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-xl font-medium mb-6">No past orders found.</p>
                <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">Start Shopping</Link>
            </FadeIn>
        ) : (
            <div className="space-y-8">
                {orders.map((order, index) => (
                    <FadeIn key={order.id} delay={index * 0.1} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 transition hover:shadow-md">
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start gap-6 border-b border-gray-100 pb-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                    <FiPackage size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                                    <p className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <FiClock size={12} /> {order.status}
                                </span>
                                <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toDateString()}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center group">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        <img src={item.image_url || "/placeholder.png"} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-sm text-gray-500 font-medium">Payment via Cash</p>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
                                <p className="text-2xl font-black text-black">₹{order.totalAmount}</p>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}