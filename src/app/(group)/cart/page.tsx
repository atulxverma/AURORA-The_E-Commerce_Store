// //@ts-nocheck
// "use client";

// import React, { useContext, useEffect, useState } from "react";
// import Header from "@/app/components/Header";
// import Link from "next/link";
// import { NewCartContext } from "@/app/components/cart-context";

// interface ProductItem {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   thumbnail: string;
//   rating: number;
// }

// export default function CartPage() {
//   const {cart , setCart} = useContext(NewCartContext);
//   // const [cartItems, setCartItems] = useState<ProductItem[]>([]);

//   // useEffect(() => {
//   //   loadCart();
//   // }, []);

//   // const loadCart = () => {
//   //   try {
//   //     const items = localStorage.getItem("cart");
//   //     const parsed = items ? JSON.parse(items) : [];

//   //     const validItems = Array.isArray(parsed)
//   //       ? parsed.filter((item) => item && item.id && item.title)
//   //       : [];

//   //     setCartItems(validItems);
//   //     setCart(validItems);
//   //   } catch (err) {
//   //     console.error("Error reading cart:", err);
//   //     setCartItems([]);
//   //     setCart([]);
//   //   }
//   // };

//   const handleRemove = (id: number) => {
//     // const updatedItems = cartItems.filter((item) => item.id !== id);
//     const updatedItems = cart.filter((item) => item.id !== id);
//     // setCartItems(updatedItems);
//     setCart(updatedItems);
//     localStorage.setItem("cart", JSON.stringify(updatedItems));
//   };

//   const clearCart = () => {
//     localStorage.removeItem("cart");
//     setCart([]);
//   };

//   const renderStars = (rating: number) => {
//     const full = Math.floor(rating);
//     const half = rating % 1 >= 0.5;
//     const empty = 5 - full - (half ? 1 : 0);

//     const stars = [];
//     for (let i = 0; i < full; i++) stars.push(<span key={`f-${i}`}>⭐</span>);
//     if (half) stars.push(<span key="half">⭐️</span>);
//     for (let i = 0; i < empty; i++)
//       stars.push(
//         <span key={`e-${i}`} className="opacity-30">
//           ⭐
//         </span>
//       );
//     return stars;
//   };

//   const calculateTotal = () => {
//     // return cartItems.reduce(
//       return cart.reduce(
//       (total, item) => total + Math.ceil(item.price * 80),
//       0
//     );
//   };

//   return (
//     <div>
//       <Header />
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//         {cart.length === 0 ? (
//           <p className="text-gray-500">Cart is empty.</p>
//         ) : (
//           <>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
//                 >
//                   <img
//                     src={item.thumbnail}
//                     alt={item.title}
//                     className="h-[250px] w-full object-cover rounded"
//                   />
//                   <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                     {item.description}
//                   </p>

//                   <div className="mt-2 text-yellow-500 text-sm">
//                     {renderStars(item.rating)}
//                     <span className="ml-1 text-gray-500 text-xs">
//                       ({item.rating})
//                     </span>
//                   </div>

//                   <div className="mt-4 flex justify-between items-center">
//                     <span className="text-xl font-bold text-blue-600">
//                       ₹{Math.ceil(item.price * 80)}
//                     </span>
//                     <Link
//                       href={`/product/${item.id}`}
//                       className="text-sm text-blue-500 hover:underline"
//                     >
//                       View
//                     </Link>
//                   </div>

//                   <button
//                     onClick={() => handleRemove(item.id)}
//                     className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-10 text-right">
//               <p className="text-xl font-semibold">
//                 Total: ₹{calculateTotal()}
//               </p>
//               <button
//                 onClick={clearCart}
//                 className="mt-3 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }










//@ts-nocheck
"use client";

import React, { useContext, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { NewCartContext } from "@/app/components/cart-context";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, setCart } = useContext(NewCartContext);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleRemove = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<span key={`f-${i}`}>⭐</span>);
    if (half) stars.push(<span key="half">⭐</span>);
    for (let i = 0; i < empty; i++)
      stars.push(
        <span key={`e-${i}`} className="opacity-30">
          ⭐
        </span>
      );
    return stars;
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + Math.ceil(item.price * 80), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-lg">Cart is empty.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
                >
                  <Image
                    src={item.thumbnail || item.image_url}
                    alt={item.title}
                    width={300}
                    height={250}
                    className="rounded object-cover w-full h-64"
                  />

                  <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2 text-yellow-500 text-sm">
                    {renderStars(item.rating)}
                    <span className="ml-1 text-gray-500 text-xs">
                      ({item.rating})
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ₹{Math.ceil(item.price * 80)}
                    </span>
                    <Link
                      href={`/product/${item.id}`}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 text-right">
              <p className="text-2xl font-semibold">
                Total: ₹{calculateTotal()}
              </p>
              <button
                onClick={clearCart}
                className="mt-3 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
