"use client";
import Link from "next/link";
import AddToCart from "./addToCart";
import EditProdButton from "./edit-prod-button";
import { FiTrash2 } from "react-icons/fi";

export default function ItemCard({ item, deleteItem }: { item: any, deleteItem?: any }) {
  const image = item.thumbnail || item.images?.[0] || item.image_url || "/placeholder.png";
  const isOwner = Boolean(deleteItem);

  return (
    <div className="group h-full bg-white border border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200 hover:border-gray-300 relative overflow-hidden">
        
        {/* --- OWNER CONTROLS (Hover Reveal) --- */}
        {isOwner && (
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                
                {/* Edit Button (Clean Wrapper) */}
                <div className="bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm flex items-center justify-center w-10 h-10">
                    {/* Passed simplified prop to avoid extra styling inside button */}
                    <EditProdButton product={item} />
                </div>
                
                {/* Delete Button (Round) */}
                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="bg-gray-100 text-red-500 w-10 h-10 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                  title="Delete Item"
                >
                  <FiTrash2 size={16} />
                </button>
            </div>
        )}

        <Link href={`/product/${item.id}`} className="w-full flex flex-col items-center flex-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                {item.category || "Exclusive"}
            </span>

            <div className="relative w-full h-48 mb-6 flex items-center justify-center">
                <img
                  src={image}
                  alt={item.title}
                  className="w-full h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                />
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
                {item.title}
            </h3>

            <div className="text-lg font-bold text-gray-500 mb-6">
                ₹{item.price.toLocaleString()}
            </div>
        </Link>

        {/* --- BOTTOM CTA --- */}
        <div className="mt-auto w-full pt-4 border-t border-gray-50">
            {isOwner ? (
                <button className="w-full bg-gray-50 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed text-xs uppercase tracking-wide border border-gray-100">
                    You own this product
                </button>
            ) : (
                <div className="w-full">
                    <AddToCart item={item} />
                </div>
            )}
        </div>

    </div>
  );
}