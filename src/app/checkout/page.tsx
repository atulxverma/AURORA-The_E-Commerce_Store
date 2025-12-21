"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { placeOrder } from "@/actions/prodactions";
import FadeIn from "../components/FadeIn";
import { FiLock, FiCreditCard, FiTruck } from "react-icons/fi";
import { toast } from "sonner";
import Script from "next/script"; 

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({ fullName: "", address: "", city: "", zipCode: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
        const userRes = await fetch("/api/me");
        if (userRes.ok) {
            const uData = await userRes.json();
            setCurrentUser(uData.user);
        }
    }
    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.fullName || !formData.address) return toast.error("Please fill details");

    setLoading(true);
const res = await placeOrder(formData, "TEST_PAYMENT_ID_123");
  
  if (res.success) {
      toast.success("Order Placed (Test Mode)");
      router.push("/orders");
  } else {
      toast.error(res.message);
  }
  //RAZORPAY
    try {
        // 1. Create Order (Server calculates amount)
        const response = await fetch("/api/razorpay", { method: "POST" });
        const order = await response.json();

        if (order.error) throw new Error(order.error);

        // 2. Open Razorpay
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
            amount: order.amount,
            currency: "INR",
            name: "Aurora Store",
            description: "Premium Checkout",
            order_id: order.id,
            handler: async function (response: any) {
                toast.loading("Verifying Payment...");
                
                // 3. Save to DB
                const res = await placeOrder(formData, response.razorpay_payment_id);
                
                if (res.success) {
                    toast.success("Order Placed Successfully!");
                    router.push("/orders");
                } else {
                    toast.error("Database Error: " + res.message);
                }
            },
            prefill: {
                name: currentUser?.name,
                email: currentUser?.email,
            },
            theme: {
                color: "#000000",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        setLoading(false);

    } catch (error: any) {
        toast.error("Payment Failed", { description: error.message });
        setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <Header user={currentUser} />
      
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
            
            {/* FORM */}
            <div className="lg:col-span-2">
                <FadeIn delay={0.1} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Details</h2>
                    </div>

                    <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
                        <div className="group"><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label><input required name="fullName" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="Ex: John Doe" /></div>
                        <div className="group"><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Address</label><input required name="address" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="Ex: 123 Fashion St." /></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">City</label><input required name="city" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="New York" /></div>
                            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Zip Code</label><input required name="zipCode" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="10001" /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Country</label><input required name="country" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition font-medium" placeholder="United States" /></div>
                    </form>
                </FadeIn>
            </div>

            {/* BUTTON */}
            <div className="space-y-6">
                <FadeIn delay={0.2} className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
                        <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">2</div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">Payment</h2>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition">
                            <FiCreditCard className="text-xl" />
                            <span className="font-bold text-sm">Cards, UPI & Netbanking</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-6 text-center leading-relaxed">
                        Securely processed by Razorpay.
                    </p>

                    <button 
                        form="checkout-form"
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </FadeIn>
            </div>

        </div>
      </div>
    </div>
  );
}