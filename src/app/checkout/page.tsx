"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { placeOrder } from "@/actions/prodactions";
import FadeIn from "../components/FadeIn";
import { FiLock, FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "", address: "", city: "", zipCode: "", country: ""
  });
  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await placeOrder(formData);
      if (res.success) {
        router.push("/orders"); 
      } else {
        alert(res.message);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-20">
        <FadeIn>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-2">SECURE CHECKOUT</h1>
                <p className="text-gray-500 flex items-center justify-center gap-2">
                    <FiLock className="text-green-600" /> 256-bit SSL Encrypted
                </p>
            </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT: SHIPPING FORM */}
            <div className="lg:col-span-2">
                <FadeIn delay={0.1} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Details</h2>
                    </div>

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                            <input required name="fullName" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="Ex: John Doe" />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Address</label>
                            <input required name="address" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="Ex: 123 Fashion St." />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">City</label>
                                <input required name="city" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="New York" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Zip Code</label>
                                <input required name="zipCode" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="10001" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Country</label>
                            <input required name="country" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="United States" />
                        </div>
                    </form>
                </FadeIn>
            </div>

            {/* RIGHT: SUMMARY & PAYMENT */}
            <div className="space-y-6">
                <FadeIn delay={0.2} className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
                        <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">2</div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">Payment</h2>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                            <FiCreditCard className="text-xl" />
                            <span className="font-bold text-sm">Credit / Debit Card</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white text-black rounded-xl border border-white cursor-pointer">
                            <FiTruck className="text-xl" />
                            <span className="font-bold text-sm">Cash on Delivery</span>
                            <FiCheckCircle className="ml-auto text-green-600" />
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-6 text-center leading-relaxed">
                        By placing this order, you agree to our Terms of Service and Privacy Policy.
                    </p>

                    <button 
                        form="checkout-form"
                        type="submit" 
                        disabled={isPending}
                        className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
                    >
                        {isPending ? "Processing..." : "Confirm Order"}
                    </button>
                </FadeIn>
            </div>

        </div>
      </div>
    </div>
  );
}