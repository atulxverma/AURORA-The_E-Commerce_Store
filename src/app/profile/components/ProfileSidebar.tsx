"use client";
import { FiGrid, FiBox, FiShoppingBag, FiLogOut } from "react-icons/fi";

interface SidebarProps {
  user: any;
  activeTab: string;
  switchTab: (tab: string) => void;
  handleLogout: () => void;
  loading: boolean;
}

export default function ProfileSidebar({ user, activeTab, switchTab, handleLogout, loading }: SidebarProps) {
  return (
    <div className="lg:col-span-3 lg:sticky lg:top-32 h-fit space-y-6">
      
      {/* User Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative z-10 w-24 h-24 bg-black text-white rounded-3xl flex items-center justify-center text-4xl font-black mb-4 shadow-xl border-4 border-white">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <h2 className="relative z-10 text-xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
        <p className="relative z-10 text-sm text-gray-500 font-medium">{user?.email}</p>
      </div>

      {/* Navigation Menu (REMOVED SETTINGS) */}
      <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-2">
        {[
          { id: "overview", label: "Overview", icon: FiGrid },
          { id: "products", label: "My Listings", icon: FiBox },
          { id: "orders", label: "My Orders", icon: FiShoppingBag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300 group cursor-pointer ${
              activeTab === tab.id
                ? "bg-black text-white shadow-lg translate-x-1"
                : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <tab.icon size={18} className={`${activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-black"} transition-colors`} />
            {tab.label}
          </button>
        ))}

        <div className="h-px bg-gray-100 my-2 mx-4"></div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm text-red-500 hover:bg-red-50 transition-all duration-300 w-full text-left group cursor-pointer"
        >
          <FiLogOut size={18} className="text-red-400 group-hover:text-red-600" />
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}