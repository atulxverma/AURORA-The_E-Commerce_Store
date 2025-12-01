"use client";
import { FiBox, FiTrash2, FiEdit } from "react-icons/fi";
import AddProdButton from "../../components/add-prod-button";
import EditProdButton from "../../components/edit-prod-button"; 
import FadeIn from "../../components/FadeIn";

interface Props {
  products: any[];
  handleNewProduct: (p: any) => void;
  handleDeleteProduct: (id: string) => void;
}

export default function ProfileProducts({ products, handleNewProduct, handleDeleteProduct }: Props) {
  return (
    <FadeIn className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Your Listings</h2>
          <p className="text-gray-500 font-medium mt-2">Manage and edit your live products.</p>
        </div>
        <div className="relative z-20">
          <AddProdButton onProductAdded={handleNewProduct} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-24 rounded-[2.5rem] shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <FiBox size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">No Products Yet</h3>
          <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto font-medium">It looks a bit empty here. Why not list your first item for sale?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
              
              {/* Image Area */}
              <div className="relative aspect-square bg-[#F4F4F5] rounded-[1.5rem] overflow-hidden mb-4">
                <img
                  src={product.thumbnail || product.image_url || "/placeholder.png"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={product.title}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black shadow-sm border border-white/50">
                  ₹{product.price}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white">
                  {product.category}
                </div>
              </div>

              {/* Info Content */}
              <div className="px-2 flex flex-col flex-1 mb-2">
                <h3 className="font-bold text-lg text-gray-900 truncate leading-tight">{product.title}</h3>
                <p className="text-xs text-gray-400 font-medium line-clamp-1 mt-1">{product.description}</p>

                {/* CONTROL BAR (FIXED) */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-50">
                  
                  {/* 
                      MAGIC FIX: 
                      [&>button] targets the button INSIDE EditProdButton.
                      We force it to be full width, black, and have text.
                  */}
                  <div className="flex-1 [&>button]:w-full [&>button]:bg-black [&>button]:text-white [&>button]:rounded-xl [&>button]:py-3 [&>button]:text-sm [&>button]:font-bold [&>button]:hover:bg-gray-800 [&>button]:transition-all [&>button]:flex [&>button]:justify-center [&>button]:items-center">
                      <EditProdButton product={product} />
                  </div>
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-12 h-11 flex items-center justify-center bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all duration-200 shadow-sm group/delete"
                    title="Delete Product"
                  >
                    <FiTrash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FadeIn>
  );
}