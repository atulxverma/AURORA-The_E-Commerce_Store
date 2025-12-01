"use client";
import Link from "next/link";
import { FiBox, FiArrowUpRight, FiShoppingBag, FiDollarSign, FiActivity } from "react-icons/fi";
import FadeIn from "../../components/FadeIn";

export default function ProfileOverview({ user, productCount, orders }: any) {
  
  // Mock Revenue Logic (In real app, filter orders where user is seller)
  // For now, summing up user's *purchases* as an example stat
  const totalSpent = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);
  const recentOrders = orders.slice(0, 3); // Top 3

  return (
    <FadeIn className="space-y-8">
      <div className="px-2">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Dashboard</h1>
        <p className="text-gray-500 font-medium mt-2">Welcome back, {user.name}. Here is your store overview.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat 1: Products */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FiBox size={100} />
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <FiBox size={24} />
          </div>
          <p className="text-4xl font-black text-gray-900 mb-1">{productCount}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Listings</p>
        </div>

        {/* Stat 2: Orders */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <FiShoppingBag size={24} />
          </div>
          <p className="text-4xl font-black text-gray-900 mb-1">{orders.length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
        </div>

        {/* Stat 3: Revenue (Mock) */}
        <div className="bg-black p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all duration-300 text-white group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
            <FiDollarSign size={100} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <FiDollarSign size={24} />
          </div>
          <p className="text-4xl font-black mb-1">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <FiActivity /> Recent Activity
              </h3>
              <Link href="/profile?tab=orders" className="text-xs font-bold text-blue-600 uppercase hover:underline">View All</Link>
          </div>

          {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent activity.</p>
          ) : (
              <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                  <FiShoppingBag size={16} className="text-gray-400" />
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <span className="font-bold text-sm text-black">₹{order.totalAmount}</span>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </FadeIn>
  );
}