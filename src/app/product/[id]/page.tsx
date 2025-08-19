// "use client";

// import Header from "@/app/components/Header";
// import { notFound } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import prismaClient from "@/services/prisma";

// type Props = {
//   params: {
//     id: string;
//   };
// };

// export default async function Page({ params }: Props) {
//   const id = params.id;

//   const res = await fetch("http://localhost:3000/api/products/ "+id)
//   const data = await res.json();
//   const product = data?.data;

//   if(!product){
//     notFound();
//   }

//   // const product = await prismaClient.product.findUnique({
//   //   where : { id },
//   // })
//   const router = useRouter();
//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [added, setAdded] = useState(false);

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         const res = await fetch(`https://dummyjson.com/products/${id}`);
//         if (!res.ok) throw new Error("Product not found");
//         const data = await res.json();
//         setProduct(data);
//       } catch (error) {
//         console.error("Error:", error);
//         notFound(); 
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     const cartData = localStorage.getItem("cart");
//     let cartItems = cartData ? JSON.parse(cartData) : [];

//     const exists = cartItems.find((item: any) => item.id === product.id);
//     if (!exists) {
//       cartItems.push(product);
//       localStorage.setItem("cart", JSON.stringify(cartItems));
//       setAdded(true);
//       setTimeout(() => {
//         setAdded(false);
//         router.push("/cart");
//       }, 1000);
//     } else {
//       alert("Already in cart!");
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading product...</p>;
//   if (!product) return <p>Product not found.</p>;

//   return (
//     <div>
//       <Header />
//       <div>
//         <Link href={"/"}>Back</Link>
//       </div>

//       <div className="flex justify-center items-center border h-[600px] w-[800px] mx-auto mt-16 rounded-md shadow-2xl bg-white gap-6 p-4">
//         <div className="h-[300px] w-[400px] border">
//           <Image
//             src={product.thumbnail}
//             alt={product.title}
//             height={300}
//             width={400}
//             className="w-full h-full object-cover rounded"
//           />
//         </div>

//         <div className="max-w-md">
//           <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
//           <p className="mb-4 text-gray-700">{product.description}</p>
//           <h2 className="text-xl font-bold text-blue-600 mb-4">
//             ₹{Math.ceil(product.price * 80)}
//           </h2>

//           <button
//             onClick={handleAddToCart}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
//           >
//             Add to Cart
//           </button>

//           {added && (
//             <p className="mt-3 text-green-600 font-medium">Added to cart!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }














'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/app/components/Header';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
}

export default function ProductPage() {
  const params = useParams();  
  const id = params?.id;        
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!id) return;

  async function fetchProduct() {
    try {
      setLoading(true);

      let res = await fetch(`/api/product/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        return;
      }

      res = await fetch(`https://dummyjson.com/products/${Number(id)}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchProduct();
}, [id]);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<span key={`f-${i}`}>⭐</span>);
    if (half) stars.push(<span key="half">⭐</span>);
    for (let i = 0; i < empty; i++)
      stars.push(<span key={`e-${i}`} className="opacity-30">⭐</span>);
    return stars;
  };

  const handleBuyNow = () => alert('Buying product: ' + product?.title);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        {product && (
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
            <img
              src={product.thumbnail || product.image_url}
              alt={product.title}
              className="w-full md:w-1/2 h-80 object-cover rounded-lg"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                <div className="text-yellow-500 mb-2">{renderStars(product.rating)}</div>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-xl font-semibold text-blue-700 mb-4">
                  ₹{Math.ceil(product.price * 80)}
                </p>
              </div>
              <button
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}





