"use client";
import FadeIn from "../../components/FadeIn";
import { FiPackage, FiClock, FiCheckCircle, FiShoppingBag } from "react-icons/fi";

export default function ProfileOrders({ orders }: { orders: any[] }) {
  return (
    <FadeIn className="space-y-8">
      <div className="flex items-end justify-between px-2">
        <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order History</h2>
            <p className="text-gray-500 text-sm font-medium">Track your recent purchases and status.</p>
        </div>
        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] shadow-sm border border-gray-100 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <FiShoppingBag size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-900">No Orders Yet</h3>
             <p className="text-gray-500 mt-2">You haven't purchased anything yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    
                    {/* --- ORDER HEADER --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                <FiPackage size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                                <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                order.status === 'Delivered' 
                                ? 'bg-green-50 text-green-700 border-green-100' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            }`}>
                                {order.status === 'Delivered' ? <FiCheckCircle /> : <FiClock />}
                                {order.status}
                            </span>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                                <p className="text-xl font-black text-gray-900">₹{order.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- ORDER ITEMS LIST (Premium View) --- */}
                    <div className="space-y-3">
                        {/* SAFETY CHECK ADDED HERE: (order.items || []) */}
                        {(order.items || []).map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition">
                                <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.image_url || "/placeholder.png"} 
                                        className="w-full h-full object-contain p-2 mix-blend-multiply" 
                                        alt={item.title}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-sm text-gray-900">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
      )}
    </FadeIn>
  );
}