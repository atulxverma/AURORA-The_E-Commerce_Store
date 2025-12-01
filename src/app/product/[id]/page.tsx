"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import AddToCart from '@/app/components/addToCart';
import FadeIn from '@/app/components/FadeIn';
import ReviewsSection from '@/app/components/ReviewsSection'; 
import WishlistButton from '@/app/components/wishlist-button'; 
import { FiCheckCircle, FiPackage, FiTag, FiStar } from "react-icons/fi";
import { getWishlist } from "@/actions/prodactions"; // Action Import

export default function ProductPage() {
  const params = useParams();  
  const id = params?.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // --- STATE FOR WISHLIST STATUS ---
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Product
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);

        // 2. Fetch User
        const userRes = await fetch("/api/me");
        if (userRes.ok) {
            const uData = await userRes.json();
            setCurrentUser(uData.user);

            // 3. CHECK WISHLIST STATUS (Server Action)
            if (uData.user) {
                const wishlistItems = await getWishlist();
                // Robust ID check (String conversion ensures safety)
                const found = wishlistItems.find((w: any) => String(w.productId) === String(id));
                setIsLiked(!!found); 
            }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if(id) fetchData();
  }, [id]);

  // Helper: Star Renderer
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <FiStar 
                key={i} 
                className={`w-5 h-5 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
            />
        );
    }
    return <div className="flex items-center gap-1">{stars} <span className="text-xs text-gray-500 ml-2">({rating || 0})</span></div>;
  };

  if (loading) return <div className="min-h-screen bg-gray-50 pt-40 text-center"><div className="animate-pulse text-xl font-bold text-gray-400">Loading...</div></div>;
  if (!product) return <div className="min-h-screen bg-gray-50 pt-40 text-center"><div className="text-xl font-bold text-red-500">Product not found</div></div>;

  // Logic Checks
  const isDbProduct = product.id.length === 24;
  const isOwner = isDbProduct && currentUser?.id === product.ownerId;
  const image = product.thumbnail || product.images?.[0] || product.image_url || "/placeholder.png";
  
  const reviews = product.reviews || [];
  const avgRating = reviews.length 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
    : (product.rating || 0);

  return (
    <div className="bg-white min-h-screen">
      <Header user={currentUser} />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: Image */}
          <FadeIn className="lg:sticky lg:top-32 bg-gray-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center h-[500px] lg:h-[600px] relative border border-gray-100 group">
             
             {/* --- WISHLIST BUTTON --- */}
             {!isOwner && (
                 <div className="absolute top-6 right-6 z-20 bg-white rounded-full shadow-lg hover:scale-110 transition p-1">
                     <WishlistButton 
                        // KEY PROP IS THE MAGIC FIX:
                        // It forces the component to re-render when isLiked changes
                        key={isLiked ? "liked" : "unliked"} 
                        product={product} 
                        initialLiked={isLiked} 
                     />
                 </div>
             )}

             {isOwner && (
                <span className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
                    Your Product
                </span>
             )}
            <img 
                src={image} 
                alt={product.title} 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 ease-in-out" 
            />
          </FadeIn>

          {/* RIGHT: Detailed Content */}
          <FadeIn delay={0.2} className="flex flex-col justify-center py-4">
            
            {/* Category & Rating */}
            <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-50 text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full">
                    {product.category || "General"}
                </span>
                {renderStars(avgRating)}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                {product.title}
            </h1>

            <div className="text-3xl font-medium text-gray-900 mb-8 flex items-center gap-3">
              ₹{product.price}
              <span className="text-lg text-gray-400 line-through font-normal">₹{Math.ceil(product.price * 1.2)}</span>
              <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded">20% OFF</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                        <FiPackage /> Brand
                    </div>
                    <p className="font-bold text-gray-900">{product.brand || "Generic"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                        <FiCheckCircle /> Availability
                    </div>
                    <p className="font-bold text-green-600">{product.stock > 0 ? "In Stock" : "Available"}</p>
                </div>
            </div>

            {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10">
                    {product.tags.map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            <FiTag size={12} /> {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 max-w-md">
               {isOwner ? (
                   <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl cursor-not-allowed border-2 border-dashed border-gray-200">
                       You own this product
                   </button>
               ) : (
                   <div className="w-full transform transition active:scale-95">
                      <AddToCart item={product} />
                   </div>
               )}
               
               <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mt-4">
                  <span>Free shipping</span> &bull; <span>Secure checkout</span> &bull; <span>Returns available</span>
               </div>
            </div>
          </FadeIn>
        </div>

        {/* --- REVIEWS SECTION (Only for DB Products) --- */}
        {isDbProduct && (
            <FadeIn delay={0.4}>
                <ReviewsSection 
                    productId={product.id} 
                    reviews={product.reviews || []} 
                    currentUser={currentUser}
                    productOwnerId={product.ownerId} 
                />
            </FadeIn>
        )}

        {!isDbProduct && (
            <div className="mt-20 pt-10 border-t border-gray-100 text-center text-gray-400 text-sm">
                Reviews are not available for external products.
            </div>
        )}

      </div>
    </div>
  );
}