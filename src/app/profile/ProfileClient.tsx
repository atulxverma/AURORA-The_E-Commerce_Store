"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteProductFromDb, deleteAccount, logoutUser } from "@/actions/prodactions";
import { FiArrowLeft } from "react-icons/fi"; 

// IMPORT COMPONENTS
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileOverview from "./components/ProfileOverview";
import ProfileProducts from "./components/ProfileProducts";
import ProfileSettings from "./components/ProfileSettings";
import ProfileOrders from "./components/ProfileOrders"; 

export default function ProfileClient({ user, products, orders }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeTab = searchParams.get("tab") || "overview";

  const [myProducts, setMyProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMyProducts(products); }, [products]);

  const switchTab = (tab: string) => { router.push(`/profile?tab=${tab}`); };

  const handleNewProduct = (newProduct: any) => {
    setMyProducts((prev: any[]) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    setMyProducts((prev: any[]) => prev.filter((p) => p.id !== id));
    const res = await deleteProductFromDb(id);
    if (res.success) router.refresh();
    else alert("Failed to delete");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("ARE YOU SURE? This will delete all your data permanently.")) return;
    setLoading(true);
    await deleteAccount();
    router.push("/login");
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
  };

  // ============================================================
  // LAYOUT 1: ACCOUNT SETTINGS (Standalone Page)
  // ============================================================
  if (activeTab === "settings") {
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                {/* --- FIX: LOGICAL BACK BUTTON --- */}
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition mb-6 group px-2 py-1 -ml-2"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                    Back
                </button>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Account Settings</h1>
                <p className="text-gray-500 font-medium mt-2">Manage your profile details and security preferences.</p>
            </div>

            <ProfileSettings 
                user={user} 
                handleDeleteAccount={handleDeleteAccount} 
                loading={loading} 
            />
        </div>
    );
  }

  // ============================================================
  // LAYOUT 2: DASHBOARD (Sidebar + Content)
  // ============================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SIDEBAR */}
      <ProfileSidebar 
        user={user} 
        activeTab={activeTab} 
        switchTab={switchTab} 
        handleLogout={handleLogout} 
        loading={loading} 
      />

      {/* CONTENT */}
      <div className="lg:col-span-9">
        
        {activeTab === "overview" && (
            <ProfileOverview user={user} productCount={myProducts.length} orders={orders} />
        )}

        {activeTab === "products" && (
            <ProfileProducts 
                products={myProducts} 
                handleNewProduct={handleNewProduct} 
                handleDeleteProduct={handleDeleteProduct} 
            />
        )}

        {activeTab === "orders" && (
            <ProfileOrders orders={orders} />
        )}

      </div>
    </div>
  );
}