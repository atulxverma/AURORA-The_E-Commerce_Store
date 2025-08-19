// //@ts-nocheck
// 'use client';
// import React from "react";
// import Link from "next/link";
// import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
// import DeleteItem from "./delete-item-button";
// import EditProdButton from "./edit-prod-button";

// export default function ItemCard({ item , deleteItem , handleUpdate}) {
//   const href = "/product/" + item.id;

//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     const stars = [];

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
//     }

//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
//     }

//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-400" />);
//     }

//     return stars;
//   };

//   return (
//     <div className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px] border rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden bg-white mt-5">
//       <Link href={href}>
//         <div>
//           <img
//             src={item.image_url}
//             alt={item.title}
//             className="h-[400px] w-full object-cover"
//           />

//           <div className="p-4">
//             <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
//             <p className="text-sm text-gray-600 line-clamp-2 mt-1">
//               {item.description}
//             </p>
//           </div>
//         </div>
//       </Link>

//       <div className="px-4 flex items-center gap-1 text-sm mt-1">
//         <div className="flex">{renderStars(item.rating || 0)}</div>
//         <span className="text-gray-500 ml-2 text-xs">({item.rating})</span>
//       </div>

//       <div className="mt-4 px-4 pb-4 flex justify-between items-center">
//         <span className="text-xl font-bold text-blue-600">
//           ₹{Math.ceil(item.price * 80)}
//         </span>
//         <DeleteItem id={item.id} deleteItem={deleteItem} />
//         <EditProdButton item={item} handleUpdate={handleUpdate} />
//         <Link href={`/product/${item.id}`}>
//           <p className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition">
//             View Details
//           </p>
//         </Link>
//       </div>
//     </div>
//   );
// }










"use client";
import DeleteItem from "./delete-item-button";
import EditProdButton from "./edit-prod-button";
import { useState, useContext } from "react";
import { NewCartContext } from "./cart-context";

export default function ItemCard({ item, deleteItem }: { item: any; deleteItem?: any }) {
  const [product, setProduct] = useState(item);
  const { cart, setCart } = useContext(NewCartContext);

  const handleUpdate = async (updatedItem: any) => {
    try {
      const res = await fetch(`/api/product/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Update failed");
      setProduct(data.product);
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const addToCart = () => {
    const exists = cart.find((p: any) => p.id === product.id);
    if (exists) {
      alert("Product already in cart");
      return;
    }
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart!");
  };

  return (
    <div className="bg-black text-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between">

      <div className="h-64 w-full flex items-center justify-center bg-gray-900">
        <img src={product.thumbnail || product.image_url} alt={product.title} className="h-full object-contain" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold line-clamp-1">{product.title || "No Title"}</h2>
        <p className="text-sm text-gray-300 mt-1 line-clamp-3">{product.description || "No description available."}</p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={addToCart}
            className="border border-orange-500 hover:bg-orange-500 hover:text-black transition py-2 rounded-md"
          >
            Add to Cart
          </button>
          <button className="border border-orange-500 hover:bg-orange-500 hover:text-black transition py-2 rounded-md">
            Buy Now
          </button>
          <EditProdButton product={product} onUpdate={handleUpdate} />
          {deleteItem && <DeleteItem id={product.id} deleteItem={deleteItem} />}
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700">
        <span className="text-green-500 font-bold text-lg">₹{product.price ?? "N/A"}</span>
        <span className="flex items-center gap-1 text-yellow-400 font-semibold">
          ⭐ {product.rating !== undefined ? product.rating.toFixed(2) : "N/A"}
        </span>
      </div>
    </div>
  );
}



