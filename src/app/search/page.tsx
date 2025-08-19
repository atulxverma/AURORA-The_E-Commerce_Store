// //@ts-nocheck
// 'use client';

// import React, { useEffect, useState } from 'react';
// import ItemCard from '@/app/components/Item-card';
// import prismaClient from '@/services/prisma';

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   thumbnail: string;
//   rating: number;
// }

// export default async function SearchPage({ searchParams }: { searchParams: any }) {
//   const query = searchParams.q || '';
//   let url = 'http://localhost:3000/api/search?';
//   if(query){
//     url+='&q=' + query;
//   }
//   let results =[];
//   try {
//     data = await prismaClient.product.findMany({
//       where: {
//         title: {
//           contains: query,
//           mode: 'insensitive',
//         },
//       },

//   })
// } catch (err){

// }
//   const min = parseFloat(searchParams.min || '0');
//   const max = parseFloat(searchParams.max || '999999');

//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchSearchResults() {
//       try {
//         setLoading(true);
//         const res = await fetch(`https://dummyjson.com/products/search?q=${query}`);
//         const data = await res.json();

//         const filtered = data.products.filter((item: Product) => {
//           return item.price >= min && item.price <= max;
//         });

//         setFilteredData(filtered);
//       } catch (err) {
//         console.error("Error fetching search results:", err);
//         setFilteredData([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (query.trim() !== '') {
//       fetchSearchResults();
//     } else {
//       setFilteredData([]);
//       setLoading(false);
//     }
//   }, [query, min, max]);

//   return (
//     <div>

//       <div className="p-5">
//         <h1 className="text-2xl font-bold mb-4">
//           Search Results for "{query}" {`(₹${min} to ₹${max})`}
//         </h1>

//         {loading ? (
//           <p>Loading...</p>
//         ) : filteredData.length === 0 ? (
//           <p>No matching items found.</p>
//         ) : (
//           <div className="flex flex-wrap gap-5">
//             {filteredData.map((item) => (
//               <ItemCard key={item.id} item={item} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









'use client';

import React, { useEffect, useState } from "react";
import ItemCard from "@/app/components/Item-card";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const min = parseFloat(searchParams.get("min") || "0");
  const max = parseFloat(searchParams.get("max") || "999999");

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setLoading(true);

        // Fetch API products
        const apiRes = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        const apiData = await apiRes.json();

        // Fetch DB products from existing route
        const dbRes = await fetch("/api/product");
        const dbData = await dbRes.json();

        // Combine both and normalize images
        const allProducts = [...apiData.products, ...dbData].map((item: any) => ({
          ...item,
          thumbnail: item.thumbnail || item.image_url, // always have thumbnail
        }));

        // Filter by name + price
        const filtered = allProducts.filter((item: any) => {
          const nameMatch =
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.name?.toLowerCase().includes(query.toLowerCase());
          const priceMatch = item.price >= min && item.price <= max;
          return nameMatch && priceMatch;
        });

        setFilteredData(filtered);
      } catch (err) {
        console.error(err);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    }

    if (query.trim() !== "") {
      fetchSearchResults();
    } else {
      setFilteredData([]);
      setLoading(false);
    }
  }, [query, min, max]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}" ({`₹${min} to ₹${max}`})
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No matching items found.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredData.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}


