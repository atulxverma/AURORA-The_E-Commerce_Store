"use client";
import React, { useState } from "react";
import { FiTrendingUp, FiUsers, FiBox, FiDollarSign, FiPackage, FiActivity, FiX } from "react-icons/fi";
import FadeIn from "../../components/FadeIn";
import AdminChart from "./AdminChart";
import { createPortal } from "react-dom";

export default function AdminDashboardClient({ productsCount, usersCount, orders, user }: any) {
  const [showAllOrders, setShowAllOrders] = useState(false);

  // --- CALCS ---
  const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);
  
  const salesMap = new Map();
  orders.forEach((order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      salesMap.set(date, (salesMap.get(date) || 0) + order.totalAmount);
  });
  const chartData = Array.from(salesMap, ([name, total]) => ({ name, total })).reverse().slice(0, 7).reverse();

  const revenueTrend = orders.length > 5 ? "+12.5%" : "+0.0%"; 

  return (
    // --- FIX: Width synced with Main Layout (max-w-[1400px]) ---
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        <FadeIn>
            {/* --- HEADER --- */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Command Center</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Overview</h1>
                </div>
                <div className="flex gap-2">
                    <span className="bg-white border border-gray-200 px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> System Live
                    </span>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<FiDollarSign />} color="bg-black text-white" trend={revenueTrend} trendUp={true} />
                <StatCard title="Total Orders" value={orders.length} icon={<FiPackage />} trend="+5.2%" trendUp={true} />
                <StatCard title="Active Products" value={productsCount} icon={<FiBox />} trend="+2.4%" trendUp={true} />
                <StatCard title="Total Users" value={usersCount} icon={<FiUsers />} trend="+8.1%" trendUp={true} />
            </div>

            {/* --- MAIN GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. REVENUE CHART */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Revenue Analytics</h3>
                            <p className="text-xs text-gray-400 font-medium">Performance over last 7 days</p>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-full border border-green-100">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <AdminChart data={chartData} />
                    </div>
                </div>

                {/* 2. RECENT ORDERS */}
                <div className="bg-white p-0 rounded-[2.5rem] shadow-sm border border-gray-100 h-[500px] flex flex-col overflow-hidden relative">
                    <div className="p-8 pb-4 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2"><FiActivity /> Recent Orders</h3>
                        <button 
                            onClick={() => setShowAllOrders(true)} 
                            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                        >
                            View All
                        </button>
                    </div>
                    
                    <div className="overflow-y-auto custom-scrollbar flex-1 p-4 pt-2 space-y-2">
                        {orders.slice(0, 10).map((order: any) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition group cursor-default border border-transparent hover:border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-xs shadow-sm text-gray-700">
                                        {order.user?.name?.[0]?.toUpperCase() || "G"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate w-24">{order.fullName || "Guest"}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">#{order.id.slice(-6)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm font-black text-gray-900">₹{order.totalAmount}</span>
                                    <span className={`text-[10px] font-bold uppercase ${order.status === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </FadeIn>

        {/* --- VIEW ALL ORDERS MODAL --- */}
        {showAllOrders && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAllOrders(false)} />
                <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                    
                    <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-white">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">All Transactions</h2>
                            <p className="text-sm text-gray-500">Full history of {orders.length} orders.</p>
                        </div>
                        <button onClick={() => setShowAllOrders(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"><FiX size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-4">
                            {orders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-sm">
                                            {order.user?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{order.fullName || "Guest"}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black">₹{order.totalAmount}</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </div>
  );
}

function StatCard({ title, value, icon, color = "bg-white text-gray-900", trend }: any) {
    return (
        <div className={`${color} p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between h-44 hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none">{icon}</div>
            <div className="flex justify-between items-start z-10">
                <div className="p-3 bg-gray-50/10 rounded-2xl backdrop-blur-sm border border-white/10 text-inherit shadow-inner">{icon}</div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                    {trend}
                </span>
            </div>
            <div className="z-10">
                <h3 className="text-4xl font-black tracking-tight">{value}</h3>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">{title}</p>
            </div>
        </div>
    )
}