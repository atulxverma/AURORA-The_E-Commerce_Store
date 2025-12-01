"use client";
import Link from "next/link";
import AddToCart from "./addToCart";
import EditProdButton from "./edit-prod-button";
import { FiTrash2 } from "react-icons/fi";

export default function ItemCard({ item, deleteItem }: { item: any, deleteItem?: any }) {
  const image = item.thumbnail || item.images?.[0] || item.image_url || "/placeholder.png";
  const isOwner = Boolean(deleteItem);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full w-full cursor-default">
      
      {/* --- OWNER CONTROLS (Visible on Hover) --- */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            
            {/* Edit Button Wrapper - Added Hover & Pointer */}
            <div className="bg-white p-1 rounded-full shadow-md hover:bg-blue-50 transition-colors cursor-pointer hover:scale-110 transform duration-200 border border-gray-100">
                <EditProdButton product={item} />
            </div>
            
            {/* Delete Button */}
            <button 
              onClick={(e) => {
                e.preventDefault(); 
                deleteItem(item.id);
              }}
              className="bg-white text-red-500 p-2.5 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer border border-gray-100 hover:scale-110"
              title="Delete Item"
            >
              <FiTrash2 size={16} />
            </button>
        </div>
      )}

      {/* --- IMAGE SECTION --- */}
      <Link href={`/product/${item.id}`} className="block relative w-full aspect-[4/3] bg-[#F4F4F5] overflow-hidden cursor-pointer">
        <img
          src={image}
          alt={item.title}
          className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-in-out"
          onError={(e) => e.currentTarget.src = "/placeholder.png"}
        />
        
        {/* Category Badge */}
        <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider z-10 shadow-sm border border-white/60">
            {item.category || "New"}
        </span>

        {isOwner && (
            <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md backdrop-blur-sm">
                Owner
            </span>
        )}
      </Link>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-1">
        
        <div className="flex justify-between items-start gap-3 mb-2">
            <Link href={`/product/${item.id}`} className="flex-1 min-w-0 group/link">
                <h3 
                    className="font-bold text-base text-gray-900 leading-tight group-hover/link:text-blue-600 transition-colors line-clamp-2 h-10 cursor-pointer"
                    title={item.title}
                >
                    {item.title}
                </h3>
            </Link>
            <span className="text-base font-black text-gray-900 whitespace-nowrap flex-shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                ₹{item.price}
            </span>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1 min-h-[2.5em] font-medium">
            {item.description}
        </p>

        {/* --- ACTION BUTTON --- */}
        <div className="mt-auto pt-2">
            {isOwner ? (
                <button className="w-full border border-gray-200 bg-gray-50 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed text-xs uppercase tracking-wide">
                    You own this
                </button>
            ) : (
                <div className="transform transition active:scale-95 cursor-pointer">
                    <AddToCart item={item} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}