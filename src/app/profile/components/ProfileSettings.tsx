"use client";
import { FiAlertTriangle, FiUser, FiMail, FiAtSign } from "react-icons/fi";
import FadeIn from "../../components/FadeIn";

interface Props {
  user: any;
  handleDeleteAccount: () => void;
  loading: boolean;
}

export default function ProfileSettings({ user, handleDeleteAccount, loading }: Props) {
  
  // --- SAFETY CHECK ---
  if (!user) return <div className="p-10 text-center text-gray-400">Loading user profile...</div>;

  return (
    <FadeIn className="space-y-8">
      
      {/* Form Container */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          
          <div className="group">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                <FiUser /> Full Name
            </label>
            <div className="bg-gray-50 p-5 rounded-2xl font-bold text-gray-900 border border-transparent group-hover:border-gray-200 transition duration-300">
                {user?.name || "N/A"} 
            </div>
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                <FiMail /> Email Address
            </label>
            <div className="bg-gray-50 p-5 rounded-2xl font-bold text-gray-500 border border-transparent group-hover:border-gray-200 transition duration-300">
                {user?.email || "N/A"}
            </div>
          </div>

          <div className="md:col-span-2 group">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                <FiAtSign /> Username
            </label>
            <div className="bg-blue-50 p-5 rounded-2xl font-bold text-blue-700 border border-transparent group-hover:border-blue-200 transition duration-300">
                @{user?.username || "user"}
            </div>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-5">
          <div className="w-14 h-14 bg-white text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <FiAlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-700 uppercase tracking-tight">Danger Zone</h3>
            <p className="text-sm text-red-600/70 font-medium max-w-md mt-1">
                This action is irreversible. All your products, orders, and account data will be permanently deleted.
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-600 text-white border border-red-600 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-red-700 hover:shadow-lg transition-all shadow-sm whitespace-nowrap uppercase tracking-wide"
        >
          {loading ? "Processing..." : "Delete Account"}
        </button>
      </div>
    </FadeIn>
  );
}