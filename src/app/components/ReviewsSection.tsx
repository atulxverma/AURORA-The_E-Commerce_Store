"use client";
import React, { useState, useTransition, useEffect } from "react";
import { FiStar, FiUser, FiMessageSquare } from "react-icons/fi";
import { addReview } from "@/actions/prodactions";
import { useRouter } from "next/navigation";

export default function ReviewsSection({ 
    productId, 
    reviews, 
    currentUser,
    productOwnerId 
}: { 
    productId: string, 
    reviews: any[], 
    currentUser: any,
    productOwnerId?: string 
}) {
  // --- LOCAL STATE FOR INSTANT UPDATES ---
  const [reviewList, setReviewList] = useState(reviews);
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Sync if server props change
  useEffect(() => {
    setReviewList(reviews);
  }, [reviews]);

  // Logic: Check if owner
  const isOwner = currentUser?.id === productOwnerId;

  // Calculate Average dynamically based on LOCAL state
  const totalRating = reviewList.reduce((acc, item) => acc + item.rating, 0);
  const avgRating = reviewList.length ? (totalRating / reviewList.length).toFixed(1) : "0.0";

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating");
    if (!comment.trim()) return alert("Please write a comment");
    
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", String(rating));
    formData.append("comment", comment);

    startTransition(async () => {
        const res = await addReview(formData);
        
        if(res.success && res.newReview) {
            // --- INSTANT UI UPDATE ---
            // Add new review to the top of the list
            setReviewList((prev) => [res.newReview, ...prev]);
            
            // Reset form
            setComment(""); 
            setRating(0);
            
            // Refresh server data in background
            router.refresh();
        } else {
            alert(res.message);
        }
    });
  };

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FiMessageSquare size={24} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Customer Reviews</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Stats & Form */}
        <div className="lg:col-span-4 space-y-8">
            {/* Average Box */}
            <div className="bg-white p-8 rounded-[2.5rem] text-center shadow-sm border border-gray-100">
                <div className="text-6xl font-black text-gray-900 tracking-tighter">{avgRating}</div>
                <div className="flex justify-center gap-1 text-yellow-400 my-4 text-xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <FiStar key={s} fill={s <= Math.round(Number(avgRating)) ? "currentColor" : "none"} />
                    ))}
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{reviewList.length} Verified Reviews</p>
            </div>

            {/* Add Review Form */}
            {isOwner ? (
                <div className="p-8 bg-blue-50 rounded-[2.5rem] text-center border border-blue-100">
                    <p className="text-blue-700 font-bold text-sm">You own this product, so you cannot review it.</p>
                </div>
            ) : currentUser ? (
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                    
                    <div className="flex gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                            >
                                <FiStar 
                                    className={star <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                                />
                            </button>
                        ))}
                    </div>

                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white p-4 rounded-2xl text-sm outline-none resize-none border border-gray-200 focus:border-black transition mb-4"
                        placeholder="How was the product? Share your thoughts..."
                        rows={4}
                    />

                    <button 
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:scale-[1.02] transition disabled:opacity-50 shadow-lg"
                    >
                        {isPending ? "Posting..." : "Post Review"}
                    </button>
                </div>
            ) : (
                <div className="p-8 bg-gray-50 rounded-[2.5rem] text-center border border-gray-100">
                    <p className="text-gray-500 font-medium">Please <a href="/login" className="text-black font-bold underline">login</a> to write a review.</p>
                </div>
            )}
        </div>

        {/* RIGHT: Review List */}
        <div className="lg:col-span-8 space-y-6">
            {reviewList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                reviewList.map((review) => (
                    <div key={review.id} className="flex gap-6 p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-lg transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-14 h-14 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold border border-gray-200 group-hover:bg-black group-hover:text-white transition-colors">
                            {review.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{review.user?.name || "Anonymous"}</h4>
                                <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-1 text-yellow-400 text-sm mb-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <FiStar key={s} fill={s <= review.rating ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}